import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: formattedErrors,
    });
    return;
  }

  // Handle custom AppError
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
    return;
  }

  // Handle Prisma not found or constraint errors
  if (err.code === 'P2025') {
    res.status(404).json({
      success: false,
      error: 'Requested record was not found.',
    });
    return;
  }

  if (err.code === 'P2002') {
    res.status(409).json({
      success: false,
      error: 'A record with this unique identifier or email already exists.',
    });
    return;
  }

  // Generic fallback
  console.error('[Unhandled Server Error]:', err);
  res.status(500).json({
    success: false,
    error: 'An unexpected internal server error occurred. Please try again later.',
  });
};
