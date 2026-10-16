import { Router } from 'express';
import { OrderController, createOrderSchema } from '../controllers/order.controller.js';
import { validateBody } from '../middlewares/validate.js';
import { authenticateJWT, optionalAuth } from '../middlewares/auth.js';

const router = Router();

// Guest or authenticated user can place an order
router.post('/', optionalAuth, validateBody(createOrderSchema), OrderController.createOrder);

// Authenticated user can see their orders
router.get('/my-orders', authenticateJWT, OrderController.getCustomerOrders);

// Fetch specific order (authorized user or admin)
router.get('/:id', optionalAuth, OrderController.getOrderById);

export default router;
