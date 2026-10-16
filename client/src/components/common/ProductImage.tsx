import React, { useState } from 'react';

interface ProductImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackCategory?: string;
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  className = '',
  fallbackCategory = 'yoga',
}) => {
  const [hasError, setHasError] = useState(false);

  // SVG Fallback representation with earthy tones and leaf/lotus motif
  const fallbackSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%"><rect width="100%" height="100%" fill="%23f4ede2"/><circle cx="200" cy="200" r="110" fill="%23e1ede7"/><path d="M200 120 C180 160 170 200 200 250 C230 200 220 160 200 120 Z" fill="%232d6a4f"/><path d="M200 180 C160 190 130 210 150 240 C180 230 190 200 200 180 Z" fill="%23c86d51"/><path d="M200 180 C240 190 270 210 250 240 C220 230 210 200 200 180 Z" fill="%23c86d51"/><text x="200" y="310" font-family="serif" font-size="16" fill="%23143826" text-anchor="middle" font-weight="bold">SATTVA LIVING</text></svg>`;

  return (
    <img
      src={hasError || !src ? fallbackSvg : src}
      alt={alt}
      className={`object-cover transition-opacity duration-300 ${className}`}
      onError={() => setHasError(true)}
      loading="lazy"
    />
  );
};
