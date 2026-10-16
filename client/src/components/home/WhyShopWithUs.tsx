import React from 'react';
import { ShieldCheck, Truck, RefreshCw, Sparkles } from 'lucide-react';

export const WhyShopWithUs: React.FC = () => {
  const points = [
    {
      icon: ShieldCheck,
      title: 'Practitioner Tested',
      desc: 'Every mat, zafu cushion, and bronze diya undergoes extensive testing by certified Hatha yoga teachers for alignment and durability.',
    },
    {
      icon: Truck,
      title: 'Conscious Shipping',
      desc: 'Free express courier delivery on all orders over ₹1,999 across all Indian pin codes, securely packed in zero-plastic materials.',
    },
    {
      icon: RefreshCw,
      title: '30-Day Sacred Trial',
      desc: 'Practice on your mat for up to 30 days. If it does not support your stillness and posture, return it for an effortless exchange.',
    },
    {
      icon: Sparkles,
      title: 'Fair Heritage Sourcing',
      desc: 'Direct ethical partnerships with multi-generational weaver families in Tamil Nadu, Karnataka, and Bengal.',
    },
  ];

  return (
    <section className="py-16 bg-ivory-100/60 border-b border-forest-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-semibold tracking-wider uppercase text-terracotta-600">
            Our Commitment
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-forest-900 mt-1">
            Why Shop With Us
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {points.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl border border-forest-100 shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-forest-50 text-forest-700 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-base font-bold text-forest-900">{p.title}</h3>
                <p className="text-xs text-charcoal-500 mt-2 leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
