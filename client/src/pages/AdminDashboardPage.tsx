import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingBag,
  TrendingUp,
  Plus,
  Edit2,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Search,
  X,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.js';
import { Product, Order, Category, AnalyticsData } from '../types/index.js';
import { ProductImage } from '../components/common/ProductImage.js';
import { formatINR } from '../config/brand.js';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'inventory' | 'orders' | 'analytics'
  >('overview');

  // Overview data
  const [overview, setOverview] = useState<any>(null);

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productSearch, setProductSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderFilterStatus, setOrderFilterStatus] = useState<string>('');

  // Analytics state
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Product Form state for Add/Edit
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    priceRupees: 1499,
    compareAtRupees: 0,
    categoryId: '',
    imageUrl: '',
    stock: 20,
    material: '',
    dimensions: '',
    careInstructions: '',
    intendedUse: '',
    experienceLevel: 'ALL_LEVELS',
    isActive: true,
  });

  // Guard: Protect admin route
  useEffect(() => {
    if (!isLoading) {
      if (!user || !isAdmin) {
        navigate('/login', { replace: true, state: { from: { pathname: '/admin' } } });
      }
    }
  }, [user, isAdmin, isLoading, navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [overRes, prodRes, catRes, ordRes, anaRes] = await Promise.all([
        api.getAdminOverview(),
        api.getAdminProducts(1, 100),
        api.getCategories(),
        api.getAdminOrders(1, 100),
        api.getAdminAnalytics(),
      ]);

      setOverview(overRes.overview);
      setProducts(prodRes.products || []);
      setCategories(catRes.categories || []);
      setOrders(ordRes.orders || []);
      setAnalytics(anaRes.data);
    } catch (err) {
      console.error('Failed to load admin dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  const showSuccess = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  // Product Actions
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      description: '',
      priceRupees: 1999,
      compareAtRupees: 0,
      categoryId: categories[0]?.id || '',
      imageUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
      stock: 25,
      material: '100% Organic Cotton',
      dimensions: '180 cm x 60 cm',
      careInstructions: 'Spot clean and air dry away from heat.',
      intendedUse: 'Daily sadhana and meditation.',
      experienceLevel: 'ALL_LEVELS',
      isActive: true,
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    let firstImg = '';
    try {
      const imgs = JSON.parse(p.images);
      firstImg = Array.isArray(imgs) && imgs.length > 0 ? imgs[0] : '';
    } catch {
      firstImg = '';
    }

    setProductForm({
      name: p.name,
      description: p.description,
      priceRupees: Math.round(p.price / 100),
      compareAtRupees: p.compareAtPrice ? Math.round(p.compareAtPrice / 100) : 0,
      categoryId: p.categoryId,
      imageUrl: firstImg,
      stock: p.stock,
      material: p.material,
      dimensions: p.dimensions,
      careInstructions: p.careInstructions,
      intendedUse: p.intendedUse,
      experienceLevel: p.experienceLevel,
      isActive: p.isActive,
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = {
        name: productForm.name,
        description: productForm.description,
        price: productForm.priceRupees * 100, // into paise
        compareAtPrice: productForm.compareAtRupees > 0 ? productForm.compareAtRupees * 100 : null,
        categoryId: productForm.categoryId,
        images: [productForm.imageUrl],
        stock: Number(productForm.stock),
        material: productForm.material,
        dimensions: productForm.dimensions,
        careInstructions: productForm.careInstructions,
        intendedUse: productForm.intendedUse,
        experienceLevel: productForm.experienceLevel,
        isActive: productForm.isActive,
      };

      if (editingProduct) {
        await api.updateAdminProduct(editingProduct.id, payload);
        showSuccess(`Product '${payload.name}' updated successfully!`);
      } else {
        await api.createAdminProduct(payload);
        showSuccess(`Product '${payload.name}' added to catalogue!`);
      }

      setIsProductModalOpen(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to save product');
    }
  };

  const handleQuickStockUpdate = async (productId: string, newStock: number) => {
    if (newStock < 0) return;
    try {
      await api.updateAdminStock(productId, newStock);
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, stock: newStock } : p))
      );
      showSuccess('Inventory count updated.');
    } catch (err: any) {
      alert(err.message || 'Failed to update stock');
    }
  };

  const handleOrderStatusChange = async (orderId: string, status: string) => {
    try {
      await api.updateAdminOrderStatus(orderId, status);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: status as any } : o))
      );
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: status as any } : null));
      }
      showSuccess(`Order status updated to ${status}`);
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  if (isLoading || loading) {
    return (
      <div className="bg-ivory-50 min-h-screen py-20 flex items-center justify-center">
        <div className="text-center space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin text-forest-700 mx-auto" />
          <p className="text-xs font-semibold text-forest-900">Loading Administrator Console...</p>
        </div>
      </div>
    );
  }

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category?.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.material.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredOrders = orderFilterStatus
    ? orders.filter((o) => o.status === orderFilterStatus)
    : orders;

  return (
    <div className="bg-ivory-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-forest-100 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-terracotta-100 text-terracotta-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Admin Console
              </span>
              <span className="text-xs text-charcoal-400">Authenticated as {user?.email}</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest-900 mt-1">
              Store Management Portal
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              className="flex items-center gap-1.5 text-xs font-semibold text-forest-800 bg-forest-50 hover:bg-forest-100 border border-forest-200 px-3.5 py-2 rounded-xl transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Data</span>
            </button>
            <button
              onClick={handleOpenAddProduct}
              className="flex items-center gap-1.5 text-xs font-semibold text-white bg-forest-700 hover:bg-forest-800 px-4 py-2 rounded-xl shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>
        </div>

        {/* Success Alert Banner */}
        {actionSuccess && (
          <div className="p-4 rounded-2xl bg-green-50 border border-green-200 text-green-800 text-xs flex items-center gap-2 shadow-xs animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex border-b border-forest-200/80 gap-2 overflow-x-auto whitespace-nowrap text-xs font-semibold">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'products', label: 'Product Catalogue', icon: Package },
            { id: 'inventory', label: 'Inventory Control', icon: Boxes },
            { id: 'orders', label: 'Customer Orders', icon: ShoppingBag },
            { id: 'analytics', label: 'Business Analytics', icon: TrendingUp },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-3 rounded-t-2xl transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-forest-900 font-bold border-t-2 border-forest-700 shadow-xs'
                    : 'text-charcoal-500 hover:text-forest-800 hover:bg-white/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && overview && (
          <div className="space-y-6 animate-fadeIn">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-forest-100 shadow-xs">
                <span className="text-[11px] font-semibold text-charcoal-400 uppercase tracking-wider">
                  Active Products
                </span>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-forest-900 mt-1">
                  {overview.totalActiveProducts}
                </p>
                <p className="text-[10px] text-green-700 mt-1">Live in store catalogue</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-forest-100 shadow-xs">
                <span className="text-[11px] font-semibold text-charcoal-400 uppercase tracking-wider">
                  Low-Stock Items
                </span>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-amber-700 mt-1">
                  {overview.lowStockProductsCount}
                </p>
                <p className="text-[10px] text-amber-700 mt-1">≤ 5 units remaining</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-forest-100 shadow-xs">
                <span className="text-[11px] font-semibold text-charcoal-400 uppercase tracking-wider">
                  Total Orders
                </span>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-forest-900 mt-1">
                  {overview.totalOrdersCount}
                </p>
                <p className="text-[10px] text-charcoal-500 mt-1">Lifetime recorded</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-forest-100 shadow-xs">
                <span className="text-[11px] font-semibold text-charcoal-400 uppercase tracking-wider">
                  Orders Pending
                </span>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-terracotta-700 mt-1">
                  {overview.ordersAwaitingProcessing}
                </p>
                <p className="text-[10px] text-terracotta-700 mt-1">Awaiting dispatch</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-forest-100 shadow-xs">
                <span className="text-[11px] font-semibold text-charcoal-400 uppercase tracking-wider">
                  Recorded Revenue
                </span>
                <p className="font-serif text-xl sm:text-2xl font-bold text-forest-900 mt-1">
                  {formatINR(overview.totalRecordedRevenue)}
                </p>
                <p className="text-[10px] text-forest-700 mt-1">Non-cancelled orders</p>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-white rounded-3xl border border-forest-100 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-forest-50 pb-3">
                <h3 className="font-serif text-base font-bold text-forest-900">
                  Recent Customer Orders
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-forest-700 hover:text-forest-900 font-semibold underline"
                >
                  View All Orders
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-ivory-50 text-charcoal-500 uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Order Number</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Items</th>
                      <th className="p-3">Total</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-forest-50">
                    {overview.recentOrders?.map((ord: any) => (
                      <tr key={ord.id} className="hover:bg-ivory-50/50">
                        <td className="p-3 font-mono font-bold text-forest-900">{ord.orderNumber}</td>
                        <td className="p-3 font-medium text-charcoal-800">{ord.customerName}</td>
                        <td className="p-3 text-charcoal-500">{ord.items?.length || 0} items</td>
                        <td className="p-3 font-bold text-forest-900">{formatINR(ord.totalAmount)}</td>
                        <td className="p-3">
                          <span className="bg-forest-50 text-forest-800 px-2 py-0.5 rounded-full border border-forest-200 text-[10px] font-semibold uppercase">
                            {ord.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl border border-forest-100 shadow-sm p-6 space-y-4 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Filter by name, material, category..."
                  className="w-full bg-ivory-50 border border-forest-200 rounded-xl px-3.5 py-2 pl-9 text-xs focus:outline-none focus:ring-1 focus:ring-forest-600"
                />
                <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-2.5" />
              </div>

              <span className="text-xs text-charcoal-500">
                Showing {filteredProducts.length} products
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-ivory-50 text-charcoal-500 uppercase text-[10px] border-b border-forest-100">
                  <tr>
                    <th className="p-3">Item</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Stock</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-forest-50">
                  {filteredProducts.map((p) => {
                    let firstImg = '';
                    try {
                      const imgs = JSON.parse(p.images);
                      firstImg = Array.isArray(imgs) && imgs.length > 0 ? imgs[0] : '';
                    } catch {
                      firstImg = '';
                    }

                    return (
                      <tr key={p.id} className="hover:bg-ivory-50/50">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-ivory-100 flex-shrink-0 border border-forest-100">
                              <ProductImage
                                src={firstImg}
                                alt={p.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-bold text-forest-900 line-clamp-1">{p.name}</p>
                              <p className="text-[10px] text-charcoal-400 line-clamp-1">{p.material}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-charcoal-700">{p.category?.name}</td>
                        <td className="p-3 font-bold text-forest-900">{formatINR(p.price)}</td>
                        <td className="p-3">
                          <span
                            className={`font-semibold ${
                              p.stock <= 0
                                ? 'text-red-600'
                                : p.stock <= 5
                                ? 'text-amber-700'
                                : 'text-forest-800'
                            }`}
                          >
                            {p.stock}
                          </span>
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              p.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-charcoal-100 text-charcoal-600'
                            }`}
                          >
                            {p.isActive ? 'Active' : 'Discontinued'}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleOpenEditProduct(p)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-forest-700 hover:text-forest-900 p-1.5 rounded-lg hover:bg-forest-50 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: INVENTORY CONTROL */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-3xl border border-forest-100 shadow-sm p-6 space-y-4 animate-fadeIn">
            <div>
              <h2 className="font-serif text-lg font-bold text-forest-900">
                Real-Time Inventory Management
              </h2>
              <p className="text-xs text-charcoal-500 mt-0.5">
                Adjust stock quantities directly. Changes immediately reflect in customer catalogue and enforce checkout boundaries.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-ivory-50 text-charcoal-500 uppercase text-[10px] border-b border-forest-100">
                  <tr>
                    <th className="p-3">Product</th>
                    <th className="p-3">Current Stock</th>
                    <th className="p-3">Stock State</th>
                    <th className="p-3 text-right">Quick Adjust Inventory</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-forest-50">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-ivory-50/50">
                      <td className="p-3 font-semibold text-forest-900">{p.name}</td>
                      <td className="p-3 font-bold text-sm text-forest-900">{p.stock}</td>
                      <td className="p-3">
                        {p.stock <= 0 ? (
                          <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                            Out of Stock
                          </span>
                        ) : p.stock <= 5 ? (
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                            Low Stock (≤5)
                          </span>
                        ) : (
                          <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                            Healthy
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => handleQuickStockUpdate(p.id, Math.max(0, p.stock - 5))}
                          className="px-2.5 py-1 bg-ivory-100 hover:bg-ivory-200 text-charcoal-800 rounded-lg text-xs font-semibold"
                        >
                          -5
                        </button>
                        <button
                          onClick={() => handleQuickStockUpdate(p.id, p.stock + 5)}
                          className="px-2.5 py-1 bg-forest-100 hover:bg-forest-200 text-forest-900 rounded-lg text-xs font-semibold"
                        >
                          +5
                        </button>
                        <button
                          onClick={() => handleQuickStockUpdate(p.id, p.stock + 20)}
                          className="px-2.5 py-1 bg-forest-700 hover:bg-forest-800 text-white rounded-lg text-xs font-semibold"
                        >
                          +20 Restock
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-forest-100 shadow-sm p-6 space-y-4 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="font-serif text-lg font-bold text-forest-900">Customer Orders</h2>
                <p className="text-xs text-charcoal-500 mt-0.5">
                  Review submitted orders and update fulfilment statuses.
                </p>
              </div>

              <select
                value={orderFilterStatus}
                onChange={(e) => setOrderFilterStatus(e.target.value)}
                className="bg-ivory-50 border border-forest-200 rounded-xl px-3 py-1.5 text-xs text-forest-900 font-semibold focus:outline-none"
              >
                <option value="">All Order Statuses</option>
                <option value="CONFIRMED">CONFIRMED</option>
                <option value="PROCESSING">PROCESSING</option>
                <option value="SHIPPED">SHIPPED</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-ivory-50 text-charcoal-500 uppercase text-[10px] border-b border-forest-100">
                  <tr>
                    <th className="p-3">Order Number</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Destination</th>
                    <th className="p-3">Total Amount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Details & Update</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-forest-50">
                  {filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-ivory-50/50">
                      <td className="p-3 font-mono font-bold text-forest-900">{ord.orderNumber}</td>
                      <td className="p-3">
                        <p className="font-semibold text-charcoal-800">{ord.customerName}</p>
                        <p className="text-[10px] text-charcoal-400">{ord.customerEmail}</p>
                      </td>
                      <td className="p-3 text-charcoal-600">
                        {ord.city}, {ord.state}
                      </td>
                      <td className="p-3 font-bold text-forest-900">{formatINR(ord.totalAmount)}</td>
                      <td className="p-3">
                        <select
                          value={ord.status}
                          onChange={(e) => handleOrderStatusChange(ord.id, e.target.value)}
                          className="bg-ivory-50 border border-forest-200 rounded-lg px-2 py-1 text-xs font-semibold text-forest-900"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-forest-700 hover:text-forest-900 underline"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: BUSINESS ANALYTICS */}
        {activeTab === 'analytics' && analytics && (
          <div className="space-y-6 animate-fadeIn">
            {/* Conversion Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-forest-100 shadow-xs">
                <span className="text-[11px] font-semibold text-charcoal-400 uppercase tracking-wider">
                  Unique Visitor Sessions
                </span>
                <p className="font-serif text-3xl font-bold text-forest-900 mt-1">
                  {analytics.metrics.uniqueVisitorSessions}
                </p>
                <p className="text-[10px] text-charcoal-500 mt-1">Total recorded browsing sessions</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-forest-100 shadow-xs">
                <span className="text-[11px] font-semibold text-charcoal-400 uppercase tracking-wider">
                  Overall Conversion Rate
                </span>
                <p className="font-serif text-3xl font-bold text-forest-900 mt-1">
                  {analytics.metrics.conversionRate}%
                </p>
                <p className="text-[10px] text-green-700 mt-1">Sessions completing an order</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-forest-100 shadow-xs">
                <span className="text-[11px] font-semibold text-charcoal-400 uppercase tracking-wider">
                  Average Order Value (AOV)
                </span>
                <p className="font-serif text-2xl font-bold text-forest-900 mt-1">
                  {formatINR(analytics.metrics.averageOrderValue)}
                </p>
                <p className="text-[10px] text-charcoal-500 mt-1">Per completed order</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-forest-100 shadow-xs">
                <span className="text-[11px] font-semibold text-charcoal-400 uppercase tracking-wider">
                  Add-To-Cart Rate
                </span>
                <p className="font-serif text-3xl font-bold text-terracotta-600 mt-1">
                  {analytics.metrics.addToCartRate}%
                </p>
                <p className="text-[10px] text-charcoal-500 mt-1">Checkout Rate: {analytics.metrics.checkoutInitiationRate}%</p>
              </div>
            </div>

            {/* Product Rankings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Viewed */}
              <div className="bg-white p-6 rounded-3xl border border-forest-100 shadow-xs space-y-4">
                <h3 className="font-serif text-base font-bold text-forest-900">
                  Most Viewed Products
                </h3>
                <div className="space-y-3">
                  {analytics.rankings.mostViewedProducts.map((p, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-forest-100 text-forest-800 flex items-center justify-center font-bold text-[10px]">
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-forest-900">{p.name}</span>
                      </div>
                      <span className="font-bold text-forest-800 bg-forest-50 px-2 py-0.5 rounded-full border border-forest-100">
                        {p.views} views
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Purchased */}
              <div className="bg-white p-6 rounded-3xl border border-forest-100 shadow-xs space-y-4">
                <h3 className="font-serif text-base font-bold text-forest-900">
                  Most Purchased Products
                </h3>
                <div className="space-y-3">
                  {analytics.rankings.mostPurchasedProducts.map((p, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-terracotta-100 text-terracotta-800 flex items-center justify-center font-bold text-[10px]">
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-forest-900">{p.name}</span>
                      </div>
                      <span className="font-bold text-terracotta-700 bg-terracotta-50 px-2 py-0.5 rounded-full border border-terracotta-100">
                        {p.unitsSold} units sold
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Methodology & Limitations Documentation */}
            <div className="bg-ivory-100/70 p-6 rounded-3xl border border-forest-200/80 text-xs text-charcoal-700 space-y-2">
              <h4 className="font-serif text-sm font-bold text-forest-900">
                Metric Calculation Methodology & Data Integrity Notes
              </h4>
              <p>
                <strong>Conversion Rate:</strong> {analytics.methodology.conversionRate}
              </p>
              <p>
                <strong>Average Order Value:</strong> {analytics.methodology.averageOrderValue}
              </p>
              <p className="text-charcoal-500 italic pt-1">
                <strong>Data Limitations:</strong> {analytics.methodology.limitations}
              </p>
            </div>
          </div>
        )}

        {/* Product Add/Edit Modal */}
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-forest-200 max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-scaleUp">
              <div className="flex justify-between items-center border-b border-forest-100 pb-3">
                <h3 className="font-serif text-xl font-bold text-forest-900">
                  {editingProduct ? 'Edit Product Details' : 'Add New Product to Catalogue'}
                </h3>
                <button
                  onClick={() => setIsProductModalOpen(false)}
                  className="p-1 text-charcoal-400 hover:text-charcoal-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-charcoal-700 mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full bg-ivory-50 border border-forest-200 rounded-xl p-2.5 text-xs text-charcoal-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-charcoal-700 mb-1">Category</label>
                    <select
                      value={productForm.categoryId}
                      onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                      className="w-full bg-ivory-50 border border-forest-200 rounded-xl p-2.5 text-xs text-charcoal-900"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-charcoal-700 mb-1">Price (₹ INR)</label>
                    <input
                      type="number"
                      required
                      min={100}
                      value={productForm.priceRupees}
                      onChange={(e) =>
                        setProductForm({ ...productForm, priceRupees: Number(e.target.value) })
                      }
                      className="w-full bg-ivory-50 border border-forest-200 rounded-xl p-2.5 text-xs text-charcoal-900"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-charcoal-700 mb-1">Stock Units</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={productForm.stock}
                      onChange={(e) =>
                        setProductForm({ ...productForm, stock: Number(e.target.value) })
                      }
                      className="w-full bg-ivory-50 border border-forest-200 rounded-xl p-2.5 text-xs text-charcoal-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-charcoal-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    required
                    value={productForm.imageUrl}
                    onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                    className="w-full bg-ivory-50 border border-forest-200 rounded-xl p-2.5 text-xs text-charcoal-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-charcoal-700 mb-1">Description</label>
                  <textarea
                    rows={2}
                    required
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full bg-ivory-50 border border-forest-200 rounded-xl p-2.5 text-xs text-charcoal-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-charcoal-700 mb-1">Material</label>
                    <input
                      type="text"
                      required
                      value={productForm.material}
                      onChange={(e) => setProductForm({ ...productForm, material: e.target.value })}
                      className="w-full bg-ivory-50 border border-forest-200 rounded-xl p-2.5 text-xs text-charcoal-900"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-charcoal-700 mb-1">Dimensions</label>
                    <input
                      type="text"
                      required
                      value={productForm.dimensions}
                      onChange={(e) => setProductForm({ ...productForm, dimensions: e.target.value })}
                      className="w-full bg-ivory-50 border border-forest-200 rounded-xl p-2.5 text-xs text-charcoal-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-charcoal-700 mb-1">Intended Practice</label>
                  <input
                    type="text"
                    required
                    value={productForm.intendedUse}
                    onChange={(e) => setProductForm({ ...productForm, intendedUse: e.target.value })}
                    className="w-full bg-ivory-50 border border-forest-200 rounded-xl p-2.5 text-xs text-charcoal-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-charcoal-700 mb-1">Care Instructions</label>
                  <input
                    type="text"
                    required
                    value={productForm.careInstructions}
                    onChange={(e) =>
                      setProductForm({ ...productForm, careInstructions: e.target.value })
                    }
                    className="w-full bg-ivory-50 border border-forest-200 rounded-xl p-2.5 text-xs text-charcoal-900"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isActiveCheck"
                    checked={productForm.isActive}
                    onChange={(e) => setProductForm({ ...productForm, isActive: e.target.checked })}
                    className="rounded border-forest-300 text-forest-700"
                  />
                  <label htmlFor="isActiveCheck" className="font-semibold text-charcoal-800">
                    Product is Active in Store (uncheck to discontinue)
                  </label>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-forest-100">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="px-5 py-2.5 rounded-full border border-forest-200 text-charcoal-600 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-forest-700 text-white font-semibold hover:bg-forest-800 shadow-sm"
                  >
                    Save Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Order Inspection Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-charcoal-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-forest-200 max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl animate-scaleUp text-xs">
              <div className="flex justify-between items-center border-b border-forest-100 pb-3">
                <div>
                  <h3 className="font-serif text-lg font-bold text-forest-900">
                    Order Details: {selectedOrder.orderNumber}
                  </h3>
                  <p className="text-charcoal-400">
                    Placed by {selectedOrder.customerName} on{' '}
                    {new Date(selectedOrder.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1 text-charcoal-400 hover:text-charcoal-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Update */}
              <div className="bg-ivory-50 p-3 rounded-xl border border-forest-100 flex items-center justify-between">
                <span className="font-semibold text-forest-900">Order Status:</span>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => handleOrderStatusChange(selectedOrder.id, e.target.value)}
                  className="bg-white border border-forest-200 rounded-lg px-2.5 py-1 text-xs font-bold text-forest-800"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              {/* Delivery Details */}
              <div className="space-y-1">
                <p className="font-bold text-forest-900">Delivery Address:</p>
                <p className="text-charcoal-600">{selectedOrder.address}</p>
                <p className="text-charcoal-600">
                  {selectedOrder.city}, {selectedOrder.state} - {selectedOrder.postalCode}
                </p>
                <p className="text-charcoal-500">Phone: {selectedOrder.customerPhone}</p>
              </div>

              {/* Items */}
              <div className="space-y-2 pt-2 border-t border-forest-100">
                <p className="font-bold text-forest-900">Line Items:</p>
                <div className="divide-y divide-forest-50 max-h-48 overflow-y-auto">
                  {selectedOrder.items?.map((item) => (
                    <div key={item.id} className="py-2 flex justify-between">
                      <div>
                        <p className="font-semibold text-charcoal-900">{item.productName}</p>
                        <p className="text-charcoal-400">
                          {formatINR(item.unitPrice)} × {item.quantity}
                        </p>
                      </div>
                      <span className="font-bold text-forest-900">{formatINR(item.subtotal)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="pt-3 border-t border-forest-100 flex justify-between text-sm font-bold text-forest-900">
                <span>Final Total:</span>
                <span>{formatINR(selectedOrder.totalAmount)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
