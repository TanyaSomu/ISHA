# Product Requirements Document (PRD)

## Project Title
**AI-POWERED YOGA & WELLNESS E-COMMERCE PLATFORM**
**Brand Name:** Sattva Living (working name; easily configurable)

---

## 1. Product Overview & Goals
Sattva Living is a full-stack, responsive e-commerce web platform inspired by the conscious living, yoga, and meditation shopping experience of *Isha Life* (https://ishalife.sadhguru.org/in/yogastore).

### Primary Business Objectives:
1. **Improve Product Discovery:** Enable practitioners to quickly discover appropriate yoga mats, meditation cushions, props, apparel, and lifestyle items suited to their specific practice level and physiological needs.
2. **Improve Conversion Opportunities:** Deliver transparent product specifications, genuine materials disclosure, accurate stock availability, and a low-friction cart and simulated checkout journey.
3. **Support Business Growth:** Provide an integrated lightweight event-driven analytics pipeline tracking visitor sessions, cart adds, checkouts, and completed orders to derive real business metrics (Conversion Rate, Average Order Value, and Top Products).

---

## 2. Target Users & Personas

### Persona A: The Beginner Practitioner (e.g. Maya)
- **Goal:** Seeks comfortable, non-intimidating yoga gear with proper cushioning and alignment cues.
- **Pain Point:** Confused by material terms (TPE vs PVC vs Natural Rubber vs Jute) and unsure what props to buy.
- **Feature Needs:** Interactive Smart Product Finder ("Find Your Perfect Product"), educational buying guides, and bundled kits.

### Persona B: The Daily Sadhana Practitioner (e.g. Aarav)
- **Goal:** Seeks durable, natural, high-traction materials (unbleached organic cotton, dense cork, natural tree rubber) and sacred meditation accessories (zafus, kansa diyas).
- **Pain Point:** Toxic petroleum odors, slippery synthetic mats, and lack of genuine artisan transparency.
- **Feature Needs:** Detailed material & care specifications, instant stock visibility, and side-by-side product comparison.

### Persona C: The E-Commerce Store Manager / Administrator (e.g. Admin)
- **Goal:** Monitor real-time orders, manage catalog inventory, prevent overselling, and analyze conversion funnels.
- **Pain Point:** Lack of unified oversight, inaccurate manual spreadsheets, and unverified AI claims.
- **Feature Needs:** Protected Admin Console, inventory quick-adjustments, order status workflows, and event-based analytics.

---

## 3. User Stories & Acceptance Criteria

### US-1: Catalog Browsing & Filtering
- **User Story:** As a customer, I want to filter products by category, price, and stock status, and sort by price or popularity, so that I find relevant items quickly.
- **Acceptance Criteria:**
  - Filtering by category loads only products belonging to that category slug.
  - Price filter restricts results to maximum budget in INR.
  - In-stock toggle excludes items with zero stock.
  - Active filter tags can be removed individually or cleared with "Clear all filters".
  - Empty search produces a helpful recovery message with a reset button.

### US-2: Product Details & Specifications
- **User Story:** As a customer, I want to inspect product images, materials, dimensions, and care instructions before adding items to my cart.
- **Acceptance Criteria:**
  - Multiple image thumbnails with full-size gallery preview.
  - Real-time stock status badge (Healthy, Low Stock ≤ 5, or Sold Out).
  - Quantity selector validated against current database inventory.
  - Add to Cart disabled when stock is zero.
  - Clear academic disclaimer for demonstration customer feedback.

### US-3: Smart Product Finder ("Find Your Perfect Product")
- **User Story:** As a customer, I want guidance on which mat or prop fits my practice, budget, and experience level.
- **Acceptance Criteria:**
  - 4-step guided questionnaire (Practice Focus, Experience Level, Material Attributes, Budget).
  - Connects to Google Gemini API when `GEMINI_API_KEY` is present; seamlessly falls back to the rule-based catalog matcher when absent.
  - Recommendations cite verified database products with real prices and "Why recommended" rationales.
  - Direct "Add to Cart" and "Details" buttons on recommended cards.

### US-4: Yoga Kit Bundle Customizer
- **User Story:** As a customer, I want to build a complete yoga kit (Mat + Blocks + Strap) and see bundle savings.
- **Acceptance Criteria:**
  - Interactive selection of mat, cork blocks, and alignment strap.
  - Dynamic 15% bundle discount calculation.
  - Single-click "Add Complete Kit to Cart" button adding all three items simultaneously.

### US-5: Shopping Cart & Price Integrity
- **User Story:** As a customer, I want to manage line items, update quantities, and see shipping thresholds.
- **Acceptance Criteria:**
  - Slide-over cart drawer and full `/cart` page.
  - Quantity updates cannot exceed available stock.
  - Subtotal, delivery charges (Free over ₹1,999, else ₹150), and total amounts calculated accurately.
  - Backend re-calculates all prices against PostgreSQL during checkout; frontend prices are never trusted.

### US-6: Transactional Checkout & Order Creation
- **User Story:** As a customer, I want to place a demo order with my shipping information.
- **Acceptance Criteria:**
  - Form validation for full name, email, phone, street address, city, state, and postal code.
  - Clear simulated payment notice (no real card details requested or stored).
  - Database transaction validates stock, atomically decrements inventory, and creates `Order` + `OrderItem` records.
  - Generates unique order number (e.g. `SL-2026-XXXX`).
  - Navigates to Order Confirmation page with order summary.

### US-7: Customer Authentication & Order History
- **User Story:** As a customer, I want to create an account, log in securely, and view my past orders.
- **Acceptance Criteria:**
  - Secure bcrypt password hashing.
  - JWT token stored securely and sent in Authorization header.
  - Customers can only view their own order history; unauthorized order IDs return 403 Forbidden.

### US-8: Administrator Store Management
- **User Story:** As an administrator, I want to manage products, adjust inventory, update order statuses, and view business analytics.
- **Acceptance Criteria:**
  - Administrative routes protected by `authenticateJWT` and `requireAdmin` role check.
  - Non-admin users cannot access admin endpoints.
  - Products can be created, edited, and discontinued.
  - Inline inventory adjustment (`-5`, `+5`, `+20 Restock`).
  - Permitted order status transitions (`PENDING`, `CONFIRMED`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`).
  - Real analytics calculated from `AnalyticsEvent` and `Order` tables.

---

## 4. Scope Limitations
1. **Simulated Payment Gateway:** No live Razorpay/Stripe keys are required for this academic demonstration; simulated payment creates verified transactional database orders safely.
2. **Real Courier Tracking API:** Order statuses are updated via the Administrator Console rather than live webhook integrations with external logistics providers.
3. **No Cross-Device Cookie Tracking:** Analytics rely on local anonymous session identifiers to respect user privacy and avoid invasive tracking scripts.
