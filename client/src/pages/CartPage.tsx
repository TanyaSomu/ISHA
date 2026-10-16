import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext.js';
import { ProductImage } from '../components/common/ProductImage.js';
import { formatINR, BRAND } from '../config/brand.js';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryCharge,
    totalAmount,
    itemCount,
  } = useCart();

  const freeShippingPaise = BRAND.freeShippingThreshold * 100;
  const neededForFreeShipping = Math.max(0, freeShippingPaise - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingPaise) * 100));

  if (items.length === 0) {
    return (
      <div className="bg-ivory-50 min-h-screen py-20">
        <div className="max-w-xl mx-auto px-4 text-center space-y-4 bg-white p-12 rounded-3xl border border-forest-100 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-forest-50 text-forest-700 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8 opacity-70" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-forest-900">Your Cart is Empty</h2>
          <p className="text-xs text-charcoal-500 max-w-sm mx-auto leading-relaxed">
            Your mindful shopping bag is awaiting your practice choices. Explore our mats, cushions, and conscious living essentials.
          </p>
          <div className="pt-2">
            <Link
              to="/catalogue"
              className="inline-flex items-center gap-2 bg-forest-700 hover:bg-forest-800 text-white text-xs font-semibold px-6 py-3 rounded-full transition-colors shadow-sm"
            >
              <span>Explore Catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-ivory-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-forest-900">Your Shopping Bag</h1>
            <p className="text-xs text-charcoal-500 mt-1">
              Review your items, quantities, and conscious shipping details.
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-terracotta-600 hover:text-terracotta-700 font-semibold underline"
          >
            Clear Entire Bag
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Items Table - 8 cols */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-forest-100 p-6 shadow-sm space-y-6">
            {/* Free Shipping Alert */}
            <div className="bg-forest-50 p-4 rounded-2xl border border-forest-200/80 text-xs text-forest-900">
              {neededForFreeShipping > 0 ? (
                <div className="space-y-2">
                  <p className="font-medium">
                    Add <span className="font-bold text-terracotta-600">{formatINR(neededForFreeShipping)}</span> more to qualify for <span className="font-semibold text-forest-800">Free Conscious Delivery</span>!
                  </p>
                  <div className="w-full bg-forest-200/60 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-forest-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${freeShippingProgress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <p className="font-semibold text-green-800 flex items-center gap-1.5">
                  <span>✓</span> You qualify for Free Conscious Delivery across India!
                </p>
              )}
            </div>

            {/* Line Items List */}
            <div className="divide-y divide-forest-50">
              {items.map((item) => {
                let firstImg = '';
                try {
                  const imgs = JSON.parse(item.product.images);
                  firstImg = Array.isArray(imgs) && imgs.length > 0 ? imgs[0] : '';
                } catch {
                  firstImg = '';
                }

                return (
                  <div key={item.product.id} className="py-5 flex gap-4 sm:gap-6 items-center">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-ivory-100 flex-shrink-0 border border-forest-100">
                      <ProductImage
                        src={firstImg}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-terracotta-600 uppercase tracking-wider block">
                        {item.product.category?.name}
                      </span>
                      <Link
                        to={`/products/${item.product.slug}`}
                        className="font-serif text-sm sm:text-base font-bold text-forest-900 hover:text-forest-700 block truncate"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-xs text-charcoal-500 mt-0.5">
                        {formatINR(item.product.price)} each
                      </p>

                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center border border-forest-200 rounded-lg bg-ivory-50">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="px-2.5 py-1 text-forest-800 hover:bg-forest-100 font-bold"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 py-1 text-xs font-bold text-forest-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="px-2.5 py-1 text-forest-800 hover:bg-forest-100 font-bold disabled:opacity-30"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-xs text-charcoal-400 hover:text-red-600 flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Remove</span>
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-sm sm:text-base font-bold text-forest-900 block">
                        {formatINR(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-forest-100 flex justify-between items-center">
              <Link
                to="/catalogue"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-forest-700 hover:text-forest-900"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>

          {/* Order Summary Sidebar - 4 cols */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-forest-100 p-6 shadow-sm space-y-6">
            <h2 className="font-serif text-lg font-bold text-forest-900 border-b border-forest-50 pb-3">
              Order Summary
            </h2>

            <div className="space-y-3 text-xs text-charcoal-600">
              <div className="flex justify-between">
                <span>Items Subtotal ({itemCount})</span>
                <span className="font-semibold text-charcoal-900">{formatINR(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Conscious Shipping</span>
                <span>
                  {deliveryCharge === 0 ? (
                    <span className="text-green-700 font-semibold">FREE</span>
                  ) : (
                    formatINR(deliveryCharge)
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Packaging</span>
                <span className="text-forest-800 font-medium">Plastic-Free (Included)</span>
              </div>

              <div className="flex justify-between text-base font-bold text-forest-900 pt-3 border-t border-forest-100">
                <span>Total Amount</span>
                <span className="text-xl text-forest-800 font-serif">{formatINR(totalAmount)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-forest-700 hover:bg-forest-800 text-white text-xs font-bold py-3.5 rounded-full flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="bg-ivory-50 p-4 rounded-2xl border border-forest-100 text-[11px] text-charcoal-500 space-y-1">
              <p className="font-semibold text-forest-900">Sattva Purchase Promise:</p>
              <p>• 100% Secure Simulated Checkout</p>
              <p>• Verified inventory decremented in real-time</p>
              <p>• 30-day effortless practice exchange guarantee</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
