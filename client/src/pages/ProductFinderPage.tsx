import React, { useEffect } from 'react';
import { SmartProductFinder } from '../components/finder/SmartProductFinder.js';
import { api } from '../services/api.js';

export const ProductFinderPage: React.FC = () => {
  useEffect(() => {
    api.trackEvent('PAGE_VIEW', { page: 'ProductFinder' });
  }, []);

  return (
    <div className="bg-ivory-50 py-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold tracking-wider uppercase text-terracotta-600">
            AI & Algorithmic Recommendation
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-forest-900 mt-1">
            Find What Supports Your Practice
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-2 leading-relaxed">
            Answer four simple questions about your practice focus, experience, and budget. Our recommendation engine consults verified real-time inventory to match you with suitable items.
          </p>
        </div>

        <SmartProductFinder />
      </div>
    </div>
  );
};
