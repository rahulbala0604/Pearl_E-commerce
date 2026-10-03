import express from 'express';
import {
  createOrder,
  getOrderById,
  getMyOrders,
  getAllOrders
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createOrder)
  .get(protect, getMyOrders);

router.route('/admin/all').get(protect, admin, getAllOrders);

router.route('/:id').get(protect, getOrderById);

export default router;
