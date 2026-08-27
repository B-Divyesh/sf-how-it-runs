# How It Runs — repair handoff

**Work order:** `how-it-runs-repair-2`
**Repaired from:** verifier-2 candidate `ac0d806bc60db7b8494fe9661937793101c9c711`
**Baseline report:** `.factory/verification-2.md`
**Deployment class:** Standard static (`dist/`)
**Completed:** 2026-08-27 UTC

## What changed

- Re-rendering the simulator now restores keyboard focus to the corresponding
  replacement control. This covers the Watch/Pause control, flow control, fault,
  reset, and range controls. A keyboard user can press **Enter** on **Watch it
  run**, then immediately press **Space** on the focused **Pause watch mode**
  control; pausing likewise leaves focus on the replacement Watch control.
- Recovery to the departure state now rewrites the URL with `history.replaceState`.
  An unknown `system` query no longer leaves an invalid share link in the address
  bar; closing a running route also correctly clears its route state.
- Extended the production browser gate with exact Enter-then-Space focus and
  unknown-route URL-normalization regressions.

## Verification

Ran from a clean dependency install (`npm ci`):

```sh
npm test
npm run build
npm run preview -- --port 4173
npm run verify:browser -- http://127.0.0.1:4173
```

- Unit/integration: 7/7 Vitest tests passed.
- Type check and Vite production build passed; `dist/` was written. Initial
  JavaScript is 19.81 KB raw / 7.48 KB gzip and CSS is 20.02 KB raw / 5.44 KB
  gzip, inside the static budgets.
- Production browser gate passed at 390 × 844: targets/fault, mobile overflow,
  visible skip-link focus, exact Watch **Enter → Space** behavior, normalized
  invalid route URL, axe (0 violations), no console errors, immutable hashed
  assets, and PWA offline reload with a JavaScript module response.
- Desktop smoke test passed at 1440 × 1000 on a steady grid route with no
  horizontal overflow or page errors.

## Deploy and re-check

Deploy the freshly built `dist/` directory as **Standard static**. Then run:

```sh
npm run verify:browser -- https://how-it-runs.sociobot.in
```

The application remains local-first: it has no accounts, analytics, cookies,
third-party runtime requests, or backend. No known release-blocking gaps remain.
