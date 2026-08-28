# Adversarial first-read review 5 — PASS

- **Product:** How It Runs
- **Live URL:** <https://how-it-runs.sociobot.in>
- **Repository candidate:** `9cffccfa3c84f294780e35d8d2187c8af51e45ef`
- **Reviewed:** 2026-08-28 UTC
- **Contexts:** new Chromium contexts at 390 × 844 and 1440 × 900; fresh clone at `/tmp/how-it-runs-review-5`

## Verdict

**PASS.** This round found zero blocking, major, minor, or untested-claim findings. The live site is clear before a scroll, exposes an honest one-click sample, keeps that sample separate from real-mode state, and supplies the required route, accessibility, privacy, and metadata behavior.

## Cold first read, before scrolling

| Viewport | What this does | For whom | First click |
| --- | --- | --- | --- |
| 390 × 844 | A browser simulator where I adjust water, power, or bakery systems and see their results. | Kids and grown-ups who want to understand everyday infrastructure. | **Try it with sample data**. |
| 1440 × 900 | The same three-system simulator; the poster art supports rather than replaces the explanation. | Kids and grown-ups. | **Try it with sample data**. |

The required answer is available in both contexts before a scroll:

> “Run water, power, and bakery systems”

> “For kids and grown-ups who want to see how water, power, and bread reach a neighborhood.”

> “Try it with sample data” / “Opens water at 65% settling, 65% filter speed, and 60% disinfectant.”

All three plain facts were visible without a scroll at both 390 px and 1440 px. No first-read blocking finding applies.

## Copy audit

Counts are whitespace-delimited. This inventory covers every prose sentence on the landing page and README. No sentence exceeds 22 words; no banned plain-words term, marketing adjective, jargon-dependent heading, inconsistent product term, or non-result-naming action was found.

### Landing-page sentences

| Sentence | Words | Result |
| --- | ---: | --- |
| For kids and grown-ups who want to see how water, power, and bread reach a neighborhood. | 16 | Pass |
| Opens water at 65% settling, 65% filter speed, and 60% disinfectant. | 10 | Pass |
| Free. | 1 | Pass |
| Works offline after the first visit. | 6 | Pass |
| No account; settings stay in the URL. | 7 | Pass |
| Each simulation has controls, five stages, live results, a fault, and a worker’s job note. | 15 | Pass |
| Guide cloudy river water through settling, filtering, and careful disinfection. | 10 | Pass |
| Balance a small generator, a battery, and flexible uses as the neighborhood changes. | 13 | Pass |
| Mix, bake, and move loaves through a small production bakery before the morning delivery. | 14 | Pass |
| Choose water, power, or bakery to open a simulation. | 9 | Pass |
| Choose water, power, or bakery. | 5 | Pass |
| Move the controls and read the live results. | 8 | Pass |
| Meet all three targets, then try a fault. | 9 | Pass |
| Each simulator has three controls and three result meters. | 9 | Pass |
| These simulations are not engineering tools. | 6 | Pass |
| First ask for a prediction. | 5 | Pass |
| Move one lever, name what changed, then try the fault. | 11 | Pass |
| In watch mode, pause after each caption and ask what you would do next. | 14 | Pass |
| There are no accounts, analytics, cookies, or saved profiles. | 9 | Pass |
| A share link contains only the current system settings. | 9 | Pass |
| You’re offline. The current simulation still works. | 7 | Pass |
| A free browser simulator for kids and grown-ups. | 9 | Pass |
| Original generated panorama. | 3 | Pass |

### README sentences

