import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '../utils/prisma.js';
import { config } from '../config/index.js';

export interface RecommendationResponse {
  engine: 'gemini_ai' | 'catalog_rule_engine';
  message: string;
  recommendedProducts: Array<{
    id: string;
    name: string;
    slug: string;
    price: number;
    stock: number;
    categoryName: string;
    image: string;
    reason: string;
  }>;
  disclaimer?: string;
}

export class AIService {
  /**
   * Generates tailored product recommendations based on user query and preferences.
   * If GEMINI_API_KEY is present, connects to Google Gemini API.
   * Otherwise, employs the intelligent rule-based catalog matcher.
   */
  static async getRecommendations(query: string, preferences?: {
    category?: string;
    budgetMax?: number; // in paise
    experienceLevel?: string;
    attributes?: string[];
  }): Promise<RecommendationResponse> {
    // 1. Fetch all active, in-stock products from the database to serve as ground truth
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        stock: { gt: 0 },
      },
      include: {
        category: true,
      },
    });

    if (products.length === 0) {
      return {
        engine: 'catalog_rule_engine',
        message: 'Our catalog is currently being updated. Please check back shortly.',
        recommendedProducts: [],
      };
    }

    // Try Gemini API if key is present
    if (config.geminiApiKey && config.geminiApiKey.trim() !== '') {
      try {
        const geminiResult = await this.callGeminiAPI(query, preferences, products);
        if (geminiResult) {
          return geminiResult;
        }
      } catch (err) {
        console.warn('[AIService] Gemini API invocation failed, falling back to rule engine:', err);
      }
    }

    // 2. Intelligent Algorithmic Fallback Engine
    return this.fallbackCatalogMatcher(query, preferences, products);
  }

  private static async callGeminiAPI(
    query: string,
    preferences: any,
    catalog: any[]
  ): Promise<RecommendationResponse | null> {
    const genAI = new GoogleGenerativeAI(config.geminiApiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Build catalog summary for prompt context
    const catalogContext = catalog.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      category: p.category.name,
      priceRupees: p.price / 100,
      stock: p.stock,
      material: p.material,
      intendedUse: p.intendedUse,
      experienceLevel: p.experienceLevel,
    }));

    const systemPrompt = `You are the Mindful Shopping Assistant for Sattva Living, an authentic yoga, meditation, and conscious-living e-commerce store.
Your goal is to recommend the best products for the customer's request based ONLY on the verified catalog items provided below.

RULES:
1. Recommend ONLY items that exist in the provided catalog with their exact IDs.
2. Do not invent products, prices, materials, or fake medical cures.
3. Keep the tone peaceful, knowledgeable, respectful, and grounded.
4. Output your answer strictly as a JSON object matching this structure:
{
  "message": "A warm, helpful explanation of why these items support the practitioner's journey.",
  "recommendedProductIds": [
    { "id": "PRODUCT_ID", "reason": "Specific 1-2 sentence reason matching their practice need." }
  ]
}

Available Verified Catalog:
${JSON.stringify(catalogContext, null, 2)}
`;

    const userPrompt = `Customer Request: "${query}"
Customer Preferences: ${JSON.stringify(preferences || {})}`;

    const result = await model.generateContent([
      { text: systemPrompt },
      { text: userPrompt },
    ]);

    const responseText = result.response.text();
    // Parse JSON from response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const parsed = JSON.parse(jsonMatch[0]);
    if (!parsed.recommendedProductIds || !Array.isArray(parsed.recommendedProductIds)) {
      return null;
    }

    // Validate recommended IDs against real database products
    const validatedProducts: any[] = [];
    for (const rec of parsed.recommendedProductIds) {
      const match = catalog.find((p) => p.id === rec.id);
      if (match) {
        let firstImg = '';
        try {
          const imgs = JSON.parse(match.images);
          firstImg = Array.isArray(imgs) && imgs.length > 0 ? imgs[0] : '';
        } catch {
          firstImg = '';
        }

        validatedProducts.push({
          id: match.id,
          name: match.name,
          slug: match.slug,
          price: match.price,
          stock: match.stock,
          categoryName: match.category.name,
          image: firstImg,
          reason: rec.reason || `Perfect match for ${match.intendedUse}`,
        });
      }
    }

    return {
      engine: 'gemini_ai',
      message: parsed.message || 'Here are tailored recommendations based on your practice requirements:',
      recommendedProducts: validatedProducts,
      disclaimer: 'Recommendations generated by Gemini AI using verified live catalog inventory.',
    };
  }

  private static fallbackCatalogMatcher(
    query: string,
    preferences: any,
    catalog: any[]
  ): RecommendationResponse {
    const q = (query || '').toLowerCase();
    const prefCategory = preferences?.category?.toLowerCase();
    const budgetMax = preferences?.budgetMax;
    const expLevel = preferences?.experienceLevel?.toUpperCase();
    const attributes = (preferences?.attributes || []).map((a: string) => a.toLowerCase());

    // Score products based on matching criteria
    const scored = catalog.map((p) => {
      let score = 0;
      const reasons: string[] = [];

      // Budget filter
      if (budgetMax && p.price > budgetMax) {
        return { product: p, score: -1, reasons: [] };
      }

      // Keyword query matching
      if (q) {
        if (p.name.toLowerCase().includes(q)) {
          score += 5;
          reasons.push(`Directly matches your interest in ${p.name.split(' ')[0]}`);
        }
        if (p.description.toLowerCase().includes(q)) score += 3;
        if (p.material.toLowerCase().includes(q)) {
          score += 4;
          reasons.push(`Crafted with ${p.material.split('&')[0].trim()}`);
        }
        if (p.intendedUse.toLowerCase().includes(q)) score += 4;
      }

      // Category matching
      if (prefCategory && (p.category.slug.includes(prefCategory) || p.category.name.toLowerCase().includes(prefCategory))) {
        score += 6;
        reasons.push(`Tailored for the ${p.category.name} category`);
      }

      // Experience level matching
      if (expLevel && (p.experienceLevel === expLevel || p.experienceLevel === 'ALL_LEVELS')) {
        score += 3;
        reasons.push(`Ideal for ${expLevel.toLowerCase().replace('_', ' ')} practitioners`);
      }

      // Attribute matching (eco, cushion, grip, travel, etc.)
      for (const attr of attributes) {
        if (
          p.collectionTags.toLowerCase().includes(attr) ||
          p.material.toLowerCase().includes(attr) ||
          p.description.toLowerCase().includes(attr)
        ) {
          score += 3;
          reasons.push(`Emphasizes ${attr}`);
        }
      }

      // Bestseller boost
      if (p.isBestseller) score += 2;
      if (p.isFeatured) score += 1;

      return {
        product: p,
        score,
        reasons,
      };
    });

    // Filter positive scores and sort descending
    const filtered = scored
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);

    // If query was very generic or empty, take top featured/bestsellers
    const finalMatches =
      filtered.length > 0
        ? filtered
        : catalog
            .filter((p) => (!budgetMax || p.price <= budgetMax))
            .slice(0, 3)
            .map((p) => ({
              product: p,
              score: 1,
              reasons: [`Versatile, high-demand choice suitable for daily practice`],
            }));

    const recommendedProducts = finalMatches.map(({ product: p, reasons }) => {
      let firstImg = '';
      try {
        const imgs = JSON.parse(p.images);
        firstImg = Array.isArray(imgs) && imgs.length > 0 ? imgs[0] : '';
      } catch {
        firstImg = '';
      }

      const cleanReason =
        reasons.length > 0
          ? reasons.slice(0, 2).join(' • ')
          : `Crafted from ${p.material} for ${p.intendedUse}`;

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        stock: p.stock,
        categoryName: p.category.name,
        image: firstImg,
        reason: cleanReason,
      };
    });

    return {
      engine: 'catalog_rule_engine',
      message:
        'Here are curated recommendations from our verified inventory aligned with your focus, preferences, and budget:',
      recommendedProducts,
      disclaimer:
        'Recommendations curated by Sattva Catalog Matching Engine based on verified product specifications and real-time inventory.',
    };
  }
}
