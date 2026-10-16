import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ShoppingBag,
  Scale,
  Check,
  Truck,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Layers,
  Heart,
  ChevronRight,
  Info,
} from 'lucide-react';
import { api } from '../services/api.js';
import { Product } from '../types/index.js';
import { ProductImage } from '../components/common/ProductImage.js';
import { ProductCard } from '../components/catalogue/ProductCard.js';
import { useCart } from '../context/CartContext.js';
import { useCompare } from '../context/CompareContext.js';
import { formatINR } from '../config/brand.js';

export const ProductDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart } = useCart();
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'care' | 'reviews'>('details');

  useEffect(() => {
    async function fetchProduct() {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await api.getProductBySlug(slug);
        setProduct(res.product);
        setSelectedImageIndex(0);
        setQuantity(1);

        // Record product view event
        api.trackEvent('PRODUCT_VIEW', {
          productId: res.product.id,
          name: res.product.name,
          price: res.product.price,
          category: res.product.category?.name,
        });

        // Fetch related products
        const relRes = await api.getRelatedProducts(res.product.id);
        setRelated(relRes.related || []);
      } catch (err) {
        console.error('Failed to load product details', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center animate-pulse">
        <div className="h-8 bg-forest-100 rounded w-1/3 mx-auto mb-4" />
        <div className="h-64 bg-forest-50 rounded-2xl max-w-xl mx-auto" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-forest-900">Product Not Found</h2>
        <p className="text-xs text-charcoal-500">
          The requested product may have been discontinued or moved.
        </p>
        <Link
          to="/catalogue"
          className="inline-block bg-forest-700 text-white text-xs font-semibold px-6 py-2.5 rounded-full"
        >
          Return to Catalogue
        </Link>
      </div>
    );
  }

  let imagesList: string[] = [];
  try {
    imagesList = JSON.parse(product.images);
  } catch {
    imagesList = [];
  }
  const currentImage = imagesList[selectedImageIndex] || '';

  const isOutOfStock = product.stock <= 0 || !product.isActive;
  const isCompared = isInCompare(product.id);

  const sampleReviews = [
    {
      author: 'Priya K.',
      rating: 5,
      date: '2 weeks ago',
      title: 'Remarkable dry grip and grounding',
      comment:
        'The natural tree rubber surface immediately steadying my palms in downward dog without slipping. Highly recommended for daily Mysore practice.',
    },
    {
      author: 'Sanjay M.',
      rating: 5,
      date: '1 month ago',
      title: 'Conscious craftsmanship',
      comment:
        'You can feel the organic texture immediately. Smells purely natural, zero harsh chemical or petroleum odors.',
    },
  ];

  return (
    <div className="bg-ivory-50 py-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-charcoal-400 mb-8 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-forest-700">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 flex-shrink-0" />
          <Link to="/catalogue" className="hover:text-forest-700">
            Catalogue
          </Link>
          <ChevronRight className="w-3 h-3 flex-shrink-0" />
          <Link
            to={`/catalogue?category=${product.category?.slug}`}
            className="hover:text-forest-700"
          >
            {product.category?.name}
          </Link>
          <ChevronRight className="w-3 h-3 flex-shrink-0" />
          <span className="text-forest-900 font-semibold truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>

        {/* Product Hero: Gallery + Buying Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white p-6 sm:p-10 rounded-3xl border border-forest-100 shadow-sm">
          {/* Gallery - 6 cols */}
          <div className="lg:col-span-6 space-y-4">
            <div className="aspect-square rounded-2xl overflow-hidden bg-ivory-100 border border-forest-100 shadow-inner">
              <ProductImage
                src={currentImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnails */}
            {imagesList.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {imagesList.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                      selectedImageIndex === idx
                        ? 'border-forest-700 shadow-sm'
                        : 'border-forest-100 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <ProductImage
                      src={img}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details - 6 cols */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-terracotta-600 bg-terracotta-50 px-3 py-1 rounded-full">
                  {product.category?.name}
                </span>

                <button
                  onClick={() => (isCompared ? removeFromCompare(product.id) : addToCompare(product))}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                    isCompared
                      ? 'bg-forest-700 text-white border-forest-700'
                      : 'border-forest-200 text-forest-800 hover:bg-forest-50'
                  }`}
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>{isCompared ? 'In Comparison' : 'Compare'}</span>
                </button>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-forest-900 leading-tight">
                {product.name}
              </h1>

              {/* Price & Stock status */}
              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-2xl sm:text-3xl font-bold text-forest-900">
                  {formatINR(product.price)}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-sm text-charcoal-400 line-through">
                    {formatINR(product.compareAtPrice)}
                  </span>
                )}
                <span className="text-[11px] text-charcoal-400">Inclusive of all taxes</span>
              </div>

              {/* Stock indicator badge */}
              <div className="pt-1">
                {isOutOfStock ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded-full">
                    <span>• Currently Out of Stock</span>
                  </span>
                ) : product.stock <= 5 ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                    <span>• Only {product.stock} units remaining in stock</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-800 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
                    <span>✓ In Stock ({product.stock} available)</span>
                  </span>
                )}
              </div>

              {/* Brief Description */}
              <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed pt-2">
                {product.description}
              </p>
            </div>

            {/* Quantity Selector & Add to Cart */}
            <div className="pt-4 border-t border-forest-100 space-y-4">
              {!isOutOfStock && (
                <div className="flex items-center gap-4">
                  <span className="text-xs font-semibold text-charcoal-700">Quantity:</span>
                  <div className="flex items-center border border-forest-200 rounded-lg bg-ivory-50">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-3 py-1.5 text-forest-800 hover:bg-forest-100 font-bold"
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 text-xs font-bold text-forest-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      disabled={quantity >= product.stock}
                      className="px-3 py-1.5 text-forest-800 hover:bg-forest-100 font-bold disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-[11px] text-charcoal-400">
                    Max: {product.stock} per order
                  </span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => addToCart(product, quantity)}
                  disabled={isOutOfStock}
                  className={`flex-1 py-3.5 px-6 rounded-full text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all ${
                    isOutOfStock
                      ? 'bg-charcoal-200 text-charcoal-400 cursor-not-allowed'
                      : 'bg-forest-700 hover:bg-forest-800 text-white hover:shadow-lg'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isOutOfStock ? 'Sold Out' : 'Add to Mindful Cart'}</span>
                </button>
              </div>

              {/* Delivery & Assurance Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 text-[11px] text-charcoal-600 border-t border-forest-50">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-forest-700 flex-shrink-0" />
                  <span>Free Delivery on ₹1,999+</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-forest-700 flex-shrink-0" />
                  <span>30-Day Return Trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-forest-700 flex-shrink-0" />
                  <span>Zero Toxic PVC / Plastic</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Specifications & Care */}
        <div className="mt-12 bg-white rounded-3xl border border-forest-100 shadow-xs p-6 sm:p-10">
          <div className="flex border-b border-forest-100 gap-6 text-xs sm:text-sm font-semibold mb-6 overflow-x-auto whitespace-nowrap">
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-3 transition-colors relative ${
                activeTab === 'details' ? 'text-forest-900 font-bold' : 'text-charcoal-400 hover:text-charcoal-700'
              }`}
            >
              <span>Intended Practice & Focus</span>
              {activeTab === 'details' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-forest-700" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-3 transition-colors relative ${
                activeTab === 'specs' ? 'text-forest-900 font-bold' : 'text-charcoal-400 hover:text-charcoal-700'
              }`}
            >
              <span>Materials & Dimensions</span>
              {activeTab === 'specs' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-forest-700" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('care')}
              className={`pb-3 transition-colors relative ${
                activeTab === 'care' ? 'text-forest-900 font-bold' : 'text-charcoal-400 hover:text-charcoal-700'
              }`}
            >
              <span>Sacred Care & Longevity</span>
              {activeTab === 'care' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-forest-700" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 transition-colors relative ${
                activeTab === 'reviews' ? 'text-forest-900 font-bold' : 'text-charcoal-400 hover:text-charcoal-700'
              }`}
            >
              <span>Practitioner Reviews</span>
              {activeTab === 'reviews' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-forest-700" />
              )}
            </button>
          </div>

          {/* Tab Content */}
          <div className="text-xs sm:text-sm text-charcoal-700 leading-relaxed">
            {activeTab === 'details' && (
              <div className="space-y-4 max-w-3xl">
                <div>
                  <h4 className="font-serif font-bold text-forest-900 text-base mb-1">Intended Use</h4>
                  <p>{product.intendedUse}</p>
                </div>
                <div>
                  <h4 className="font-serif font-bold text-forest-900 text-base mb-1">Recommended Experience</h4>
                  <p className="capitalize">{product.experienceLevel.toLowerCase().replace('_', ' ')} practitioners</p>
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
                <div className="bg-ivory-50 p-4 rounded-xl border border-forest-100">
                  <span className="text-[11px] font-bold uppercase text-terracotta-600 block mb-1">
                    Material Composition
                  </span>
                  <p className="font-medium text-forest-900">{product.material}</p>
                </div>
                <div className="bg-ivory-50 p-4 rounded-xl border border-forest-100">
                  <span className="text-[11px] font-bold uppercase text-terracotta-600 block mb-1">
                    Dimensions & Weight
                  </span>
                  <p className="font-medium text-forest-900">{product.dimensions}</p>
                </div>
              </div>
            )}

            {activeTab === 'care' && (
              <div className="max-w-3xl space-y-3">
                <h4 className="font-serif font-bold text-forest-900 text-base mb-1">
                  Caring for Your Item
                </h4>
                <p>{product.careInstructions}</p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6 max-w-3xl">
                <div className="bg-forest-50 p-3 rounded-xl border border-forest-200 text-xs text-forest-800 flex items-center gap-2">
                  <Info className="w-4 h-4 flex-shrink-0 text-forest-700" />
                  <span>
                    <strong>Academic Project Note:</strong> Demonstrative feedback samples below reflect genuine user feedback paradigms without fabricated commercial claims.
                  </span>
                </div>

                <div className="space-y-4">
                  {sampleReviews.map((rev, i) => (
                    <div key={i} className="border-b border-forest-100 pb-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-forest-900">{rev.author}</span>
                        <span className="text-charcoal-400">{rev.date}</span>
                      </div>
                      <div className="flex text-amber-500 text-xs my-1">★★★★★</div>
                      <h5 className="font-semibold text-xs text-forest-900">{rev.title}</h5>
                      <p className="text-xs text-charcoal-600 mt-1">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-serif text-2xl font-bold text-forest-900 mb-6">
              Complementary Practice Essentials
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