| Sentence | Words | Result |
| --- | ---: | --- |
| Run water, power, and bakery systems. | 6 | Pass |
| This free browser simulator is for kids and grown-ups curious about everyday infrastructure. | 13 | Pass |
| Open the sample demo. | 4 | Pass |
| One click opens water at 65% settling, 65% filter speed, and 60% disinfectant. | 13 | Pass |
| The demo banner stays visible while sample data is active. | 10 | Pass |
| Reset demo restores the sample data. | 5 | Pass |
| Leave demo and clear sample removes it. | 7 | Pass |
| Each simulation has three controls, five stages, three live results, a fault, and a worker’s job note. | 17 | Pass |
| Controls work with arrow keys. | 5 | Pass |
| If your device reduces motion, flow lines stay still and screen changes do not animate. | 15 | Pass |
| Each simulation has a link you can copy and reopen. | 10 | Pass |
| Watch mode can pause and stops after four captions. | 9 | Pass |
| Works offline after the first visit. | 6 | Pass |
| No account; settings stay in the URL. | 7 | Pass |
| There are no accounts, analytics, cookies, or saved profiles. | 9 | Pass |
| These simulations are not engineering, food-safety, or operational guidance. | 9 | Pass |
| Use Node.js 20.19+ (20.x) or 22.12+. | 7 | Pass |
| The production build creates the static site in `dist`, with `index.html` at its root. | 14 | Pass |
| Demo changes use only `demo:how-it-runs:state` in session storage. | 8 | Pass |
| Real mode does not read or write that key. | 9 | Pass |
| The generated panorama is original to this product, with its source prompt and generation record included. | 15 | Pass |
| Deploy `dist/` as an Azure Static Web App. | 8 | Pass |
| The included hosting file adds security rules and a branded page for missing links. | 13 | Pass |

Checked headings and controls: **Open a system**, **Run a system in three steps**, **What each simulation leaves out**, **Try it with sample data**, **Run this system**, **Reset demo**, **Leave demo and clear sample**, **Copy share link**, **Watch it run**, and **Pause flow** are plain and name their context or result. Navigation labels are links, not action buttons. The terminology is consistent: *simulation*, *system*, *controls*, *fault*, *Watch mode*, and *settings*.

## Demo and sandbox

A fresh 390 × 844 context clicked **Try it with sample data** once. It reached `/demo/?demo=1&system=water&set=65%2C65%2C60`. The immediate in-use screen had the `h1` “Try the water system with sample data”; the persistent banner “Demo — sample data, nothing is saved” at y=0–111; and the seeded settling control at y=613 with value `65` (the complete seed was `65/65/60`), within the 844 px viewport.

Changing settling to `80` and choosing **Reset demo** restored `65`. A pre-seeded real-mode local-storage sentinel remained unchanged. Demo used only `sessionStorage["demo:how-it-runs:state"]`. **Leave demo and clear sample** returned to `/`, removed that session key, and retained the real sentinel.

The full demo flow requested only `https://how-it-runs.sociobot.in`, set no cookies, and logged no browser error. The live browser gate separately exercised offline reload after service-worker control and passed. No demo or sandbox finding applies.

## Claims and clean-clone tests

I read `.factory/claims.json`, installed the fresh clone with `npm ci`, and ran every declared command. `npm test` passed 8/8 tests and `npm run build` emitted `dist/index.html`.

| Claim ID | Result |
| --- | --- |
| `sample-demo-isolated` | PASS |
| `leave-demo-discards-sample` | PASS |
| `free` | PASS |
| `offline-reload` | PASS |
| `no-tracking-storage` | PASS |
| `private-url-settings` | PASS |
| `system-loop` | PASS |
| `keyboard-controls` | PASS |
| `reduced-motion` | PASS |
| `real-routes` | PASS |
| `watch-mode` | PASS |
| `art-provenance` | PASS |
| `build-output` | PASS |
| `hosting-routes` | PASS |
| `node-runtime-support` | PASS — clean install, test, and build on Node 20.19.0, 22.12.0, and 24 |

I re-read the current live landing page and README after the test run. Their reliance statements map to those tested claim entries: seed/isolation/exit, free access, offline reload, tracking and storage, URL settings, the system loop, keyboard, reduced motion, routes, Watch mode, provenance, build output, hosting, and Node support. The limitation statements state scope rather than a new operational promise. No unlisted-claim finding applies.

## Structure, routes, accessibility, and identity

