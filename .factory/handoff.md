# How It Runs — repair handoff

**Work order:** `how-it-runs-repair-3`
**Repaired from:** verifier candidate `b6f9f987f6c34d969873510099c7316c86c1c00e`
**Baseline report:** `.factory/verification-3.md`
**Deployment class:** Azure Static Web App (`dist/`)
**Completed:** 2026-08-27 UTC

## Release result: PASS and deployed

The sole release-blocking finding in verification 3 was repaired: visible header
and footer links at a 390 × 844 viewport did not provide 44 × 44 CSS px touch
targets. The simulator models, URL sharing, watch/fault loop, PWA, privacy model,
and the previously repaired keyboard/recovery behavior are unchanged.

## What changed

- The header brand, header navigation links, and footer legal links now have a
  minimum 44 × 44 px target box. Header and footer link groups retain at least an
  8 px gap between adjacent controls.
- The footer legal links are a named flex group so target spacing and the original
  generated-art disclosure remain clear on narrow screens.
- `scripts/verify-browser.mjs` now has a regression assertion at 390 px that
  measures every visible `a`, `button`, `input`, and `summary`; any dimension
  below 44 px fails the production browser gate. It runs on both the landing page
  and an active simulator state.

## Local verification evidence

From a clean dependency install (`npm ci`):

```sh
npm test
npm run build
npm run preview -- --port 4173
timeout 120s npm run verify:browser -- http://127.0.0.1:4173
```

- Vitest: 7/7 unit/integration tests passed.
- Type checking and the production Vite build passed; `dist/index.html` exists.
  Entry JavaScript is 19.81 KB raw / 7.48 KB gzip and CSS is 20.31 KB raw /
  5.48 KB gzip, within the static budgets.
- The browser gate passed at 390 × 844 with target/fault flows, keyboard skip and
  Watch **Enter → Space**, URL recovery, offline reload and JavaScript module MIME,
  service-worker update contract, cache policy, axe (0 violations), no console
  errors, and the new touch-target regression.
- Direct 390 px target measurements: brand **178.67 × 44**, **Pick a system**
  **92.63 × 44**, **Privacy 44 × 44**, **Terms 44 × 44** CSS px. The hidden
  mobile-only-suppressed “For grown-ups” link was excluded as non-visible.
- Desktop 1440 × 1000 and mobile 390 × 844 simulator smoke tests had no document
  horizontal overflow. Reduced-motion flow duration is `1e-05s`.
- Axe returned 0 violations on home, a running bakery simulator, Privacy, and
  Terms. The worker URL verifier confirmed title, `lang`, one `h1`, `main`, image
  alt text, and no browser errors.
- Privacy smoke testing observed only the same local origin, an empty cookie
  string, and zero local/session-storage entries. Response checks confirmed the
  self-only CSP, nosniff/referrer/permissions policies, revalidating shell,
  immutable hashed assets, and no-store service worker.

## Publish and live re-check

Commit `11e7fbb` was pushed to `main`. The verified `dist/` artifact was published
with `/opt/fleet/lib/deploy-static.sh how-it-runs dist` (Azure deployment
`49102656-1210-4413-b5a6-542b6baf10ce`) and is live at
<https://how-it-runs.sociobot.in>.

- `timeout 120s npm run verify:browser -- https://how-it-runs.sociobot.in` passed:
  all three target journeys, water fault, keyboard skip and Watch **Enter → Space**,
  mobile overflow, 44 px target regression, axe (0 violations), no console errors,
  immutable assets, worker update lifecycle, and offline shell/module reload.
- The live 390 px measurements are the same as local: brand **178.67 × 44**,
  **Pick a system 92.63 × 44**, **Privacy 44 × 44**, and **Terms 44 × 44** CSS px.
  A live 1440 × 1000 steady-grid smoke test had no horizontal overflow or console
  errors.
- `/opt/fleet/lib/verify-url.sh` passed against the live URL: HTTP 200 in 665 ms,
  title/lang/one `h1`/`main`/image alt checks pass, and there were no page or
  console errors. The live headers include HSTS, self-only CSP, nosniff,
  strict-origin referrer policy, disabled camera/mic/geolocation, revalidating
  shell, immutable assets, and no-store service worker.
- SHA-256 identity checks matched live `/`, both hashed JS/CSS assets, `sw.js`,
  legal CSS, Privacy, Terms, favicon, all four hero variants, robots, and sitemap
  byte-for-byte against the deployed local build.
- Lighthouse mobile scores were **100 Performance / 100 Accessibility / 100 Best
  Practices / 100 SEO** (FCP 1.0 s, LCP 1.1 s, TBT 30 ms, CLS 0). Lighthouse wrote
  the report but ended with Chromium's known final screenshot/BFCache tab-crash
  message, so treat the score as advisory; the independently complete Playwright
  live gate passed.

## Known gaps / next steps

No known release-blocking gaps. This is a static web app; there is no consumer
package, backend, account, payment, or concurrency surface to verify.
