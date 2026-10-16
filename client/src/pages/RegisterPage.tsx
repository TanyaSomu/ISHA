import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User, Phone, MapPin, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { BRAND } from '../config/brand.js';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim() || undefined,
        address: formData.address.trim() || undefined,
        city: formData.city.trim() || undefined,
        state: formData.state.trim() || undefined,
        postalCode: formData.postalCode.trim() || undefined,
      });

      navigate('/catalogue');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-ivory-50 min-h-screen py-16 flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white rounded-3xl border border-forest-100 shadow-xl p-8 sm:p-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-forest-700 text-ivory-100 flex items-center justify-center mx-auto shadow-sm">
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h1 className="font-serif text-2xl font-bold text-forest-900">Join {BRAND.name}</h1>
          <p className="text-xs text-charcoal-500">
            Create your mindful customer account for faster checkout and order tracking.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">Full Name *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Maya Sharma"
                  className="w-full bg-ivory-50 border border-forest-200 rounded-xl px-3.5 py-2.5 pl-10 text-xs text-charcoal-800 focus:outline-none focus:ring-1 focus:ring-forest-600"
                />
                <User className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">Email Address *</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="maya@example.com"
                  className="w-full bg-ivory-50 border border-forest-200 rounded-xl px-3.5 py-2.5 pl-10 text-xs text-charcoal-800 focus:outline-none focus:ring-1 focus:ring-forest-600"
                />
                <Mail className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">Password *</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  minLength={6}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  className="w-full bg-ivory-50 border border-forest-200 rounded-xl px-3.5 py-2.5 pl-10 text-xs text-charcoal-800 focus:outline-none focus:ring-1 focus:ring-forest-600"
                />
                <Lock className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">Phone Number</label>
              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 00000"
                  className="w-full bg-ivory-50 border border-forest-200 rounded-xl px-3.5 py-2.5 pl-10 text-xs text-charcoal-800 focus:outline-none focus:ring-1 focus:ring-forest-600"
                />
                <Phone className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-700 mb-1">Delivery Address</label>
            <div className="relative">
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street address or locality"
                className="w-full bg-ivory-50 border border-forest-200 rounded-xl px-3.5 py-2.5 pl-10 text-xs text-charcoal-800 focus:outline-none focus:ring-1 focus:ring-forest-600"
              />
              <MapPin className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                className="w-full bg-ivory-50 border border-forest-200 rounded-xl px-3 py-2 text-xs text-charcoal-800 focus:outline-none focus:ring-1"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
                className="w-full bg-ivory-50 border border-forest-200 rounded-xl px-3 py-2 text-xs text-charcoal-800 focus:outline-none focus:ring-1"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">PIN</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="PIN"
                className="w-full bg-ivory-50 border border-forest-200 rounded-xl px-3 py-2 text-xs text-charcoal-800 focus:outline-none focus:ring-1"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-forest-700 hover:bg-forest-800 disabled:opacity-50 text-white text-xs font-bold py-3.5 rounded-full flex items-center justify-center gap-2 shadow-md transition-all mt-4"
          >
            <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-charcoal-500 pt-2 border-t border-forest-50">
          <span>Already have an account? </span>
          <Link to="/login" className="text-terracotta-600 hover:underline font-semibold">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
