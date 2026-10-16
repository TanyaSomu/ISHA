import React, { useState } from 'react';
import { Sparkles, X, Send, Bot, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api.js';
import { RecommendedProduct } from '../../types/index.js';
import { ProductImage } from '../common/ProductImage.js';
import { useCart } from '../../context/CartContext.js';
import { formatINR } from '../../config/brand.js';

export const AIAssistantWidget: React.FC = () => {
  const { addToCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const [conversation, setConversation] = useState<Array<{
    sender: 'user' | 'assistant';
    text: string;
    products?: RecommendedProduct[];
    engine?: string;
  }>>([
    {
      sender: 'assistant',
      text: 'Namaste. I am your Mindful Shopping Assistant for Sattva Living. How may I support your practice today? Feel free to ask about mat materials, alignment props, or meditation accessories.',
    },
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || loading) return;

    const userText = query.trim();
    setQuery('');
    setConversation((prev) => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    try {
      const res = await api.getAIRecommendations(userText);
      setConversation((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: res.message,
          products: res.recommendedProducts,
          engine: res.engine,
        },
      ]);
    } catch {
      setConversation((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: 'I apologize, but I could not reach our recommendation service. Please browse our catalogue directly or check your network connection.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-forest-800 hover:bg-forest-900 text-ivory-50 p-3.5 rounded-full shadow-2xl flex items-center gap-2 border-2 border-ivory-100/30 group transition-all duration-300 hover:scale-105"
        aria-label="Open AI Shopping Assistant"
      >
        <Sparkles className="w-5 h-5 text-terracotta-400 group-hover:rotate-12 transition-transform" />
        <span className="text-xs font-semibold pr-1 hidden sm:inline">Ask AI Guide</span>
      </button>

      {/* Slide-out / Modal Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:p-6 bg-charcoal-900/40 backdrop-blur-xs">
          <div className="w-full sm:max-w-md h-[85vh] sm:h-[650px] bg-ivory-50 rounded-t-3xl sm:rounded-3xl shadow-2xl border border-forest-200 flex flex-col overflow-hidden animate-slideUp">
            {/* Header */}
            <div className="bg-forest-800 text-ivory-50 p-4 flex items-center justify-between border-b border-forest-700">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-forest-700 flex items-center justify-center text-terracotta-300">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-bold text-white">Sattva Practice Guide</h3>
                  <p className="text-[10px] text-ivory-300">Verified Catalogue Intelligence</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-ivory-300 hover:text-white rounded-lg hover:bg-forest-700 transition-colors"
                aria-label="Close Assistant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conversation Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
              {conversation.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-forest-700 text-white rounded-tr-none'
                        : 'bg-white text-charcoal-800 border border-forest-100 shadow-xs rounded-tl-none'
                    }`}
                  >
                    <p>{msg.text}</p>
                  </div>

                  {/* Recommended Products Embed */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="w-full mt-2.5 space-y-2">
                      <p className="text-[10px] font-bold text-terracotta-600 uppercase tracking-wider">
                        Matched Practice Items
                      </p>
                      <div className="space-y-2">
                        {msg.products.map((p) => (
                          <div
                            key={p.id}
                            className="bg-white p-2.5 rounded-xl border border-forest-100 shadow-xs flex items-center gap-2.5"
                          >
                            <div className="w-12 h-12 rounded-lg bg-ivory-100 overflow-hidden flex-shrink-0">
                              <ProductImage
                                src={p.image}
                                alt={p.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <Link
                                to={`/products/${p.slug}`}
                                onClick={() => setIsOpen(false)}
                                className="font-serif font-bold text-forest-900 hover:text-forest-700 block truncate"
                              >
                                {p.name}
                              </Link>
                              <p className="text-[10px] text-charcoal-500 truncate">{p.reason}</p>
                              <span className="font-bold text-forest-800 text-xs">
                                {formatINR(p.price)}
                              </span>
                            </div>
                            <button
                              onClick={() => {
                                addToCart({
                                  id: p.id,
                                  name: p.name,
                                  slug: p.slug,
                                  price: p.price,
                                  stock: p.stock,
                                  category: { id: '', name: p.categoryName, slug: '' },
                                  images: JSON.stringify([p.image]),
                                  description: '',
                                  material: '',
                                  dimensions: '',
                                  careInstructions: '',
                                  intendedUse: '',
                                  experienceLevel: 'ALL_LEVELS',
                                  isFeatured: false,
                                  isBestseller: false,
                                  isActive: true,
                                  collectionTags: '[]',
                                  createdAt: '',
                                  updatedAt: '',
                                  categoryId: '',
                                });
                              }}
                              className="p-2 bg-forest-50 hover:bg-forest-700 text-forest-800 hover:text-white rounded-lg transition-colors flex-shrink-0"
                              title="Add to cart"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-charcoal-400 text-xs italic bg-white p-2.5 rounded-xl border border-forest-100 w-fit">
                  <Sparkles className="w-3.5 h-3.5 animate-spin text-terracotta-500" />
                  <span>Consulting verified catalogue specifications...</span>
                </div>
              )}
            </div>

            {/* Prompt Form */}
            <form onSubmit={handleSubmit} className="p-3 border-t border-forest-100 bg-white">
              <div className="flex items-center gap-1.5 bg-ivory-50 border border-forest-200 rounded-full px-3 py-1.5">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask about mats, props, or budget..."
                  className="flex-1 bg-transparent text-xs text-charcoal-800 placeholder-charcoal-400 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!query.trim() || loading}
                  className="bg-forest-700 hover:bg-forest-800 disabled:opacity-40 text-white p-1.5 rounded-full transition-colors"
                  aria-label="Send query"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
