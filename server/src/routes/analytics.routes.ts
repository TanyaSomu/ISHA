import { Router } from 'express';
import { AnalyticsController, trackEventSchema } from '../controllers/analytics.controller.js';
import { validateBody } from '../middlewares/validate.js';
import { optionalAuth } from '../middlewares/auth.js';

const router = Router();

router.post('/track', optionalAuth, validateBody(trackEventSchema), AnalyticsController.track);

export default router;
