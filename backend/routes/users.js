import express from 'express';
import userController from '../controllers/user.controller.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Admin: create user
router.post('/', authenticate, authorize('admin'), userController.createUser);
// Admin: list users
router.get('/', authenticate, authorize('admin'), userController.getAllUsers);
// Admin: dashboard stats
router.get('/admin/dashboard', authenticate, authorize('admin'), userController.getAdminDashboard);

export default router; 