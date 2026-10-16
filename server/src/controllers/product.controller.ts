import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service.js';

export class ProductController {
  static async getCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await ProductService.getCategories();
      res.status(200).json({
        success: true,
        categories,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        search,
        category,
        minPrice,
        maxPrice,
        inStock,
        featured,
        bestseller,
        sortBy,
        page,
        limit,
      } = req.query;

      // Parse prices (frontend may pass INR Rupees or Paise; if <= 100000 assume Rupees and convert to paise, or if marked)
      const parsedMinPrice = minPrice ? parseInt(minPrice as string, 10) * 100 : undefined;
      const parsedMaxPrice = maxPrice ? parseInt(maxPrice as string, 10) * 100 : undefined;

      const result = await ProductService.getProducts({
        search: search as string,
        categorySlug: category as string,
        minPrice: parsedMinPrice,
        maxPrice: parsedMaxPrice,
        inStockOnly: inStock === 'true',
        featuredOnly: featured === 'true',
        bestsellerOnly: bestseller === 'true',
        sortBy: sortBy as any,
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 20,
      });

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getProductBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slug } = req.params;
      const product = await ProductService.getProductBySlug(slug);
      res.status(200).json({
        success: true,
        product,
      });
    } catch (err) {
      next(err);
    }
  }

  static async getRelated(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 4;
      const related = await ProductService.getRelatedProducts(id, limit);
      res.status(200).json({
        success: true,
        related,
      });
    } catch (err) {
      next(err);
    }
  }
}
