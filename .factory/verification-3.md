# Independent verification 3 — FAIL

**Candidate commit:** `b6f9f987f6c34d969873510099c7316c86c1c00e`
**Live URL:** <https://how-it-runs.sociobot.in>
**Verified:** 2026-08-27 UTC
**Scope:** clean checkout; exact production build; live identity; desktop and 390 px mobile; representative, boundary, malformed, recovery, keyboard, accessibility, privacy, PWA, response-policy, caching, and budget checks.

## Verdict

**FAIL.** The live deployment is byte-identical to the candidate's runtime artifact and all core simulator, privacy, PWA, build, browser, axe, and performance checks passed. However, visible mobile links do not meet the work order's non-negotiable **44 × 44 CSS px touch-target** baseline. This is a P2 accessibility release blocker for a touch-friendly child-facing product.

No product code was modified during verification.

## Evidence

| Check | Result | Evidence |
| --- | --- | --- |
| Clean candidate | Pass | Worktree began clean at exactly `b6f9f987f6c34d969873510099c7316c86c1c00e`. |
| Install / tests | Pass | `npm ci`: 71 packages added, 0 vulnerabilities. `npm test`: Vitest 7/7 tests passed. |
| Type check / exact build | Pass | `npm run build` ran `tsc --noEmit && vite build`, writing `dist/`. No lint script/configuration exists; type checking is part of the build. |
| Bundle and image budgets | Pass | Entry JS: 19,809 B raw / 7,479 B gzip; CSS: 20,021 B raw / 5,449 B gzip (under 200 KB / 50 KB). Mobile hero: 58,514 B WebP and 34,397 B AVIF (under 300 KB). |
| Repository browser gate | Pass | `npm run preview -- --port 4173`, then `timeout 120s npm run verify:browser -- http://127.0.0.1:4173` passed: all targets/faults, mobile overflow, keyboard Watch Enter→Space, skip focus, URL recovery, axe, offline reload/module MIME, cache policies, and no console errors. |
| Live browser / PWA gate | Pass | `timeout 120s npm run verify:browser -- https://how-it-runs.sociobot.in` passed with the same assertions, including worker control, offline reload, JavaScript module response offline, and worker update lifecycle contract (`skipWaiting`, `clients.claim`, old-cache deletion). |
| Live identity | Pass | SHA-256 matched local build against live `/`, both hashed assets, `sw.js`, legal CSS, Privacy, Terms, favicon, all four hero assets, robots, and sitemap. `staticwebapp.config.json` is intentionally not a public deployment artifact (its public URL did not match the source config); it does not affect the runtime identity comparison. |
| Core user journeys | Pass | Independently exercised water `65,65,60`, grid `70,40,30`, bakery `60,70,60`: each showed **System steady**, unlocked and activated its fault, then recovered with reachable slider values water `80,65,65`, grid `75,70,55`, bakery `70,80,75`. Watch mode displayed caption 1 and paused cleanly. Closing a route cleared its query state. |
| Boundary, invalid input, recovery | Pass | `grid=-999,999,5` became `20,100,5` and rewrote the URL; malformed water settings reset to `45,75,35`; unknown-system recovery normalizes to departures. ArrowRight changed water settling 65→70 and wrote the share URL. |
| Desktop / mobile / motion | Pass | No horizontal document overflow at 1440×1000 or 390×844. At 390 px, simulator content scrolls horizontally only within the labelled flow region. Under `prefers-reduced-motion: reduce`, flow animation duration computed as `1e-05s`; normal desktop duration is 1.3 s. |
| Keyboard / focus | Pass | Skip link is first tab stop and transfers focus to `main`; range controls operate with arrows; Watch retains focus across Enter→Space pause; visible focus uses a 3 px marigold outline. |
| Axe / semantics | Pass | Axe returned 0 violations (therefore 0 serious/critical) on home, Privacy, Terms, desktop water simulator, and reduced-motion 390 px bakery simulator. Browser gate also passed. |
| Errors | Pass | No `console.error` or `pageerror` across normal, invalid, recovery, watch, fault, and legal-page exercise. |
| Privacy / outbound requests | Pass | Runtime request capture (service workers blocked) observed only `https://how-it-runs.sociobot.in`. Cookie string empty; localStorage and sessionStorage counts 0. Static inspection found no analytics, advertising, CDN fonts/scripts, account, or backend calls; share state is URL-only. |
| Live headers / caching | Pass | HTTPS has HSTS, `default-src 'self'` CSP with `frame-ancestors 'none'`, `object-src 'none'`, nosniff, strict-origin referrer policy, and camera/mic/geolocation disabled. HTML/legal pages revalidate; hashed JS/CSS are `public, max-age=31536000, immutable`; `sw.js` is `no-cache, no-store, must-revalidate`. |
| Lighthouse, local mobile simulation | Advisory pass | Lighthouse produced 100 Performance / 100 Accessibility / 100 Best Practices / 100 SEO; FCP 1.2 s, LCP 1.2 s, TBT 0 ms, CLS 0, interactive 1.2 s. Lighthouse then emitted its known Chromium “Browser tab has unexpectedly crashed” message during its final pass, so scores are advisory rather than a clean process completion. |

## Defects

### P2 — visible mobile links are below the required 44 px touch target

**Affected:** <https://how-it-runs.sociobot.in> at 390 × 844, and the same local production build.

The attached accessibility contract sets **touch targets ≥44 px**. Direct browser `getBoundingClientRect()` measurements at the required mobile viewport found these visible links:

| Control | Measured size |
| --- | --- |
| Header brand (“How It Runs”) | 179 × 38 px |
| Header “Pick a system” | 93 × 22 px |
| Footer “Privacy” | 43 × 15 px |
| Footer “Terms” | 35 × 15 px |

The primary simulator controls, route buttons, sliders, summaries, and fault action are at least 44 px high. The undersized navigation and legal controls are nevertheless reachable touch targets and fall short of the product contract. Add a 44 px target box/padding (while retaining spacing between adjacent controls), then rerun mobile target measurement and the browser gate.

## Scope notes

- This is a static web app: no library/CLI consumer package, backend concurrency/persistence, payments, or account flow is in scope.
- The candidate otherwise provides the brief-required three original system simulations, simplified-model disclosure, job context, target/fault loop, passive watch mode, URL sharing, original-art provenance, Privacy/Terms pages, and local-first/no-tracking behavior.
- Prior verification files concern earlier candidates. This file is the independent result for `b6f9f987f6c34d969873510099c7316c86c1c00e`.
