import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../utils/prisma.js';
import { ProductService } from '../services/product.service.js';
import { OrderService } from '../services/order.service.js';
import { AnalyticsService } from '../services/analytics.service.js';
import { OrderStatus } from '@prisma/client';
import { AppError } from '../middlewares/errorHandler.js';

export const createProductSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  description: z.string().min(5, 'Description is required'),
  price: z.number().int().positive('Price in paise must be a positive integer'),
  compareAtPrice: z.number().int().positive().nullable().optional(),
  categoryId: z.string().min(1, 'Category ID is required'),
  images: z.array(z.string()).min(1, 'At least one product image URL is required'),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  material: z.string().min(2, 'Material specification is required'),
  dimensions: z.string().min(2, 'Dimensions are required'),
  careInstructions: z.string().min(2, 'Care instructions are required'),
  intendedUse: z.string().min(2, 'Intended use description is required'),
  experienceLevel: z.string().optional(),
  isFeatured: z.boolean().optional(),
  isBestseller: z.boolean().optional(),
  isActive: z.boolean().optional(),
  collectionTags: z.array(z.string()).optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const updateStockSchema = z.object({
  stock: z.number().int().min(0, 'Stock count cannot be negative'),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
});

export class AdminController {
  static async getOverview(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const [
        totalActiveProducts,
        lowStockProductsCount,
        totalOrdersCount,
        pendingOrdersCount,
        completedOrders,
      ] = await Promise.all([
        prisma.product.count({ where: { isActive: true } }),
        prisma.product.count({ where: { stock: { lte: 5 }, isActive: true } }),
        prisma.order.count(),
        prisma.order.count({
          where: { status: { in: [OrderStatus.PENDING, OrderStatus.CONFIRMED, OrderStatus.PROCESSING] } },
        }),
        prisma.order.findMany({
          where: { status: { not: OrderStatus.CANCELLED } },
          select: { totalAmount: true },
        }),
      ]);

      const totalRecordedRevenue = completedOrders.reduce((sum, o) => sum + o.totalAmount, 0);

      // Fetch 5 most recent orders for quick review
      const recentOrders = await prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { items: true },
      });

      res.status(200).json({
        success: true,
        overview: {
          totalActiveProducts,
          lowStockProductsCount,
          totalOrdersCount,
          ordersAwaitingProcessing: pendingOrdersCount,
          totalRecordedRevenue, // in paise
          recentOrders,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async getProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;

      const result = await ProductService.getProducts({
        page,
        limit,
        includeInactive: true, // admin sees both active and discontinued
      });

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }

  static async createProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await ProductService.createProduct(req.body);
      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        product,
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const product = await ProductService.updateProduct(id, req.body);
      res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        product,
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateStock(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { stock } = req.body;
      const product = await ProductService.updateStock(id, stock);
      res.status(200).json({
        success: true,
        message: 'Inventory count updated successfully',
        product,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
      const status = req.query.status as OrderStatus | undefined;

      const result = await OrderService.getAllOrders(page, limit, status);
      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateOrderStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const order = await OrderService.updateOrderStatus(id, status as OrderStatus);
      res.status(200).json({
        success: true,
        message: `Order status updated to ${status}`,
        order,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getAnalytics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const days = req.query.days ? parseInt(req.query.days as string, 10) : undefined;
      const data = await AnalyticsService.getDashboardMetrics(days);
      res.status(200).json({
        success: true,
        data,
      });
    } catch (err) {
      next(err);
    }
  }
}