Raw live documents for `/`, `/demo/`, all three `/systems/*/` routes, `/privacy/`, `/terms/`, and a missing route were checked. Each regular route has status 200, one `h1`, `lang="en"`, a route-specific plain-language title and description, canonical, OG/Twitter title, SVG favicon, and Apple touch icon. The missing path returned HTTP 404 with the designed “This page does not exist” screen and its own metadata. System titles now use the required product-first pattern, for example `How It Runs — Clean water works simulator`.

Clicking the first system changed the URL to `/systems/water/?set=45%2C75%2C35`, focused `h1#page-title`, and announced “Clean water works simulator opened.” Back focused the home h1 and announced its opening; Forward restored the water route, focus, and announcement. The local route crawler found four internal link destinations and no non-200 link.

`npm run verify:browser -- https://how-it-runs.sociobot.in` passed: target and fault loop, Watch pause with continuous keyboard focus, fractional URL normalization, 390 px overflow and touch targets, skip link, reduced motion, offline module reload, cache lifecycle, styled 404, and all crawled routes. It reported 0 Axe violations, 0 serious/critical issues, and 0 console errors. `verify-url.sh` independently reported one title, `lang="en"`, `main`, no image-alt omissions, no unlabeled buttons, and no errors.

The navy/paper/marigold art-deco civic-poster system, punched tickets, original panorama, and dark control-room flow stage match `.factory/design.md` and are distinct from a generic SaaS template. Header/footer consistency, Privacy and Terms links, factory credit, and build id were present on the inspected routes.

## Earlier-finding regression check

I read every earlier `review-*`, `polish-*`, verification record, and the prior handoff. This table confirms the actual current live behavior and source, rather than relying on a “fixed” label.

| Earlier finding IDs | Current confirmation |
| --- | --- |
| `R1-B1`, `R1-B2`, `R1-B3`, `R1-B4` | First screen is clear; demo is one-click and isolated; all claims are registered and passed; physical routes, history, 404, focus, and announcement work. |
| `R1-M1`, `R1-M2`, `R1-M3` | Complete per-route metadata and icons, standard shell, and plain consistent terminology are present. |
| `R1-CP01`–`R1-CP19` | The 19 quoted metaphors, jargon terms, indirect labels, and overlong README sentences remain removed or rewritten; the sentence inventory above confirms this. |
| `R1-U01`–`R1-U32` | The former unmeasured claims remain absent or have a corresponding observable manifest test; the 15-test matrix passed. |
| `R2-B1`, `R2-U01`–`R2-U05`, `R2-C01` | Seeded demo opens directly on controls, false/unlisted copy is absent, privacy/exit behavior is isolated, and the affected claims are fully exercised. |
| `R2-S01`, `R2-S02`, `R2-S03` | Raw/executed route metadata is specific, route changes announce and focus, and desktop facts fit before y=900. |
| `R2-CP01`–`R2-CP08` | Exact seed values, “sample data,” “Meet all three targets,” plain motion/route/build/hosting wording, and named exit action remain in place. |
| `F-3-1` / reopened `R1-B3` | The documented Node range passed clean Node 20.19.0, 22.12.0, and 24 installs, tests, and builds. |
| `F-3-2` | The route claim changes, copies, and reopens settings for water, grid, and bakery. |
| `F-4-1` | All system document, OG, Twitter, and client-updated titles are product-first. |
| Earlier verification P1–P3: skip focus; offline/cache/404; Watch focus; touch targets; fractional URL state | The live browser gate independently passed each behavior. |

## Missed leverage

No missing AI, import/export, or sync capability is implied by this brief. The job is an explainable, deterministic causal simulation; a model-generated step would reduce the clarity it is meant to teach. The existing copyable URL is the appropriate lightweight way to share a chosen system state. There is no runtime AI feature, provider key, or unexplained decorative AI claim to flag.

## What would make this perfect

No product change is outstanding from this review. Preserve the existing claim-test matrix and repeat this clean-clone/live check after any copy, route, storage, or service-worker change.
