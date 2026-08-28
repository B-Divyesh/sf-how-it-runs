# Polish 2 handoff

## Delivered

- Repaired all cumulative review findings from `.factory/review-1.md` and
  `.factory/review-2.md`; the mapping is in `.factory/polish-2.md`.
- The one-click demo is a fixed, isolated water sample. It has a visible,
  persistent banner, reset, leave-and-clear control, separate `demo:` session
  namespace, and canonical handling that rejects imported system/settings
  values.
- Completed claims, real route documents/metadata, history focus and
  announcements, 404/legal shell, mobile fold/touch behavior, copy audit, and
  catalog description. The art-deco civic-systems visual identity is unchanged.
- Commit containing the product repair: `8c6b23d170b8b6de73d0fc8a6c8c3ffea9b29d34`.

## Verification

- Fresh clone: `/tmp/how-it-runs-clean.M1Emlo`, cloned at the repair commit.
  `npm ci`, all 14 individually invoked `.factory/claims.json` commands,
  `npm test` (8/8), and `npm run build` passed. `dist/index.html` exists.
- Local exact production build: `npm run build` passed. Assets: JavaScript
  22.50 kB raw / 8.32 kB gzip; CSS 24.49 kB raw / 6.30 kB gzip.
- Local browser/PWA/accessibility suite:
  `npm run verify:browser -- http://127.0.0.1:4173` passed. It reported zero
  console errors, zero axe violations on every checked route, no mobile
  overflow, 44 px touch targets, offline reload, cache policy, route focus,
  and route announcement checks.
- Local semantic smoke test:
  `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173 /tmp/how-it-runs-url-verify-4173`
  passed in 529 ms with one h1, `lang=en`, `main`, image alt text, labeled
  buttons, and no errors.
- Visual evidence: `.factory/evidence/home-390.png`,
  `.factory/evidence/demo-390.png`, `.factory/evidence/home-1440.png`.

## Deployment and live recheck

Push this commit to `main`; the static deployment work order publishes `dist/`
to Azure Static Web Apps. After publication, run the same browser and URL
checks against `https://how-it-runs.sociobot.in`, including a cold `/demo/`
visit, before accepting the deployment.

## Known gaps

None in the committed artifact. Live deployment evidence is added after the
push completes.
