import { Router } from 'express';
import { AIController, aiRecommendationSchema } from '../controllers/ai.controller.js';
import { validateBody } from '../middlewares/validate.js';

const router = Router();

router.post('/recommend', validateBody(aiRecommendationSchema), AIController.recommend);

export default router;
