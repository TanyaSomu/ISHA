import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  User as UserIcon,
  Menu,
  X,
  Compass,
  Scale,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useCart } from '../../context/CartContext.js';
import { useCompare } from '../../context/CompareContext.js';
import { BRAND } from '../../config/brand.js';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();
  const { itemCount, openCart } = useCart();
  const { comparedProducts } = useCompare();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalogue?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { label: 'All Products', href: '/catalogue' },
    { label: 'Yoga Mats', href: '/catalogue?category=yoga-mats' },
    { label: 'Meditation Cushions', href: '/catalogue?category=meditation-cushions' },
    { label: 'Blocks & Straps', href: '/catalogue?category=yoga-blocks-straps' },
    { label: 'Clothing', href: '/catalogue?category=yoga-clothing' },
    { label: 'Accessories', href: '/catalogue?category=meditation-accessories' },
    { label: 'Wellness', href: '/catalogue?category=wellness-lifestyle' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-ivory-50/95 backdrop-blur-md border-b border-forest-100 transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-forest-800 text-ivory-100 text-xs py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <span>🌿 Free Mindful Delivery across India on orders above ₹1,999</span>
        <span className="hidden md:inline">• Handcrafted with Earth-Kind Organic Materials</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-forest-800 hover:text-forest-600 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo & Brand Name */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-full bg-forest-700 flex items-center justify-center text-ivory-100 shadow-sm group-hover:bg-forest-600 transition-colors">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M12 8c-1.5 2-2 4-2 6 2 0 4-2 4-4 0-1-1-2-2-2z" fill="currentColor" opacity="0.8" />
              </svg>
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-forest-800 group-hover:text-forest-600 transition-colors">
                {BRAND.name}
              </span>
              <p className="text-[10px] text-terracotta-600 font-medium tracking-wider uppercase hidden sm:block">
                Yoga • Meditation • Living
              </p>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-md relative items-center mx-4"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search mats, cushions, singing bowls..."
              className="w-full bg-ivory-100/80 border border-forest-200/80 rounded-full py-2 pl-4 pr-10 text-sm text-charcoal-800 placeholder-charcoal-400 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all"
            />
            <button
              type="submit"
              className="absolute right-3 text-forest-700 hover:text-forest-900 transition-colors"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Smart Product Finder CTA */}
            <Link
              to="/product-finder"
              className="hidden lg:flex items-center gap-1.5 text-xs font-medium text-forest-700 hover:text-forest-900 bg-forest-50 hover:bg-forest-100 border border-forest-200 px-3 py-1.5 rounded-full transition-all"
              title="Find Your Perfect Product"
            >
              <Compass className="w-3.5 h-3.5 text-terracotta-600" />
              <span>Product Finder</span>
            </Link>

            {/* Product Comparison Badge */}
            <Link
              to="/compare"
              className="relative p-2 text-forest-800 hover:text-forest-600 transition-colors"
              title="Compare Products"
            >
              <Scale className="w-5 h-5" />
              {comparedProducts.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-terracotta-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {comparedProducts.length}
                </span>
              )}
            </Link>

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={openCart}
              className="relative p-2 text-forest-800 hover:text-forest-600 transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-forest-700 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                  {itemCount}
                </span>
              )}
            </button>

            {/* User Account / Admin Menu */}
            <div className="relative">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1.5 text-sm font-medium text-forest-800 hover:text-forest-600 p-1.5 rounded-lg border border-transparent hover:border-forest-200 transition-all"
                  >
                    <div className="w-7 h-7 rounded-full bg-forest-100 text-forest-800 flex items-center justify-center font-semibold text-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:inline max-w-[90px] truncate">{user.name.split(' ')[0]}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-forest-600" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-forest-100 py-2 z-50 animate-fadeIn">
                      <div className="px-4 py-2 border-b border-forest-50">
                        <p className="text-xs text-charcoal-400">Signed in as</p>
                        <p className="text-sm font-semibold text-forest-900 truncate">{user.email}</p>
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-terracotta-600 hover:bg-terracotta-50 font-medium"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>Admin Portal</span>
                        </Link>
                      )}

                      <Link
                        to="/account/orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-charcoal-700 hover:bg-ivory-100"
                      >
                        My Orders
                      </Link>

                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                          navigate('/');
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-forest-800 hover:text-forest-600 px-3 py-1.5 rounded-full border border-forest-200 hover:border-forest-400 transition-colors"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Secondary Category Navigation Bar - Desktop */}
        <nav className="hidden md:flex items-center justify-center space-x-8 py-2.5 border-t border-forest-100/70 text-xs font-medium tracking-wide uppercase">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-forest-800 hover:text-terracotta-600 transition-colors py-1 relative group"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-terracotta-500 transition-all duration-200 group-hover:w-full" />
            </Link>
          ))}
          <Link
            to="/kit-builder"
            className="text-terracotta-600 hover:text-terracotta-700 font-semibold tracking-wider flex items-center gap-1"
          >
            <span>★ Yoga Kit Builder</span>
          </Link>
        </nav>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-ivory-50 border-b border-forest-200 px-4 pt-2 pb-6 space-y-4 animate-fadeIn">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-white border border-forest-200 rounded-lg py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-forest-600"
            />
            <button type="submit" className="absolute right-3 top-2.5 text-forest-700">
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Mobile Category Links */}
          <div className="grid grid-cols-2 gap-2 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg bg-white/70 text-forest-900 border border-forest-100 hover:bg-forest-50"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-forest-100 flex flex-col gap-2">
            <Link
              to="/product-finder"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-sm font-medium text-forest-800 px-3 py-2 rounded-lg bg-forest-50"
            >
              <Compass className="w-4 h-4 text-terracotta-600" />
              <span>Smart Product Finder</span>
            </Link>
            <Link
              to="/kit-builder"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-sm font-medium text-terracotta-700 px-3 py-2 rounded-lg bg-terracotta-50"
            >
              <span>★ Build Your Yoga Kit (Save 15%)</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
