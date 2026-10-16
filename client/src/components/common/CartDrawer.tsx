import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext.js';
import { ProductImage } from './ProductImage.js';
import { formatINR, BRAND } from '../../config/brand.js';

export const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    subtotal,
    deliveryCharge,
    totalAmount,
  } = useCart();

  if (!isCartOpen) return null;

  const freeShippingPaise = BRAND.freeShippingThreshold * 100;
  const neededForFreeShipping = Math.max(0, freeShippingPaise - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingPaise) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-charcoal-900/50 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-ivory-50 border-l border-forest-100 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-forest-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-forest-700" />
              <h2 className="font-serif text-lg font-bold text-forest-900">Your Mindful Cart</h2>
              <span className="text-xs bg-forest-100 text-forest-800 px-2 py-0.5 rounded-full font-medium">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 text-charcoal-400 hover:text-charcoal-700 rounded-lg hover:bg-ivory-100 transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress */}
          <div className="bg-forest-50 px-4 py-3 border-b border-forest-100 text-xs">
            {neededForFreeShipping > 0 ? (
              <div>
                <p className="text-forest-800 font-medium">
                  Add <span className="font-bold text-terracotta-600">{formatINR(neededForFreeShipping)}</span> more for Free Conscious Delivery!
                </p>
                <div className="w-full bg-forest-200/60 rounded-full h-1.5 mt-1.5 overflow-hidden">
                  <div
                    className="bg-forest-600 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <p className="text-forest-700 font-semibold flex items-center gap-1.5">
                <span>✓</span> You qualify for Free Mindful Delivery!
              </p>
            )}
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center mx-auto text-forest-600">
                  <ShoppingBag className="w-8 h-8 opacity-70" />
                </div>
                <h3 className="font-serif text-lg text-forest-900">Your cart is empty</h3>
                <p className="text-xs text-charcoal-500 max-w-xs mx-auto">
                  Explore our collection of authentic yoga mats, meditation cushions, and conscious lifestyle essentials.
                </p>
                <button
                  onClick={() => {
                    closeCart();
                    navigate('/catalogue');
                  }}
                  className="mt-2 inline-flex items-center gap-2 bg-forest-700 text-ivory-50 text-xs font-semibold px-4 py-2.5 rounded-full hover:bg-forest-800 transition-all shadow-sm"
                >
                  <span>Explore Catalogue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              items.map((item) => {
                let firstImg = '';
                try {
                  const imgs = JSON.parse(item.product.images);
                  firstImg = Array.isArray(imgs) && imgs.length > 0 ? imgs[0] : '';
                } catch {
                  firstImg = '';
                }

                return (
                  <div
                    key={item.product.id}
                    className="flex gap-3 bg-white p-3 rounded-xl border border-forest-100 shadow-sm"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-ivory-100">
                      <ProductImage
                        src={firstImg}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-xs font-semibold text-forest-900 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-charcoal-400 hover:text-red-500 transition-colors p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-xs font-medium text-forest-700">
                        {formatINR(item.product.price)}
                      </p>

                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center border border-forest-200 rounded-md bg-ivory-50">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 text-forest-800 hover:text-forest-600 hover:bg-forest-100"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold px-2.5 text-forest-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="p-1 text-forest-800 hover:text-forest-600 hover:bg-forest-100 disabled:opacity-30"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="text-xs font-bold text-forest-900">
                          {formatINR(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout Summary */}
          {items.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-forest-100 bg-white space-y-3">
              <div className="space-y-1.5 text-xs text-charcoal-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-charcoal-900">{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Conscious Delivery</span>
                  <span>
                    {deliveryCharge === 0 ? (
                      <span className="text-green-600 font-semibold">FREE</span>
                    ) : (
                      formatINR(deliveryCharge)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-forest-900 pt-2 border-t border-forest-50">
                  <span>Estimated Total</span>
                  <span className="text-base text-forest-800">{formatINR(totalAmount)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => {
                    closeCart();
                    navigate('/cart');
                  }}
                  className="w-full text-center border border-forest-300 text-forest-800 text-xs font-semibold py-2.5 rounded-lg hover:bg-forest-50 transition-colors"
                >
                  View Full Cart
                </button>
                <button
                  onClick={() => {
                    closeCart();
                    navigate('/checkout');
                  }}
                  className="w-full flex items-center justify-center gap-1.5 bg-forest-700 text-ivory-50 text-xs font-semibold py-2.5 rounded-lg hover:bg-forest-800 transition-colors shadow-sm"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-[10px] text-center text-charcoal-400">
                100% Secure Simulated Checkout • Carbon-Neutral Packaging
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
