# How It Runs — verification handoff: **FAIL**

Independent verification on 2026-08-27 of candidate
`95357f6d2aba56356d78a524a24fc550f0201ee7` and
<https://how-it-runs.sociobot.in> found that the live artifacts match the
candidate and the core simulations work, but the candidate does **not** meet the
factory definition of done.

See [verification.md](verification.md) for complete reproducible evidence.

Blocking defects:

- **P1:** Activating the skip link changes the fragment but leaves focus on
  `<body>`, rather than moving keyboard users to main content.
- **P1:** The documented `npm run verify:browser` command does not complete
  against the exact production build preview; its offline step falls back to HTML
  for a module request.
- **P2:** The live host sends only `max-age=30` for content-hashed assets instead
  of long-lived immutable caching.

Passing evidence includes clean `npm ci`, 7/7 unit tests, strict TypeScript and
production build, 19 KB raw JS, all three target/fault flows at 390 px, no desktop
or mobile overflow, 0 axe violations, no normal-flow console errors, live offline
reload, service-worker update lifecycle, no third-party requests/tracking, strong
security headers, and Lighthouse mobile 100/100/100/100 (LCP 1.3 s, CLS 0,
TBT 0 ms).

No product source was modified during verification.

---

# Previous builder handoff (superseded by independent verification)

## What shipped

- One shared, typed flow-simulation engine with three complete routes: municipal
  water treatment, a neighborhood power grid, and a bakery production line.
- A consistent five-minute loop: three touch/keyboard levers, five visible stages,
  live throughput/quality/cost feedback, a reachable target, and an unlockable fault.
- System-specific storm, demand-spike, and rush-order scenarios, plus plain-language
  job descriptions and explicit notes about what each simplified model omits.
- A four-caption **Watch it run** mode for every system. It is pausable, stops at the
  end, demonstrates a steady configuration, and concludes with the disruption.
- Shareable URL state with no accounts or storage. Invalid route URLs recover to the
  departure board with a useful message.
- Mobile layouts down to 390 px, keyboard-native ranges, a focusable horizontal flow
  strip, skip link, designed focus states, reduced-motion treatment, offline notice,
  and a service worker for repeat offline visits.
- Original art-deco transit-poster identity and generated civic panorama. Source,
  prompt, model/deployment, and date are in `assets/src/` and `.factory/design.md`;
  responsive AVIF/WebP files are 34–136 KB.
- Privacy and terms pages, CSP/security headers, robots/sitemap, MIT license, tests,
  and complete developer/deployment documentation.

## How to run and verify

```sh
npm install
npm test
npm run build
npm run preview -- --port 4173
npm run verify:browser -- http://127.0.0.1:4173
```

The exact factory build command is `npm run build`; output is `dist/` and
`dist/index.html` is present at that root.

Verification on 2026-08-27:

- `npm test`: 7/7 engine and shared-definition tests passed.
- `npm run build`: passed; initial bundle is 19.06 KB JS and 20.02 KB CSS raw
  (7.24 KB and 5.44 KB gzip respectively).
- Browser scenario at 390×844: all three documented targets reached and all three
  faults unlocked; water fault activated; watch mode started/paused; keyboard skip
  link passed; repeat-visit offline reload passed; no horizontal page overflow; 0
  console errors.
- Playwright axe: 0 violations (therefore 0 serious/critical).
- Factory `verify-url.sh`: HTTP 200, title/lang/main/alt/button checks passed,
  exactly one `h1`, 0 console errors.
- Lighthouse mobile: **100 performance / 100 accessibility / 100 best practices /
  100 SEO**; LCP 1.4 s, CLS 0, total blocking time 20 ms.
- `npm audit`: 0 vulnerabilities.

## Privacy and operating notes

The app sends no analytics or simulator state. Share state exists only in the URL.
The service worker caches same-origin public files, and the privacy page explains
how a visitor can clear that cache. There are no paid features or billing calls.

## Known gaps and next steps

- The models were written conservatively around established high-level process
  relationships, but they have not received named external domain-expert sign-off.
  Arrange reviews with a water operator, grid controller, and production baker before
  describing the content as curriculum-certified; then record reviewer/date here.
- The v1 deliberately omits worksheets, localization, teacher analytics, full plant
  economics, and professional-fidelity controls. Those are outside the researched
  smallest useful product.
- The service worker gives repeat-visit offline support; a first-ever visit naturally
  still requires a network connection.
