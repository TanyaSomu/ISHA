import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { prisma } from '../utils/prisma.js';
import { AppError } from './errorHandler.js';

export interface AuthUser {
  id: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
  name: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export const authenticateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Authentication token missing or invalid format', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwtSecret) as {
      id: string;
      email: string;
      role: 'CUSTOMER' | 'ADMIN';
    };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true, name: true },
    });

    if (!user) {
      throw new AppError('Authenticated user no longer exists', 401);
    }

    req.user = user as AuthUser;
    next();
  } catch (error: any) {
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ success: false, error: 'Session expired or token invalid' });
      return;
    }
    next(error);
  }
};

export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, config.jwtSecret) as { id: string };
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true, role: true, name: true },
      });
      if (user) {
        req.user = user as AuthUser;
      }
    }
  } catch {
    // Ignore invalid token in optional auth
  }
  next();
};

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || req.user.role !== 'ADMIN') {
    res.status(403).json({
      success: false,
      error: 'Access denied: Administrator privileges required',
    });
    return;
  }
  next();
};
