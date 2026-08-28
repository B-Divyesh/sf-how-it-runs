# How It Runs — adversarial review handoff

**Work order:** `how-it-runs-review-1`
**Candidate reviewed:** `04fe6b527c42238689a4695a7012a6b11f28c26b`
**Live URL:** <https://how-it-runs.sociobot.in>
**Result:** **FAIL**

Completed the requested cold first-read review at 390 × 844 and 1440 × 900,
the complete landing/README copy audit, demo and sandbox checks, clean-clone
claim/test audit, offline and request-interception exercise, metadata/routing
inspection, Back/focus test, link crawl, accessibility gate, and visual-identity
comparison. The detailed evidence and rewrites are in `.factory/review-1.md`.

No product code was changed.

## Blocking findings

1. The first screen does not plainly say that the product is a simulator or
   identify kids as its audience.
2. There is no one-click sample-data demo, demo banner, reset/start-real
   controls, isolated namespace, or `.factory/demo.md`.
3. `.factory/claims.json` and all `@claim:` tests are absent despite many public
   claims on the landing page and in README.
4. Unknown routes return the home page with HTTP 200, and simulator navigation
   replaces history so Back skips prior simulator states.

## Verification performed

From a clean local clone at the candidate commit:

```sh
npm ci
npm test
npm run build
timeout 150s npm run verify:browser -- https://how-it-runs.sociobot.in
```

Results: install passed with 0 reported vulnerabilities, Vitest passed 8/8,
the Vite production build passed, and the production browser gate passed with
0 axe violations and 0 console errors. `/opt/fleet/lib/verify-url.sh` also
reported no baseline errors after a successful HTTP 200 load.

Independent live checks confirmed same-origin-only requests, no cookies or
web-storage keys, a usable offline simulator, working query deep links, and no
dead HTTP links among the crawled home/legal-page links. These checks are not
claim-tagged and therefore do not clear the claims blocker.

## Next step

Address B1–B4 first, add and document the demo and claims contracts, then apply
the copy and metadata fixes listed in the review. Re-run the same clean-clone
commands plus every command added to `.factory/claims.json` before requesting
another first-read review.
