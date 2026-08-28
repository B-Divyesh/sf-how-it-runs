# Polish 4 handoff

## Delivered

- Fixed `F-4-1`: water, grid, and bakery now use product-first document,
  Open Graph, and Twitter titles in both generated HTML and client navigation.
- Extended `@claim:real-routes` to require exact raw and executed social titles
  and the `How It Runs — …` system-title prefix.
- Rechecked every finding in reviews 1–4 and polish records 2–3. The first
  screen, isolated one-click demo, claims, real routes, focus, 404, legal shell,
  mobile layout, privacy, offline mode, and accessibility remain fixed.
- Updated the visible build label to `polish-4` and the catalog description to
  a 72-character, verb-first sentence.
- Preserved the civic art-deco transit-poster design and original generated
  panorama. No generic redesign or unnecessary AI feature was added.

Runtime repair commit: `0e8d9f17f1ece8d7cffa8c25fdbf734ada065876`.
Live URL: <https://how-it-runs.sociobot.in>.

## Exact verification evidence

- Fresh clone: `/tmp/how-it-runs-polish4.5aqWY1/repo` at `0e8d9f1`.
- `npm ci`: pass, 0 vulnerabilities.
- `npm test`: pass, 8/8 Vitest tests.
- `npm run build`: pass; `dist/index.html` produced.
- Every test command in `.factory/claims.json` ran separately: 15/15 pass.
- `npm run test:node-versions`: clean install, test, and build pass on Node.js
  20.19.0, 22.12.0, and 24.
- `npm run verify:browser -- http://127.0.0.1:4173`: pass.
- `npm run verify:browser -- https://how-it-runs.sociobot.in`: pass.
- Both browser gates report 0 axe violations, 0 serious/critical findings,
  0 console errors, working offline reload, valid 44 px mobile targets, first-
  screen facts, route focus/history, cache policy, and the styled 404.
- `/opt/fleet/lib/verify-url.sh` passes locally and live. Live evidence is in
  `.factory/evidence/polish-4/live-url/verify.json`.
- Cold live 390 × 844 audit: headline, audience, sample action/result, and facts
  end by y=700. One click opens `/demo/`; the banner begins at y=0 and a seeded
  65% control appears at y=613. Reset returns 65. Exit clears the demo key and
  preserves a pre-seeded real key.
- Cold live metadata audit: all three raw and executed `<title>`, `og:title`,
  and `twitter:title` values exactly match the product-first strings. Back and
  Forward restore the route, focus, and announcement.
- Cold live privacy audit: only `https://how-it-runs.sociobot.in` was requested;
  there were no cookies and no console errors.
- Lighthouse 12.8.2 mobile: local 100 Performance / 100 Accessibility / 100
  Best Practices / 100 SEO, LCP 1.3 s, CLS 0, TBT 0 ms; live 100/100/100/100,
  LCP 1.2 s, CLS 0, TBT 40 ms.
- Production budgets: JS 22,496 B raw / 8,292 B gzip; CSS 24,490 B raw /
  6,311 B gzip; mobile hero 34,397 B AVIF / 58,514 B WebP.
- Deployment identity: SHA-256 matched 21/21 public runtime artifacts in
  `dist` against the custom domain.

Evidence index:

- `.factory/evidence/polish-4/test-summary.json`
- `.factory/evidence/polish-4/live-cold-check.json`
- `.factory/evidence/polish-4/lighthouse-summary.json`
- `.factory/evidence/polish-4/live-home-390.png`
- `.factory/evidence/polish-4/live-demo-390.png`
- `.factory/evidence/polish-4/live-water-390.png`
- `.factory/evidence/polish-4/live-url/screenshot-desktop.png`
- `.factory/polish-4.md`

## Run and verify

```sh
npm ci
npm test
npm run build
npm run preview -- --port 4173
npm run verify:browser -- http://127.0.0.1:4173
npm run test:claims
npm run test:node-versions
```

## Deployment

Built with the work-order command `npm ci && npm test && npm run build`, then
deployed `dist/` to the production Azure Static Web App `sf-how-it-runs`. The
custom domain serves build `polish-4` and the exact tested artifacts.

## Known gaps and next steps

None. Every cumulative review finding and every acceptance gate is resolved.
