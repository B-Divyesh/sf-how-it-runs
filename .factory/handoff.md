# How It Runs — build handoff

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
