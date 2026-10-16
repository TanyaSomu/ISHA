import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { BRAND } from '../config/brand.js';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email.trim(), password);
      // If admin logging in, take to /admin; else return to prior page
      if (email.toLowerCase().includes('admin')) {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCustomer = () => {
    setEmail('aarav@example.com');
    setPassword('Customer@1234');
  };

  const fillDemoAdmin = () => {
    setEmail('admin@sattvaliving.com');
    setPassword('Admin@Sattva2026!');
  };

  return (
    <div className="bg-ivory-50 min-h-screen py-16 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-forest-100 shadow-xl p-8 sm:p-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-forest-700 text-ivory-100 flex items-center justify-center mx-auto shadow-sm">
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h1 className="font-serif text-2xl font-bold text-forest-900">Sign In to {BRAND.name}</h1>
          <p className="text-xs text-charcoal-500">
            Access your orders, saved practice items, and personalized recommendations.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-ivory-50 border border-forest-200 rounded-xl px-3.5 py-2.5 pl-10 text-xs text-charcoal-800 focus:outline-none focus:ring-1 focus:ring-forest-600"
              />
              <Mail className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-ivory-50 border border-forest-200 rounded-xl px-3.5 py-2.5 pl-10 text-xs text-charcoal-800 focus:outline-none focus:ring-1 focus:ring-forest-600"
              />
              <Lock className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-forest-700 hover:bg-forest-800 disabled:opacity-50 text-white text-xs font-bold py-3.5 rounded-full flex items-center justify-center gap-2 shadow-md transition-all"
          >
            <span>{loading ? 'Verifying...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast-Login Pills */}
        <div className="p-3.5 bg-ivory-100/70 border border-forest-200/70 rounded-2xl space-y-2 text-xs">
          <p className="text-[11px] font-semibold text-forest-900 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-terracotta-600" />
            <span>Academic Demonstration Credentials:</span>
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={fillDemoCustomer}
              className="flex-1 bg-white hover:bg-forest-50 border border-forest-200 rounded-lg py-1.5 text-[11px] font-medium text-forest-800 transition-colors"
            >
              Fill Demo Customer
            </button>
            <button
              type="button"
              onClick={fillDemoAdmin}
              className="flex-1 bg-white hover:bg-terracotta-50 border border-terracotta-200 rounded-lg py-1.5 text-[11px] font-medium text-terracotta-800 transition-colors"
            >
              Fill Demo Admin
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-charcoal-500 pt-2 border-t border-forest-50">
          <span>New to {BRAND.name}? </span>
          <Link to="/register" className="text-terracotta-600 hover:underline font-semibold">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};
