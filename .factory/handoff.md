# How It Runs — repair handoff

**Work order:** `how-it-runs-repair-1`
**Repaired candidate:** `95357f6d2aba56356d78a524a24fc550f0201ee7`
**Repair commit:** `8b62ce0430bd8ff849e35a30825d994057ec60e3`
**Deployment class:** Standard static only

## What changed

- Fixed the keyboard skip link: `main#main` is programmatically focusable and the
  skip-link activation explicitly transfers focus there while retaining `#main`.
- Replaced the broad service-worker HTML fallback. Navigation requests use a
  network-first shell with offline shell fallback; static assets are cache-first;
  failed module/assets requests never receive HTML. The cache is versioned to v3,
  and install fetches a revalidated shell.
- Added Static Web Apps cache routes: content-hashed `/assets/*` receive
  `public, max-age=31536000, immutable`; HTML shells revalidate; `sw.js` is
  `no-cache, no-store, must-revalidate` so updates are discovered safely.
- Replaced the local Vite preview command with a small production-static preview
  server that serves `dist/` and applies the committed Static Web Apps fallback,
  MIME, security, and cache rules. This makes the documented browser gate test the
  deployment artifact and cache behavior, rather than an approximation.
- Expanded `verify:browser` regressions for skip-link focus, immutable asset
  headers, shell/service-worker revalidation headers, and an offline module
  response that must remain JavaScript rather than HTML.

The municipal water, neighborhood power-grid, and bakery simulations remain shared
typed engine flows and were all exercised at their documented steady targets.

## Run and verify

```sh
npm ci
npm test
npm run build
npm run preview -- --port 4173
npm run verify:browser -- http://127.0.0.1:4173
```

The production artifact is `dist/`; deploy it as a Standard static app. Do not use
any server/runtime or paid deployment feature.

## Verification recorded 2026-08-27

- Clean `npm ci`: passed; 72 packages audited, 0 vulnerabilities.
- `npm test`: passed, 7/7 tests.
- `npm run build`: passed. Initial JS is 19.20 kB raw / 7.29 kB gzip; CSS is
  20.02 kB raw / 5.44 kB gzip, within the static budgets.
- Browser quality gate against the production-static preview: passed at 390×844.
  All three steady targets and faults worked; water fault/watch pause worked;
  no mobile horizontal overflow; skip-link focus reached `main`; axe had 0
  violations (0 serious/critical); browser console had 0 errors.
- Offline: after service-worker control, offline reload rendered **Clean water
  works**, and the content-hashed module returned HTTP 200 JavaScript rather than
  an HTML fallback.
- Headers: preview returned `no-cache, must-revalidate` for the HTML shell,
  `public, max-age=31536000, immutable` for the hashed JS module, and
  `no-cache, no-store, must-revalidate` for `sw.js`.
- `verify-url.sh` desktop/mobile smoke test: HTTP 200, title/lang/main/one h1/alt
  checks passed with 0 console errors.
- Service-worker update contract: versioned cache v3, `skipWaiting`,
  `clients.claim`, and old-cache cleanup are present; the updated worker was
  exercised by the offline browser gate.
- Lighthouse CLI was available but this container's Chromium could not accept a
  Lighthouse debugging connection. The prior independent live baseline was
  100/100/100/100 (performance/accessibility/best-practices/SEO; LCP 1.3 s,
  CLS 0, TBT 0 ms). The non-Lighthouse mobile/axe/browser checks above were rerun
  after this repair.
- Standard static deployment: uploaded successfully to
  `https://how-it-runs.sociobot.in`. Post-deploy browser quality gate and
  `verify-url.sh` both passed against the live URL with the same 390 px, axe,
  offline-module, focus, update-contract, cache-header, and zero-console-error
  results. Live headers matched the expected shell, hashed-asset, and `sw.js`
  policies above.

## Privacy and known limits

No analytics, tracking, third-party requests, accounts, cookies, or remote fonts
were added. State remains in the share URL. Repeat visits work offline after the
service worker has installed; a first-ever visit still requires a network
connection. The simulations are intentionally simplified intuition-builders, not
operational tools.
