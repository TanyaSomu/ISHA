import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.js';
import { CartProvider } from './context/CartContext.js';
import { CompareProvider } from './context/CompareContext.js';
import { Header } from './components/common/Header.js';
import { Footer } from './components/common/Footer.js';
import { CartDrawer } from './components/common/CartDrawer.js';
import { AIAssistantWidget } from './components/ai/AIAssistantWidget.js';

// Pages
import { HomePage } from './pages/HomePage.js';
import { CataloguePage } from './pages/CataloguePage.js';
import { ProductDetailsPage } from './pages/ProductDetailsPage.js';
import { ProductFinderPage } from './pages/ProductFinderPage.js';
import { ProductComparisonPage } from './pages/ProductComparisonPage.js';
import { CartPage } from './pages/CartPage.js';
import { CheckoutPage } from './pages/CheckoutPage.js';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage.js';
import { OrdersHistoryPage } from './pages/OrdersHistoryPage.js';
import { LoginPage } from './pages/LoginPage.js';
import { RegisterPage } from './pages/RegisterPage.js';
import { AdminDashboardPage } from './pages/AdminDashboardPage.js';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <CompareProvider>
            <div className="min-h-screen flex flex-col bg-ivory-50 text-charcoal-800">
              {/* Sticky Mindful Navigation Header */}
              <Header />

              {/* Main Page Content */}
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/catalogue" element={<CataloguePage />} />
                  <Route path="/products/:slug" element={<ProductDetailsPage />} />
                  <Route path="/product-finder" element={<ProductFinderPage />} />
                  <Route path="/compare" element={<ProductComparisonPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/order-confirmation/:id" element={<OrderConfirmationPage />} />
                  <Route path="/account/orders" element={<OrdersHistoryPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/admin" element={<AdminDashboardPage />} />
                  <Route path="/kit-builder" element={<Navigate to="/#kit-builder" replace />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>

              {/* Slide-over Mindful Cart Drawer */}
              <CartDrawer />

              {/* Floating AI Shopping Assistant Widget */}
              <AIAssistantWidget />

              {/* Mindful Living Footer */}
              <Footer />
            </div>
          </CompareProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};
export default App;
