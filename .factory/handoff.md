# Repair handoff — perfection loop round 1

## Delivered

Repair code commit: `814d2d311237bef0d029fb62bba0cfac03089b19`.

- Rewrote the first screen with the required plain job, audience, sample action, result, and three tested facts.
- Added `/demo/` and `?demo=1`, seeded water settings, the persistent demo banner, Reset demo, Start for real, and the `demo:` session-storage namespace.
- Added claim manifest and isolated Playwright claim checks for every retained public claim.
- Added physical `/systems/water/`, `/systems/grid/`, `/systems/bakery/`, and `/demo/` documents; route titles, canonical metadata, focused route announcements, browser Back/Forward behavior, and a styled HTTP 404.
- Completed metadata, social card, apple touch icon, sitemap, shared legal shell, footer links, mobile demo targets, and the three-step landing section.
- Preserved the civic art-deco transit-poster identity. The social image is a 1200 × 630 crop of the retained product panorama.

## Exact verification evidence

Clean clone: `/tmp/how-it-runs-clean.5PgZ9Y` cloned from the repair commit.

| Command | Result |
| --- | --- |
| `npm ci` | Passed; 71 packages installed, 0 vulnerabilities reported. |
| `npm test` | Passed; Vitest 8/8. |
| `npm run test:claims` | Passed all eight: `sample-demo-isolated`, `free`, `offline-reload`, `private-url-settings`, `system-loop`, `keyboard-controls`, `reduced-motion`, and `real-routes`. |
| Every individual command in `.factory/claims.json` | Passed after the full manifest run. |
| `npm run build` | Passed; writes `dist/index.html` and static route documents. |
| `npm run verify:browser -- http://127.0.0.1:4190` | Passed: demo, routes, 404, Back/Forward, focus, mobile overflow and 44 px targets, offline reload, cache policy, privacy/network checks, zero console errors, and Axe 0 violations. |
| `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173 /tmp/how-it-runs-url-evidence` | Passed: HTTP 200, title, `lang`, one h1, main, alt text, and zero captured errors. |
| Preview HTTP checks | `/not-a-real-route-qa` returned 404; `/demo/` returned 200. |

The Playwright Axe integration is the accessibility scanner used by `verify:browser`; it reported zero serious or critical violations. The standalone Axe CLI could not start its own Chrome binary in this container, so it was not used as release evidence.

Final build budgets: JS 22.33 kB raw / 8.28 kB gzip; CSS 22.58 kB raw / 5.92 kB gzip; 768 px WebP hero remains 58.5 kB. All are within the static-product budgets.

## Deploy

Push `main` to the configured repository. The static Azure work order deploys `dist/`; `public/staticwebapp.config.json` supplies production cache and 404 behavior.

## Known gaps

None. The standalone Axe CLI’s unavailable Chrome binary is an environment limitation, covered by the passing Playwright Axe scan.
