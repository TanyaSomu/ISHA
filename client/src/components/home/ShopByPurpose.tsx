import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Moon, Layers, Feather, Gift } from 'lucide-react';

export const ShopByPurpose: React.FC = () => {
  const purposes = [
    {
      title: 'Start Your Yoga Journey',
      tagline: 'Gentle foundation mats, non-slip straps & beginner guides',
      link: '/catalogue?category=yoga-mats',
      icon: Sparkles,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Create Your Meditation Space',
      tagline: 'Ergonomic zafus, zabuton mats, brass diyas & singing bowls',
      link: '/catalogue?category=meditation-cushions',
      icon: Moon,
      color: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Explore Yoga Accessories',
      tagline: 'Dense cork blocks, tension-tested straps & posture supports',
      link: '/catalogue?category=yoga-blocks-straps',
      icon: Layers,
      color: 'bg-amber-50 text-amber-800 border-amber-200',
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Discover Mindful Living',
      tagline: 'Ayurvedic copper carafes, sacred neem malas & pure resins',
      link: '/catalogue?category=wellness-lifestyle',
      icon: Feather,
      color: 'bg-orange-50 text-orange-800 border-orange-200',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Find a Sacred Gift',
      tagline: 'Curated wellness packages & brass meditation treasures',
      link: '/catalogue?featured=true',
      icon: Gift,
      color: 'bg-rose-50 text-rose-800 border-rose-200',
      image: 'https://images.unsplash.com/photo-1602192509154-0b900ee1f851?auto=format&fit=crop&w=600&q=80',
    },
  ];

  return (
    <section className="py-16 bg-ivory-50/70 border-b border-forest-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-terracotta-600">
              Intentional Shopping
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-900 mt-1">
              Shop by Purpose
            </h2>
            <p className="text-sm text-charcoal-500 mt-2 max-w-xl">
              Every practice is unique. Explore thoughtfully organized pathways tailored to where you are right now.
            </p>
          </div>
          <Link
            to="/catalogue"
            className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-xs font-semibold text-forest-700 hover:text-forest-900 group"
          >
            <span>View All Collections</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {purposes.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={idx}
                to={item.link}
                className="group relative rounded-2xl overflow-hidden bg-white border border-forest-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                <div className="aspect-[4/3] overflow-hidden bg-ivory-100 relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-950/70 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-3 left-3 text-white">
                    <span className="inline-flex p-1.5 rounded-lg bg-white/20 backdrop-blur-md">
                      <Icon className="w-4 h-4 text-ivory-100" />
                    </span>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-base font-bold text-forest-900 group-hover:text-forest-700 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-charcoal-500 mt-1.5 line-clamp-2 leading-relaxed">
                      {item.tagline}
                    </p>
                  </div>
                  <div className="mt-4 pt-2 border-t border-forest-50 flex items-center text-xs font-semibold text-terracotta-600 group-hover:text-terracotta-700">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
