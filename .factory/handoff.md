# How It Runs — repair handoff

**Work order:** `how-it-runs-repair-4`
**Base verification commit:** `3d26abcb8db2c43008a784a9f4095a0e0df04b4c`
**Repair commit:** `11291c969cdda6eb1c5e6a3fa005fb703136f106`
**Deployment:** <https://how-it-runs.sociobot.in>
**Completed:** 2026-08-27 UTC

## Release result: PASS

Repaired the sole release-blocking P2 finding in `.factory/verification-4.md`:
fractional URL lever values were previously displayed and evaluated as fractional
numbers while native range controls snapped their thumbs to a 5% step. A shared
`?system=water&set=66.6,65,60` now canonicalizes before state is rendered or
evaluated, to `?system=water&set=65,65,60`. The output reads `65%`, the range
value is `65`, and the copied/share URL is reproducible.

The app remains the same Vite + vanilla TypeScript static web artifact, deployed
as `dist/` to the existing Azure Static Web App. No brief-required simulation,
fault, watch, privacy, PWA, or visual behavior was changed.

## What changed

- Added `normalizeLeverValue` in `src/data.ts`. It clamps each imported numeric
  value to the lever range, then snaps it to that lever's own `min`/`max`/`step`
  lattice, preserving decimal precision where a future lever step requires it.
- Applied that normalizer in URL-state parsing before simulator state, rendered
  output, outcome evaluation, and URL rewrite.
- Added unit regression coverage for fractional, low, high, and zero-based
  lever values; `66.6` on water settling is exactly `65`.
- Extended the production Playwright gate to open the reported faulty URL and
  assert its range value, output, and canonical URL are all `65`.

## Verification evidence

Clean install and local artifact:

- `npm ci` — passed; 71 packages installed and 0 vulnerabilities reported.
- `npm test` — passed: Vitest, 1 file, **8/8 tests**.
- `npm run build` — passed (`tsc --noEmit` + Vite), producing `dist/index.html`.
  There is no separate lint script/configuration; strict TypeScript checking is
  the repository's configured static-analysis gate.
- Built entry JS: 19,991 B raw / 7,552 B gzip; CSS: 20,313 B raw / 5,475 B gzip;
  both are below the 200 KB / 50 KB static budget. Mobile hero is 58,514 B WebP
  and 34,397 B AVIF (below 300 KB).
- Local production preview: `npm run preview -- --port 4173` then
  `timeout 120s npm run verify:browser -- http://127.0.0.1:4173` passed.
  This covers all three system targets and faults, fractional URL normalization,
  malformed/unknown route recovery, 390×844 overflow and 44 px targets,
  native range keyboard input, skip-link focus, Watch Enter→Space focus
  continuity, reduced motion, axe (0 violations), console/page errors (0),
  offline reload and JavaScript module MIME, immutable hashed assets, and
  worker `skipWaiting`/`clients.claim`/cache cleanup lifecycle.
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173` passed: 531 ms load,
  title/lang/single-h1/main/alt/button-label checks, 0 errors.
- Independent local 1440×1000 browser check passed with no horizontal overflow;
  the reported fractional URL rendered range `65`, output `65%`, and canonical
  `set=65,65,60`. It observed no cookies, local/session storage, external
  origins, or console/page errors. Privacy and Terms each retained one h1.
- Local response-policy check confirmed self-only CSP, nosniff, strict-origin
  referrer policy, disabled camera/microphone/geolocation, shell revalidation,
  immutable hashed assets, and no-store service worker response.

Production:

- Pushed `11291c9` to `origin/main` and deployed `dist/` with
  `swa deploy dist --env production --app-name sf-how-it-runs --resource-group sociobot`.
- `timeout 120s npm run verify:browser -- https://how-it-runs.sociobot.in`
  passed with the same end-to-end, 390 px, keyboard, axe, offline/update,
  cache, and console checks; it includes the fractional URL regression.
- `/opt/fleet/lib/verify-url.sh https://how-it-runs.sociobot.in` passed: 641 ms
  load and 0 errors.
- Live 1440×1000 check confirmed the repaired URL, no horizontal overflow, no
  cookies or browser storage, same-origin-only requests, and zero console/page
  errors. Live HTTPS headers retain HSTS, CSP, nosniff, referrer and permissions
  policies; shell/assets/worker cache directives match the deployment contract.
- SHA-256 compared local `dist/` to all 14 public runtime artifacts: shell,
  both hashed assets, worker, legal CSS/pages, favicon, robots, sitemap, and
  four hero files. All matched byte-for-byte.
- Lighthouse mobile generated a complete report: **100 Performance / 100
  Accessibility / 100 Best Practices / 100 SEO**; FCP 1.04 s, LCP 1.07 s,
  TBT 0 ms, CLS 0. The CLI exited nonzero only after report generation because
  Chromium crashed in its final screenshot/BFCache collection; this is advisory
  and the independent Playwright gates completed cleanly.

## Known gaps / next steps

No release-blocking gaps remain. The only environment limitation is Lighthouse's
post-report Chromium screenshot/BFCache crash; retain the generated JSON scores
as advisory and use the passing browser gate as the executable release check.
