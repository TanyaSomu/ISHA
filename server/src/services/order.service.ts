import { prisma } from '../utils/prisma.js';
import { AppError } from '../middlewares/errorHandler.js';
import { config } from '../config/index.js';
import { OrderStatus, Prisma } from '@prisma/client';

export interface CheckoutItemInput {
  productId: string;
  quantity: number;
}

export interface CreateOrderInput {
  userId?: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  items: CheckoutItemInput[];
}

export class OrderService {
  static async createOrder(input: CreateOrderInput) {
    if (!input.items || input.items.length === 0) {
      throw new AppError('Order must contain at least one item', 400);
    }

    // Run order creation and inventory decrement inside an isolated Prisma transaction
    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      let calculatedSubtotal = 0;
      const orderItemsToCreate: Array<{
        productId: string;
        productName: string;
        productImage: string;
        unitPrice: number;
        quantity: number;
        subtotal: number;
      }> = [];

      for (const item of input.items) {
        if (!item.quantity || item.quantity <= 0 || !Number.isInteger(item.quantity)) {
          throw new AppError(`Invalid item quantity: ${item.quantity}. Must be a positive integer.`, 400);
        }

        // Fetch fresh product from database to get authoritative price and stock
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new AppError(`Product with id '${item.productId}' was not found`, 404);
        }

        if (!product.isActive) {
          throw new AppError(`'${product.name}' has been discontinued and is not available for purchase.`, 400);
        }

        if (product.stock < item.quantity) {
          throw new AppError(
            `Insufficient stock for '${product.name}'. Available: ${product.stock}, requested: ${item.quantity}.`,
            400
          );
        }

        // Decrement stock atomically
        await tx.product.update({
          where: { id: product.id },
          data: { stock: { decrement: item.quantity } },
        });

        const lineSubtotal = product.price * item.quantity;
        calculatedSubtotal += lineSubtotal;

        let parsedImage = '';
        try {
          const imgs = JSON.parse(product.images);
          parsedImage = Array.isArray(imgs) && imgs.length > 0 ? imgs[0] : '';
        } catch {
          parsedImage = '';
        }

        orderItemsToCreate.push({
          productId: product.id,
          productName: product.name,
          productImage: parsedImage,
          unitPrice: product.price, // Authoritative purchase-time price in paise
          quantity: item.quantity,
          subtotal: lineSubtotal,
        });
      }

      // Calculate delivery fee
      const deliveryCharge =
        calculatedSubtotal >= config.brand.freeShippingThreshold
          ? 0
          : config.brand.standardShippingFee;

      const totalAmount = calculatedSubtotal + deliveryCharge;

      // Generate human-readable order number e.g. SL-2026-XXXXX
      const randomPart = Math.floor(1000 + Math.random() * 9000);
      const timestampPart = Date.now().toString().slice(-4);
      const orderNumber = `SL-2026-${randomPart}-${timestampPart}`;

      const createdOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: input.userId || null,
          customerName: input.customerName.trim(),
          customerEmail: input.customerEmail.trim().toLowerCase(),
          customerPhone: input.customerPhone.trim(),
          address: input.address.trim(),
          city: input.city.trim(),
          state: input.state.trim(),
          postalCode: input.postalCode.trim(),
          subtotal: calculatedSubtotal,
          deliveryCharge,
          totalAmount,
          status: OrderStatus.CONFIRMED,
          paymentMethod: 'SIMULATED_CHECKOUT',
          paymentStatus: 'SIMULATED_PAID',
          items: {
            create: orderItemsToCreate,
          },
        },
        include: {
          items: true,
        },
      });

      return createdOrder;
    });
  }

  static async getCustomerOrders(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
      },
    });
  }

  static async getOrderById(orderId: string, authorizedUserId?: string, isAdmin = false) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    // Ensure authorization
    if (!isAdmin) {
      if (!authorizedUserId || order.userId !== authorizedUserId) {
        throw new AppError('Access forbidden: You are not authorized to view this order', 403);
      }
    }

    return order;
  }

  static async getAllOrders(page = 1, limit = 20, status?: OrderStatus) {
    const where: any = {};
    if (status) {
      where.status = status;
    }

    const skip = (page - 1) * limit;

    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: { items: true, user: { select: { id: true, name: true, email: true } } },
      }),
      prisma.order.count({ where }),
    ]);

    return {
      orders,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit) || 1,
      },
    };
  }

  static async updateOrderStatus(orderId: string, status: OrderStatus) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      throw new AppError('Order not found to update status', 404);
    }

    return prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: { items: true },
    });
  }
}
