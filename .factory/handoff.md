# Review 3 handoff

## Delivered

- Wrote `.factory/review-3.md` for candidate `1fdb855` and the live production
  site. Verdict: **FAIL**.
- No product code was modified.
- Recorded a cold 390 × 844 and 1440 × 900 first read, complete landing/README
  copy inventories, all declared claim results, demo/privacy/offline evidence,
  site-structure checks, missed leverage, and an item-by-item reconciliation of
  both earlier reviews.

## Findings

- **F-3-1 / reopened R1-B3 (blocking):** README and `package.json` promise all
  Node 20+ releases, but Vite requires Node 20.19+ or 22.12+. Node 20.0 fails the
  build. The claim is also absent from `.factory/claims.json`.
- **F-3-2 (major):** the `real-routes` manifest claim promises that every
  simulation link can be copied and reopened, but its declared test never
  performs that flow. The behavior itself passed a manual live check for all
  three systems.

## Verification

- Clean clone: `/tmp/how-it-runs-review3.6Wz6sR/clean` at `1fdb855`.
- All 14 exact `.factory/claims.json` commands exited zero when run separately.
- `npm test`: 8/8 passed.
- `npm run build`: passed; JS 22.50 kB raw / 8.32 kB gzip and CSS 24.49 kB raw /
  6.30 kB gzip.
- `npm run verify:browser -- https://how-it-runs.sociobot.in`: passed with zero
  axe violations and zero console errors.
- `/opt/fleet/lib/verify-url.sh https://how-it-runs.sociobot.in ...`: passed in
  550 ms with no errors.
- Independent live checks covered cold first screens, one-click demo placement,
  reset/exit/isolation, same-origin requests, all-system share/reopen, route
  status/crawl, and Back/Forward focus/announcement.
- Node boundary reproduction:
  `npx --yes node@20.0.0 ./node_modules/vite/bin/vite.js build` failed with
  Vite’s documented minimum-version error and `crypto.hash is not a function`.

## Next steps

1. Align README and `package.json#engines.node` with the actual Vite-supported
   range and add a minimum-version claim test.
2. Extend `@claim:real-routes` to copy and reopen changed settings for water,
   grid, and bakery in fresh pages.
3. Re-run the complete claim matrix and adversarial live review.
