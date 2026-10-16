import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Category } from '../../types/index.js';

interface ShopByCategoryProps {
  categories: Category[];
}

export const ShopByCategory: React.FC<ShopByCategoryProps> = ({ categories }) => {
  return (
    <section className="py-16 bg-white border-b border-forest-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold tracking-wider uppercase text-terracotta-600">
            Conscious Taxonomy
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-900 mt-1">
            Shop by Category
          </h2>
          <p className="text-sm text-charcoal-500 mt-2">
            Mindfully organized items crafted to support your physical postures, breathing practices, and inner stillness.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/catalogue?category=${category.slug}`}
              className="group flex flex-col items-center text-center p-3 rounded-2xl border border-forest-100/80 hover:border-forest-300 bg-ivory-50/50 hover:bg-white shadow-xs hover:shadow-md transition-all duration-300"
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden mb-3 border-2 border-forest-100 group-hover:border-forest-400 transition-colors shadow-inner bg-ivory-100">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h3 className="font-serif text-sm font-bold text-forest-900 group-hover:text-forest-700 transition-colors">
                {category.name}
              </h3>
              <p className="text-[11px] text-charcoal-400 mt-0.5">
                {category._count ? `${category._count.products} Products` : 'Explore'}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
