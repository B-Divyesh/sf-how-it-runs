# Independent verification 2 — FAIL

**Candidate commit:** `ac0d806bc60db7b8494fe9661937793101c9c711`
**Live URL:** <https://how-it-runs.sociobot.in>
**Verified:** 2026-08-27 UTC
**Verifier scope:** clean candidate checkout; local production artifact; deployed static site; desktop, 390 px mobile, keyboard, PWA, accessibility, privacy, security, caching, and bundle checks.

## Verdict

**FAIL.** The live deployment is exactly the tested production artifact and nearly all functional, performance, privacy, and PWA checks pass. However, a required Watch-mode control loses keyboard focus when it re-renders. A keyboard-only user cannot immediately pause a Watch run with Space after starting it with Enter. This fails the work order's keyboard-only requirement, so the release is not accepted.

No product code was modified by this verification.

## Exact verification evidence

| Check | Result | Evidence |
| --- | --- | --- |
| Candidate / clean state | Pass | Started on clean `main` at exactly `ac0d806bc60db7b8494fe9661937793101c9c711`. |
| Install | Pass | `npm ci`: 71 packages added; audit reported 0 vulnerabilities. |
| Unit/integration tests | Pass | `npm test`: Vitest, 1 file and 7/7 tests passed. |
| Type check / production build | Pass | `npm run build` ran `tsc --noEmit && vite build` and wrote `dist/`. |
| Lint | Not available | No lint script or linter configuration exists in `package.json`; TypeScript checking is included in build. |
| Local browser gate | Pass | `npm run preview -- --port 4173`, then `timeout 90s npm run verify:browser -- http://127.0.0.1:4173`: all built-in checks passed. |
| Live browser gate | Pass | `timeout 120s npm run verify:browser -- https://how-it-runs.sociobot.in`: all built-in checks passed: three targets/faults, mobile overflow, skip focus, axe, offline reload/module MIME, cache policy, worker lifecycle contract, and no console errors. |
| Representative core flow | Pass | Water `65,65,60`, grid `70,40,30`, and bakery `60,70,60` each reached **System steady**, unlocked their fault, and could activate it. Fault recoveries water `80,65,65`, grid `75,70,55`, and bakery `70,78,75` each reached **System steady** while the fault was active. |
| Boundary / malformed / recovery routes | Pass with P3 note | Grid `-999,999,5` clamps and rewrites to `20,100,5`; malformed water settings reset and rewrite to `45,75,35`; unknown routes display the departure/notification recovery state. The unknown query itself remains in the address bar (P3). |
| Desktop and mobile | Pass | Exercised 1440 x 1000 desktop and 390 x 844 mobile. No mobile horizontal overflow. |
| Keyboard / visible focus | **Fail** | Skip link visibly focuses and transfers focus to `main`; a range input increments from 45 to 50 with ArrowRight and writes `set=50,75,35`. But Watch-mode Enter replaces the focused button and leaves `document.activeElement === document.body`; immediate Space does not pause the run. |
| Reduced motion | Pass | At `prefers-reduced-motion: reduce`, computed flow animation duration was `1e-05s` (effectively static). |
| Axe | Pass | Live desktop selected-system axe scan: 0 violations, including 0 serious/critical. The repository mobile axe scan also passed with 0 violations. |
| Console/page errors | Pass | No browser console errors or `pageerror` events across normal routes, faults, malformed routes, and local/live browser gates. |
| Privacy / outbound requests | Pass | Runtime capture saw only `https://how-it-runs.sociobot.in`; no third-party scripts/fonts/requests, cookies, local storage, or session storage. Static inspection confirms URL-only state and no analytics. |
| Live security headers | Pass | HTTPS responses include HSTS, CSP with `default-src 'self'` and `frame-ancestors 'none'`, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, and disabled camera/microphone/geolocation. |
| Caching | Pass | Live hashed JS returns `Cache-Control: public, max-age=31536000, immutable`; shell returns `no-cache, must-revalidate`; `sw.js` returns `no-cache, no-store, must-revalidate`. |
| Bundle budgets | Pass | Built JS is 19,201 B raw / 7,290 B gzip; CSS is 20,021 B raw / 5,440 B gzip. Both are below 200 KB JS / 50 KB CSS. Hero 768 WebP is 58,514 B and AVIF is 34,397 B. |
| PWA/offline/update | Pass | Built-in local and live browser gate installed the worker, confirmed control, reloaded offline into **Clean water works**, and verified the cached module remains JavaScript rather than an HTML fallback. Worker source has versioned cache cleanup, `skipWaiting`, and `clients.claim`. |
| Live/candidate identity | Pass | `cmp` matched local `dist/` against live `/`, `/sw.js`, `/legal.css`, `/privacy/`, `/terms/`, all four hero variants, and both hashed assets byte-for-byte. |
| Lighthouse mobile | Advisory pass | Lighthouse generated 93 Performance / 100 Accessibility / 100 Best Practices / 100 SEO; LCP 1.3 s, CLS 0, TTI 1.8 s. Its Chromium tab crashed during final screenshot/BFCache collection after analysis, so this is advisory rather than a green process exit. |

## Defects

### P1 — Watch mode drops keyboard focus after activation

**Affected:** local build and <https://how-it-runs.sociobot.in>.

**Reproduce:**

1. Open `/?system=water&set=65,65,60`.
2. Tab to **Watch it run** and press Enter.
3. Observe that **Pause watch mode** is rendered, but `document.activeElement` is now `<body>`.
4. Press Space. Nothing pauses, because the new Pause button does not hold focus.

One additional Tab happens to reach Pause, so the user can recover, but focus should remain on the replacement watch button. This makes the required pause control fail continuous keyboard-only operation and violates the factory keyboard requirement. Preserve/refocus the watch action after `renderSimulator()` (and apply the same rule to any other state-changing control that replaces itself), then add a keyboard regression that presses Enter followed by Space.

### P3 — Unknown system recovery leaves an invalid share URL

**Affected:** local build and live site.

`/?system=does-not-exist&set=1,2,3` correctly shows “That route does not exist, so we brought you back to departures” and the departure state, but retains the invalid query in the location bar. Replace the URL with the recovered empty/departures state so a copied link represents what the page is showing.

## Scope notes

- This is a static web app: no backend, account persistence, payments, library/CLI package, or server concurrency surface is in scope.
- The site has all three brief-required simulations, target/fault loops, job explanations, passive Watch mode, original-art provenance, legal pages, and URL-based share state.
- Prior report `.factory/verification.md` concerns an earlier candidate. This report is the independent result for the requested candidate only.
