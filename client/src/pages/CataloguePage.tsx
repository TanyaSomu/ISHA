import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, Search, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { api } from '../services/api.js';
import { Product, Category } from '../types/index.js';
import { ProductCard } from '../components/catalogue/ProductCard.js';

export const CataloguePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter states
  const searchQuery = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category') || '';
  const inStockOnly = searchParams.get('inStock') === 'true';
  const sortBy = searchParams.get('sortBy') || 'newest';
  const maxPriceRupees = searchParams.get('maxPrice')
    ? parseInt(searchParams.get('maxPrice')!, 10)
    : 5000;

  useEffect(() => {
    api.trackEvent('PAGE_VIEW', { page: 'Catalogue', category: selectedCategory });

    async function fetchCategories() {
      try {
        const res = await api.getCategories();
        setCategories(res.categories || []);
      } catch (e) {
        console.error('Failed to load categories', e);
      }
    }
    fetchCategories();
  }, [selectedCategory]);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await api.getProducts({
          search: searchQuery || undefined,
          category: selectedCategory || undefined,
          inStock: inStockOnly || undefined,
          sortBy: sortBy || undefined,
          maxPrice: maxPriceRupees < 5000 ? maxPriceRupees : undefined,
          limit: 50,
        });

        setProducts(res.products || []);
        setTotalCount(res.pagination?.totalCount || 0);

        if (searchQuery) {
          api.trackEvent('SEARCH', { query: searchQuery, resultsCount: res.pagination?.totalCount });
        }
        if (selectedCategory) {
          api.trackEvent('FILTER_APPLIED', { category: selectedCategory });
        }
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [searchQuery, selectedCategory, inStockOnly, sortBy, maxPriceRupees]);

  const updateParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (value === null || value === '') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = Boolean(
    searchQuery || selectedCategory || inStockOnly || maxPriceRupees < 5000
  );

  return (
    <div className="bg-ivory-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb / Title */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest-900">
            {selectedCategory
              ? categories.find((c) => c.slug === selectedCategory)?.name || 'Product Catalogue'
              : 'Complete Catalogue'}
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1.5 max-w-2xl">
            Ethically crafted yoga mats, ergonomic meditation cushions, alignment props, and conscious lifestyle essentials.
          </p>
        </div>

        {/* Controls Bar */}
        <div className="bg-white p-4 rounded-2xl border border-forest-100 shadow-xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="md:hidden flex items-center gap-1.5 bg-forest-50 border border-forest-200 text-forest-800 text-xs font-semibold px-3 py-2 rounded-lg"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            <span className="text-xs font-medium text-charcoal-500">
              Showing <strong className="text-forest-900">{totalCount}</strong> products
            </span>

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center gap-1 text-xs text-terracotta-600 hover:text-terracotta-700 font-semibold underline ml-2"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear all filters</span>
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-charcoal-500 font-medium">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => updateParam('sortBy', e.target.value)}
              className="bg-ivory-50 border border-forest-200 rounded-lg px-3 py-1.5 text-xs text-forest-900 font-medium focus:outline-none focus:ring-1 focus:ring-forest-600"
            >
              <option value="newest">Newest Additions</option>
              <option value="popularity">Popular & Bestsellers</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6 text-xs">
            <span className="text-charcoal-400 font-medium">Active Filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1 bg-white border border-forest-200 text-forest-800 px-2.5 py-1 rounded-full">
                <span>Keyword: "{searchQuery}"</span>
                <X
                  className="w-3 h-3 cursor-pointer hover:text-red-500"
                  onClick={() => updateParam('search', null)}
                />
              </span>
            )}
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 bg-white border border-forest-200 text-forest-800 px-2.5 py-1 rounded-full">
                <span>Category: {categories.find((c) => c.slug === selectedCategory)?.name}</span>
                <X
                  className="w-3 h-3 cursor-pointer hover:text-red-500"
                  onClick={() => updateParam('category', null)}
                />
              </span>
            )}
            {inStockOnly && (
              <span className="inline-flex items-center gap-1 bg-white border border-forest-200 text-forest-800 px-2.5 py-1 rounded-full">
                <span>In Stock Only</span>
                <X
                  className="w-3 h-3 cursor-pointer hover:text-red-500"
                  onClick={() => updateParam('inStock', null)}
                />
              </span>
            )}
            {maxPriceRupees < 5000 && (
              <span className="inline-flex items-center gap-1 bg-white border border-forest-200 text-forest-800 px-2.5 py-1 rounded-full">
                <span>Price ≤ ₹{maxPriceRupees}</span>
                <X
                  className="w-3 h-3 cursor-pointer hover:text-red-500"
                  onClick={() => updateParam('maxPrice', null)}
                />
              </span>
            )}
          </div>
        )}

        {/* Main Layout: Sidebar Filters + Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <div className="hidden md:block bg-white p-5 rounded-2xl border border-forest-100 shadow-xs space-y-6 sticky top-28">
            {/* Category Filter */}
            <div>
              <h3 className="font-serif text-sm font-bold text-forest-900 border-b border-forest-100 pb-2 mb-3">
                Categories
              </h3>
              <div className="space-y-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => updateParam('category', null)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors ${
                    !selectedCategory
                      ? 'bg-forest-100 text-forest-900 font-bold'
                      : 'text-charcoal-600 hover:bg-ivory-100'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((c) => (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => updateParam('category', c.slug)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors flex justify-between items-center ${
                      selectedCategory === c.slug
                        ? 'bg-forest-100 text-forest-900 font-bold'
                        : 'text-charcoal-600 hover:bg-ivory-100'
                    }`}
                  >
                    <span>{c.name}</span>
                    {c._count && (
                      <span className="text-[10px] text-charcoal-400">({c._count.products})</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter Slider */}
            <div>
              <div className="flex justify-between items-center border-b border-forest-100 pb-2 mb-3">
                <h3 className="font-serif text-sm font-bold text-forest-900">Max Budget</h3>
                <span className="text-xs font-bold text-terracotta-600">
                  {maxPriceRupees >= 5000 ? 'Any' : `₹${maxPriceRupees}`}
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="5000"
                step="250"
                value={maxPriceRupees}
                onChange={(e) => updateParam('maxPrice', e.target.value)}
                className="w-full accent-forest-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-charcoal-400 mt-1">
                <span>₹500</span>
                <span>₹2,500</span>
                <span>₹5,000+</span>
              </div>
            </div>

            {/* Availability Filter */}
            <div>
              <h3 className="font-serif text-sm font-bold text-forest-900 border-b border-forest-100 pb-2 mb-3">
                Availability
              </h3>
              <label className="flex items-center gap-2 text-xs text-charcoal-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => updateParam('inStock', e.target.checked ? 'true' : null)}
                  className="rounded border-forest-300 text-forest-700 focus:ring-forest-500"
                />
                <span>In Stock Only</span>
              </label>
            </div>
          </div>

          {/* Product Grid Area */}
          <div className="md:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-forest-100 p-4 h-80 animate-pulse flex flex-col justify-between"
                  >
                    <div className="bg-ivory-200 h-44 rounded-xl" />
                    <div className="space-y-2">
                      <div className="bg-ivory-200 h-4 rounded w-3/4" />
                      <div className="bg-ivory-200 h-3 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              /* Helpful Empty State */
              <div className="bg-white rounded-3xl border border-forest-100 p-12 text-center max-w-lg mx-auto space-y-4">
                <div className="w-16 h-16 rounded-full bg-forest-50 flex items-center justify-center mx-auto text-forest-600">
                  <Search className="w-8 h-8 opacity-60" />
                </div>
                <h3 className="font-serif text-xl font-bold text-forest-900">
                  No matching products found
                </h3>
                <p className="text-xs text-charcoal-500 leading-relaxed">
                  We could not find any items matching your current criteria. Try loosening your price limit, searching for another keyword, or exploring all categories.
                </p>
                <div className="pt-2">
                  <button
                    onClick={clearAllFilters}
                    className="inline-flex items-center gap-1.5 bg-forest-700 hover:bg-forest-800 text-white text-xs font-semibold px-5 py-2.5 rounded-full shadow-sm transition-all"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset All Filters</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-charcoal-900/50 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full p-6 overflow-y-auto space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-forest-100 pb-3">
                <h3 className="font-serif text-base font-bold text-forest-900">Filters</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-charcoal-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Category List */}
              <div>
                <h4 className="text-xs font-bold text-forest-900 uppercase mb-2">Category</h4>
                <div className="space-y-1.5 text-xs">
                  <button
                    onClick={() => {
                      updateParam('category', null);
                      setMobileFilterOpen(false);
                    }}
                    className="w-full text-left py-1"
                  >
                    All Categories
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        updateParam('category', c.slug);
                        setMobileFilterOpen(false);
                      }}
                      className={`w-full text-left py-1 ${
                        selectedCategory === c.slug ? 'font-bold text-forest-800' : 'text-charcoal-600'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Price Slider */}
              <div>
                <h4 className="text-xs font-bold text-forest-900 uppercase mb-2">
                  Max Budget: ₹{maxPriceRupees}
                </h4>
                <input
                  type="range"
                  min="500"
                  max="5000"
                  step="250"
                  value={maxPriceRupees}
                  onChange={(e) => updateParam('maxPrice', e.target.value)}
                  className="w-full accent-forest-700"
                />
              </div>

              {/* Mobile In Stock Checkbox */}
              <div>
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => updateParam('inStock', e.target.checked ? 'true' : null)}
                  />
                  <span>In Stock Only</span>
                </label>
              </div>
            </div>

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full bg-forest-700 text-white text-xs font-semibold py-3 rounded-full"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
