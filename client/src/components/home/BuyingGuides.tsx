import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight } from 'lucide-react';

export const BuyingGuides: React.FC = () => {
  const articles = [
    {
      title: 'How to Choose the Right Yoga Mat for Your Sadhana',
      category: 'Practice Guide',
      readTime: '4 min read',
      excerpt:
        'Understanding tree rubber density, organic jute texture, and alignment markers based on whether your practice is dynamic flow or meditative stillness.',
      image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80',
      link: '/catalogue?category=yoga-mats',
    },
    {
      title: 'Creating an Altar & Sacred Meditation Corner at Home',
      category: 'Sacred Living',
      readTime: '6 min read',
      excerpt:
        'A practical guide on orienting your seat, maintaining spinal alignment with zafus, and introducing sacred sound and pure bronze ghee lamps.',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
      link: '/catalogue?category=meditation-cushions',
    },
    {
      title: 'The Living Science of Tamra Jal: Ayurvedic Copper Vessels',
      category: 'Ayurveda',
      readTime: '3 min read',
      excerpt:
        'Why resting clean drinking water in pure hammered copper overnight supports cellular vitality, digestive balance, and mindful morning rituals.',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80',
      link: '/catalogue?category=wellness-lifestyle',
    },
  ];

  return (
    <section className="py-16 bg-white border-b border-forest-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-semibold tracking-wider uppercase text-terracotta-600">
              Conscious Wisdom
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-900 mt-1">
              Educational Buying Guides
            </h2>
            <p className="text-sm text-charcoal-500 mt-2 max-w-xl">
              Equip your practice with clear knowledge on materials, traditional proportions, and sacred upkeep.
            </p>
          </div>
          <Link
            to="/catalogue"
            className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-xs font-semibold text-forest-700 hover:text-forest-900 group"
          >
            <span>Browse Products in Guides</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((art, idx) => (
            <Link
              key={idx}
              to={art.link}
              className="group flex flex-col bg-ivory-50/50 rounded-2xl overflow-hidden border border-forest-100/80 hover:border-forest-300 transition-all shadow-xs hover:shadow-md"
            >
              <div className="aspect-[16/10] overflow-hidden bg-ivory-200">
                <img
                  src={art.image}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[11px] font-semibold text-terracotta-600 uppercase tracking-wider mb-2">
                    <span>{art.category}</span>
                    <span>•</span>
                    <span className="text-charcoal-400 font-normal lowercase">{art.readTime}</span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-forest-900 group-hover:text-forest-700 transition-colors leading-snug">
                    {art.title}
                  </h3>
                  <p className="text-xs text-charcoal-500 mt-2.5 line-clamp-3 leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-forest-100 flex items-center gap-1.5 text-xs font-bold text-forest-800 group-hover:text-terracotta-600 transition-colors">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Read Guide & See Gear</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-auto transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
