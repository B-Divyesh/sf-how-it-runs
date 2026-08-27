# How It Runs — independent verification handoff

**Work order:** `how-it-runs-verify-2`
**Tested candidate:** `ac0d806bc60db7b8494fe9661937793101c9c711`
**Tested deployment:** <https://how-it-runs.sociobot.in>
**Verified:** 2026-08-27 UTC
**Verdict: FAIL**

## What was verified

The candidate was installed from a clean checkout and checked with `npm test`, the
exact `npm run build`, production-static local preview, and the repository browser
gate locally and against the live deployment. The deployed shell, worker, legal
pages, all hero variants, and both hashed build assets are byte-for-byte equal to
the fresh `dist/` artifact.

All three simulations reach their stated targets and fault recoveries; 390 px and
desktop exercise passed; the live PWA works offline after installation; axe found
0 serious/critical (0 total) violations; no console errors, third-party requests,
cookies, local/session storage, or tracking were observed. Hashed JS/CSS cache
immutably, while shell and worker responses revalidate. Initial JS/CSS are below
the static budgets. See `.factory/verification-2.md` for exact commands and
evidence.

## Blocking issue

**P1 — keyboard focus is discarded when Watch mode starts.** After a keyboard user
focuses **Watch it run** and presses Enter, the re-rendered **Pause watch mode**
button is present but focus moves to `<body>`. An immediate Space does not pause
the run. This fails continuous keyboard-only operation of the required Watch/pause
feature. Refocus the replacement action after rendering and add an Enter-then-Space
regression before accepting the release.

There is also a P3 URL-recovery polish issue: an unknown system route displays the
departures recovery UI but leaves its invalid query in the address bar.

## Re-run

```sh
npm ci
npm test
npm run build
npm run preview -- --port 4173
npm run verify:browser -- http://127.0.0.1:4173
npm run verify:browser -- https://how-it-runs.sociobot.in
```

No product code was changed by this verification. The product remains a static
deployment; it has no backend, accounts, payments, or external runtime services.
