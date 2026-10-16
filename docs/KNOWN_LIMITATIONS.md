# Known Limitations & Operating Boundaries

## Project: Sattva Living E-Commerce Platform

This document transparently records the deliberate operating boundaries, simulated modules, external dependency requirements, and technical trade-offs in the Sattva Living application.

---

## 1. Simulated Functionality

### A. Simulated Payment Processing
- **Implementation:** The checkout flow validates the shipping address, verifies inventory, and decrements stock inside a database transaction, but marks payment as `SIMULATED_PAID` (`paymentMethod: "SIMULATED_CHECKOUT"`).
- **Rationale:** Prevents storing sensitive PCI-DSS cardholder data or requiring paid third-party payment gateway credentials for academic demonstration.
- **Production Roadmap:** To activate real payments, integrate Razorpay or Stripe webhooks into `server/src/controllers/order.controller.ts`.

### B. Courier & Shipment Tracking
- **Implementation:** Order fulfillment transitions (`CONFIRMED`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`) are managed directly via the Administrator Portal.
- **Rationale:** Real courier APIs (e.g. Shiprocket, Delhivery) require live merchant accounts and physical pick-up manifests.
- **Production Roadmap:** Implement courier webhook listeners to ingest real AWB tracking numbers.

---

## 2. External Configuration Requirements

### A. Google Gemini AI API Key (`GEMINI_API_KEY`)
- **Requirement:** Access to real-time generative responses requires setting a valid `GEMINI_API_KEY` in `server/.env`.
- **Fallback Behavior:** If this variable is empty or absent, the platform automatically engages the built-in **Sattva Catalog Matching Engine**. This engine scores verified database records based on keywords, category, experience level, and budget. The UI transparently indicates which engine generated the result (`gemini_ai` vs `catalog_rule_engine`).

---

## 3. Analytics & Tracking Limitations

### A. Session Persistence Across Devices
- **Limitation:** Anonymous session IDs are stored in the client's `localStorage`. If a user browses in Incognito mode or clears browser data, their session ID will regenerate on the next visit.
- **Cross-Device Tracking:** An anonymous user browsing on mobile and subsequently purchasing on desktop will count as two separate visitor sessions. This is an intentional privacy-preserving trade-off.

---

## 4. Concurrency & Performance Limits

### A. Single Server Instance & PostgreSQL Locking
- **Limitation:** The backend handles concurrent purchases using row-level Prisma database transactions. Under extremely high enterprise workloads (>1,000 transactions/second on the exact same product SKU), row locks on the product table may cause transient contention.
- **Production Roadmap:** Implement a Redis-backed distributed inventory queue for massive flash-sale scenarios.
