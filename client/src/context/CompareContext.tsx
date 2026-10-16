import React, { createContext, useContext, useState } from 'react';
import { Product } from '../types/index.js';

interface CompareContextType {
  comparedProducts: Product[];
  addToCompare: (product: Product) => boolean;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [comparedProducts, setComparedProducts] = useState<Product[]>([]);

  const addToCompare = (product: Product): boolean => {
    if (comparedProducts.some((p) => p.id === product.id)) {
      return false;
    }
    if (comparedProducts.length >= 3) {
      alert('You can compare a maximum of 3 products at a time.');
      return false;
    }
    setComparedProducts((prev) => [...prev, product]);
    return true;
  };

  const removeFromCompare = (productId: string) => {
    setComparedProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const clearCompare = () => {
    setComparedProducts([]);
  };

  const isInCompare = (productId: string) => {
    return comparedProducts.some((p) => p.id === productId);
  };

  return (
    <CompareContext.Provider
      value={{
        comparedProducts,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = (): CompareContextType => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};
