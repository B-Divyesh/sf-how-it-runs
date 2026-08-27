# Independent verification 5 — PASS

**Work order:** `how-it-runs-verify-5`  
**Candidate commit:** `b2914d525ab002f605a77ae5ae82332b0af63a15` (`main`)  
**Production URL:** <https://how-it-runs.sociobot.in>  
**Verified:** 2026-08-27 UTC

## Verdict

**PASS.** This was a fresh, independent verification of the requested candidate.
The live deployment is byte-identical to the candidate's rebuilt public runtime
artifact, and the required simulator, accessibility, privacy, PWA, response
policy, mobile, keyboard, and budget checks passed. No product code was
modified by this verification.

## Evidence

| Area | Result | Fresh evidence |
| --- | --- | --- |
| Clean candidate | Pass | Began with a clean worktree at exactly `b2914d525ab002f605a77ae5ae82332b0af63a15`. |
| Install | Pass | `npm ci` installed 71 packages; audit reported 0 vulnerabilities. |
| Tests | Pass | `npm test` completed Vitest's 8/8 tests. |
| Type / exact production build | Pass | `npm run build` ran `tsc --noEmit && vite build` and emitted `dist/`. There is no configured lint script or linter; strict TypeScript is the repository's available static-analysis gate. |
| Local production browser / PWA gate | Pass | `npm run preview -- --port 4173`, then `timeout 150s npm run verify:browser -- http://127.0.0.1:4173` passed. It covers the three targets, fault unlock, fractional URL normalization, unknown-route recovery, 390 px overflow/touch targets, skip link, keyboard Watch pause, reduced motion, axe, offline reload/module MIME, cache policy, and service-worker lifecycle contract. |
| Live browser / PWA gate | Pass | `timeout 150s npm run verify:browser -- https://how-it-runs.sociobot.in` passed with the same assertions and zero browser errors. |
| Live semantic smoke check | Pass | `/opt/fleet/lib/verify-url.sh https://how-it-runs.sociobot.in /tmp/how-it-runs-verify-5` reported 691 ms load; title, `lang`, exactly one `h1`, `main`, image alt text, and button labels all passed with no errors. |
| Product loop | Pass | Independently exercised water `65,65,60`, grid `70,40,30`, and bakery `60,70,60`: each reached **System steady** and unlocked its fault. Active-fault recovery reached **System steady** at water `80,65,65`, grid `75,70,55`, and bakery `70,80,75`. |
| Boundary / invalid recovery | Pass | `grid=-999,999,5` canonicalized to `20,100,5`; malformed water settings reset to `45,75,35`; `water=66.6,65,60` rendered range/output `65` / `65%` and rewrote to `65,65,60`; an unknown system recovered to departures and `/`. |
| Desktop, mobile, touch | Pass | Independent checks at 1440 x 1000 and 390 x 844 found no document horizontal overflow. All visible links, buttons, inputs, and summaries at 390 px measured at least 44 x 44 CSS px. |
| Keyboard / focus | Pass | Skip link was the first stop and focused `main`; range control accepted Home/End and arrows and updated URL state; Watch retained focus from Enter to **Pause watch mode** and then Space back to Watch. Flow, fault, and reset state-changing controls also retained focus. Focused range computed a solid visible outline. |
| Reduced motion | Pass | With `prefers-reduced-motion: reduce`, animated flow/transition durations computed to `1e-05s`; Watch still supplied its explicit pause control and captions. |
| Accessibility | Pass | Independent `@axe-core/playwright` scans on home, water simulator, Privacy, and Terms found 0 violations (therefore 0 serious/critical) locally and live. |
| Errors | Pass | No console-error or `pageerror` events during normal, fault, URL-recovery, keyboard, mobile, legal, reduced-motion, local, or live exercise. |
| Privacy / outbound requests | Pass | Browser capture with service workers blocked observed only the current origin. `document.cookie` was empty and local/session storage had 0 entries. Static review found URL-only state, no analytics, ad/tracker, third-party font/script, account, or external API request. |
| HTTPS response policy | Pass | Live shell, assets, worker, Privacy, and Terms serve self-only CSP, `nosniff`, strict-origin referrer policy, camera/microphone/geolocation denial, and HSTS. Shell/legal pages revalidate; hashed JS/CSS are `public, max-age=31536000, immutable`; `sw.js` is `no-cache, no-store, must-revalidate`. |
| PWA | Pass | Local and live browser gates installed and controlled the worker, reloaded a selected simulator offline, and verified the cached JS module was still served as JavaScript. Shipped worker has versioned cache cleanup, `skipWaiting`, and `clients.claim`; the gate's update-lifecycle contract passed. |
| Candidate / deployment identity | Pass | SHA-256 matched rebuilt `dist/` against live `/`, both hashed assets, `sw.js`, legal CSS, Privacy, Terms, favicon, four hero assets, robots, and sitemap: 14/14 public runtime artifacts matched byte-for-byte. `staticwebapp.config.json` is deployment configuration, not a public runtime artifact. |
| Bundle / image budget | Pass | Entry JS: 19,991 B raw / 7,556 B gzip (<200 KB). CSS: 20,313 B raw / 5,482 B gzip (<50 KB). Mobile hero: 58,514 B WebP and 34,397 B AVIF (<300 KB). |

## Performance-audit note

Fresh Lighthouse 12.8.2 was run against production using Playwright's installed
Chromium. Chromium crashed during trace collection and Lighthouse wrote a JSON
report with null scores/metrics before returning nonzero (`Browser tab has
unexpectedly crashed`). It did not identify a product defect and is not used as
evidence of a score. The independently completing Playwright/PWA tests,
response checks, and small asset budgets above remain the release evidence.

## Defects by severity

None found: **P0 0, P1 0, P2 0, P3 0.**

## Scope note

This is a static web application with no backend, account persistence, payment,
library/CLI package, or server-concurrency surface. The brief-required three
original simulations, mission/fault loop, passive Watch mode, URL sharing,
honest simplified-model disclosure, original-art provenance, legal pages, and
privacy posture are present.
