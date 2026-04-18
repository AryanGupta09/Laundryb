import { Router } from 'express';
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} from '../controllers/orderController.js';

const router = Router();

// POST   /api/orders
router.post('/', createOrder);

// GET    /api/orders
router.get('/', getAllOrders);

// GET    /api/orders/:id
router.get('/:id', getOrderById);

// PATCH  /api/orders/:id/status
router.patch('/:id/status', updateOrderStatus);

export default router;
