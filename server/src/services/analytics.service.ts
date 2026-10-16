import { prisma } from '../utils/prisma.js';

export class AnalyticsService {
  static async recordEvent(data: {
    eventType: string;
    sessionId: string;
    eventData?: Record<string, any>;
    userId?: string | null;
  }) {
    if (!data.sessionId || !data.eventType) {
      return null;
    }

    return prisma.analyticsEvent.create({
      data: {
        eventType: data.eventType,
        sessionId: data.sessionId,
        eventData: data.eventData ? JSON.stringify(data.eventData) : null,
        userId: data.userId || null,
      },
    });
  }

  static async getDashboardMetrics(timeRangeDays?: number) {
    const dateFilter: any = {};
    if (timeRangeDays && timeRangeDays > 0) {
      const sinceDate = new Date();
      sinceDate.setDate(sinceDate.getDate() - timeRangeDays);
      dateFilter.gte = sinceDate;
    }

    const eventWhere = timeRangeDays ? { createdAt: dateFilter } : {};
    const orderWhere = timeRangeDays ? { createdAt: dateFilter } : {};

    // 1. Total events and distinct sessions
    const allEvents = await prisma.analyticsEvent.findMany({
      where: eventWhere,
      select: { eventType: true, sessionId: true, eventData: true },
    });

    const uniqueSessions = new Set<string>();
    const cartSessions = new Set<string>();
    const checkoutSessions = new Set<string>();
    const orderSessions = new Set<string>();
    let productViewsCount = 0;

    const productViewCounts: Record<string, { count: number; name: string }> = {};

    for (const ev of allEvents) {
      uniqueSessions.add(ev.sessionId);

      if (ev.eventType === 'PRODUCT_VIEW') {
        productViewsCount++;
        try {
          if (ev.eventData) {
            const parsed = JSON.parse(ev.eventData);
            if (parsed.productId) {
              if (!productViewCounts[parsed.productId]) {
                productViewCounts[parsed.productId] = {
                  count: 0,
                  name: parsed.name || 'Unknown Product',
                };
              }
              productViewCounts[parsed.productId].count++;
            }
          }
        } catch {
          // ignore parse errors
        }
      } else if (ev.eventType === 'ADD_TO_CART') {
        cartSessions.add(ev.sessionId);
      } else if (ev.eventType === 'CHECKOUT_STARTED') {
        checkoutSessions.add(ev.sessionId);
      } else if (ev.eventType === 'ORDER_COMPLETED') {
        orderSessions.add(ev.sessionId);
      }
    }

    const totalSessionsCount = uniqueSessions.size || 1; // avoid division by zero

    // 2. Orders metrics
    const orders = await prisma.order.findMany({
      where: orderWhere,
      select: {
        id: true,
        totalAmount: true,
        status: true,
        items: {
          select: { productId: true, productName: true, quantity: true },
        },
      },
    });

    const completedOrders = orders.filter((o) => o.status !== 'CANCELLED');
    const completedOrdersCount = completedOrders.length;
    const recordedRevenue = completedOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    // Conversion rate: (sessions with completed order / total sessions) * 100
    const conversionRate = parseFloat(
      ((orderSessions.size / totalSessionsCount) * 100).toFixed(2)
    );

    // Add to cart rate: (sessions with add to cart / total sessions) * 100
    const addToCartRate = parseFloat(
      ((cartSessions.size / totalSessionsCount) * 100).toFixed(2)
    );

    // Checkout initiation rate: (sessions with checkout / total sessions) * 100
    const checkoutInitiationRate = parseFloat(
      ((checkoutSessions.size / totalSessionsCount) * 100).toFixed(2)
    );

    // Average Order Value (AOV) in paise
    const averageOrderValue =
      completedOrdersCount > 0 ? Math.round(recordedRevenue / completedOrdersCount) : 0;

    // 3. Most viewed products (Top 5)
    const mostViewedProducts = Object.entries(productViewCounts)
      .map(([id, data]) => ({ productId: id, name: data.name, views: data.count }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    // 4. Most purchased products (Top 5)
    const productPurchases: Record<string, { name: string; quantity: number }> = {};
    for (const ord of completedOrders) {
      for (const item of ord.items) {
        if (!productPurchases[item.productId]) {
          productPurchases[item.productId] = { name: item.productName, quantity: 0 };
        }
        productPurchases[item.productId].quantity += item.quantity;
      }
    }

    const mostPurchasedProducts = Object.entries(productPurchases)
      .map(([id, data]) => ({
        productId: id,
        name: data.name,
        unitsSold: data.quantity,
      }))
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, 5);

    return {
      metrics: {
        uniqueVisitorSessions: uniqueSessions.size,
        totalProductViews: productViewsCount,
        addToCartRate, // percentage
        checkoutInitiationRate, // percentage
        completedOrders: completedOrdersCount,
        conversionRate, // percentage
        averageOrderValue, // in paise
        recordedRevenue, // in paise
      },
      rankings: {
        mostViewedProducts,
        mostPurchasedProducts,
      },
      methodology: {
        conversionRate:
          'Calculated as (Unique Visitor Sessions with an ORDER_COMPLETED event / Total Unique Sessions) * 100.',
        averageOrderValue:
          'Calculated as Total Recorded Revenue from non-cancelled orders / Total number of non-cancelled orders.',
        limitations:
          'Anonymous session IDs are stored in localStorage/cookies. In incognito or cookie-blocked environments, sessions may reset on refresh. No cross-device tracking is performed to uphold customer privacy.',
      },
    };
  }
}
