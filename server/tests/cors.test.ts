import { describe, it, expect } from 'vitest';
import { isOriginAllowed, createApp } from '../src/app.js';
import cors from 'cors';

describe('CORS Security Configuration Test Suite', () => {
  const prodSite = 'https://isha-eosin-alpha.vercel.app';
  const evilSite = 'https://evil-attacker.com';
  const unrelatedVercel = 'https://unrelated-phishing.vercel.app';
  const arbitraryVercel = 'https://malicious-app.vercel.app';
  const localhost5173 = 'http://localhost:5173';
  const localhostIp = 'http://127.0.0.1:5173';

  // Requirement a: Production website is allowed
  it('a. Production website is allowed in both production and development', () => {
    expect(isOriginAllowed(prodSite, 'production', prodSite)).toBe(true);
    expect(isOriginAllowed(prodSite, 'development', localhost5173)).toBe(true);
  });

  // Requirement b: Unrelated external domain is rejected
  it('b. Unrelated external domain is rejected in production and development', () => {
    expect(isOriginAllowed(evilSite, 'production', prodSite)).toBe(false);
    expect(isOriginAllowed(evilSite, 'development', localhost5173)).toBe(false);
    expect(isOriginAllowed('https://random-site.org', 'production', prodSite)).toBe(false);
  });

  // Requirement c: Unrelated Vercel domain is rejected
  it('c. Unrelated Vercel domain is rejected (broad *.vercel.app matching removed)', () => {
    expect(isOriginAllowed(unrelatedVercel, 'production', prodSite)).toBe(false);
    expect(isOriginAllowed(arbitraryVercel, 'production', prodSite)).toBe(false);
    expect(isOriginAllowed(unrelatedVercel, 'development', localhost5173)).toBe(false);
    expect(isOriginAllowed('https://another-user.vercel.app', 'production', prodSite)).toBe(false);
  });

  // Requirement d: Localhost is allowed in development
  it('d. Localhost origins are allowed outside production (development/test)', () => {
    expect(isOriginAllowed(localhost5173, 'development', localhost5173)).toBe(true);
    expect(isOriginAllowed(localhostIp, 'development', localhost5173)).toBe(true);
    expect(isOriginAllowed(localhost5173, 'test', localhost5173)).toBe(true);
  });

  // Requirement e: Localhost is rejected in production
  it('e. Localhost origins are strictly rejected in production', () => {
    expect(isOriginAllowed(localhost5173, 'production', prodSite)).toBe(false);
    expect(isOriginAllowed(localhostIp, 'production', prodSite)).toBe(false);
  });

  // Requirement f: Requests without Origin are handled correctly
  it('f. Requests without an Origin header (server-to-server, curl) are allowed', () => {
    expect(isOriginAllowed(undefined, 'production', prodSite)).toBe(true);
    expect(isOriginAllowed(undefined, 'development', localhost5173)).toBe(true);
    expect(isOriginAllowed('', 'production', prodSite)).toBe(true);
    expect(isOriginAllowed('   ', 'production', prodSite)).toBe(true);
  });

  // Integration: verify Express cors middleware with simulated requests
  it('Middleware Integration: handles allowed, rejected, and missing origins appropriately', () => {
    const corsMiddleware = cors({
      origin: (origin, callback) => {
        if (isOriginAllowed(origin, 'production', prodSite)) {
          callback(null, true);
        } else {
          callback(null, false);
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });

    const runMiddleware = (headers: Record<string, string>) => {
      const resHeaders: Record<string, string> = {};
      const req = { method: 'GET', headers };
      const res = {
        setHeader: (k: string, v: string) => { resHeaders[k.toLowerCase()] = v; },
        getHeader: (k: string) => resHeaders[k.toLowerCase()],
      };
      let nextCalled = false;
      let errorThrown: any = null;
      (corsMiddleware as any)(req, res, (err: any) => {
        nextCalled = true;
        errorThrown = err;
      });
      return { resHeaders, nextCalled, errorThrown };
    };

    // 1. Prod site: gets Access-Control-Allow-Origin and Credentials
    const prodResult = runMiddleware({ origin: prodSite });
    expect(prodResult.nextCalled).toBe(true);
    expect(prodResult.resHeaders['access-control-allow-origin']).toBe(prodSite);
    expect(prodResult.resHeaders['access-control-allow-credentials']).toBe('true');

    // 2. Evil site: does NOT get Access-Control-Allow-Origin
    const evilResult = runMiddleware({ origin: evilSite });
    expect(evilResult.nextCalled).toBe(true);
    expect(evilResult.resHeaders['access-control-allow-origin']).toBeUndefined();

    // 3. Unrelated Vercel site: does NOT get Access-Control-Allow-Origin
    const vercelResult = runMiddleware({ origin: unrelatedVercel });
    expect(vercelResult.nextCalled).toBe(true);
    expect(vercelResult.resHeaders['access-control-allow-origin']).toBeUndefined();

    // 4. Localhost in production: does NOT get Access-Control-Allow-Origin
    const localResult = runMiddleware({ origin: localhost5173 });
    expect(localResult.nextCalled).toBe(true);
    expect(localResult.resHeaders['access-control-allow-origin']).toBeUndefined();

    // 5. No origin (curl / server-to-server): allowed, no CORS headers set
    const noOriginResult = runMiddleware({});
    expect(noOriginResult.nextCalled).toBe(true);
    expect(noOriginResult.resHeaders['access-control-allow-origin']).toBeUndefined();
  });
});
