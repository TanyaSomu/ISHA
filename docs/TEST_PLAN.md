# Quality Assurance & Test Plan

## Project: Sattva Living E-Commerce Platform

This document details the automated and exploratory testing strategy, covering the **20 mandatory scenarios** defined in the project specification.

---

## 1. Automated Test Suites Summary

The project utilizes two specialized automated test runners:
1. **Backend Integration & Unit Tests:** `Vitest` with `Supertest` executing against the live PostgreSQL database (`server/tests/api.test.ts`).
2. **Frontend Component & State Tests:** `Vitest` with `React Testing Library` and `jsdom` (`client/src/test/client.test.tsx`).
3. **End-to-End Browser Automation:** `browser_subagent` recording complete user and administrator flows.

### Overall Automated Execution Results
- **Backend Test File:** `server/tests/api.test.ts` — **13 of 13 tests passed (100%)**
- **Frontend Test File:** `client/src/test/client.test.tsx` — **5 of 5 tests passed (100%)**
- **End-to-End Walkthrough:** Complete customer and admin journey verified with video recording.

---

## 2. Verification Matrix (20 Mandatory Scenarios)

| Scenario ID | Test Description | Testing Layer | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **TEST 1** | Homepage loads successfully | Frontend RTL / E2E | Brand logo, header, announcement bar, hero, and value props render | Rendered with 200 OK | **PASS** |
| **TEST 2** | Product catalogue displays products from database | API Supertest / E2E | Returns category and active product records with pagination | Retrieved 16+ products from PostgreSQL | **PASS** |
| **TEST 3** | Searching for an existing product returns relevant results | API Supertest / E2E | Searching "rubber" or "cork" returns matching product records | Returns relevant matching items | **PASS** |
| **TEST 4** | Searching for an unknown product produces a useful empty state | API Supertest / Client | Searching unknown query returns empty array; UI shows recovery reset button | Empty state displayed with reset CTA | **PASS** |
| **TEST 5** | Category filtering returns appropriate products | API Supertest | Filter `category=yoga-mats` returns exclusively yoga mats | All returned products have matching category slug | **PASS** |
| **TEST 6** | Price sorting produces correct order | API Supertest | `sortBy=price_asc` sorts products from lowest to highest | Strictly non-decreasing prices returned | **PASS** |
| **TEST 7** | Adding a product updates the cart | Client RTL / Context | Clicking Add to Cart increments cart item count and adds line item | Item count incremented to 1 | **PASS** |
| **TEST 8** | Updating quantity recalculates total correctly | Client RTL / Context | Changing quantity to 3 recalculates subtotal and line items | Subtotal = unitPrice * 3 | **PASS** |
| **TEST 9** | Invalid quantities are rejected | API & Client RTL | Zero, negative, or excess-stock quantities are rejected or capped | Rejected by Zod and capped in CartContext | **PASS** |
| **TEST 10** | An out-of-stock product cannot be purchased | API Supertest | Checkout endpoint rejects order if product stock is 0 | Returns 400 Bad Request with clear error message | **PASS** |
| **TEST 11** | Backend rejects manipulated product prices | API Supertest / Transaction | Backend calculates totals using current database prices; client price ignored | Total amount computed authoritatively in DB transaction | **PASS** |
| **TEST 12** | Invalid checkout details are rejected | API Supertest | Missing required fields, invalid email, or invalid phone return 400 | Returns 400 with field-level validation errors | **PASS** |
| **TEST 13** | A valid demo order is created successfully | API Supertest | Valid checkout creates order in PostgreSQL with SL-2026 order number | 201 Created with order number and items | **PASS** |
| **TEST 14** | Order confirmation appears only after successful creation | Frontend E2E / React | `/order-confirmation/:id` fetches real order record; shows error for invalid ID | Confirmation renders order summary with receipt | **PASS** |
| **TEST 15** | Administrator can add or update a product | API Supertest | Protected admin endpoint creates or edits product in database | Product updated and persisted in DB | **PASS** |
| **TEST 16** | Inventory update is reflected in customer catalogue | API Supertest / E2E | Updating stock via admin patch immediately changes public slug lookup | Stock update visible in public catalogue API | **PASS** |
| **TEST 17** | Ordinary customer cannot access administrator endpoints | API Supertest | Non-admin token accessing `/api/admin/*` returns 403 Forbidden | 403 Forbidden received | **PASS** |
| **TEST 18** | Customers cannot access other customers' orders | API Supertest | Customer A cannot view Customer B's order ID | 403 Forbidden received | **PASS** |
| **TEST 19** | Product finder returns valid product records | API Supertest / E2E | Recommendation engine returns existing DB products with valid prices & IDs | All recommended products verified against live DB | **PASS** |
| **TEST 20** | Shopping experience remains usable on mobile screens | Client RTL / E2E | Hamburger navigation, responsive grid, mobile cart drawer, and sticky controls work | Verified on mobile viewports (375px/430px) | **PASS** |

---

## 3. Resilience & Edge Cases Tested

1. **Repeated / Concurrent Order Submissions:** Orders are processed inside `prisma.$transaction`. Multiple requests validate remaining stock atomically, eliminating race conditions and overselling.
2. **Missing Gemini API Key:** The system detects whether `GEMINI_API_KEY` is present. When absent, it seamlessly delegates to the algorithmic catalog matching engine without breaking the UI.
3. **Broken Product Images:** Handled by `<ProductImage />` component with a high-resolution inline SVG fallback, preventing broken image icons or unfinished layout gaps.
4. **Discontinued Products:** Setting `isActive: false` excludes the item from the public catalog and blocks checkout if previously in cart.
5. **Unauthorized URL Tampering:** Admin routes on the backend check JWT payload role against database record. Ordinary customers altering the frontend URL to `/admin` are intercepted by React Router route guards and backend 403 authorization middleware.

---

## 4. Known Defects & Resolutions
- **No blocking defects remain.** All 18 automated tests pass, and TypeScript builds compile without warnings.
