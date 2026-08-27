# Independent verification — FAIL

**Candidate:** `95357f6d2aba56356d78a524a24fc550f0201ee7`  
**Live URL:** <https://how-it-runs.sociobot.in>  
**Verified:** 2026-08-27 UTC  
**Scope:** clean checkout, production build, live deployment, desktop and 390 px mobile browser exercise, privacy/security, PWA, accessibility, performance.

## Verdict

**FAIL.** The live deployment matches the candidate and the central simulations work, but the candidate does not meet the factory accessibility and local quality-gate requirements described below. No product source was changed during this verification.

## Reproducible evidence

| Check | Result | Evidence |
| --- | --- | --- |
| Clean install | Pass | `npm ci`: 72 packages audited, 0 vulnerabilities. |
| Unit tests | Pass | `npm test`: 1 file, 7/7 tests passed. |
| Type check / exact production build | Pass | `npm run build` (`tsc --noEmit && vite build`) completed and produced `dist/`. |
| Lint | Not available | `package.json` contains no lint script or linter configuration. |
| Bundle budget | Pass | Built JS: 19,056 B raw / 7,240 B gzip; CSS: 20,021 B raw / 5,440 B gzip. Both are below the 200 KB JS / 50 KB CSS budgets. |
| Simulator end-to-end | Pass | At 390 px, water `65,65,60`, grid `70,40,30`, and bakery `60,70,60` each displayed “System steady” and enabled the corresponding fault. Arrow-key control changed water settling from 65% to 70% and updated the URL. |
| Boundary / malformed / recovery inputs | Pass with minor issue | `grid=-999,999,5` clamped to 20%, 100%, 5%; malformed water settings reset to 45%, 75%, 35%; unknown system shows the recovery message and departure state. The invalid query remains in the address bar (P3). |
| Desktop and 390 px | Pass | No horizontal overflow at 1440 px or 390 px. |
| Reduced motion | Pass | At `prefers-reduced-motion: reduce`, flow animation duration computed as `0.00001s`. |
| Axe | Pass | Playwright axe scan of the selected water simulator: 0 violations, including 0 serious/critical. |
| Console / page errors | Pass for normal live/local use | No errors while navigating the home page, all three routes, Privacy, or Terms with service workers blocked for request inspection. |
| Browser verifier | **Fail** | `timeout 25s npm run verify:browser -- http://127.0.0.1:4173` exited `124`. It stalls in its offline step, then waits for “Clean water works”; the Vite preview worker serves cached `/` HTML as the module response for a cache miss (`Expected a JavaScript-or-Wasm module script ... MIME type text/html`). This is the command documented in the README and prior handoff. |
| Live/candidate identity | Pass | SHA-256 matches for `/`, JS, CSS, `sw.js`, Privacy, Terms, and hero asset. Example JS SHA-256: `872bc7e19ee7db743c9c5a88b4c2c5d77c7aecc7c0b0b4f6c874713192a22bf0`. |
| Privacy / outbound requests | Pass | Static inspection and Playwright request capture found only same-origin application requests; no analytics, cookies, local/session storage, third-party scripts/fonts, or external network calls. State is in the URL. |
| Live security headers | Pass | HTTPS response has HSTS, CSP (`default-src 'self'`), `frame-ancestors 'none'`, `object-src 'none'`, nosniff, strict-origin referrer policy, and camera/microphone/geolocation disabled. |
| Live PWA offline | Pass | After worker control, offline reload of `?system=water&set=65,65,60` rendered Clean water works and System steady with no console errors. |
| Service-worker update | Pass | A controlled two-version worker lifecycle test using the built shell observed active worker `v1`, `controllerchange`, then active worker `v2`; the shipped worker contains `skipWaiting`, `clients.claim`, and versioned cache cleanup. |
| Lighthouse, live mobile simulated | Pass | 100 Performance / 100 Accessibility / 100 Best Practices / 100 SEO; LCP 1.3 s, CLS 0, TBT 0 ms. |

## Defects

### P1 — skip link does not transfer keyboard focus into main content

**Reproduction:** load the home page, press Tab (the visibly focused “Skip to the simulator” link appears), then press Enter. The URL changes to `#main`, but `document.activeElement` is `<body>`, not `<main id="main">` or a focusable element inside it. Keyboard users must resume tabbing from the document rather than arriving at the simulator/main landmark.

This fails the stated keyboard-only / skip-link requirement even though axe does not flag it. Make the main target programmatically focusable and move focus to it on activation, while preserving the existing visible focus treatment.

### P1 — documented `verify:browser` quality gate does not finish locally

**Reproduction:**

```sh
npm run build
npm run preview -- --port 4173
timeout 25s npm run verify:browser -- http://127.0.0.1:4173
```

The command times out in the offline test. With Vite preview, the worker's generic offline fallback returns cached HTML for a module-script cache miss, producing a module MIME error and preventing the expected water heading. The live Azure-hosted site happened to pass the equivalent offline flow, but the repository's documented local browser quality gate is not reliable and cannot support the earlier claimed passing result.

### P2 — hashed static assets are not cached immutably on the live deployment

`HEAD /assets/index-C1_T4aFu.js` returns:

```text
cache-control: public, must-revalidate, max-age=30
```

The candidate uses content-hashed asset names but the deployment gives them a 30-second revalidation window, contrary to the required long-lived immutable caching for hashed static assets. Configure immutable caching for `/assets/*` and retain short/no-cache behavior for the HTML shell and `sw.js`.

### P3 — invalid route URL is not normalized after visual recovery

`/?system=not-a-system&set=1,2,3` displays the promised recovery message and departure state, but the invalid query remains in the location bar. It is a minor share/recovery polish issue; replacing it with the recovered URL would make the state unambiguous.

## Notes

- There is no backend, payment flow, CLI/library package, or account persistence in scope.
- The live app is deployed from the tested candidate, not a deployment-only failure: the compared public artifacts were byte-identical.
- The simulation is an honest simplified model and includes all three systems, watch mode, targets, faults, job context, legal pages, and no tracking.
