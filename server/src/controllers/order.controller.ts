import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { OrderService } from '../services/order.service.js';
import { AnalyticsService } from '../services/analytics.service.js';

export const checkoutItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().positive('Quantity must be a positive integer'),
});

export const createOrderSchema = z.object({
  customerName: z.string().min(2, 'Full name must be at least 2 characters'),
  customerEmail: z.string().email('Please enter a valid email address'),
  customerPhone: z.string().min(7, 'Phone number must be at least 7 digits'),
  address: z.string().min(5, 'Delivery address is required (minimum 5 characters)'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postalCode: z.string().min(4, 'Postal code is required'),
  items: z.array(checkoutItemSchema).min(1, 'Order must contain at least one product'),
  sessionId: z.string().optional(),
});

export class OrderController {
  static async createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        customerName,
        customerEmail,
        customerPhone,
        address,
        city,
        state,
        postalCode,
        items,
        sessionId,
      } = req.body;

      const userId = req.user ? req.user.id : null;

      const order = await OrderService.createOrder({
        userId,
        customerName,
        customerEmail,
        customerPhone,
        address,
        city,
        state,
        postalCode,
        items,
      });

      // Track ORDER_COMPLETED analytics event
      if (sessionId) {
        await AnalyticsService.recordEvent({
          eventType: 'ORDER_COMPLETED',
          sessionId,
          userId,
          eventData: {
            orderId: order.id,
            orderNumber: order.orderNumber,
            totalAmount: order.totalAmount,
            itemCount: order.items.length,
          },
        });
      }

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        order,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getCustomerOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const orders = await OrderService.getCustomerOrders(req.user.id);
      res.status(200).json({
        success: true,
        orders,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getOrderById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user ? req.user.id : undefined;
      const isAdmin = req.user?.role === 'ADMIN';

      const order = await OrderService.getOrderById(id, userId, isAdmin);
      res.status(200).json({
        success: true,
        order,
      });
    } catch (err) {
      next(err);
    }
  }
}
