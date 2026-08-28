# Review 4 handoff

## Delivered

- Completed the requested independent adversarial review without changing product
  code.
- Added `.factory/review-4.md` with one remaining minor finding, full first-read,
  demo, claims, structure, copy, and earlier-finding checks.
- Verdict: **FAIL** until the three system page titles use the required
  `How It Runs — …` order.

## Verification

- Fresh live Chromium checks at 390 × 844 and 1440 × 900.
- Fresh clone at `/tmp/how-it-runs-review4.6jVR6S/repo`: `npm ci`, `npm test`
  (8/8), `npm run build`, all 15 commands from `.factory/claims.json`, and
  `npm run test:node-versions` all passed.
- Local production browser gate passed: zero axe violations, zero console
  errors, functional demo/offline behavior, touch targets, cache checks, deep
  links, history/focus, and styled 404.
- Live demo directly verified isolated `demo:` session storage, reset, exit,
  real-data preservation, same-origin requests, no cookies, and offline reload.

## Remaining work

- Fix `F-4-1` in `.factory/review-4.md`: place **How It Runs** first in the
  title, Open Graph title, Twitter title, and SPA title for all three
  `/systems/*/` routes; add a `real-routes` claim assertion.
