import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import { BRAND } from '../../config/brand.js';

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail && consentChecked) {
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-forest-900 text-ivory-100/90 pt-16 pb-12 border-t border-forest-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-forest-800/80">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-forest-700 flex items-center justify-center text-ivory-100">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-ivory-50">
                {BRAND.name}
              </span>
            </div>
            <p className="text-xs text-ivory-200/80 leading-relaxed max-w-sm">
              Dedicated to deepening your yoga and meditation journey through authentic, handcrafted, and biodegradable practice essentials inspired by yogic traditions.
            </p>
            <div className="space-y-2 text-xs text-ivory-200/70 pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-terracotta-400" />
                <span>{BRAND.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-terracotta-400" />
                <a href={`mailto:${BRAND.supportEmail}`} className="hover:underline">
                  {BRAND.supportEmail}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-terracotta-400" />
                <span>{BRAND.supportPhone}</span>
              </div>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold tracking-wider text-ivory-50 uppercase">
              Catalogue
            </h4>
            <ul className="space-y-2 text-xs text-ivory-200/80">
              <li>
                <Link to="/catalogue?category=yoga-mats" className="hover:text-terracotta-300 transition-colors">
                  Natural Yoga Mats
                </Link>
              </li>
              <li>
                <Link to="/catalogue?category=meditation-cushions" className="hover:text-terracotta-300 transition-colors">
                  Zafu & Zabuton Cushions
                </Link>
              </li>
              <li>
                <Link to="/catalogue?category=yoga-blocks-straps" className="hover:text-terracotta-300 transition-colors">
                  Cork Blocks & Cotton Straps
                </Link>
              </li>
              <li>
                <Link to="/catalogue?category=yoga-clothing" className="hover:text-terracotta-300 transition-colors">
                  Organic Khadi Apparel
                </Link>
              </li>
              <li>
                <Link to="/catalogue?category=meditation-accessories" className="hover:text-terracotta-300 transition-colors">
                  Singing Bowls & Malas
                </Link>
              </li>
              <li>
                <Link to="/catalogue?category=wellness-lifestyle" className="hover:text-terracotta-300 transition-colors">
                  Ayurvedic Copper & Dhoop
                </Link>
              </li>
            </ul>
          </div>

          {/* Discovery & Support */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold tracking-wider text-ivory-50 uppercase">
              Practice Tools
            </h4>
            <ul className="space-y-2 text-xs text-ivory-200/80">
              <li>
                <Link to="/product-finder" className="hover:text-terracotta-300 transition-colors font-medium text-terracotta-400">
                  ✦ Smart Product Finder
                </Link>
              </li>
              <li>
                <Link to="/kit-builder" className="hover:text-terracotta-300 transition-colors">
                  Build Your Yoga Kit
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-terracotta-300 transition-colors">
                  Product Comparison
                </Link>
              </li>
              <li>
                <Link to="/account/orders" className="hover:text-terracotta-300 transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-terracotta-300 transition-colors text-ivory-300/50">
                  Administrator Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Consent-Based Newsletter */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-semibold tracking-wider text-ivory-50 uppercase">
              Mindful Journal
            </h4>
            <p className="text-xs text-ivory-200/80 leading-relaxed">
              Receive seasonal reflections on yogic sadhana, alignment guides, and mindful restock announcements.
            </p>
            {subscribed ? (
              <div className="bg-forest-800/80 border border-forest-600 p-3 rounded-lg flex items-center gap-2 text-xs text-green-300">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>Thank you. You have been subscribed with mindful care.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-2">
                <div className="flex gap-1.5">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 bg-forest-800/80 border border-forest-700 rounded-lg px-3 py-2 text-xs text-ivory-100 placeholder-forest-400 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                  />
                  <button
                    type="submit"
                    disabled={!consentChecked}
                    className="bg-terracotta-600 hover:bg-terracotta-700 disabled:opacity-40 text-ivory-100 px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center"
                    aria-label="Subscribe to newsletter"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <label className="flex items-start gap-2 text-[10px] text-ivory-200/70 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={consentChecked}
                    onChange={(e) => setConsentChecked(e.target.checked)}
                    className="mt-0.5 rounded border-forest-700 text-terracotta-600 focus:ring-terracotta-500"
                  />
                  <span>I consent to receive mindful email updates. You can unsubscribe at any time.</span>
                </label>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Credits & Academic Notice */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-ivory-200/60 gap-4">
          <p>
            © {new Date().getFullYear()} {BRAND.name}. All rights reserved. Crafted with reverence for conscious living.
          </p>
          <div className="flex items-center gap-6">
            <span>Demo Academic Project</span>
            <span>Simulated Checkout Only</span>
            <span>Zero Plastic Packaging</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
