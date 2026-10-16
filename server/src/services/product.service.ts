import { prisma } from '../utils/prisma.js';
import { AppError } from '../middlewares/errorHandler.js';

export interface ProductFilterOptions {
  search?: string;
  categorySlug?: string;
  minPrice?: number; // in paise
  maxPrice?: number; // in paise
  inStockOnly?: boolean;
  featuredOnly?: boolean;
  bestsellerOnly?: boolean;
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'popularity';
  page?: number;
  limit?: number;
  includeInactive?: boolean; // for admin
}

export class ProductService {
  static async getCategories() {
    return prisma.category.findMany({
      orderBy: { displayOrder: 'asc' },
      include: {
        _count: {
          select: { products: { where: { isActive: true } } },
        },
      },
    });
  }

  static async getProducts(options: ProductFilterOptions = {}) {
    const {
      search,
      categorySlug,
      minPrice,
      maxPrice,
      inStockOnly,
      featuredOnly,
      bestsellerOnly,
      sortBy = 'newest',
      page = 1,
      limit = 20,
      includeInactive = false,
    } = options;

    const where: any = {};

    if (!includeInactive) {
      where.isActive = true;
    }

    if (inStockOnly) {
      where.stock = { gt: 0 };
    }

    if (featuredOnly) {
      where.isFeatured = true;
    }

    if (bestsellerOnly) {
      where.isBestseller = true;
    }

    if (categorySlug) {
      where.category = { slug: categorySlug };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    if (search && search.trim() !== '') {
      const term = search.trim();
      where.OR = [
        { name: { contains: term, mode: 'insensitive' } },
        { description: { contains: term, mode: 'insensitive' } },
        { material: { contains: term, mode: 'insensitive' } },
        { intendedUse: { contains: term, mode: 'insensitive' } },
        { collectionTags: { contains: term, mode: 'insensitive' } },
      ];
    }

    // Determine sorting
    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'price_asc') {
      orderBy = { price: 'asc' };
    } else if (sortBy === 'price_desc') {
      orderBy = { price: 'desc' };
    } else if (sortBy === 'popularity') {
      orderBy = [{ isBestseller: 'desc' }, { isFeatured: 'desc' }, { stock: 'desc' }];
    } else if (sortBy === 'newest') {
      orderBy = { createdAt: 'desc' };
    }

    const skip = (page - 1) * limit;

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit) || 1,
      },
    };
  }

  static async getProductBySlug(slug: string) {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
      },
    });

    if (!product) {
      throw new AppError(`Product with slug '${slug}' not found`, 404);
    }

    return product;
  }

  static async getProductById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!product) {
      throw new AppError(`Product with id '${id}' not found`, 404);
    }

    return product;
  }

  static async getRelatedProducts(productId: string, limit = 4) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, categoryId: true },
    });

    if (!product) return [];

    return prisma.product.findMany({
      where: {
        id: { not: productId },
        categoryId: product.categoryId,
        isActive: true,
        stock: { gt: 0 },
      },
      take: limit,
      include: {
        category: { select: { id: true, name: true, slug: true } },
      },
    });
  }

  static async createProduct(data: {
    name: string;
    slug?: string;
    description: string;
    price: number;
    compareAtPrice?: number | null;
    categoryId: string;
    images: string[];
    stock: number;
    material: string;
    dimensions: string;
    careInstructions: string;
    intendedUse: string;
    experienceLevel?: string;
    isFeatured?: boolean;
    isBestseller?: boolean;
    isActive?: boolean;
    collectionTags?: string[];
  }) {
    // Generate slug if not provided
    const slug =
      data.slug ||
      data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') +
        '-' +
        Date.now().toString().slice(-4);

    return prisma.product.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        price: data.price,
        compareAtPrice: data.compareAtPrice,
        categoryId: data.categoryId,
        images: JSON.stringify(data.images),
        stock: data.stock,
        material: data.material,
        dimensions: data.dimensions,
        careInstructions: data.careInstructions,
        intendedUse: data.intendedUse,
        experienceLevel: data.experienceLevel || 'ALL_LEVELS',
        isFeatured: data.isFeatured ?? false,
        isBestseller: data.isBestseller ?? false,
        isActive: data.isActive ?? true,
        collectionTags: JSON.stringify(data.collectionTags || []),
      },
      include: {
        category: true,
      },
    });
  }

  static async updateProduct(id: string, data: any) {
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      throw new AppError('Product not found to update', 404);
    }

    const updateData: any = { ...data };
    if (data.images && Array.isArray(data.images)) {
      updateData.images = JSON.stringify(data.images);
    }
    if (data.collectionTags && Array.isArray(data.collectionTags)) {
      updateData.collectionTags = JSON.stringify(data.collectionTags);
    }

    return prisma.product.update({
      where: { id },
      data: updateData,
      include: { category: true },
    });
  }

  static async updateStock(id: string, newStock: number) {
    if (newStock < 0) {
      throw new AppError('Inventory count cannot be negative', 400);
    }
    return prisma.product.update({
      where: { id },
      data: { stock: newStock },
    });
  }
}
