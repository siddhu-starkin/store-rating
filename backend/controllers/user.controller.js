import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import Pujari from "../models/pujari.model.js";
import Bhajantri from "../models/bhajantri.model.js";
import Store from "../models/store.model.js";
import Rating from "../models/rating.model.js";
import Booking from "../models/booking.model.js";
import Payment from "../models/payment.model.js";

// Register new user
const userController = {
  register: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, phoneNumber } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [{ email }, { phoneNumber }],
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User with this email or phone number already exists",
        });
      }

      // Create new user
      const user = new User(req.body);
      await user.save();

      // Generate JWT token
      const token = jwt.sign({ id: user._id }, config.jwtSecret, {
        expiresIn: "7d",
      });

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        token,
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            userType: user.userType,
            isApproved: user.isApproved,
          },
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  // Login user
  login: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Validate password
      const isPasswordValid = await user.validatePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Generate JWT token
      const token = jwt.sign({ id: user._id }, config.jwtSecret, {
        expiresIn: "7d",
      });

      return res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          userType: user.userType,
          isApproved: user.isApproved,
          staffId: user.staffId,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  // Get current user profile
  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (error) {
      console.error("Get profile error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  // Update user profile
  updateProfile: async (req, res) => {
    try {
      const updates = req.body;

      // Prevent updating certain fields
      delete updates.password;
      delete updates.userType;
      delete updates.isApproved;

      const user = await User.findByIdAndUpdate(
        req.user.id,
        { $set: updates },
        { new: true, runValidators: true }
      ).select("-password");

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: { user },
      });
    } catch (error) {
      console.error("Update profile error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  // List all users (for admin)
  getAllUsers: async (req, res) => {
    try {
      // Verify current user is admin
      const admin = await User.findById(req.user.id);
      if (!admin || admin.userType !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Unauthorized. Admin privileges required",
        });
      }

      const { userType, isApproved } = req.query;
      const filter = {};

      // Apply filters if provided
      if (userType) filter.userType = userType;
      if (isApproved !== undefined) filter.isApproved = isApproved === "true";

      const users = await User.find(filter).select("-password");

      return res.status(200).json({
        success: true,
        data: { users },
      });
    } catch (error) {
      console.error("Get all users error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

  // List all service providers (for admin)
  getAllServiceProviders: async (req, res) => {
    try {
      // Verify current user is admin
      // const admin = await User.findById(req.user.id);
      // if (!admin || admin.userType !== "admin") {
      //   return res.status(403).json({
      //     success: false,
      //     message: "Unauthorized. Admin privileges required",
      //   });
      // }

      // Get all service providers with their details
      const [pujaris, bhajantris, stores] = await Promise.all([
        Pujari.find().select("-documents"),
        Bhajantri.find().select("-documents"),
        Store.find().select("-documents"),
      ]);

      // Get ratings for all service providers
      const ratings = await Rating.find({
        $or: [
          {
            receiverType: "Pujari",
            receiver: { $in: pujaris.map((p) => p._id) },
          },
          {
            receiverType: "Bhajantri",
            receiver: { $in: bhajantris.map((b) => b._id) },
          },
          {
            receiverType: "Store",
            receiver: { $in: stores.map((s) => s._id) },
          },
        ],
      });

      // Get bookings for all service providers
      const bookings = await Booking.find({
        $or: [
          { pujari: { $in: pujaris.map((p) => p._id) } },
          { bhajantri: { $in: bhajantris.map((b) => b._id) } },
        ],
      });

      // Get payments for all bookings
      const payments = await Payment.find({
        _id: { $in: bookings.map((b) => b.payment).filter(Boolean) },
      });

      // Process and combine all data
      const serviceProviders = [
        ...pujaris.map((pujari) => ({
          _id: pujari._id,
          userType: "Pujari",
          fullName: pujari.fullName,
          phoneNumber: pujari.phoneNumber,
          status: pujari.status,
          rating: pujari.rating,
          experience: pujari.qualification.yearsofExperience,
          location: pujari.address?.city || "N/A",
          totalBookings: bookings.filter(
            (b) => b.pujari?.toString() === pujari._id.toString()
          ).length,
          totalEarnings: payments
            .filter((p) =>
              bookings
                .filter((b) => b.pujari?.toString() === pujari._id.toString())
                .map((b) => b.payment)
                .includes(p._id)
            )
            .reduce((sum, p) => sum + (p.pujaCharges || 0), 0),
          createdAt: pujari.createdAt,
        })),
        ...bhajantris.map((bhajantri) => ({
          _id: bhajantri._id,
          userType: "Bhajantri",
          fullName: bhajantri.groupinfo.leaderName,
          phoneNumber: bhajantri.groupinfo.phoneNumber,
          status: bhajantri.status,
          rating: bhajantri.rating,
          experience: bhajantri.qualification.yearsOfExperience,
          location: bhajantri.groupinfo.address.city || "N/A",
          totalBookings: bookings.filter(
            (b) => b.bhajantri?.toString() === bhajantri._id.toString()
          ).length,
          totalEarnings: payments
            .filter((p) =>
              bookings
                .filter(
                  (b) => b.bhajantri?.toString() === bhajantri._id.toString()
                )
                .map((b) => b.payment)
                .includes(p._id)
            )
            .reduce((sum, p) => sum + (p.bhanjantriCharges || 0), 0),
          createdAt: bhajantri.createdAt,
        })),
        ...stores.map((store) => ({
          _id: store._id,
          userType: "Store",
          fullName: store.personalDetails.fullName,
          phoneNumber: store.personalDetails.phoneNumber,
          status: store.status,
          rating: store.rating,
          location: store.personalDetails.address.city || "N/A",
          storeName: store.storeName,
          totalEarnings: payments
            .filter((p) => p.storeCharges > 0)
            .reduce((sum, p) => sum + (p.storeCharges || 0), 0),
          createdAt: store.createdAt,
        })),
      ];

      return res.status(200).json(serviceProviders);
    } catch (error) {
      console.error("Get all service providers error:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
};
export default userController;
