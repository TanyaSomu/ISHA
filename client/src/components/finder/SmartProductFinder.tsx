import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  Check,
  ShoppingBag,
  Sparkles,
  Bot,
  RotateCcw,
} from 'lucide-react';
import { api } from '../../services/api.js';
import { RecommendedProduct, Product } from '../../types/index.js';
import { ProductImage } from '../common/ProductImage.js';
import { useCart } from '../../context/CartContext.js';
import { formatINR } from '../../config/brand.js';

export const SmartProductFinder: React.FC = () => {
  const { addToCart } = useCart();

  const [step, setStep] = useState(1);
  const [focus, setFocus] = useState('Dynamic Asana & Hatha Practice');
  const [category, setCategory] = useState('yoga-mats');
  const [experienceLevel, setExperienceLevel] = useState('BEGINNER');
  const [budgetMax, setBudgetMax] = useState(3500); // in Rupees
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([
    'natural-rubber',
    'eco-friendly',
  ]);

  const [loading, setLoading] = useState(false);
  const [engineUsed, setEngineUsed] = useState<string>('');
  const [assistantMessage, setAssistantMessage] = useState('');
  const [disclaimer, setDisclaimer] = useState('');
  const [recommendations, setRecommendations] = useState<RecommendedProduct[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const toggleAttribute = (attr: string) => {
    setSelectedAttributes((prev) =>
      prev.includes(attr) ? prev.filter((a) => a !== attr) : [...prev, attr]
    );
  };

  const handleFindProducts = async () => {
    setLoading(true);
    setHasSearched(true);

    const query = `I am practicing ${focus} at a ${experienceLevel.toLowerCase()} level. I prefer ${selectedAttributes.join(
      ', '
    )} within a budget of ₹${budgetMax}. What do you recommend?`;

    try {
      const res = await api.getAIRecommendations(query, {
        category,
        budgetMax,
        experienceLevel,
        attributes: selectedAttributes,
      });

      setEngineUsed(res.engine);
      setAssistantMessage(res.message);
      setRecommendations(res.recommendedProducts || []);
      setDisclaimer(res.disclaimer || '');
      setStep(5); // Show results step
    } catch (err: any) {
      console.error('Finder error:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetQuiz = () => {
    setStep(1);
    setHasSearched(false);
    setRecommendations([]);
  };

  return (
    <div className="bg-white rounded-3xl border border-forest-200/90 shadow-xl overflow-hidden max-w-4xl mx-auto">
      {/* Header bar */}
      <div className="bg-gradient-to-r from-forest-800 to-forest-900 text-ivory-100 p-6 sm:p-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-forest-700 flex items-center justify-center text-terracotta-400">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-ivory-50">
              Find Your Perfect Product
            </h2>
            <p className="text-xs text-ivory-300 mt-0.5">
              Personalized guidance verified against real catalogue inventory and current stock
            </p>
          </div>
        </div>

        {hasSearched && (
          <button
            onClick={resetQuiz}
            className="flex items-center gap-1.5 text-xs text-ivory-200 hover:text-white bg-forest-700/60 hover:bg-forest-700 px-3 py-1.5 rounded-full transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Start Over</span>
          </button>
        )}
      </div>

      {/* Progress Dots */}
      {step < 5 && (
        <div className="bg-ivory-100/60 px-6 py-3 border-b border-forest-100 flex items-center justify-between text-xs text-forest-800">
          <span>Step {step} of 4</span>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  step === s
                    ? 'bg-forest-700 w-6'
                    : step > s
                    ? 'bg-forest-400'
                    : 'bg-forest-200'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Quiz Body */}
      <div className="p-6 sm:p-10">
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-xs font-bold text-terracotta-600 uppercase tracking-wider">
                Question 1
              </span>
              <h3 className="font-serif text-2xl font-bold text-forest-900 mt-1">
                What is the primary focus of your practice?
              </h3>
              <p className="text-xs text-charcoal-500 mt-1">
                Select the area you wish to deepen or support right now.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {[
                {
                  label: 'Dynamic Asana & Hatha Practice',
                  cat: 'yoga-mats',
                  desc: 'High-traction natural mats & grip-focused essentials',
                },
                {
                  label: 'Meditation & Silent Stillness',
                  cat: 'meditation-cushions',
                  desc: 'Spine-supporting zafu cushions & zabuton base mats',
                },
                {
                  label: 'Alignment, Reach & Posture Stability',
                  cat: 'yoga-blocks-straps',
                  desc: 'Cork blocks & tension-tested woven cotton straps',
                },
                {
                  label: 'Sacred Corner & Daily Mindful Living',
                  cat: 'wellness-lifestyle',
                  desc: 'Ayurvedic copper carafes, singing bowls & pure dhoop',
                },
              ].map((opt) => (
                <div
                  key={opt.label}
                  onClick={() => {
                    setFocus(opt.label);
                    setCategory(opt.cat);
                  }}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    focus === opt.label
                      ? 'border-forest-700 bg-forest-50/70 shadow-sm'
                      : 'border-forest-100 hover:border-forest-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="font-serif font-bold text-sm text-forest-900">{opt.label}</p>
                    {focus === opt.label && (
                      <Check className="w-4 h-4 text-forest-700 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-charcoal-500 mt-1">{opt.desc}</p>
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 bg-forest-700 hover:bg-forest-800 text-white text-xs font-semibold px-6 py-3 rounded-full transition-all shadow-sm"
              >
                <span>Next Question</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-xs font-bold text-terracotta-600 uppercase tracking-wider">
                Question 2
              </span>
              <h3 className="font-serif text-2xl font-bold text-forest-900 mt-1">
                What is your experience level?
              </h3>
              <p className="text-xs text-charcoal-500 mt-1">
                Helps determine the optimal cushioning, firmness, and prop specifications.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  level: 'BEGINNER',
                  title: 'Beginning Practitioner',
                  desc: 'Seeking gentle comfort, clear alignment markers, and forgiving support.',
                },
                {
                  level: 'INTERMEDIATE',
                  title: 'Regular Practitioner',
                  desc: 'Practicing several days a week, needing durable grip and responsive joint feedback.',
                },
                {
                  level: 'ADVANCED',
                  title: 'Daily / Teacher',
                  desc: 'Intensive sadhana requiring high-density natural materials and traditional endurance.',
                },
              ].map((lvl) => (
                <div
                  key={lvl.level}
                  onClick={() => setExperienceLevel(lvl.level)}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                    experienceLevel === lvl.level
                      ? 'border-forest-700 bg-forest-50/70 shadow-sm'
                      : 'border-forest-100 hover:border-forest-300 bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <p className="font-serif font-bold text-sm text-forest-900">{lvl.title}</p>
                      {experienceLevel === lvl.level && (
                        <Check className="w-4 h-4 text-forest-700" />
                      )}
                    </div>
                    <p className="text-xs text-charcoal-500 mt-2 leading-relaxed">{lvl.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-600 hover:text-charcoal-900 px-4 py-2.5 rounded-full"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-2 bg-forest-700 hover:bg-forest-800 text-white text-xs font-semibold px-6 py-3 rounded-full transition-all shadow-sm"
              >
                <span>Next Question</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-xs font-bold text-terracotta-600 uppercase tracking-wider">
                Question 3
              </span>
              <h3 className="font-serif text-2xl font-bold text-forest-900 mt-1">
                Which product characteristics matter most to you?
              </h3>
              <p className="text-xs text-charcoal-500 mt-1">
                Select all attributes that align with your personal values.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'eco-friendly', label: '100% Eco-Friendly' },
                { id: 'natural-rubber', label: 'Tree Rubber Grip' },
                { id: 'cork', label: 'Renewable Cork' },
                { id: 'jute', label: 'Raw Handwoven Jute' },
                { id: 'spine-support', label: 'Spine Ergonomics' },
                { id: 'antimicrobial', label: 'Antimicrobial Surface' },
                { id: 'khadi', label: 'Handloom Khadi' },
                { id: 'sound-healing', label: 'Acoustic 432Hz' },
              ].map((attr) => {
                const selected = selectedAttributes.includes(attr.id);
                return (
                  <button
                    type="button"
                    key={attr.id}
                    onClick={() => toggleAttribute(attr.id)}
                    className={`p-3.5 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${
                      selected
                        ? 'border-forest-700 bg-forest-100 text-forest-900'
                        : 'border-forest-200 text-charcoal-700 bg-white hover:bg-forest-50'
                    }`}
                  >
                    <span>{attr.label}</span>
                    {selected && <Check className="w-3.5 h-3.5 text-forest-800" />}
                  </button>
                );
              })}
            </div>

            <div className="pt-4 flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-600 hover:text-charcoal-900 px-4 py-2.5 rounded-full"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setStep(4)}
                className="inline-flex items-center gap-2 bg-forest-700 hover:bg-forest-800 text-white text-xs font-semibold px-6 py-3 rounded-full transition-all shadow-sm"
              >
                <span>Next Question</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-xs font-bold text-terracotta-600 uppercase tracking-wider">
                Question 4
              </span>
              <h3 className="font-serif text-2xl font-bold text-forest-900 mt-1">
                What is your approximate budget?
              </h3>
              <p className="text-xs text-charcoal-500 mt-1">
                We only recommend items available within your chosen ceiling.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {[
                { label: 'Under ₹1,500', val: 1500 },
                { label: 'Up to ₹2,500', val: 2500 },
                { label: 'Up to ₹3,500', val: 3500 },
                { label: 'Any Budget (All Items)', val: 10000 },
              ].map((b) => (
                <div
                  key={b.val}
                  onClick={() => setBudgetMax(b.val)}
                  className={`p-4 rounded-xl border-2 text-center cursor-pointer transition-all ${
                    budgetMax === b.val
                      ? 'border-forest-700 bg-forest-50 text-forest-900 font-bold'
                      : 'border-forest-100 hover:border-forest-300 text-charcoal-700'
                  }`}
                >
                  <p className="text-sm font-semibold">{b.label}</p>
                </div>
              ))}
            </div>

            <div className="pt-6 flex justify-between items-center border-t border-forest-100">
              <button
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal-600 hover:text-charcoal-900 px-4 py-2.5 rounded-full"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                onClick={handleFindProducts}
                disabled={loading}
                className="inline-flex items-center gap-2 bg-terracotta-600 hover:bg-terracotta-700 text-white text-xs font-bold px-8 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all"
              >
                {loading ? (
                  <span>Consulting Catalogue...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Find My Recommendations</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Results Screen */}
        {step === 5 && (
          <div className="space-y-6 animate-fadeIn">
            {/* Engine banner */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-forest-50 border border-forest-200">
              <div className="flex items-center gap-2.5 text-xs text-forest-900">
                {engineUsed === 'gemini_ai' ? (
                  <Sparkles className="w-4 h-4 text-terracotta-600 flex-shrink-0" />
                ) : (
                  <Compass className="w-4 h-4 text-forest-700 flex-shrink-0" />
                )}
                <span>
                  <strong>Recommendation Engine:</strong>{' '}
                  {engineUsed === 'gemini_ai'
                    ? 'Google Gemini AI (Live Context)'
                    : 'Verified Rule-Based Catalog Matcher'}
                </span>
              </div>
              <span className="text-[11px] text-forest-700 bg-white px-2.5 py-1 rounded-full border border-forest-200 font-medium">
                {recommendations.length} {recommendations.length === 1 ? 'match' : 'matches'} found
              </span>
            </div>

            <p className="text-sm text-charcoal-700 leading-relaxed font-serif italic bg-ivory-50 p-4 rounded-xl border border-forest-100">
              "{assistantMessage}"
            </p>

            {/* Recommended Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="bg-white border border-forest-200 rounded-2xl p-4 flex gap-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-ivory-100 flex-shrink-0">
                    <ProductImage
                      src={rec.image}
                      alt={rec.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta-600">
                        {rec.categoryName}
                      </span>
                      <Link
                        to={`/products/${rec.slug}`}
                        className="font-serif text-sm font-bold text-forest-900 hover:text-forest-700 block line-clamp-1 mt-0.5"
                      >
                        {rec.name}
                      </Link>
                      <p className="text-xs text-forest-800 bg-forest-50/70 p-1.5 rounded-lg border border-forest-100/60 mt-1.5 leading-snug">
                        <strong>Why:</strong> {rec.reason}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-forest-50">
                      <span className="text-sm font-bold text-forest-900">
                        {formatINR(rec.price)}
                      </span>

                      <div className="flex gap-2">
                        <Link
                          to={`/products/${rec.slug}`}
                          className="text-xs font-semibold text-forest-800 hover:underline px-2 py-1"
                        >
                          Details
                        </Link>
                        <button
                          onClick={() => {
                            // Synthesize minimal product object for cart
                            addToCart({
                              id: rec.id,
                              name: rec.name,
                              slug: rec.slug,
                              price: rec.price,
                              stock: rec.stock,
                              category: { id: '', name: rec.categoryName, slug: '' },
                              images: JSON.stringify([rec.image]),
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
                          className="flex items-center gap-1 bg-forest-700 hover:bg-forest-800 text-white text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {disclaimer && (
              <p className="text-[11px] text-center text-charcoal-400 italic">
                {disclaimer}
              </p>
            )}

            <div className="pt-4 text-center">
              <button
                onClick={resetQuiz}
                className="text-xs font-bold text-forest-800 hover:text-terracotta-600 underline"
              >
                Change Preferences and Try Another Search
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
