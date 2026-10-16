import { Router } from 'express';
import { ProductController } from '../controllers/product.controller.js';

const router = Router();

router.get('/categories', ProductController.getCategories);
router.get('/', ProductController.getProducts);
router.get('/slug/:slug', ProductController.getProductBySlug);
router.get('/:id/related', ProductController.getRelated);

export default router;
