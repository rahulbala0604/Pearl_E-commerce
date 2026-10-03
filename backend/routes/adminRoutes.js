import express from 'express';
import { getDashboardStats, getCustomers, getAdminOrders, updateOrderStatus, getAdminPayments, updatePaymentStatus } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', protect, admin, getDashboardStats);
router.get('/customers', protect, admin, getCustomers);
router.get('/orders', protect, admin, getAdminOrders);
router.put('/orders/:id/status', protect, admin, updateOrderStatus);
router.get('/payments', protect, admin, getAdminPayments);
router.put('/payments/:id/status', protect, admin, updatePaymentStatus);

export default router;
