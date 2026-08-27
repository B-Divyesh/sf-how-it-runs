# Independent verification 4 — FAIL

**Work order:** `how-it-runs-verify-4`
**Candidate:** `2fbe5a861d56da16265fcb726f69e40c626a8aed` (`main`)
**Production URL:** <https://how-it-runs.sociobot.in>
**Verified:** 2026-08-27 UTC
**Verdict:** **FAIL** — one moderate functional defect remains in the required URL-state/invalid-input path. The prior reported deployment-only failure is not present: the live artifact matches this candidate exactly.

## Release-blocking defect

### P2 — Fractional URL state disagrees with its 5%-step control

Reproduction, both local production preview and live:

1. Open `/?system=water&set=66.6,65,60`.
2. The output next to **Settling time** says `66.6%` and the URL retains `66.6`.
3. The native range input, whose declared `step` is `5`, renders at `65`.

The simulation evaluates the unquantized `66.6` while the visible control is at 65. A recipient cannot reproduce the shared state using the lever, and malformed numeric URL input is not normalized to the allowed control values. This violates the brief's URL-state contract and the verification requirement to recover from invalid user input. Clamp/round values to each lever's valid `min`/`max`/`step` value before putting them in state and normalize the URL.

Evidence captured locally:

```json
{
  "url": "http://127.0.0.1:4173/?system=water&set=66.6%2C65%2C60",
  "displayed": "66.6%",
  "slider": "65"
}
```

The same evidence on production was:

```json
{
  "url": "https://how-it-runs.sociobot.in/?system=water&set=66.6%2C65%2C60",
  "output": "66.6%",
  "slider": "65"
}
```

## Local clean-checkout evidence

The checkout was clean and already at the requested SHA. Dependencies were installed with `npm ci`.

| Check | Result |
| --- | --- |
| `npm test` | PASS — Vitest 3.2.7, 7/7 tests passed |
| `npm run build` | PASS — `tsc --noEmit` and Vite production build completed; `dist/index.html` produced |
| Bundle budget | PASS — JS 19.81 kB raw / 7.48 kB gzip; CSS 20.31 kB raw / 5.48 kB gzip (both below the 200/50 kB limits) |
| `npm run preview -- --port 4173` | PASS — tested the exact built `dist/` output |
| `timeout 120s npm run verify:browser -- http://127.0.0.1:4173` | PASS — target/fault/watch/keyboard/recovery/mobile/offline/cache/SW/axe suite, 0 console errors |
| `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173 <temp-evidence-dir>` | PASS — 533 ms load; title/lang/one h1/main/image-alt/button-label checks; 0 errors |

Independent Playwright checks on the local production preview also passed for all normal cases:

- Water (`65,65,60`), grid (`70,40,30`), and bakery (`60,70,60`) each reached the stated target, unlocked its fault, toggled fault and flow pause, reset cleanly, and supported keyboard Home/End at their range endpoints.
- Tested fault recoveries reported “Strong recovery” for water `65,65,60`, grid `75,70,55`, and bakery `70,78,75` with `fault=1`.
- 1440 × 1000 desktop and 390 × 844 mobile had no document horizontal overflow. All visible mobile links, buttons, inputs, and summaries measured at least 44 × 44 CSS px.
- Keyboard started at the skip link and showed a 3 px marigold focus outline. Watch mode worked with Enter then Space and retained focus; native sliders were keyboard-operable.
- Invalid nonnumeric, wrong-length, and unknown-system URLs recovered correctly to default state or departures. Only fractional numeric input failed normalization as described above.
- Reduced motion computed a `1e-05s` animation/transition duration. Flow pause is present and works.
- Axe found 0 serious/critical issues on home, a running simulator, Privacy, and Terms. The browser checks observed 0 page/console errors.

## Privacy, policies, PWA, and deployment

- No external browser requests were observed on local or live runs; all requests were same-origin. No cookies, local storage, or session storage entries were created. There are no third-party fonts, scripts, analytics, ads, or trackers.
- Local and live Content Security Policy is self-only (`default-src 'self'`; `connect-src 'self'`), with `nosniff`, strict-origin referrer policy, disabled camera/microphone/geolocation, and HSTS in production.
- HTML revalidates; content-hashed assets are `public, max-age=31536000, immutable`; `sw.js` is `no-cache, no-store, must-revalidate` and has the expected `skipWaiting`, `clients.claim`, and prior-cache deletion update lifecycle.
- Offline reload and cached JavaScript-module MIME behavior passed through the browser gate. This static PWA has no backend, payment, account, library/CLI, concurrency, or persistence boundary beyond its service-worker cache.
- `timeout 120s npm run verify:browser -- https://how-it-runs.sociobot.in` passed with 0 axe violations and 0 console errors. The live worker URL check passed in 687 ms.
- SHA-256 comparisons matched local `dist/` and live `/`, `/privacy/`, `/terms/`, legal CSS, worker, favicon, all four hero formats, robots, sitemap, and both hashed JS/CSS assets. Therefore the production site is the candidate build, not a stale/deployment-only variant.

## Performance audit

Mobile Lighthouse produced **99 Performance / 100 Accessibility / 100 Best Practices / 100 SEO**: FCP 1.0 s, LCP 1.1 s, TBT 110 ms, CLS 0, interactive 1.2 s. Lighthouse emitted its known terminal Chromium-tab-crash message after writing the complete JSON report; the independently complete Playwright gate and URL verifier passed.

## Next step

Repair and regression-test step normalization for URL values, rebuild, deploy, and re-run this verification. Do not mark the release PASS until the UI value, range thumb, evaluated value, and canonical share URL agree for malformed fractional values.
