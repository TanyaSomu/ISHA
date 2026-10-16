# System Architecture & Technical Design

## Project: Sattva Living E-Commerce Platform

This document describes the high-level and detailed architecture of **Sattva Living**, covering the frontend client, backend REST services, database schema, security layer, AI recommendation engine, and analytics data pipeline.

---

## 1. High-Level System Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                                 CLIENT TIER                                       |
|  React 18 + TypeScript + Vite + Tailwind CSS + Lucide React + React Router v6    |
|                                                                                   |
|  [Header / Nav]    [Catalogue / Filters]   [Smart Finder]   [Kit Builder]         |
|  [Cart Drawer]     [Product Details]       [Admin Portal]   [AI Assistant Widget] |
|                                                                                   |
|        AuthContext          CartContext          CompareContext                   |
|             \                    |                    /                           |
|              +-------------------+-------------------+                            |
|                                  |                                                |
|                             api client                                            |
+----------------------------------|------------------------------------------------+
                                   | HTTP / REST (JSON)
                                   v
+-----------------------------------------------------------------------------------+
|                                 BACKEND TIER                                      |
|  Node.js + Express + TypeScript + Zod Validation + Helmet + Rate Limiters         |
|                                                                                   |
|  [Middleware]: CORS | Helmet | ErrorHandler | AuthJWT | RequireAdmin | Validation |
|                                                                                   |
|  [Controllers & Routes]:                                                          |
|    - /api/auth       -> Register, Login, Me                                       |
|    - /api/products   -> List, Search, Filter, Slug, Categories, Related           |
|    - /api/orders     -> Transactional Create, Customer History, Order Inspect     |
|    - /api/ai         -> Gemini AI Recommender + Rule-Based Catalog Matcher        |
|    - /api/analytics  -> Event Ingestion & Metric Aggregations                     |
|    - /api/admin      -> Overview KPIs, Product CRUD, Stock Adjust, Status Updates |
+----------------------------------|------------------------------------------------+
                                   | Prisma ORM
                                   v
+-----------------------------------------------------------------------------------+
|                                DATABASE TIER                                      |
|  PostgreSQL (Port 5433 / Port 5432)                                               |
|                                                                                   |
|  [User] <---(1:N)---> [Order] <---(1:N)---> [OrderItem] <---(N:1)---> [Product]  |
|    |                                                                      ^       |
|    +---------(1:N)---------> [AnalyticsEvent]                             |       |
|                                                                           |       |
|  [Category] <-----------------------------(1:N)---------------------------+       |
+-----------------------------------------------------------------------------------+
```

---

## 2. Frontend Architecture
- **Framework:** React 18 with TypeScript and Vite bundler for rapid HMR and optimized production bundles.
- **Styling:** Tailwind CSS with a curated natural color palette:
  - Deep Forest Green (`forest-700`: `#1b4332`, `forest-800`: `#143826`)
  - Warm Ivory (`ivory-50`: `#fdfcf9`, `ivory-100`: `#faf7f2`)
  - Muted Terracotta (`terracotta-500`: `#c86d51`, `terracotta-600`: `#b85d38`)
  - Dark Charcoal (`charcoal-800`: `#1f2429`)
- **Typography:** Refined serif headings (`Playfair Display`) paired with clean modern body typography (`Inter`).
- **State Management:** Native React Context API:
  - `AuthContext`: Manages user credentials, authentication token, login, registration, and role checks.
  - `CartContext`: Handles cart state, quantities, subtotal calculation, free shipping thresholds, and drawer visibility.
  - `CompareContext`: Manages up to 3 side-by-side compared products.
- **Responsive Layout:** Adaptive breakpoints covering mobile (375px/430px), tablet (768px), and desktop (1366px/1920px) displays with responsive product grids and slide-over navigation drawers.

---

