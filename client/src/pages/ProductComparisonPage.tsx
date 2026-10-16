import React from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingBag, Scale, ArrowLeft, ArrowRight } from 'lucide-react';
import { useCompare } from '../context/CompareContext.js';
import { useCart } from '../context/CartContext.js';
import { ProductImage } from '../components/common/ProductImage.js';
import { formatINR } from '../config/brand.js';

export const ProductComparisonPage: React.FC = () => {
  const { comparedProducts, removeFromCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();

  if (comparedProducts.length === 0) {
    return (
      <div className="bg-ivory-50 min-h-screen py-20">
        <div className="max-w-xl mx-auto px-4 text-center space-y-4 bg-white p-10 rounded-3xl border border-forest-100 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-forest-50 text-forest-700 flex items-center justify-center mx-auto">
            <Scale className="w-8 h-8 opacity-70" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-forest-900">
            No Products in Comparison
          </h2>
          <p className="text-xs text-charcoal-500 max-w-sm mx-auto leading-relaxed">
            You can compare up to 3 products side-by-side. Browse our catalogue and click the scale icon on any product card.
          </p>
          <div className="pt-2">
            <Link
              to="/catalogue"
              className="inline-flex items-center gap-2 bg-forest-700 text-white text-xs font-semibold px-6 py-3 rounded-full hover:bg-forest-800 transition-colors shadow-sm"
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <Link
              to="/catalogue"
              className="inline-flex items-center gap-1.5 text-xs text-forest-700 hover:text-forest-900 font-semibold mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Catalogue</span>
            </Link>
            <h1 className="font-serif text-3xl font-bold text-forest-900">
              Product Comparison ({comparedProducts.length}/3)
            </h1>
            <p className="text-xs text-charcoal-500 mt-1">
              Compare materials, dimensions, and intended uses to choose the right gear for your practice.
            </p>
          </div>

          <button
            onClick={clearCompare}
            className="text-xs text-terracotta-600 hover:text-terracotta-700 font-semibold underline self-start sm:self-center"
          >
            Clear all compared items
          </button>
        </div>

        {/* Side-by-Side Comparison Table */}
        <div className="bg-white rounded-3xl border border-forest-100 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs text-charcoal-700 min-w-[650px]">
            {/* Image & Title row */}
            <thead>
              <tr className="border-b border-forest-100">
                <th className="p-4 sm:p-6 w-1/4 font-serif text-sm font-bold text-forest-900 bg-ivory-50/50">
                  Product
                </th>
                {comparedProducts.map((p) => {
                  let firstImg = '';
                  try {
                    const imgs = JSON.parse(p.images);
                    firstImg = Array.isArray(imgs) && imgs.length > 0 ? imgs[0] : '';
                  } catch {
                    firstImg = '';
                  }

                  return (
                    <th key={p.id} className="p-4 sm:p-6 w-1/3 align-top relative">
                      <button
                        onClick={() => removeFromCompare(p.id)}
                        className="absolute top-3 right-3 p-1 text-charcoal-400 hover:text-red-500 transition-colors"
                        title="Remove from comparison"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      <div className="w-32 h-32 rounded-xl overflow-hidden bg-ivory-100 mb-3 border border-forest-100">
                        <ProductImage
                          src={firstImg}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <span className="text-[10px] font-bold text-terracotta-600 uppercase tracking-wider block">
                        {p.category?.name}
                      </span>
                      <Link
                        to={`/products/${p.slug}`}
                        className="font-serif text-sm font-bold text-forest-900 hover:text-forest-700 block mt-1 line-clamp-2"
                      >
                        {p.name}
                      </Link>

                      <div className="mt-2 text-base font-bold text-forest-900">
                        {formatINR(p.price)}
                      </div>

                      <button
                        onClick={() => addToCart(p, 1)}
                        disabled={p.stock <= 0}
                        className={`mt-3 w-full py-2 px-3 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                          p.stock <= 0
                            ? 'bg-charcoal-200 text-charcoal-400 cursor-not-allowed'
                            : 'bg-forest-700 hover:bg-forest-800 text-white'
                        }`}
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{p.stock <= 0 ? 'Sold Out' : 'Add to Cart'}</span>
                      </button>
                    </th>
                  );
                })}
              </tr>
            </thead>

            {/* Spec rows */}
            <tbody className="divide-y divide-forest-50">
              <tr>
                <td className="p-4 font-bold text-forest-900 bg-ivory-50/50">Availability</td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4 font-semibold">
                    {p.stock > 0 ? (
                      <span className="text-green-700">In Stock ({p.stock} units)</span>
                    ) : (
                      <span className="text-red-600">Out of Stock</span>
                    )}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-bold text-forest-900 bg-ivory-50/50">Material</td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4 leading-relaxed">
                    {p.material}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-bold text-forest-900 bg-ivory-50/50">Dimensions & Weight</td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4">
                    {p.dimensions}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-bold text-forest-900 bg-ivory-50/50">Intended Practice</td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4 leading-relaxed">
                    {p.intendedUse}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-bold text-forest-900 bg-ivory-50/50">Experience Level</td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4 capitalize">
                    {p.experienceLevel.toLowerCase().replace('_', ' ')}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-bold text-forest-900 bg-ivory-50/50">Care Instructions</td>
                {comparedProducts.map((p) => (
                  <td key={p.id} className="p-4 text-xs leading-relaxed text-charcoal-600">
                    {p.careInstructions}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
