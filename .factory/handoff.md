# Polish 3 handoff

## Delivered

- Corrected the Node support contract to `^20.19.0 || >=22.12.0` in the README,
  package manifest, lockfile, and claims manifest.
- Added a clean-sandbox runtime claim that installs, tests, and builds on Node
  20.19.0, Node 22.12.0, and the latest Node 24 LTS release.
- Expanded `@claim:real-routes` to change, copy, validate, and reopen settings
  for water, grid, and bakery in separate pages.
- Re-audited and retained every earlier copy, demo, routing, metadata, focus,
  404, legal, mobile, privacy, offline, and visual-identity repair.
- Updated the visible release label, service-worker cache version, catalog
  description, copy audit, claims manifest, and cumulative repair record.

## Exact verification evidence

- Repair commit: `5a95867715458f4061807f878ec62cdb0d925cc8`.
- Clean clone: `/tmp/how-it-runs-polish3.BTZCCx/repo` at that commit.
- Every one of the 15 exact `.factory/claims.json` commands passed separately.
- `npm test`: 8/8 passed in the clean clone.
- `npm run build`: passed in the clean clone and produced root `dist/index.html`.
- Bundle: JS 22.50 kB raw / 8.32 kB gzip; CSS 24.49 kB raw / 6.30 kB gzip.
- `npm run verify:browser -- http://127.0.0.1:4174`: passed in the clean clone.
- `npm run verify:browser -- https://how-it-runs.sociobot.in`: passed after deployment.
- Both browser gates reported 0 axe violations, 0 serious/critical findings, 0
  console errors, no 390 px overflow, valid 44 px targets, working offline
  routes, keyboard focus, metadata, cache policy, and the designed 404.
- `/opt/fleet/lib/verify-url.sh` passed locally in 657 ms and live in 969 ms.
- Live cold check at `2026-08-28T13:01:29.450Z`: both required first screens,
  direct and one-click demo, 65/65/60 reset, namespace isolation, all three
  copied-link round trips, seven route titles/metadata, Back/Forward focus and
  announcements, and HTTP 404 all passed. It saw 16 same-origin requests, 0
  third-party requests, and 0 cookies.
- Lighthouse 12.8.2 local: 100 Performance / 100 Accessibility / 100 Best
  Practices / 100 SEO; LCP 1.3 s, TBT 0 ms, CLS 0.
- Lighthouse 12.8.2 live: 100 / 100 / 100 / 100; LCP 1.2 s, TBT 30 ms, CLS 0.
- `npm audit --audit-level=high`: 0 vulnerabilities.
- Azure deployment ID: `d5c82031-a015-43fe-8394-547acb153e09`.
- Live artifact shows `build polish-3`; <https://how-it-runs.sociobot.in> and
  the intentionally missing route were cold-checked after deployment.

Evidence files are in `.factory/evidence/polish-3/`. The full finding map is in
`.factory/polish-3.md`.

## Run and verify

```sh
npm ci
npm test
npm run build
npm run test:claims
npm run test:node-versions
npm run preview -- --port 4173
npm run verify:browser -- http://127.0.0.1:4173
```

## Known gaps and next steps

None. No review finding remains open.
