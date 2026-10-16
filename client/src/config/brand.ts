export const BRAND = {
  name: 'Sattva Living',
  tagline: 'Find What Supports Your Practice',
  subTagline: 'Consciously crafted yoga, meditation, and sacred living essentials.',
  currency: 'INR',
  currencySymbol: '₹',
  freeShippingThreshold: 1999, // in Rupees
  standardShippingFee: 150, // in Rupees
  supportEmail: 'care@sattvaliving.com',
  supportPhone: '+91 80 4567 8900',
  address: 'Sattva Sanctuary, 108 Shanti Marg, Velliangiri Foothills, Coimbatore 641114',
  socials: {
    instagram: 'https://instagram.com/sattvaliving',
    youtube: 'https://youtube.com/sattvaliving',
  },
};

/**
 * Formats minor currency units (paise) into standard Indian Rupee notation (e.g. ₹1,499)
 */
export function formatINR(paiseAmount: number): string {
  const rupees = Math.round(paiseAmount / 100);
  return `${BRAND.currencySymbol}${rupees.toLocaleString('en-IN')}`;
}

/**
 * Formats pure rupees into standard Indian Rupee notation
 */
export function formatRupees(rupees: number): string {
  return `${BRAND.currencySymbol}${rupees.toLocaleString('en-IN')}`;
}
