# Sattva Living: AI-Powered Yoga & Wellness E-Commerce Platform

> **Working Name:** Sattva Living *(Configurable via `src/config/brand.ts` and `BRAND_NAME`)*  
> **Reference Inspiration:** [Isha Life Yoga Store](https://ishalife.sadhguru.org/in/yogastore)  
> **Submission Ready Date:** October 2026

[![Tests: Passing](https://img.shields.io/badge/Tests-18%20Passing-brightgreen.svg)]()
[![Stack: React_TypeScript_Node_PostgreSQL](https://img.shields.io/badge/Stack-React%20%7C%20Node%20%7C%20PostgreSQL-forest.svg)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)]()

---

## 1. Project Overview
**Sattva Living** is a full-stack, responsive e-commerce web platform inspired by the shopping experience of *Isha Life*. Built with an original visual identity, serene typography, and natural color harmonies (deep forest green, warm ivory, muted terracotta, and dark charcoal), Sattva Living offers authentic yoga mats, ergonomic meditation cushions, props, organic khadi apparel, and mindful lifestyle essentials.

The platform provides a complete customer shopping journey, an interactive multi-step **Smart Product Finder**, an AI-powered conversational **Shopping Assistant**, a **Yoga Kit Bundle Builder**, an **Administrator Management Console**, and real **Event-Driven Business Analytics**.

---

## 2. Business Problem
Consumers seeking authentic yoga, meditation, and conscious-living items in the digital marketplace confront three major hurdles:
1. **Discovery Paralysis & Material Ambiguity:** Customers do not know which mat density, thickness, or prop size fits their practice level, leading to high bounce rates.
2. **Purchasing Friction & Distrust:** Inaccurate stock numbers, hidden shipping fees, and misleading synthetic claims create high cart abandonment.
3. **Lack of Data-Driven Oversight:** Store operators often lack unified analytics connecting user browsing behaviors to actual inventory replenishment and conversion rates.

---

## 3. Proposed Solution
Sattva Living solves these problems by delivering:
- **Guided Discovery:** Intuitive "Shop by Purpose" paths, educational buying guides, and a 4-step **Smart Product Finder**.
- **Transparent & Frictionless Journey:** Real-time stock indicators ("In Stock", "Only 4 left", "Sold Out"), a free-delivery progress bar (orders over ₹1,999), and an authoritative transactional checkout.
- **AOV Growth via Bundles:** An interactive **Yoga Kit Builder** offering a dynamic 15% discount when practitioners assemble a Mat, Cork Block Pair, and Alignment Strap.
- **Event-Driven Analytics:** An internal tracking system monitoring browsing sessions, product views, cart adds, checkouts, and orders to compute authentic e-commerce metrics.

---

## 4. Main Features
- **Mindful Homepage:** Hero section (*"Find What Supports Your Practice"*), Value Propositions, Shop by Purpose, Shop by Category, Featured Items, Bestsellers, Kit Builder, and Buying Guides.
- **Product Catalogue:** Live database search, category filtering, budget price slider, stock availability toggle, sorting (Price, Newest, Popularity), active filter chips, and empty-state recovery.
- **Product Details:** Multi-image gallery with fallbacks, stock status badge, quantity selector, tabbed specifications (Materials, Dimensions, Practice Focus, Care), and verified customer feedback demonstration.
- **Smart Product Finder:** Multi-step wizard matching user focus, experience level, and budget against real database inventory.
- **Product Comparison:** Side-by-side comparison of up to 3 products across materials, dimensions, and practice focus.
- **Shopping Cart:** Slide-over cart drawer and dedicated full-page cart with live quantity adjustment and free delivery progress.
- **Transactional Checkout:** Input validation, simulated payment mode, and atomic database transaction decrements.
- **Order Confirmation & History:** Real order receipt generation with historical purchase price preservation and status tracking.
- **Customer Authentication:** Secure registration, bcrypt password hashing, JWT sessions, and order access isolation.
- **AI Shopping Assistant:** Server-side Google Gemini integration with real-time catalogue context injection and algorithmic fallback.
- **Administrator Dashboard:** Protected console featuring Overview KPIs, Product CRUD modal, Inventory adjustments, Order fulfillment status workflows, and Business Analytics charts.

---

## 5. Technology Stack

### Frontend:
- **React 18** with **TypeScript**
- **Vite** bundler
- **Tailwind CSS** (Custom brand palette: Forest Green, Ivory, Terracotta, Charcoal)
- **React Router v6**
- **Lucide React** icons

### Backend:
- **Node.js** & **Express** with **TypeScript**
- **RESTful API** architecture
- **Zod** request validation
- **Helmet** & **CORS** security headers
- **Express-Rate-Limit**
- **bcryptjs** (10-round salt password hashing)
- **jsonwebtoken (JWT)**

### Database:
- **PostgreSQL**
- **Prisma ORM** (Schema models, migrations, and seed script)

### Testing & QA:
- **Vitest** runner
- **React Testing Library** & **jsdom** (Frontend component & context tests)
- **Supertest** (Backend REST API integration tests)

---

## 6. Project Structure

```
ISHA/
├── package.json               # Root scripts (dev, build, test, setup)
├── docker-compose.yml         # Containerized PostgreSQL config
├── .gitignore                 # Standard exclusions (.env, node_modules, .pgdata)
├── .env.example               # Template environment configuration
├── docs/                      # Comprehensive technical & business documentation
│   ├── PRODUCT_REQUIREMENTS.md
│   ├── TEST_PLAN.md
│   ├── BUSINESS_GROWTH_PLAN.md
│   ├── PROJECT_ARCHITECTURE.md
│   └── KNOWN_LIMITATIONS.md
├── server/                    # Node.js + Express Backend
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env
│   ├── prisma/
│   │   ├── schema.prisma      # Prisma database models
│   │   └── seed.ts            # Database seed script (17 realistic products)
│   ├── src/
│   │   ├── app.ts             # Express application factory
│   │   ├── index.ts           # Server bootstrap
│   │   ├── config/            # Environment & brand configuration
│   │   ├── controllers/       # Auth, Product, Order, Analytics, AI, Admin
│   │   ├── middlewares/       # Error handling, Auth, Role, Zod validation
│   │   ├── routes/            # REST API route definitions
│   │   ├── services/          # Business logic (Order, Product, AI, Analytics)
│   │   └── utils/             # Prisma client singleton
│   └── tests/
│       └── api.test.ts        # Supertest automated API tests (13 tests)
└── client/                    # React + Vite Frontend
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── index.html
    ├── src/
    │   ├── main.tsx           # React entry point
    │   ├── App.tsx            # Main layout and route registry
    │   ├── index.css          # Design system, fonts, and scrollbars
    │   ├── config/brand.ts    # Brand name & INR currency formatting helpers
    │   ├── context/           # AuthContext, CartContext, CompareContext
    │   ├── components/        # Header, Footer, Cards, Finder, KitBuilder, Drawer
    │   ├── pages/             # Home, Catalogue, Details, Cart, Checkout, Admin...
    │   ├── services/          # API client and analytics tracker
    │   └── types/             # TypeScript interfaces
    └── src/test/
        ├── setup.ts           # Vitest DOM polyfills
        └── client.test.tsx    # RTL component tests (5 tests)
```

---

## 7. System Architecture
For an in-depth review of component relations, sequence diagrams, and database transaction lifecycles, refer to [docs/PROJECT_ARCHITECTURE.md](file:///d:/projects/ISHA/docs/PROJECT_ARCHITECTURE.md).

---

## 8. Database Overview
The database uses PostgreSQL with 6 primary normalized models:
1. `User`: Customer accounts and administrators (`id`, `name`, `email`, `passwordHash`, `role`).
2. `Category`: Product classifications (`id`, `name`, `slug`, `image`, `displayOrder`).
3. `Product`: Inventory records (`id`, `name`, `slug`, `price` [in paise], `stock`, `material`, `dimensions`, `careInstructions`, `isActive`).
4. `Order`: Transaction records (`id`, `orderNumber`, `subtotal`, `deliveryCharge`, `totalAmount`, `status`, `paymentMethod`).
5. `OrderItem`: Purchase-time historical line items preserving historical price.
6. `AnalyticsEvent`: Lightweight event stream (`eventType`, `sessionId`, `eventData`, `userId`, `createdAt`).

---

## 9. Installation Instructions

### Prerequisites:
- **Node.js:** v18+ (Tested on v24.16.0)
- **npm:** v9+ (Tested on v11.13.0)
- **PostgreSQL:** Local service running or Docker

### Clone and Install Dependencies:
```bash
# Clone the repository
git clone <repository_url>
cd ISHA

# Install dependencies across all workspaces
npm install --prefix server
npm install --prefix client
```

---

## 10. Environment Setup
Create the `.env` file in the `server` directory:
```bash
cp .env.example server/.env
```

Ensure the configuration matches your environment:
```env
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/sattva_db?schema=public
JWT_SECRET=sattva_living_jwt_secure_super_secret_key_2026_isha
JWT_EXPIRES_IN=7d
ADMIN_NAME="Sattva Store Administrator"
ADMIN_EMAIL=admin@sattvaliving.com
ADMIN_PASSWORD=Admin@Sattva2026!
GEMINI_API_KEY=
BRAND_NAME="Sattva Living"
DEFAULT_CURRENCY=INR
DEFAULT_CURRENCY_SYMBOL=₹
```

---

## 11. Database Migration Instructions
Push the Prisma schema to your PostgreSQL database:
```bash
cd server
npx prisma db push
```

---

## 12. Database Seeding Instructions
Seed the database with 17 realistic yoga/meditation products, admin user, demo customer, sample order, and baseline analytics:
```bash
cd server
npm run prisma:seed
```

---

## 13. Commands to Run Frontend and Backend

### Option A: Run Both Concurrently from Root
```bash
# From workspace root:
npm run dev
```

### Option B: Run in Separate Terminals
**Terminal 1 (Backend API):**
```bash
cd server
npm run dev
# Server starts on http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
cd client
npm run dev
# Vite dev server starts on http://localhost:5173
```

---

## 14. Test Commands
Execute the automated test suites:

### Run Backend API Tests (Vitest + Supertest):
```bash
cd server
npm test
# 13 tests passed
```

### Run Frontend Component Tests (Vitest + RTL):
```bash
cd client
npm test
# 5 tests passed
```

### Run Full-Stack Tests from Root:
```bash
npm run test --workspace=server
npm run test --workspace=client
```

---

## 15. Demo Checkout Explanation
For this academic demonstration, the checkout flow implements an **authenticated/guest simulated order-placement workflow**:
1. Add items to your cart from the Catalogue, Product Details, or Kit Builder.
2. Open the Cart Drawer or navigate to `/checkout`.
3. Provide your delivery address and contact phone number.
4. The system validates the fields and executes a database transaction (`prisma.$transaction`).
5. The backend re-queries product prices from PostgreSQL, calculates shipping charges, decrements inventory, and creates an order with a unique order number (e.g. `SL-2026-XXXX`).
6. You are automatically navigated to `/order-confirmation/:id`. No real payment card is charged or stored.

---

## 16. AI Integration Setup
The platform integrates an **AI Shopping Assistant** and **Smart Product Finder**:
- **With Gemini API:** Set `GEMINI_API_KEY` in `server/.env`. The backend uses Google's official `@google/generative-ai` SDK (`gemini-1.5-flash`) with live catalogue context injection.
- **Without Gemini API:** If `GEMINI_API_KEY` is omitted or empty, the platform automatically activates the built-in **Sattva Catalog Matching Engine**. This engine scores real catalogue products based on keywords, category, experience level, and budget limits.

---

## 17. Administrator Setup Instructions
The database seed script automatically creates an administrator account:
- **Email:** `admin@sattvaliving.com`
- **Password:** `Admin@Sattva2026!`

To access the Administrator Console:
1. Navigate to `http://localhost:5173/login`.
2. Click **"Fill Demo Admin"** or enter the credentials.
3. Access the portal at `http://localhost:5173/admin` or click **"Admin Portal"** in the user menu.
4. In the portal, inspect **Overview KPIs**, manage **Product Catalogue**, adjust **Inventory Levels**, review **Customer Orders**, and analyze **Business Analytics**.

---

## 18. Security Considerations
- **Password Hashing:** Passwords are encrypted using `bcryptjs` with 10 salt rounds. Plaintext passwords are never stored.
- **Authentication:** JWT tokens with cryptographic signature validation.
- **Endpoint Authorization:** Admin routes require both authentication and role verification (`user.role === 'ADMIN'`).
- **Data Isolation:** Customers can only inspect their own orders. Unauthorized requests return `403 Forbidden`.
- **Backend Price Calculation:** Client prices are disregarded; totals are computed using current database values.
- **Rate Limiting:** Auth endpoints (100 req/15 min) and AI endpoints (30 req/min) are throttled against brute-force attacks.
- **Security Headers:** Enforced via `helmet`.

---

## 19. Known Limitations
For comprehensive documentation of operational boundaries and simulated functionality, see [docs/KNOWN_LIMITATIONS.md](file:///d:/projects/ISHA/docs/KNOWN_LIMITATIONS.md).

---

## 20. GitHub Repository Preparation
Before committing to GitHub, verify that all sensitive files and local databases are ignored:
```bash
# Verify git status ignores .env, .pgdata, and node_modules
git status

# Add and commit source code
git add .
git commit -m "feat: complete Sattva Living AI-powered yoga & wellness platform"
```
The repository includes clean `.gitignore` and `.env.example` files. No real passwords, private keys, or credentials are committed.
