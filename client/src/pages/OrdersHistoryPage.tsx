import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, Calendar, MapPin } from 'lucide-react';
import { api } from '../services/api.js';
import { Order } from '../types/index.js';
import { useAuth } from '../context/AuthContext.js';
import { ProductImage } from '../components/common/ProductImage.js';
import { formatINR } from '../config/brand.js';

export const OrdersHistoryPage: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await api.getMyOrders();
        setOrders(res.orders || []);
      } catch (err) {
        console.error('Failed to load orders', err);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  return (
    <div className="bg-ivory-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-forest-900">Your Order History</h1>
          <p className="text-xs text-charcoal-500 mt-1">
            Track and review your previous conscious orders and delivery statuses.
          </p>
        </div>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2].map((i) => (
              <div key={i} className="h-40 bg-white rounded-3xl border border-forest-100 p-6" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-forest-100 p-12 text-center max-w-lg mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-forest-50 text-forest-700 flex items-center justify-center mx-auto">
              <Package className="w-8 h-8 opacity-70" />
            </div>
            <h2 className="font-serif text-xl font-bold text-forest-900">No Orders Placed Yet</h2>
            <p className="text-xs text-charcoal-500">
              You have not placed any orders under {user?.email || 'this account'}. Explore our catalogue to start your practice.
            </p>
            <div className="pt-2">
              <Link
                to="/catalogue"
                className="inline-flex items-center gap-2 bg-forest-700 hover:bg-forest-800 text-white text-xs font-semibold px-6 py-2.5 rounded-full transition-colors shadow-sm"
              >
                <span>Browse Products</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-forest-100 p-6 shadow-sm hover:shadow-md transition-shadow space-y-4"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-forest-50 gap-2 text-xs">
                  <div>
                    <span className="font-mono font-bold text-forest-900 text-sm">
                      {order.orderNumber}
                    </span>
                    <span className="text-charcoal-400 ml-3">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-bold text-forest-800 bg-forest-50 px-2.5 py-0.5 rounded-full border border-forest-200 uppercase text-[10px]">
                      {order.status}
                    </span>
                    <span className="font-serif font-bold text-forest-900 text-sm">
                      {formatINR(order.totalAmount)}
                    </span>
                  </div>
                </div>

                {/* Items preview */}
                <div className="divide-y divide-forest-50">
                  {order.items.map((item) => (
                    <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-ivory-100 flex-shrink-0 border border-forest-100">
                          <ProductImage
                            src={item.productImage}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-forest-900">{item.productName}</p>
                          <p className="text-charcoal-400">
                            Qty: {item.quantity} • {formatINR(item.unitPrice)}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-forest-900">{formatINR(item.subtotal)}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex justify-between items-center text-xs">
                  <span className="text-charcoal-400">
                    Delivered to: {order.city}, {order.state}
                  </span>
                  <Link
                    to={`/order-confirmation/${order.id}`}
                    className="text-forest-700 hover:text-forest-900 font-semibold underline"
                  >
                    View Receipt & Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
