import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ratingController = {
  // Submit or update rating
  submitOrUpdateRating: async (req, res) => {
    try {
      const { storeId, rating } = req.body;
      if (!storeId || !rating) {
        return res.status(400).json({ success: false, message: 'Store and rating required' });
      }
      if (rating < 1 || rating > 5) {
        return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
      }
      // Upsert rating
      const userId = req.user.id;
      const userRating = await prisma.rating.upsert({
        where: { userId_storeId: { userId, storeId: Number(storeId) } },
        update: { rating },
        create: { userId, storeId: Number(storeId), rating },
      });
      // Update store's average rating
      const ratings = await prisma.rating.findMany({ where: { storeId: Number(storeId) } });
      const averageRating = ratings.length ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(2) : 0;
      await prisma.store.update({ where: { id: Number(storeId) }, data: { averageRating: Number(averageRating) } });
      res.json({ success: true, data: { userRating, averageRating } });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error submitting rating' });
    }
  },
  // Get user's rating for a store
  getUserRating: async (req, res) => {
    try {
      const { storeId } = req.query;
      const userRating = await prisma.rating.findUnique({ where: { userId_storeId: { userId: req.user.id, storeId: Number(storeId) } } });
      res.json({ success: true, data: userRating });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching rating' });
    }
  },
};

export default ratingController; 