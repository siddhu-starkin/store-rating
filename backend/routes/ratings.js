import express from 'express';
import ratingController from '../controllers/ratingController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Submit or update rating
router.post('/', authenticate, ratingController.submitOrUpdateRating);
// Get user's rating for a store
router.get('/', authenticate, ratingController.getUserRating);

// Get user's rating for a specific store
router.get('/user-rating', authenticate, ratingController.getUserRating);

export default router; 