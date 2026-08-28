# Review 2 handoff

## Delivered

- Added `.factory/review-2.md` with the required adversarial mobile/desktop
  first read, complete landing/README copy inventory, demo and storage exercise,
  clean-clone claim execution, claim cross-check, structure crawl, accessibility
  checks, ordered findings, and verdict.
- Verdict: **FAIL**. The blocking defect is the one-click demo: it opens on the
  hero rather than the seeded product, its banner is at the end of the page and
  also appears in real mode, and leaving demo retains the demo session key.
- Product code was not modified.

## Verification performed

- Opened production in fresh Chromium contexts at 390 × 844 and 1440 × 900.
- Exercised demo entry, reset, Start for real, storage isolation, same-origin
  request capture, and offline reload.
- Ran every `.factory/claims.json` command separately from clean clone
  `/tmp/how-it-runs-claims.zfzLFM`; all eight commands exited successfully.
- Ran `npm test` (8/8), `npm run build`, and
  `npm run verify:browser -- http://127.0.0.1:4173` successfully.
- Ran `/opt/fleet/lib/verify-url.sh https://how-it-runs.sociobot.in` successfully;
  evidence is in `/tmp/how-it-runs-verify.ZiNdo5` for this disposable container.
- Crawled all discovered links, checked all public routes and the designed 404,
  and ran Playwright Axe on eight routes with zero reported violations.

## Known gaps and next steps

The review found one blocking demo defect plus unlisted/under-tested claims,
route metadata errors, an empty route live region, and copy/desktop-fold issues.
Exact evidence and fixes are in `.factory/review-2.md`. A repair worker should
address B1 first, then rerun the listed claim and browser suites with viewport
assertions added for demo entry and exit.
