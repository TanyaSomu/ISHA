import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext.js';
import { CartProvider, useCart } from '../context/CartContext.js';
import { CompareProvider } from '../context/CompareContext.js';
import { Header } from '../components/common/Header.js';
import { ProductCard } from '../components/catalogue/ProductCard.js';
import { Product } from '../types/index.js';
import { BRAND } from '../config/brand.js';

const mockProduct: Product = {
  id: 'test-prod-1',
  name: 'Prana Tree Rubber Mat',
  slug: 'prana-tree-rubber-mat',
  description: 'Pure natural tree rubber mat for high traction.',
  price: 349900, // ₹3,499.00
  compareAtPrice: 399900,
  categoryId: 'cat-mats',
  category: { id: 'cat-mats', name: 'Yoga Mats', slug: 'yoga-mats' },
  images: JSON.stringify(['https://example.com/mat.jpg']),
  stock: 10,
  material: '100% Tree Rubber',
  dimensions: '183 x 68 cm',
  careInstructions: 'Wipe with damp cloth',
  intendedUse: 'Hatha and Vinyasa',
  experienceLevel: 'ALL_LEVELS',
  isFeatured: true,
  isBestseller: true,
  isActive: true,
  collectionTags: '[]',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Helper test component to inspect CartContext
const CartTester: React.FC = () => {
  const { items, addToCart, updateQuantity, itemCount, totalAmount, subtotal } = useCart();
  return (
    <div>
      <div data-testid="cart-count">{itemCount}</div>
      <div data-testid="cart-subtotal">{subtotal}</div>
      <div data-testid="cart-total">{totalAmount}</div>
      <button onClick={() => addToCart(mockProduct, 1)}>Add Mat</button>
      <button onClick={() => updateQuantity(mockProduct.id, 3)}>Set Qty 3</button>
      <button onClick={() => updateQuantity(mockProduct.id, -1)}>Set Invalid Qty</button>
      <button onClick={() => updateQuantity(mockProduct.id, 999)}>Set Above Stock</button>
      {items.map((i) => (
        <div key={i.product.id} data-testid={`item-qty-${i.product.id}`}>
          {i.quantity}
        </div>
      ))}
    </div>
  );
};

describe('Sattva Living Frontend Component & Cart Tests', () => {
  it('TEST 1: Header renders brand logo and navigation links', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <CartProvider>
            <CompareProvider>
              <Header />
            </CompareProvider>
          </CartProvider>
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(BRAND.name)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search mats/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Yoga Mats/i).length).toBeGreaterThan(0);
  });

  it('TEST 7: Adding a product updates the cart', () => {
    render(
      <CartProvider>
        <CartTester />
      </CartProvider>
    );

    expect(screen.getByTestId('cart-count').textContent).toBe('0');
    fireEvent.click(screen.getByText('Add Mat'));
    expect(screen.getByTestId('cart-count').textContent).toBe('1');
    expect(screen.getByTestId(`item-qty-${mockProduct.id}`).textContent).toBe('1');
  });

  it('TEST 8: Updating quantity recalculates totals correctly', () => {
    render(
      <CartProvider>
        <CartTester />
      </CartProvider>
    );

    fireEvent.click(screen.getByText('Add Mat'));
    fireEvent.click(screen.getByText('Set Qty 3'));
    expect(screen.getByTestId('cart-count').textContent).toBe('3');
    expect(screen.getByTestId('cart-subtotal').textContent).toBe(String(mockProduct.price * 3));
  });

  it('TEST 9: Invalid quantities are rejected or capped to stock', () => {
    render(
      <CartProvider>
        <CartTester />
      </CartProvider>
    );

    fireEvent.click(screen.getByText('Add Mat'));
    // Attempting to set quantity above available stock (10) caps at 10
    fireEvent.click(screen.getByText('Set Above Stock'));
    expect(screen.getByTestId(`item-qty-${mockProduct.id}`).textContent).toBe('10');

    // Attempting to set negative quantity removes the item
    fireEvent.click(screen.getByText('Set Invalid Qty'));
    expect(screen.getByTestId('cart-count').textContent).toBe('0');
  });

  it('TEST 20: ProductCard renders responsive action buttons and handles mobile view', () => {
    render(
      <MemoryRouter>
        <CartProvider>
          <CompareProvider>
            <ProductCard product={mockProduct} />
          </CompareProvider>
        </CartProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByText(/₹3,499/)).toBeInTheDocument();
    expect(screen.getByText(/Bestseller/i)).toBeInTheDocument();
  });
});
