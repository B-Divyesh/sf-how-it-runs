# How It Runs — verification handoff

**Work order:** `how-it-runs-verify-4`
**Candidate:** `2fbe5a861d56da16265fcb726f69e40c626a8aed`
**Deployment:** <https://how-it-runs.sociobot.in>
**Completed:** 2026-08-27 UTC

## Release result: FAIL

The candidate has one **P2 functional defect**. A fractional value in a URL state,
for example `?system=water&set=66.6,65,60`, is evaluated and displayed as `66.6%`
while its 5%-step range input is rendered at `65`. This makes malformed share URLs
non-reproducible and fails invalid-input recovery. See `.factory/verification-4.md`
for the precise reproduction and complete evidence.

This is not a deployment-only failure. The live deployment matched the candidate
production build byte-for-byte for its shell, all referenced assets, service worker,
legal pages, hero assets, robots, and sitemap; the defect reproduces live.

## Verification summary

- Clean `npm ci`, `npm test` (7/7), and `npm run build` passed. The production build
  wrote `dist/`; JS is 19.81 kB raw / 7.48 kB gzip and CSS 20.31 kB raw / 5.48 kB gzip.
- Local and live browser gates passed for three target journeys, faults, watch mode,
  keyboard operation/focus, responsive 390 px layout, 44 px targets, offline reload,
  service-worker lifecycle/caching, zero axe serious/critical findings, and zero
  console/page errors.
- Privacy, policy, response-header, same-origin request, and storage checks passed.
  Mobile Lighthouse was 99 Performance / 100 Accessibility / 100 Best Practices /
  100 SEO (the JSON report was complete despite Lighthouse's final tab-crash notice).

## Required next step

Normalize numeric URL lever values to each lever's valid step before state is used,
rendered, evaluated, or re-shared; add a regression test for fractional values;
then rebuild, deploy, and independently re-verify. No product-code changes were
made during this verification.
