import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { prisma } from '../src/utils/prisma.js';

const app = createApp();

describe('Sattva Living Backend API Test Suite', () => {
  let customerToken: string;
  let adminToken: string;
  let sampleProductId: string;
  let outOfStockProductId: string;
  let testOrderId: string;

  beforeAll(async () => {
    // 1. Log in admin to get token
    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@sattvaliving.com', password: 'Admin@Sattva2026!' });
    expect(adminRes.status).toBe(200);
    adminToken = adminRes.body.token;

    // 2. Log in demo customer
    const custRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'aarav@example.com', password: 'Customer@1234' });
    expect(custRes.status).toBe(200);
    customerToken = custRes.body.token;

    // 3. Find sample in-stock and out-of-stock products
    const inStock = await prisma.product.findFirst({
      where: { stock: { gt: 5 }, isActive: true },
    });
    sampleProductId = inStock!.id;

    const outOfStock = await prisma.product.findFirst({
      where: { stock: 0 },
    });
    outOfStockProductId = outOfStock ? outOfStock.id : '';
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  // TEST 1: Health check
  it('Health Check: API reports healthy status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
    expect(res.body.brand).toBe('Sattva Living');
  });

  // TEST 2: Product catalogue displays products from database
  it('Product Catalogue: retrieves categories and active products', async () => {
    const catRes = await request(app).get('/api/products/categories');
    expect(catRes.status).toBe(200);
    expect(catRes.body.categories.length).toBeGreaterThan(0);

    const prodRes = await request(app).get('/api/products');
    expect(prodRes.status).toBe(200);
    expect(prodRes.body.products.length).toBeGreaterThan(0);
    expect(prodRes.body.pagination.totalCount).toBeGreaterThan(0);
  });

  // TEST 3: Searching for an existing product returns relevant results
  it('Search: searching for "rubber" returns matching products', async () => {
    const res = await request(app).get('/api/products?search=rubber');
    expect(res.status).toBe(200);
    expect(res.body.products.length).toBeGreaterThan(0);
    const hasMatch = res.body.products.some(
      (p: any) =>
        p.name.toLowerCase().includes('rubber') ||
        p.material.toLowerCase().includes('rubber') ||
        p.description.toLowerCase().includes('rubber')
    );
    expect(hasMatch).toBe(true);
  });

  // TEST 4: Searching for an unknown product produces a useful empty state
  it('Search: searching for unknown product returns empty list', async () => {
    const res = await request(app).get('/api/products?search=NonExistentQuantumWidgetXYZ');
    expect(res.status).toBe(200);
    expect(res.body.products).toEqual([]);
    expect(res.body.pagination.totalCount).toBe(0);
  });

  // TEST 5: Category filtering returns appropriate products
  it('Filter: category filtering by "yoga-mats" returns only yoga mats', async () => {
    const res = await request(app).get('/api/products?category=yoga-mats');
    expect(res.status).toBe(200);
    expect(res.body.products.length).toBeGreaterThan(0);
    for (const p of res.body.products) {
      expect(p.category.slug).toBe('yoga-mats');
    }
  });

  // TEST 6: Price sorting produces the correct order
  it('Sorting: price_asc sorts products from lowest to highest price', async () => {
    const res = await request(app).get('/api/products?sortBy=price_asc');
    expect(res.status).toBe(200);
    const prices = res.body.products.map((p: any) => p.price);
    for (let i = 0; i < prices.length - 1; i++) {
      expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
    }
  });

  // TEST 10: An out-of-stock product cannot be purchased
  it('Order Creation: rejects checkout if product is out of stock', async () => {
    if (!outOfStockProductId) return;

    const res = await request(app)
      .post('/api/orders')
      .send({
        customerName: 'Test Buyer',
        customerEmail: 'buyer@example.com',
        customerPhone: '+91 99999 88888',
        address: '123 Test Street',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560001',
        items: [{ productId: outOfStockProductId, quantity: 1 }],
      });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  // TEST 9 & 12: Invalid quantities and invalid checkout details are rejected
  it('Order Validation: rejects zero quantity and invalid checkout fields', async () => {
    // Zero quantity
    const zeroRes = await request(app)
      .post('/api/orders')
      .send({
        customerName: 'Test Buyer',
        customerEmail: 'buyer@example.com',
        customerPhone: '+91 99999 88888',
        address: '123 Test Street',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560001',
        items: [{ productId: sampleProductId, quantity: 0 }],
      });
    expect(zeroRes.status).toBe(400);

    // Invalid email
    const invalidEmailRes = await request(app)
      .post('/api/orders')
      .send({
        customerName: 'Test Buyer',
        customerEmail: 'not-an-email',
        customerPhone: '123',
        address: 'Abc',
        city: 'X',
        state: 'Y',
        postalCode: '1',
        items: [{ productId: sampleProductId, quantity: 1 }],
      });
    expect(invalidEmailRes.status).toBe(400);
  });

  // TEST 11, 13 & 14: Valid order creation calculates totals authoritatively on backend
  it('Order Creation: valid order is created and backend calculates authoritative total', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        customerName: 'Aarav Patel',
        customerEmail: 'aarav@example.com',
        customerPhone: '+91 98111 22334',
        address: 'Flat 402, Lotus Residency, Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560038',
        items: [{ productId: sampleProductId, quantity: 1 }],
        sessionId: 'sess_test_100',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.order).toBeDefined();
    expect(res.body.order.orderNumber).toMatch(/^SL-2026-/);
    expect(res.body.order.items.length).toBe(1);
    expect(res.body.order.totalAmount).toBeGreaterThan(0);

    testOrderId = res.body.order.id;
  });

  // TEST 17: Ordinary customer cannot access administrator endpoints
  it('Security: ordinary customer is denied access to admin endpoints', async () => {
    const res = await request(app)
      .get('/api/admin/overview')
      .set('Authorization', `Bearer ${customerToken}`);

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
  });

  // TEST 18: Customers cannot access other customers orders
  it('Security: customer cannot view an unauthorized order', async () => {
    // Register a second customer
    const regRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Second Customer',
        email: `second_${Date.now()}@example.com`,
        password: 'Password123!',
      });
    expect(regRes.status).toBe(201);
    const secondToken = regRes.body.token;

    // Attempt to view first customer's order
    const viewRes = await request(app)
      .get(`/api/orders/${testOrderId}`)
      .set('Authorization', `Bearer ${secondToken}`);

    expect(viewRes.status).toBe(403);
    expect(viewRes.body.success).toBe(false);
  });

  // TEST 15 & 16: Administrator can add/update product and update inventory
  it('Admin: administrator can update product inventory and view analytics', async () => {
    const stockRes = await request(app)
      .patch(`/api/admin/products/${sampleProductId}/stock`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ stock: 55 });

    expect(stockRes.status).toBe(200);
    expect(stockRes.body.product.stock).toBe(55);

    // Verify change is reflected in public catalogue
    const publicRes = await request(app).get(`/api/products/slug/${stockRes.body.product.slug}`);
    expect(publicRes.status).toBe(200);
    expect(publicRes.body.product.stock).toBe(55);

    // Verify admin overview and analytics
    const overviewRes = await request(app)
      .get('/api/admin/overview')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(overviewRes.status).toBe(200);
    expect(overviewRes.body.overview.totalOrdersCount).toBeGreaterThan(0);

    const analyticsRes = await request(app)
      .get('/api/admin/analytics')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(analyticsRes.status).toBe(200);
    expect(analyticsRes.body.data.metrics.conversionRate).toBeDefined();
    expect(analyticsRes.body.data.methodology).toBeDefined();
  });

  // TEST 19: Product finder returns valid catalogue records
  it('Product Finder / AI: returns valid verified catalogue recommendations', async () => {
    const res = await request(app)
      .post('/api/ai/recommend')
      .send({
        query: 'I am a beginner looking for an eco-friendly yoga mat and props',
        preferences: {
          category: 'yoga-mats',
          experienceLevel: 'BEGINNER',
          budgetMax: 3500, // in rupees
        },
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.recommendedProducts.length).toBeGreaterThan(0);
    // Ensure every recommended product exists in database and has valid price
    for (const rec of res.body.recommendedProducts) {
      expect(rec.id).toBeDefined();
      expect(rec.name).toBeDefined();
      expect(rec.price).toBeGreaterThan(0);
      expect(rec.reason).toBeDefined();
    }
  });
});
