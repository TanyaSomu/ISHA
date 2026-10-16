import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AIService } from '../services/ai.service.js';

export const aiRecommendationSchema = z.object({
  query: z.string().min(1, 'Query or question is required'),
  preferences: z
    .object({
      category: z.string().optional(),
      budgetMax: z.number().positive().optional(), // in INR rupees from UI
      experienceLevel: z.string().optional(),
      attributes: z.array(z.string()).optional(),
    })
    .optional(),
});

export class AIController {
  static async recommend(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { query, preferences } = req.body;

      // If budgetMax is provided in rupees (e.g. 3500), convert to paise (350000)
      const adjustedPreferences = preferences
        ? {
            ...preferences,
            budgetMax: preferences.budgetMax
              ? preferences.budgetMax > 50000
                ? preferences.budgetMax
                : preferences.budgetMax * 100
              : undefined,
          }
        : undefined;

      const recommendations = await AIService.getRecommendations(query, adjustedPreferences);

      res.status(200).json({
        success: true,
        ...recommendations,
      });
    } catch (err) {
      next(err);
    }
  }
}
