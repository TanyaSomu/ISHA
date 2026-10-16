import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { api } from '../services/api.js';
import { Product, Category } from '../types/index.js';
import { HeroBanner } from '../components/home/HeroBanner.js';
import { ValueProps } from '../components/home/ValueProps.js';
import { ShopByPurpose } from '../components/home/ShopByPurpose.js';
import { ShopByCategory } from '../components/home/ShopByCategory.js';
import { KitBuilderSection } from '../components/home/KitBuilderSection.js';
import { WhyShopWithUs } from '../components/home/WhyShopWithUs.js';
import { BuyingGuides } from '../components/home/BuyingGuides.js';
import { ProductCard } from '../components/catalogue/ProductCard.js';

export const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [bestsellerProducts, setBestsellerProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Record page view analytics
    api.trackEvent('PAGE_VIEW', { page: 'Home' });

    async function loadData() {
      try {
        const [catRes, prodRes] = await Promise.all([
          api.getCategories(),
          api.getProducts({ limit: 50 }),
        ]);

        setCategories(catRes.categories || []);
        const prods = prodRes.products || [];
        setAllProducts(prods);
        setFeaturedProducts(prods.filter((p) => p.isFeatured).slice(0, 4));
        setBestsellerProducts(prods.filter((p) => p.isBestseller).slice(0, 4));
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div className="space-y-0">
      {/* 1. Hero Banner */}
      <HeroBanner />

      {/* 2. Value Propositions */}
      <ValueProps />

      {/* 3. Shop by Purpose */}
      <ShopByPurpose />

      {/* 4. Shop by Category */}
      <ShopByCategory categories={categories} />

      {/* 5. Featured Products */}
      <section className="py-16 bg-ivory-50/50 border-b border-forest-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-semibold tracking-wider uppercase text-terracotta-600">
                Curated Selection
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-900 mt-1">
                Featured Practice Essentials
              </h2>
            </div>
            <Link
              to="/catalogue?featured=true"
              className="mt-3 sm:mt-0 inline-flex items-center gap-1.5 text-xs font-semibold text-forest-700 hover:text-forest-900 group"
            >
              <span>Explore All Featured</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. Build Your Yoga Kit Interactive Section */}
      <KitBuilderSection products={allProducts} />

      {/* 7. Bestsellers */}
      <section className="py-16 bg-white border-b border-forest-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-semibold tracking-wider uppercase text-terracotta-600">
                Community Favorites
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-900 mt-1">
                Bestselling Essentials
              </h2>
            </div>
            <Link
              to="/catalogue?bestseller=true"
              className="mt-3 sm:mt-0 inline-flex items-center gap-1.5 text-xs font-semibold text-forest-700 hover:text-forest-900 group"
            >
              <span>View All Bestsellers</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestsellerProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* 8. Why Shop With Us */}
      <WhyShopWithUs />

      {/* 9. Educational Buying Guides */}
      <BuyingGuides />
    </div>
  );
};
