import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Lock, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext.js';
import { useAuth } from '../context/AuthContext.js';
import { api } from '../services/api.js';
import { ProductImage } from '../components/common/ProductImage.js';
import { formatINR } from '../config/brand.js';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, subtotal, deliveryCharge, totalAmount, clearCart } = useCart();
  const { user } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    customerEmail: user?.email || '',
    customerPhone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    postalCode: user?.postalCode || '',
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  useEffect(() => {
    // If cart is empty, redirect to cart page
    if (items.length === 0) {
      navigate('/cart');
    }

    // Pre-fill user data if logged in
    if (user) {
      setFormData((prev) => ({
        ...prev,
        customerName: prev.customerName || user.name,
        customerEmail: prev.customerEmail || user.email,
        customerPhone: prev.customerPhone || user.phone || '',
        address: prev.address || user.address || '',
        city: prev.city || user.city || '',
        state: prev.state || user.state || '',
        postalCode: prev.postalCode || user.postalCode || '',
      }));
    }

    // Track checkout started event
    api.trackEvent('CHECKOUT_STARTED', {
      subtotal,
      totalAmount,
      itemCount: items.length,
    });
  }, [user, items.length, navigate, subtotal, totalAmount]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.customerName.trim() || formData.customerName.trim().length < 2) {
      errors.customerName = 'Please enter your full name (minimum 2 characters)';
    }

    if (!formData.customerEmail.trim() || !/\S+@\S+\.\S+/.test(formData.customerEmail)) {
      errors.customerEmail = 'Please provide a valid email address';
    }

    if (!formData.customerPhone.trim() || formData.customerPhone.trim().length < 7) {
      errors.customerPhone = 'Valid contact phone number is required';
    }

    if (!formData.address.trim() || formData.address.trim().length < 5) {
      errors.address = 'Complete delivery street address is required';
    }

    if (!formData.city.trim()) {
      errors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      errors.state = 'State is required';
    }

    if (!formData.postalCode.trim() || formData.postalCode.trim().length < 4) {
      errors.postalCode = 'Valid PIN / postal code is required';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    setGeneralError(null);

    try {
      const orderPayload = {
        customerName: formData.customerName.trim(),
        customerEmail: formData.customerEmail.trim(),
        customerPhone: formData.customerPhone.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        postalCode: formData.postalCode.trim(),
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
        })),
      };

      const res = await api.createOrder(orderPayload);

      // Successfully created transactionally
      clearCart();
      navigate(`/order-confirmation/${res.order.id}`);
    } catch (err: any) {
      console.error('Order submission error:', err);
      setGeneralError(err.message || 'Failed to place order. Please check availability and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-ivory-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            to="/cart"
            className="inline-flex items-center gap-1.5 text-xs text-forest-700 hover:text-forest-900 font-semibold mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Cart</span>
          </Link>
          <h1 className="font-serif text-3xl font-bold text-forest-900">Secure Checkout</h1>
          <p className="text-xs text-charcoal-500 mt-1">
            Complete your shipping details to receive your conscious practice essentials.
          </p>
        </div>

        {generalError && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
            <span>{generalError}</span>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Shipping Form - 7 cols */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-forest-100 shadow-sm space-y-6">
            <div>
              <h2 className="font-serif text-lg font-bold text-forest-900 border-b border-forest-50 pb-3">
                1. Delivery & Contact Information
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  placeholder="e.g. Aarav Patel"
                  className={`w-full bg-ivory-50 border rounded-xl px-3.5 py-2.5 text-xs text-charcoal-800 focus:outline-none focus:ring-1 ${
                    fieldErrors.customerName
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-forest-200 focus:ring-forest-600'
                  }`}
                />
                {fieldErrors.customerName && (
                  <p className="text-[10px] text-red-600 mt-1">{fieldErrors.customerName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleChange}
                  placeholder="e.g. aarav@example.com"
                  className={`w-full bg-ivory-50 border rounded-xl px-3.5 py-2.5 text-xs text-charcoal-800 focus:outline-none focus:ring-1 ${
                    fieldErrors.customerEmail
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-forest-200 focus:ring-forest-600'
                  }`}
                />
                {fieldErrors.customerEmail && (
                  <p className="text-[10px] text-red-600 mt-1">{fieldErrors.customerEmail}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Contact Phone Number *
              </label>
              <input
                type="tel"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleChange}
                placeholder="e.g. +91 98765 43210"
                className={`w-full bg-ivory-50 border rounded-xl px-3.5 py-2.5 text-xs text-charcoal-800 focus:outline-none focus:ring-1 ${
                  fieldErrors.customerPhone
                    ? 'border-red-400 focus:ring-red-400'
                    : 'border-forest-200 focus:ring-forest-600'
                }`}
              />
              {fieldErrors.customerPhone && (
                <p className="text-[10px] text-red-600 mt-1">{fieldErrors.customerPhone}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Street Address *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Flat / House / Building, Street or Area"
                className={`w-full bg-ivory-50 border rounded-xl px-3.5 py-2.5 text-xs text-charcoal-800 focus:outline-none focus:ring-1 ${
                  fieldErrors.address
                    ? 'border-red-400 focus:ring-red-400'
                    : 'border-forest-200 focus:ring-forest-600'
                }`}
              />
              {fieldErrors.address && (
                <p className="text-[10px] text-red-600 mt-1">{fieldErrors.address}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1">City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Bengaluru"
                  className={`w-full bg-ivory-50 border rounded-xl px-3.5 py-2.5 text-xs text-charcoal-800 focus:outline-none focus:ring-1 ${
                    fieldErrors.city
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-forest-200 focus:ring-forest-600'
                  }`}
                />
                {fieldErrors.city && (
                  <p className="text-[10px] text-red-600 mt-1">{fieldErrors.city}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1">State *</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="e.g. Karnataka"
                  className={`w-full bg-ivory-50 border rounded-xl px-3.5 py-2.5 text-xs text-charcoal-800 focus:outline-none focus:ring-1 ${
                    fieldErrors.state
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-forest-200 focus:ring-forest-600'
                  }`}
                />
                {fieldErrors.state && (
                  <p className="text-[10px] text-red-600 mt-1">{fieldErrors.state}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                  Postal PIN Code *
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="e.g. 560038"
                  className={`w-full bg-ivory-50 border rounded-xl px-3.5 py-2.5 text-xs text-charcoal-800 focus:outline-none focus:ring-1 ${
                    fieldErrors.postalCode
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-forest-200 focus:ring-forest-600'
                  }`}
                />
                {fieldErrors.postalCode && (
                  <p className="text-[10px] text-red-600 mt-1">{fieldErrors.postalCode}</p>
                )}
              </div>
            </div>

            {/* Payment Method Notice */}
            <div className="pt-4 border-t border-forest-100 space-y-3">
              <h2 className="font-serif text-lg font-bold text-forest-900">
                2. Simulated Payment Method
              </h2>
              <div className="p-4 rounded-2xl bg-forest-50 border border-forest-200 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-forest-700 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-forest-900 space-y-1">
                  <p className="font-bold">
                    Academic Demonstration Mode (Simulated Payment Authorized)
                  </p>
                  <p className="text-charcoal-600 leading-relaxed">
                    No real credit or debit card is charged. Clicking 'Place Demo Order' executes real backend transactional validation and decrements database inventory atomically.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Review & Submit - 5 cols */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-forest-100 shadow-sm space-y-6">
            <h2 className="font-serif text-lg font-bold text-forest-900 border-b border-forest-50 pb-3">
              Review Your Items ({items.length})
            </h2>

            {/* Item list */}
            <div className="divide-y divide-forest-50 max-h-60 overflow-y-auto space-y-2 pr-1">
              {items.map((item) => {
                let firstImg = '';
                try {
                  const imgs = JSON.parse(item.product.images);
                  firstImg = Array.isArray(imgs) && imgs.length > 0 ? imgs[0] : '';
                } catch {
                  firstImg = '';
                }

                return (
                  <div key={item.product.id} className="pt-2 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-ivory-100 flex-shrink-0">
                        <ProductImage
                          src={firstImg}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-forest-900 line-clamp-1">{item.product.name}</p>
                        <p className="text-charcoal-400">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-forest-900">
                      {formatINR(item.product.price * item.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Calculation Breakdown */}
            <div className="pt-3 border-t border-forest-100 space-y-2 text-xs text-charcoal-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-charcoal-900">{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Conscious Delivery</span>
                <span>
                  {deliveryCharge === 0 ? (
                    <span className="text-green-700 font-semibold">FREE</span>
                  ) : (
                    formatINR(deliveryCharge)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-forest-900 pt-2 border-t border-forest-100">
                <span>Final Total</span>
                <span className="text-xl text-forest-800 font-serif">{formatINR(totalAmount)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-forest-700 hover:bg-forest-800 disabled:opacity-50 text-white text-xs font-bold py-4 rounded-full flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <Lock className="w-4 h-4" />
              <span>{submitting ? 'Verifying & Placing Order...' : 'Place Demo Order Now'}</span>
            </button>

            <p className="text-[10px] text-center text-charcoal-400 leading-relaxed">
              By confirming your order, you authorize transactional inventory decrement and automated dispatch confirmation.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
