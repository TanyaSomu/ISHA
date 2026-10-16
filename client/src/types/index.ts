export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  displayOrder: number;
  _count?: { products: number };
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number; // in paise
  compareAtPrice?: number | null;
  categoryId: string;
  category: { id: string; name: string; slug: string };
  images: string; // JSON array string
  stock: number;
  material: string;
  dimensions: string;
  careInstructions: string;
  intendedUse: string;
  experienceLevel: string;
  isFeatured: boolean;
  isBestseller: boolean;
  isActive: boolean;
  collectionTags: string; // JSON array string
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  unitPrice: number; // in paise
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  subtotal: number;
  deliveryCharge: number;
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  items: OrderItem[];
}

export interface RecommendedProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  categoryName: string;
  image: string;
  reason: string;
}

export interface AIRecommendationResponse {
  success: boolean;
  engine: 'gemini_ai' | 'catalog_rule_engine';
  message: string;
  recommendedProducts: RecommendedProduct[];
  disclaimer?: string;
}

export interface AnalyticsData {
  metrics: {
    uniqueVisitorSessions: number;
    totalProductViews: number;
    addToCartRate: number;
    checkoutInitiationRate: number;
    completedOrders: number;
    conversionRate: number;
    averageOrderValue: number; // in paise
    recordedRevenue: number; // in paise
  };
  rankings: {
    mostViewedProducts: Array<{ productId: string; name: string; views: number }>;
    mostPurchasedProducts: Array<{ productId: string; name: string; unitsSold: number }>;
  };
  methodology: {
    conversionRate: string;
    averageOrderValue: string;
    limitations: string;
  };
}
