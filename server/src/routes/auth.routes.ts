import { Router } from 'express';
import { AuthController, registerSchema, loginSchema } from '../controllers/auth.controller.js';
import { validateBody } from '../middlewares/validate.js';
import { authenticateJWT } from '../middlewares/auth.js';

const router = Router();

router.post('/register', validateBody(registerSchema), AuthController.register);
router.post('/login', validateBody(loginSchema), AuthController.login);
router.get('/me', authenticateJWT, AuthController.getMe);

export default router;
