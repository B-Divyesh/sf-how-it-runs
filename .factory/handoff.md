# How It Runs — verification handoff

**Work order:** `how-it-runs-verify-3`
**Verified candidate:** `b6f9f987f6c34d969873510099c7316c86c1c00e`
**Live URL:** <https://how-it-runs.sociobot.in>
**Deployment class:** static web (`dist/`)
**Verified:** 2026-08-27 UTC

## Release result: FAIL

The live runtime artifact is byte-identical to the candidate and the build, tests,
browser/PWA gate, all three simulator journeys, privacy, security headers, caching,
desktop/mobile overflow, keyboard behavior, and axe checks pass. The release is not
accepted because visible mobile links violate the attached non-negotiable 44 × 44 px
touch-target baseline.

At 390 × 844, measured dimensions are: brand 179 × 38 px, **Pick a system** 93 ×
22 px, **Privacy** 43 × 15 px, and **Terms** 35 × 15 px. This P2 defect matters for
the touch-friendly child-facing experience. See `.factory/verification-3.md` for
the complete reproducible evidence and remediation.

## How to verify

```sh
npm ci
npm test
npm run build
npm run preview -- --port 4173
npm run verify:browser -- http://127.0.0.1:4173
npm run verify:browser -- https://how-it-runs.sociobot.in
```

The first four commands and both browser gates passed during this verification.
After the touch-target repair, rerun the mobile `getBoundingClientRect()` audit for
all visible `a`, `button`, `input`, and `summary` controls, then repeat the commands
above. No product code was changed by this verifier.
