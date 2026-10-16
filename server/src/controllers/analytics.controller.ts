import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AnalyticsService } from '../services/analytics.service.js';

export const trackEventSchema = z.object({
  eventType: z.enum([
    'PAGE_VIEW',
    'PRODUCT_VIEW',
    'SEARCH',
    'FILTER_APPLIED',
    'ADD_TO_CART',
    'CHECKOUT_STARTED',
    'ORDER_COMPLETED',
  ]),
  sessionId: z.string().min(1, 'Session ID is required'),
  eventData: z.record(z.any()).optional(),
});

export class AnalyticsController {
  static async track(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { eventType, sessionId, eventData } = req.body;
      const userId = req.user ? req.user.id : null;

      await AnalyticsService.recordEvent({
        eventType,
        sessionId,
        eventData,
        userId,
      });

      res.status(200).json({ success: true });
    } catch (err) {
      next(err);
    }
  }
}
