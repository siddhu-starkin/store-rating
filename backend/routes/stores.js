import express from 'express';
import storeController from '../controllers/storeController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Admin: create store
router.post('/', authenticate, authorize('admin'), storeController.createStore);
// User: list/search stores
router.get('/', authenticate, storeController.listStores);
// Store owner: dashboard
router.get('/owner/dashboard', authenticate, authorize('owner'), storeController.ownerDashboard);

export default router; 