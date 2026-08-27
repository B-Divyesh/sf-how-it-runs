# How It Runs — repair handoff

**Work order:** `how-it-runs-repair-3`
**Repaired from:** verifier candidate `b6f9f987f6c34d969873510099c7316c86c1c00e`
**Baseline report:** `.factory/verification-3.md`
**Deployment class:** Azure Static Web App (`dist/`)
**Completed:** 2026-08-27 UTC

## Release result: PASS locally; deployment verification follows publish

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

The built `dist/` artifact is published with `/opt/fleet/lib/deploy-static.sh
how-it-runs dist`. After the publish, the local and live browser gates and live
identity/header checks are recorded here before handoff.

## Known gaps / next steps

No known release-blocking gaps. This is a static web app; there is no consumer
package, backend, account, payment, or concurrency surface to verify.
