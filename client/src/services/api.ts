import {
  Category,
  Product,
  Order,
  User,
  AIRecommendationResponse,
  AnalyticsData,
} from '../types/index.js';

const API_BASE = '/api';

export function getSessionId(): string {
  let sid = localStorage.getItem('sattva_session_id');
  if (!sid) {
    sid = 'sess_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now().toString(36);
    localStorage.setItem('sattva_session_id', sid);
  }
  return sid;
}

export function getAuthToken(): string | null {
  return localStorage.getItem('sattva_token');
}

export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem('sattva_token', token);
  } else {
    localStorage.removeItem('sattva_token');
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong. Please try again.');
  }

  return data;
}

export const api = {
  // Products
  async getCategories(): Promise<{ categories: Category[] }> {
    return request('/products/categories');
  },

  async getProducts(params: {
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    featured?: boolean;
    bestseller?: boolean;
    sortBy?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<{
    products: Product[];
    pagination: { page: number; limit: number; totalCount: number; totalPages: number };
  }> {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.category) query.append('category', params.category);
    if (params.minPrice !== undefined) query.append('minPrice', params.minPrice.toString());
    if (params.maxPrice !== undefined) query.append('maxPrice', params.maxPrice.toString());
    if (params.inStock) query.append('inStock', 'true');
    if (params.featured) query.append('featured', 'true');
    if (params.bestseller) query.append('bestseller', 'true');
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());

    return request(`/products?${query.toString()}`);
  },

  async getProductBySlug(slug: string): Promise<{ product: Product }> {
    return request(`/products/slug/${slug}`);
  },

  async getRelatedProducts(id: string): Promise<{ related: Product[] }> {
    return request(`/products/${id}/related`);
  },

  // Auth
  async register(body: any): Promise<{ user: User; token: string }> {
    const res = await request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    setAuthToken(res.token);
    return res;
  },

  async login(body: { email: string; password: string }): Promise<{ user: User; token: string }> {
    const res = await request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    setAuthToken(res.token);
    return res;
  },

  async getMe(): Promise<{ user: User }> {
    return request('/auth/me');
  },

  logout() {
    setAuthToken(null);
  },

  // Orders
  async createOrder(body: any): Promise<{ order: Order }> {
    return request('/orders', {
      method: 'POST',
      body: JSON.stringify({
        ...body,
        sessionId: getSessionId(),
      }),
    });
  },

  async getMyOrders(): Promise<{ orders: Order[] }> {
    return request('/orders/my-orders');
  },

  async getOrderById(id: string): Promise<{ order: Order }> {
    return request(`/orders/${id}`);
  },

  // AI & Product Finder
  async getAIRecommendations(
    query: string,
    preferences?: any
  ): Promise<AIRecommendationResponse> {
    return request('/ai/recommend', {
      method: 'POST',
      body: JSON.stringify({ query, preferences }),
    });
  },

  // Analytics Event Tracking
  async trackEvent(eventType: string, eventData?: Record<string, any>) {
    try {
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType,
          sessionId: getSessionId(),
          eventData,
        }),
      });
    } catch {
      // Non-blocking analytics
    }
  },

  // Admin APIs
  async getAdminOverview(): Promise<{ overview: any }> {
    return request('/admin/overview');
  },

  async getAdminProducts(page = 1, limit = 50): Promise<{
    products: Product[];
    pagination: any;
  }> {
    return request(`/admin/products?page=${page}&limit=${limit}`);
  },

  async createAdminProduct(body: any): Promise<{ product: Product }> {
    return request('/admin/products', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  async updateAdminProduct(id: string, body: any): Promise<{ product: Product }> {
    return request(`/admin/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  async updateAdminStock(id: string, stock: number): Promise<{ product: Product }> {
    return request(`/admin/products/${id}/stock`, {
      method: 'PATCH',
      body: JSON.stringify({ stock }),
    });
  },

  async getAdminOrders(page = 1, limit = 50, status?: string): Promise<{
    orders: Order[];
    pagination: any;
  }> {
    const q = status ? `&status=${status}` : '';
    return request(`/admin/orders?page=${page}&limit=${limit}${q}`);
  },

  async updateAdminOrderStatus(id: string, status: string): Promise<{ order: Order }> {
    return request(`/admin/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  async getAdminAnalytics(days?: number): Promise<{ data: AnalyticsData }> {
    const q = days ? `?days=${days}` : '';
    return request(`/admin/analytics${q}`);
  },
};
