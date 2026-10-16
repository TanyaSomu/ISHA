import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Scale, Check } from 'lucide-react';
import { Product } from '../../types/index.js';
import { ProductImage } from '../common/ProductImage.js';
import { useCart } from '../../context/CartContext.js';
import { useCompare } from '../../context/CompareContext.js';
import { formatINR } from '../../config/brand.js';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();

  const isCompared = isInCompare(product.id);
  const isOutOfStock = product.stock <= 0 || !product.isActive;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  let firstImage = '';
  try {
    const parsed = JSON.parse(product.images);
    firstImage = Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : '';
  } catch {
    firstImage = '';
  }

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isCompared) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) {
      addToCart(product, 1);
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-forest-100 hover:border-forest-300 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col overflow-hidden relative">
      {/* Product Image Link */}
      <Link to={`/products/${product.slug}`} className="block relative aspect-square overflow-hidden bg-ivory-100">
        <ProductImage
          src={firstImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.isBestseller && (
            <span className="bg-forest-800 text-ivory-50 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              Bestseller
            </span>
          )}
          {product.isFeatured && !product.isBestseller && (
            <span className="bg-terracotta-600 text-ivory-50 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              Featured
            </span>
          )}
          {isLowStock && (
            <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-semibold px-2 py-0.5 rounded-full">
              Only {product.stock} left
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-charcoal-800 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              Sold Out
            </span>
          )}
        </div>

        {/* Quick Compare Button */}
        <button
          onClick={handleCompareClick}
          className={`absolute top-2.5 right-2.5 p-1.5 rounded-full backdrop-blur-md transition-all shadow-sm z-10 ${
            isCompared
              ? 'bg-forest-700 text-white'
              : 'bg-white/80 text-forest-800 hover:bg-white hover:text-forest-900'
          }`}
          title={isCompared ? 'Remove from comparison' : 'Compare product'}
          aria-label="Compare product"
        >
          {isCompared ? <Check className="w-3.5 h-3.5" /> : <Scale className="w-3.5 h-3.5" />}
        </button>
      </Link>

      {/* Product Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-medium tracking-wide uppercase text-terracotta-600">
            {product.category?.name || 'Yoga Essential'}
          </p>
          <Link
            to={`/products/${product.slug}`}
            className="block font-serif text-sm sm:text-base font-bold text-forest-900 hover:text-forest-700 transition-colors line-clamp-1"
          >
            {product.name}
          </Link>
          <p className="text-xs text-charcoal-500 line-clamp-1">
            {product.material}
          </p>
        </div>

        {/* Pricing and Action */}
        <div className="pt-3 mt-2 border-t border-forest-50 flex items-center justify-between">
          <div>
            <span className="text-sm sm:text-base font-bold text-forest-900">
              {formatINR(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="ml-1.5 text-xs text-charcoal-400 line-through">
                {formatINR(product.compareAtPrice)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCartClick}
            disabled={isOutOfStock}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all shadow-sm ${
              isOutOfStock
                ? 'bg-charcoal-200 text-charcoal-500 cursor-not-allowed'
                : 'bg-forest-50 hover:bg-forest-700 text-forest-800 hover:text-white border border-forest-200 hover:border-forest-700'
            }`}
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isOutOfStock ? 'Sold Out' : 'Add'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
