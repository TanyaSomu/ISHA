import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Sparkles } from 'lucide-react';
import { BRAND } from '../../config/brand.js';

export const HeroBanner: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-forest-50/70 via-ivory-100 to-ivory-50 border-b border-forest-100">
      {/* Decorative leaf motifs */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-forest-100/50 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-terracotta-100/40 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/90 border border-forest-200 px-3.5 py-1.5 rounded-full text-xs font-semibold text-forest-800 shadow-sm backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-terracotta-500" />
              <span>Conscious Yoga & Sacred Meditation Essentials</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-forest-900 tracking-tight leading-[1.15]">
              Find What Supports <br className="hidden sm:block" />
              <span className="italic font-normal text-terracotta-600">Your Practice.</span>
            </h1>

            <p className="text-base sm:text-lg text-charcoal-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              Rooted in classical tradition, sustainably crafted from natural tree rubber, raw jute, organic cotton, and hand-beaten bronze. Designed to ground your body and steady your breath.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
              <Link
                to="/catalogue"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-forest-700 hover:bg-forest-800 text-ivory-50 text-sm font-semibold px-7 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all"
              >
                <span>Shop Catalogue</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/product-finder"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-forest-50 text-forest-800 border border-forest-300 text-sm font-semibold px-6 py-3.5 rounded-full shadow-sm hover:shadow transition-all"
              >
                <Compass className="w-4 h-4 text-terracotta-600" />
                <span>Smart Product Finder</span>
              </Link>
            </div>

            {/* Micro feature pills */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-charcoal-500">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-forest-600" />
                100% Biodegradable Mats
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-forest-600" />
                Free Shipping over ₹1,999
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-forest-600" />
                Artisan Handloom Khadi
              </span>
            </div>
          </div>

          {/* Right Image Feature */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 bg-ivory-200">
                <img
                  src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1000&q=80"
                  alt="Yoga practice on natural tree rubber mat"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Stat Card */}
              <div className="absolute -bottom-6 -left-6 sm:bottom-6 sm:-left-6 bg-white/95 backdrop-blur-md border border-forest-100 p-4 rounded-2xl shadow-xl max-w-[220px]">
                <p className="text-[11px] font-semibold text-terracotta-600 uppercase tracking-wider">
                  Artisan Sourced
                </p>
                <p className="font-serif text-lg font-bold text-forest-900 mt-0.5">
                  100% Natural Rubber
                </p>
                <p className="text-[11px] text-charcoal-500 mt-1">
                  Zero toxic PVC or synthetic chemicals
                </p>
              </div>

              {/* Floating Review Badge */}
              <div className="absolute top-6 -right-4 sm:-right-6 bg-forest-800 text-ivory-100 p-3.5 rounded-2xl shadow-xl max-w-[190px] hidden sm:block">
                <div className="flex text-amber-400 text-xs">★★★★★</div>
                <p className="text-xs font-medium mt-1">
                  "The grip transforms my morning practice."
                </p>
                <span className="text-[10px] text-ivory-300/70 block mt-0.5">
                  — Verified Practitioner
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
