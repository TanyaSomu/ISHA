import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  jwtSecret: process.env.JWT_SECRET || 'sattva_secure_jwt_fallback_secret_32_chars!',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  brand: {
    name: process.env.BRAND_NAME || 'Sattva Living',
    tagline: 'Find What Supports Your Practice',
    currency: process.env.DEFAULT_CURRENCY || 'INR',
    currencySymbol: process.env.DEFAULT_CURRENCY_SYMBOL || '₹',
    freeShippingThreshold: 199900, // ₹1,999.00 in paise
    standardShippingFee: 15000, // ₹150.00 in paise
  },
};
