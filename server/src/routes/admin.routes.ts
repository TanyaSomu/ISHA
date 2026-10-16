import { Router } from 'express';
import {
  AdminController,
  createProductSchema,
  updateProductSchema,
  updateStockSchema,
  updateOrderStatusSchema,
} from '../controllers/admin.controller.js';
import { authenticateJWT, requireAdmin } from '../middlewares/auth.js';
import { validateBody } from '../middlewares/validate.js';

const router = Router();

// Enforce authentication & administrator role on all admin routes
router.use(authenticateJWT);
router.use(requireAdmin);

// Dashboard overview
router.get('/overview', AdminController.getOverview);

// Product management
router.get('/products', AdminController.getProducts);
router.post('/products', validateBody(createProductSchema), AdminController.createProduct);
router.patch('/products/:id', validateBody(updateProductSchema), AdminController.updateProduct);
router.patch('/products/:id/stock', validateBody(updateStockSchema), AdminController.updateStock);

// Order management
router.get('/orders', AdminController.getOrders);
router.patch('/orders/:id/status', validateBody(updateOrderStatusSchema), AdminController.updateOrderStatus);

// Business analytics
router.get('/analytics', AdminController.getAnalytics);

export default router;
