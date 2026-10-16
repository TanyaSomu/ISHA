import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config/index.js';
import { errorHandler } from './middlewares/errorHandler.js';

// Route imports
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import aiRoutes from './routes/ai.routes.js';
import adminRoutes from './routes/admin.routes.js';

export const createApp = (): Express => {
  const app = express();

  // Security headers
  app.use(helmet());

  // CORS configuration
  app.use(
    cors({
      origin: [config.clientOrigin, 'http://localhost:5173', 'http://127.0.0.1:5173'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Request size limit
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // Sensitive endpoint rate limiting (auth & AI)
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 auth requests per 15 minutes
    message: { success: false, error: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
  });

  const aiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 30, // Limit each IP to 30 requests per minute
    message: { success: false, error: 'AI assistant rate limit reached. Please wait a moment.' },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Health check endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({
      status: 'healthy',
      brand: config.brand.name,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // Mount API modules
  app.use('/api/auth', authLimiter, authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/analytics', analyticsRoutes);
  app.use('/api/ai', aiLimiter, aiRoutes);
  app.use('/api/admin', adminRoutes);

  // 404 handler for undefined API routes
  app.use('*', (req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: `Cannot ${req.method} ${req.originalUrl}`,
    });
  });

  // Centralized Error Handling Middleware
  app.use(errorHandler);

  return app;
};