## 3. Backend Architecture
- **Runtime:** Node.js with Express and TypeScript.
- **Security:**
  - `helmet`: Sets HTTP security headers (CSP, X-Frame-Options, HSTS).
  - `cors`: Restricts cross-origin requests to configured client origin.
  - `express-rate-limit`: Throttles sensitive authentication (100 req/15 min) and AI endpoints (30 req/min).
  - Body payload limit: Enforced at 1MB to prevent payload exhaustion attacks.
- **Validation:** Strict declarative request schema validation via `zod`. Invalid inputs yield standardized 400 responses with exact field paths.
- **Error Handling:** Centralized `errorHandler` middleware catching `AppError`, `ZodError`, and Prisma errors (`P2002`, `P2025`) without exposing raw database stack traces.

---

## 4. Database Architecture & Business Integrity Rules

The application uses PostgreSQL with Prisma ORM:

```prisma
// Core Entity Relational Structure
User (1) -------- (N) Order (1) -------- (N) OrderItem (N) -------- (1) Product
  |                                                                        |
  +--- (1:N) ---> AnalyticsEvent                                           |
                                                                           |
Category (1) -------------------------- (N) -------------------------------+
```

### Critical Business Rules Enforced in Database & Services:
1. **Integer Minor Currency Units:** Monetary values (`price`, `compareAtPrice`, `subtotal`, `deliveryCharge`, `totalAmount`) are stored as integers in **paise** (1 INR = 100 paise), guaranteeing zero IEEE-754 floating-point rounding errors.
2. **Authoritative Backend Pricing:** Order totals are calculated entirely on the backend by querying the latest product prices from the database inside `OrderService.createOrder`. Any price sent from the frontend is discarded.
3. **Atomic Inventory Decrement:** Orders are processed inside `prisma.$transaction`. Stock availability is checked and decremented atomically, preventing race conditions or overselling.
4. **Historical Price Preservation:** `OrderItem` preserves `unitPrice` and `subtotal` at time of purchase, insulating historical financial records from future catalog price edits.
5. **Authorization Isolation:** Customer order endpoints verify that the requesting authenticated user owns the requested order ID. Unauthorized access attempts return `403 Forbidden`.
6. **Discontinued Product Protection:** Inactive products (`isActive: false`) are excluded from customer searches and rejected during checkout.

---

## 5. AI Integration & Recommendation Engine

```
                                [Customer Request]
                                        |
                                        v
                            [POST /api/ai/recommend]
                                        |
                       +----------------+----------------+
                       |                                 |
              [GEMINI_API_KEY Present?]                  |
                 /                   \                   |
               YES                    NO                 |
               /                       \                 |
              v                         v                v
     [Google Gemini API]        [Rule-Based Matcher]  [Validate IDs]
   (gemini-1.5-flash model)     (Keyword & Attribute) (Against DB)
              \                         /                |
               +-----------------------+                 v
                                        \-----> [Return Verified Items]
```

1. **Live Context Injection:** The backend fetches active, in-stock products from PostgreSQL and feeds their verified attributes (IDs, name, category, price in INR, material, intended practice) into the prompt context.
2. **Strict Verification:** Product IDs returned by the AI are checked against the database. Any non-existent ID is discarded, eliminating hallucinations.
3. **Seamless Algorithmic Fallback:** If `GEMINI_API_KEY` is not configured, the service routes the query through `fallbackCatalogMatcher`, scoring real catalogue items based on keyword matching, category alignment, experience level, and budget limits.

---

## 6. Lightweight Event-Driven Analytics Flow

```
[User Action] (View Page / Search / Add to Cart / Checkout / Order)
      |
      v
[api.trackEvent] (Client-side, non-blocking)
      |
      v
[POST /api/analytics/track]
      |
      v
[AnalyticsEvent Table in PostgreSQL] (eventType, sessionId, eventData, userId, createdAt)
      |
      v (Admin Requests Analytics)
[AnalyticsService.getDashboardMetrics]
      |
      v
Calculates: Conversion Rate (%), AOV (₹), Add-To-Cart Rate (%), Most Viewed, Top Purchased
```
- **Privacy First:** Only anonymous session IDs and event metadata are stored. No invasive third-party trackers or cross-site cookies are utilized.
