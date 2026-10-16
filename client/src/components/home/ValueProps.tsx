import React from 'react';
import { Leaf, Award, HeartHandshake, PackageCheck } from 'lucide-react';

export const ValueProps: React.FC = () => {
  const pillars = [
    {
      icon: Leaf,
      title: 'Earth-Kind Materials',
      desc: '100% natural tree rubber, unbleached organic cotton, renewable cork, and pure bronze.',
    },
    {
      icon: Award,
      title: 'Sacred Alignment',
      desc: 'Tested and proportioned by seasoned practitioners to support posture stability and spine health.',
    },
    {
      icon: HeartHandshake,
      title: 'Fair Artisan Trade',
      desc: 'Handcrafted across traditional weaving clusters and metal-casting communities in India.',
    },
    {
      icon: PackageCheck,
      title: 'Plastic-Free Packaging',
      desc: 'Shipped in biodegradable corrugated cardboard and recycled cotton drawstring pouches.',
    },
  ];

  return (
    <section className="py-12 bg-white border-b border-forest-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 rounded-xl hover:bg-ivory-50 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-forest-50 border border-forest-200/80 flex items-center justify-center flex-shrink-0 text-forest-700">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-forest-900">
                    {item.title}
                  </h3>
                  <p className="text-xs text-charcoal-500 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
