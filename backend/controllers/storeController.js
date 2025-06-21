import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const storeController = {
  // Admin: Add new store
  createStore: async (req, res) => {
    try {
      const { name, email, address, password } = req.body;
      if (!name || !email || !address || !password) {
        return res.status(400).json({ success: false, message: 'All fields required' });
      }
      if (password.length < 8 || password.length > 16) {
        return res.status(400).json({ success: false, message: 'Password must be 8-16 characters.' });
      }
      if (!/[A-Z]/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
        return res.status(400).json({ success: false, message: 'Password must have at least one uppercase letter and one special character.' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const store = await prisma.store.create({
        data: {
          name,
          email,
          address,
          password: hashedPassword,
        },
      });
      res.status(201).json({ success: true, data: store });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error creating store' });
    }
  },
  // List/search stores (for users)
  listStores: async (req, res) => {
    try {
      const { search } = req.query;
      const where = {};
      
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { address: { contains: search, mode: 'insensitive' } },
        ];
      }

      const stores = await prisma.store.findMany({
        where,
        include: {
          owner: { select: { id: true, name: true, email: true, address: true } },
          ratings: true,
        },
      });
      // Add average rating to each store
      const storesWithAvg = stores.map(store => {
        const avg = store.ratings.length ? (store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length).toFixed(2) : 0;
        return { ...store, averageRating: avg };
      });
      res.json({ success: true, data: storesWithAvg });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error listing stores' });
    }
  },
  // Store owner: dashboard (list users who rated, average rating)
  ownerDashboard: async (req, res) => {
    try {
      const ownerId = req.user.id;
      const store = await prisma.store.findFirst({ where: { ownerId }, include: { ratings: { include: { user: { select: { id: true, name: true, email: true, address: true } } } } } });
      if (!store) return res.status(404).json({ success: false, message: 'Store not found' });
      const ratings = store.ratings;
      const averageRating = ratings.length ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(2) : 0;
      res.json({ success: true, data: { store, ratings, averageRating } });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching dashboard' });
    }
  },
};

export default storeController; 