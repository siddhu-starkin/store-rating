import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validationResult } from "express-validator";

const prisma = new PrismaClient();

// Register new user
const userController = {
  register: async (req, res) => {
    try {
      const { name, email, address, password, role } = req.body;
      if (!name || !email || !address || !password) {
        return res.status(400).json({ success: false, message: 'All fields required' });
      }
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'User with this email already exists' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { name, email, address, password: hashedPassword, role: role || 'user' },
      });
      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        token,
        data: { user: { id: user.id, name: user.name, email: user.email, address: user.address, role: user.role } },
      });
    } catch (error) {
      console.error('Registration error:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },

  // Login user
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password required' });
      }
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user: { id: user.id, name: user.name, email: user.email, address: user.address, role: user.role },
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },

  // Get current user profile
  getProfile: async (req, res) => {
    try {
      const user = await prisma.user.findUnique({ where: { id: req.user.id }, select: { id: true, name: true, email: true, address: true, role: true, createdAt: true } });
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      return res.status(200).json({ success: true, data: { user } });
    } catch (error) {
      console.error('Get profile error:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },

  // Update user profile
  updateProfile: async (req, res) => {
    try {
      const updates = req.body;
      delete updates.password;
      delete updates.role;
      const user = await prisma.user.update({
        where: { id: req.user.id },
        data: updates,
        select: { id: true, name: true, email: true, address: true, role: true, createdAt: true },
      });
      return res.status(200).json({ success: true, message: 'Profile updated successfully', data: { user } });
    } catch (error) {
      console.error('Update profile error:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },

  // List all users (for admin)
  getAllUsers: async (req, res) => {
    try {
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Unauthorized. Admin privileges required' });
      }
      const { search, role } = req.query;
      const where = {};
      
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { address: { contains: search, mode: 'insensitive' } },
        ];
      }
      
      if (role) {
        where.role = role;
      }

      const users = await prisma.user.findMany({ where, select: { id: true, name: true, email: true, address: true, role: true, createdAt: true } });
      return res.status(200).json({ success: true, data: { users } });
    } catch (error) {
      console.error('Get all users error:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },

  // Admin dashboard stats
  getAdminDashboard: async (req, res) => {
    try {
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Unauthorized. Admin privileges required' });
      }
      const totalUsers = await prisma.user.count({ where: { role: 'user' } });
      const totalStores = await prisma.store.count();
      const totalRatings = await prisma.rating.count();
      return res.status(200).json({ success: true, data: { totalUsers, totalStores, totalRatings } });
    } catch (error) {
      console.error('Admin dashboard error:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  },

  createUser: async (req, res) => {
    try {
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Forbidden' });
      }
      const { name, email, address, password, role } = req.body;
      if (!name || !email || !address || !password || !role) {
        return res.status(400).json({ success: false, message: 'All fields required' });
      }
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) return res.status(400).json({ success: false, message: 'User already exists' });
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({ data: { name, email, address, password: hashedPassword, role } });
      // If the user is an owner, create a store as well
      if (role === 'owner') {
        try {
          await prisma.store.create({
            data: {
              name,
              email,
              address,
              owner: {
                connect: { id: user.id }
              }
            },
          });
        } catch (storeError) {
          console.error('Error creating store for owner:', storeError);
          return res.status(500).json({ success: false, message: 'User created but failed to create store', error: storeError.message });
        }
      }
      res.status(201).json({ success: true, data: { user: { id: user.id, name: user.name, email: user.email, address: user.address, role: user.role } } });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error creating user' });
    }
  },
};

export default userController;
