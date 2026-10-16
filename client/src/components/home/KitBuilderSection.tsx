import React, { useState } from 'react';
import { Check, ShoppingBag, Sparkles, ArrowRight } from 'lucide-react';
import { Product } from '../../types/index.js';
import { useCart } from '../../context/CartContext.js';
import { formatINR } from '../../config/brand.js';

interface KitBuilderSectionProps {
  products: Product[];
}

export const KitBuilderSection: React.FC<KitBuilderSectionProps> = ({ products }) => {
  const { addToCart } = useCart();

  // Find mats, straps, and blocks from products
  const mats = products.filter((p) => p.category?.slug === 'yoga-mats');
  const blocks = products.filter((p) => p.category?.slug === 'yoga-blocks-straps' && p.name.includes('Block'));
  const straps = products.filter((p) => p.category?.slug === 'yoga-blocks-straps' && p.name.includes('Strap'));

  const [selectedMat, setSelectedMat] = useState<Product | null>(mats[0] || null);
  const [selectedBlock, setSelectedBlock] = useState<Product | null>(blocks[0] || null);
  const [selectedStrap, setSelectedStrap] = useState<Product | null>(straps[0] || null);
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Fallbacks if data loading
  const currentMat = selectedMat || mats[0];
  const currentBlock = selectedBlock || blocks[0];
  const currentStrap = selectedStrap || straps[0];

  const rawSubtotal =
    (currentMat?.price || 0) + (currentBlock?.price || 0) + (currentStrap?.price || 0);
  const bundleDiscountPaise = Math.round(rawSubtotal * 0.15); // 15% Bundle Discount
  const bundledPrice = rawSubtotal - bundleDiscountPaise;

  const handleAddKitToCart = () => {
    if (currentMat) addToCart(currentMat, 1);
    if (currentBlock) addToCart(currentBlock, 1);
    if (currentStrap) addToCart(currentStrap, 1);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 3000);
  };

  return (
    <section id="kit-builder" className="py-20 bg-forest-900 text-ivory-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-forest-800/60 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 bg-terracotta-600/30 border border-terracotta-400/40 text-terracotta-300 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Bundle Builder</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ivory-50">
            Build Your Sacred Yoga Kit
          </h2>
          <p className="text-sm text-ivory-200/80 mt-2">
            Combine your mat, blocks, and alignment strap to create an integrated practice foundation and automatically enjoy 15% bundled savings.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Step 1: Choose Mat */}
          <div className="lg:col-span-4 bg-forest-800/80 border border-forest-700/80 p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-forest-700 pb-2">
              <span className="text-xs font-bold text-terracotta-400 uppercase tracking-wider">
                Step 1: Your Mat
              </span>
              <span className="text-xs text-ivory-300">Foundation</span>
            </div>
            <div className="space-y-2">
              {mats.slice(0, 3).map((mat) => (
                <div
                  key={mat.id}
                  onClick={() => setSelectedMat(mat)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between text-xs ${
                    currentMat?.id === mat.id
                      ? 'bg-forest-700/90 border-terracotta-400 shadow-sm'
                      : 'bg-forest-900/60 border-forest-700 hover:border-forest-500'
                  }`}
                >
                  <div>
                    <p className="font-semibold text-ivory-50 line-clamp-1">{mat.name}</p>
                    <p className="text-[11px] text-ivory-300/70">{mat.material.split('&')[0]}</p>
                  </div>
                  <div className="text-right flex items-center gap-2">
                    <span className="font-bold text-ivory-100">{formatINR(mat.price)}</span>
                    {currentMat?.id === mat.id && (
                      <Check className="w-4 h-4 text-terracotta-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step 2: Choose Props */}
          <div className="lg:col-span-4 bg-forest-800/80 border border-forest-700/80 p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-forest-700 pb-2">
              <span className="text-xs font-bold text-terracotta-400 uppercase tracking-wider">
                Step 2: Props & Support
              </span>
              <span className="text-xs text-ivory-300">Stability & Reach</span>
            </div>
            <div className="space-y-2">
              <p className="text-[11px] font-semibold text-ivory-300 uppercase">Cork Block Pair</p>
              {blocks.slice(0, 2).map((blk) => (
                <div
                  key={blk.id}
                  onClick={() => setSelectedBlock(blk)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between text-xs ${
                    currentBlock?.id === blk.id
                      ? 'bg-forest-700/90 border-terracotta-400 shadow-sm'
                      : 'bg-forest-900/60 border-forest-700 hover:border-forest-500'
                  }`}
                >
                  <p className="font-semibold text-ivory-50 line-clamp-1">{blk.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-ivory-100">{formatINR(blk.price)}</span>
                    {currentBlock?.id === blk.id && (
                      <Check className="w-4 h-4 text-terracotta-400" />
                    )}
                  </div>
                </div>
              ))}

              <p className="text-[11px] font-semibold text-ivory-300 uppercase pt-2">Cotton Strap</p>
              {straps.slice(0, 2).map((strp) => (
                <div
                  key={strp.id}
                  onClick={() => setSelectedStrap(strp)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between text-xs ${
                    currentStrap?.id === strp.id
                      ? 'bg-forest-700/90 border-terracotta-400 shadow-sm'
                      : 'bg-forest-900/60 border-forest-700 hover:border-forest-500'
                  }`}
                >
                  <p className="font-semibold text-ivory-50 line-clamp-1">{strp.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-ivory-100">{formatINR(strp.price)}</span>
                    {currentStrap?.id === strp.id && (
                      <Check className="w-4 h-4 text-terracotta-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step 3: Bundle Summary & Checkout */}
          <div className="lg:col-span-4 bg-gradient-to-br from-forest-800 to-forest-950 border border-terracotta-500/40 p-6 rounded-3xl shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-forest-700 pb-3">
              <h3 className="font-serif text-lg font-bold text-ivory-50">Your Curated Kit</h3>
              <span className="bg-terracotta-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                Save 15%
              </span>
            </div>

            <div className="space-y-2 text-xs text-ivory-200/80">
              <div className="flex justify-between items-center">
                <span className="line-clamp-1">1x {currentMat?.name || 'Selected Mat'}</span>
                <span className="font-semibold">{formatINR(currentMat?.price || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="line-clamp-1">1x {currentBlock?.name || 'Cork Blocks'}</span>
                <span className="font-semibold">{formatINR(currentBlock?.price || 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="line-clamp-1">1x {currentStrap?.name || 'Cotton Strap'}</span>
                <span className="font-semibold">{formatINR(currentStrap?.price || 0)}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-forest-700/80 space-y-1.5 text-xs">
              <div className="flex justify-between text-ivory-300">
                <span>Standard Total:</span>
                <span className="line-through">{formatINR(rawSubtotal)}</span>
              </div>
              <div className="flex justify-between text-terracotta-400 font-semibold">
                <span>Bundle Savings (15%):</span>
                <span>-{formatINR(bundleDiscountPaise)}</span>
              </div>
              <div className="flex justify-between items-baseline text-sm font-bold text-ivory-50 pt-2 border-t border-forest-700">
                <span>Kit Price:</span>
                <span className="text-xl text-terracotta-400 font-serif font-bold">
                  {formatINR(bundledPrice)}
                </span>
              </div>
            </div>

            <button
              onClick={handleAddKitToCart}
              className={`w-full py-3 rounded-full text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md ${
                addedSuccess
                  ? 'bg-green-600 text-white'
                  : 'bg-terracotta-500 hover:bg-terracotta-600 text-ivory-50 hover:shadow-lg'
              }`}
            >
              {addedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Yoga Kit Added to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add Complete Kit to Cart</span>
                </>
              )}
            </button>

            <p className="text-[10px] text-center text-ivory-300/60">
              Qualifies for Free Conscious Delivery & 100-Day Return Guarantee
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
