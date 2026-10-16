import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import { api } from '../services/api.js';
import { Order } from '../types/index.js';
import { ProductImage } from '../components/common/ProductImage.js';
import { formatINR } from '../config/brand.js';

export const OrderConfirmationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      if (!id) return;
      try {
        const res = await api.getOrderById(id);
        setOrder(res.order);
      } catch (err) {
        console.error('Failed to load order', err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center animate-pulse">
        <div className="w-16 h-16 bg-forest-100 rounded-full mx-auto mb-4" />
        <div className="h-6 bg-forest-100 rounded w-1/2 mx-auto" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-forest-900">Order Not Found</h2>
        <p className="text-xs text-charcoal-500">
          We could not locate this order. Please verify your order link.
        </p>
        <Link
          to="/"
          className="inline-block bg-forest-700 text-white text-xs font-semibold px-6 py-2.5 rounded-full"
        >
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-ivory-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Success Banner */}
        <div className="bg-white rounded-3xl border border-forest-100 shadow-sm p-6 sm:p-10 text-center space-y-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-forest-50 text-forest-700 border border-forest-200 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-xs font-semibold tracking-wider uppercase text-terracotta-600">
            Order Successfully Placed
          </span>
          <h1 className="font-serif text-3xl font-bold text-forest-900">
            Namaste, {order.customerName}!
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-600 max-w-lg mx-auto leading-relaxed">
            Your mindful order has been confirmed and recorded in our database. We are carefully preparing your items for eco-conscious packaging.
          </p>

          <div className="inline-flex items-center gap-3 bg-ivory-100/70 border border-forest-200/80 px-4 py-2 rounded-xl text-xs font-mono text-forest-900 font-bold">
            <span>Order Number:</span>
            <span className="text-terracotta-600">{order.orderNumber}</span>
          </div>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-3xl border border-forest-100 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-forest-50 gap-2 text-xs">
            <div>
              <span className="text-charcoal-400">Order Placed: </span>
              <span className="font-semibold text-charcoal-800">
                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div>
              <span className="text-charcoal-400">Status: </span>
              <span className="font-bold text-forest-800 bg-forest-50 px-2.5 py-0.5 rounded-full border border-forest-200 uppercase text-[10px]">
                {order.status}
              </span>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-ivory-50 p-4 rounded-2xl border border-forest-100 space-y-1 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-forest-900 mb-1">
              <MapPin className="w-4 h-4 text-terracotta-600" />
              <span>Shipping Destination</span>
            </div>
            <p className="font-semibold text-charcoal-800">{order.customerName}</p>
            <p className="text-charcoal-600">{order.address}</p>
            <p className="text-charcoal-600">
              {order.city}, {order.state} - {order.postalCode}
            </p>
            <p className="text-charcoal-500 pt-1">
              Phone: {order.customerPhone} • Email: {order.customerEmail}
            </p>
          </div>

          {/* Purchased Items */}
          <div className="space-y-3">
            <h3 className="font-serif text-sm font-bold text-forest-900">Purchased Items</h3>
            <div className="divide-y divide-forest-50">
              {order.items.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-ivory-100 overflow-hidden flex-shrink-0 border border-forest-100">
                      <ProductImage
                        src={item.productImage}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-forest-900">{item.productName}</p>
                      <p className="text-charcoal-400">
                        {formatINR(item.unitPrice)} × {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-forest-900">{formatINR(item.subtotal)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="pt-4 border-t border-forest-100 space-y-2 text-xs text-charcoal-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-charcoal-900">{formatINR(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Conscious Delivery</span>
              <span>
                {order.deliveryCharge === 0 ? (
                  <span className="text-green-700 font-semibold">FREE</span>
                ) : (
                  formatINR(order.deliveryCharge)
                )}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-forest-900 pt-3 border-t border-forest-100">
              <span>Final Paid Amount</span>
              <span className="text-xl text-forest-800 font-serif font-bold">
                {formatINR(order.totalAmount)}
              </span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <Link
              to="/catalogue"
              className="flex-1 bg-forest-700 hover:bg-forest-800 text-white text-xs font-semibold py-3 rounded-full text-center transition-colors shadow-sm"
            >
              Continue Exploring Products
            </Link>
            <Link
              to="/account/orders"
              className="flex-1 border border-forest-300 text-forest-800 text-xs font-semibold py-3 rounded-full text-center hover:bg-forest-50 transition-colors"
            >
              View Order History
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
