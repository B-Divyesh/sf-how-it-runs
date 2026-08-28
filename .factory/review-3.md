# Adversarial first-read review 3 — FAIL

- **Product:** How It Runs
- **Live URL:** <https://how-it-runs.sociobot.in>
- **Candidate:** `1fdb855a7d293df5b602e4a964e532fb334a8304`
- **Reviewed:** 2026-08-28 12:24 UTC
- **Viewports:** 390 × 844 and 1440 × 900, fresh Chromium contexts

## Verdict

**FAIL.** One blocking claims-completeness defect remains, and one listed claim
still lacks the test its manifest says it has. The product itself is clear and
tryable, the live demo is isolated, and all 14 declared commands exit zero, but
PASS requires zero findings and no untested claim.

## Cold first read, before scrolling

| Viewport | What this does | For whom | What I should click first |
| --- | --- | --- | --- |
| 390 × 844 | It lets me run browser simulations of water, power, and bakery systems. | Kids and grown-ups curious about how those systems reach a neighborhood. | **Try it with sample data**; the next line names the exact water settings. |
| 1440 × 900 | The same; the original poster also shows all three systems. | Kids and grown-ups. | **Try it with sample data**. |

The decisive first-screen copy is:

> “Run water, power, and bakery systems”

> “For kids and grown-ups who want to see how water, power, and bread reach a neighborhood.”

> “Try it with sample data”

> “Opens water at 65% settling, 65% filter speed, and 60% disinfectant.”

All three questions are answerable without scrolling at both sizes. The three
plain facts are also fully visible. The first-read requirement passes.

## Findings

### BLOCKING F-3-1 / reopened R1-B3 — The Node requirement is unlisted and false for part of the promised range

**Quote/location:** README line 24: “Use Node.js 20 or newer.” Package manifest:
`"node": ">=20"`.

**Evidence:** There is no Node-version entry in `.factory/claims.json`. The
installed Vite 7.3.6 package requires `^20.19.0 || >=22.12.0`. From the clean
clone, this direct Node 20.0 exercise failed:

```text
$ npx --yes node@20.0.0 ./node_modules/vite/bin/vite.js build
You are using Node.js 20.0.0. Vite requires Node.js version 20.19+ or 22.12+.
error during build: [vite:build-html] crypto.hash is not a function
```

**Why this misleads:** A contributor can follow the documented requirement with
a valid Node 20 release and immediately hit a build failure. The same
operational claim was flagged as unlisted in review 2 and was not repaired, so
the earlier broad claim-completeness finding R1-B3 is not fully fixed.

**Concrete fix:** Change README and `package.json#engines.node` to Vite’s real
range, for example **“Use Node.js 20.19+ (20.x) or 22.12+.”** Add a
`node-runtime-support` entry to `.factory/claims.json` whose clean-sandbox test
runs install, tests, and build on the minimum documented version and a current
LTS version.

### MAJOR F-3-2 — The `real-routes` claim test does not test its claim

**Quote/location:** `.factory/claims.json`: “Each simulation has a link you can
copy and reopen.” Declared command:
`npm run test:claims -- --grep @claim:real-routes`.

**Evidence:** The `real-routes` block in `scripts/claims.mjs` checks raw and
executed metadata, a water route transition, focus, announcement, Back, and
Forward. It never clicks **Copy share link**, reads the clipboard, reopens a
copied link, or repeats that operation for water, power, and bakery. The
separate `private-url-settings` test copies and reopens only water.

The live behavior itself worked in an independent manual exercise for all
three systems: water reopened at 50%, grid at 50%, and bakery at 45%. That
manual result does not satisfy the rule that the declared claim test must prove
the full published sentence on every build.

**Why this misleads:** The manifest presents the claim as continuously tested,
but its tagged test could pass if the grid or bakery share action stopped
working.

**Concrete fix:** Extend `@claim:real-routes` to loop over all three systems,
change one setting, click **Copy share link**, assert the copied path and
allowed query keys, open it in a fresh page, and assert that the changed value
returns. Keep metadata/history assertions in a separate structure test or
rename the claim so its command and wording match.

## Demo and sandbox exercise

One click from the live home page opened
`/demo/?demo=1&system=water&set=65%2C65%2C60`. At 390 × 844:

- the demo banner occupied y=0–111 and stayed at y=0 after scrolling;
- the demo h1 occupied y=195–286;
- the settling control occupied y=613–657 and showed 65%;
- Reset restored settling from 80% to 65%;
- leaving removed only `demo:how-it-runs:state` and returned to `/`;
- a seeded `real:how-it-runs:state=keep` value was unchanged;
- an unrelated `demo:other` key was also unchanged;
- every observed request was same-origin.

The first screen after the click is the working product, not another landing
screen. The demo requirement passes.

The offline claim test installed the service worker, blocked the network, and
reopened the demo and all three system routes with their seeded controls. The
privacy test traversed the demo and all systems while capturing requests; it
found no other origins, tracking-shaped endpoints, cookies, profile storage,
WebSockets, event streams, or account UI.

## Claims execution from a clean clone

Clean clone: `/tmp/how-it-runs-review3.6Wz6sR/clean`, at `1fdb855`. Every exact
command in `.factory/claims.json` was invoked separately.

| Claim | Command result | Coverage result |
| --- | --- | --- |
| `sample-demo-isolated` | PASS | PASS — first viewport, exact seed, reset, canonical demo, and real-key isolation asserted. |
| `leave-demo-discards-sample` | PASS | PASS — demo key removed and real key preserved. |
| `free` | PASS | PASS — all three simulations opened without a payment or account gate. |
| `offline-reload` | PASS | PASS — demo and all three systems reopened offline. |
| `no-tracking-storage` | PASS | PASS — full-flow request, cookie, storage, stream, and account checks. |
| `private-url-settings` | PASS | PASS — water settings copied and reopened with only allowed query keys. |
| `system-loop` | PASS | PASS — exact counts, reactive meters, target, fault effect, and job note for every system. |
| `keyboard-controls` | PASS | PASS — ArrowRight changed the native range value. |
| `reduced-motion` | PASS | PASS — all animation/transition durations and scroll behavior inspected. |
| `real-routes` | PASS | **INADEQUATE — does not exercise the claim quoted above; F-3-2.** |
| `watch-mode` | PASS | PASS — pause, resume, fourth caption, and stopped state asserted. |
| `art-provenance` | PASS | PASS — retained source, prompt, generation record, and disclosure checked. |
| `build-output` | PASS | PASS — root HTML, hashed assets, and hosting configuration checked. |
| `hosting-routes` | PASS | PASS — status 404, branded content, CSP, and nosniff checked. |

No declared command failed. F-3-2 concerns the mismatch between one claim’s
wording and what its passing command actually asserts.

## Complete landing-page copy audit

Counts use whitespace-delimited words; hyphenated terms count as one word.
Repeated metadata is shown once with its occurrence count. No sentence exceeds
22 words or uses a banned plain-words term.

| Sentence | Words | Flag |
| --- | ---: | --- |
| Run water, power, and bakery browser simulations with three controls and five stages. | 13 | —; meta/OG/Twitter description ×3 |
| For kids and grown-ups who want to see how water, power, and bread reach a neighborhood. | 16 | — |
| Opens water at 65% settling, 65% filter speed, and 60% disinfectant. | 11 | — |
| Free. | 1 | — |
| Works offline after the first visit. | 6 | — |
| No account; settings stay in the URL. | 7 | — |
| Each simulation has controls, five stages, live results, a fault, and a worker’s job note. | 15 | — |
| Guide cloudy river water through settling, filtering, and careful disinfection. | 10 | — |
| Balance a small generator, a battery, and flexible uses as the neighborhood changes. | 13 | — |
| Mix, bake, and move loaves through a small production bakery before the morning delivery. | 14 | — |
| Choose water, power, or bakery to open a simulation. | 9 | — |
| Choose water, power, or bakery. | 5 | — |
| Move the controls and read the live results. | 8 | — |
| Meet all three targets, then try a fault. | 8 | — |
| Each simulator has three controls and three result meters. | 9 | — |
| These simulations are not engineering tools. | 6 | — |
| First ask for a prediction. | 5 | — |
| Move one lever, name what changed, then try the fault. | 10 | — |
| In watch mode, pause after each caption and ask what you would do next. | 14 | — |
| There are no accounts, analytics, cookies, or saved profiles. | 9 | — |
| A share link contains only the current system settings. | 9 | — |
| You’re offline. | 2 | —; conditional banner |
| The current simulation still works. | 5 | —; conditional banner |
| How It Runs · A free browser simulator for kids and grown-ups. | 12 | — |
| Original generated panorama. | 3 | — |

Headings, labels, actions, navigation, and alt text are also audited because
the plain-words rules apply to them:

| Copy | Words | Type/result |
| --- | ---: | --- |
| How It Runs — Everyday system simulators | 7 | Title; pass |
| Skip to main content | 4 | Link; pass |
| How It Runs | 3 | Wordmark; pass |
| Demo / Systems / Privacy | 1 each | Navigation links; pass |
| Browser simulations for everyday systems | 5 | Eyebrow; pass |
| Run water, power, and bakery systems | 6 | h1; pass |
| Try it with sample data | 5 | Result-naming action; pass |
| Choose a system to simulate | 5 | Eyebrow; pass |
| Open a system | 3 | h2; pass |
| From river to tap | 4 | Card label; pass |
| Clean water works | 3 | h3; pass |
| Match supply to demand | 4 | Card label; pass |
| Neighborhood power grid | 3 | h3; pass |
| Dough to doorstep | 3 | Card label; pass |
| Morning bakery line | 3 | h3; pass |
| Run this system | 3 | Button ×3; pass |
| Your controls appear here | 4 | Empty-state h2; pass |
| How it works | 3 | Eyebrow; pass |
| Run a system in three steps | 6 | h2; pass |
| Open / Adjust / Respond | 1 each | Step labels; pass |
| For parents and teachers | 4 | Eyebrow; pass |
| What each simulation leaves out | 5 | h2; pass |
| How to use this with a child or class | 9 | Summary; pass |
| Your settings are not saved | 5 | Summary; pass |
| Demo — sample data, nothing is saved | 7 | Conditional banner; pass |
| Reset demo | 2 | Button; pass |
| Leave demo and clear sample | 5 | Button; pass |
| Poster illustration joining a waterworks, electric grid, and bakery into one neighborhood | 12 | Alt text; pass |
| Built by Param Factory · build polish-2 | 7 | Footer build label; pass |

Terminology is consistent: **simulation** is the activity, **system** is the
water/power/bakery choice, **fault** is the disruption, **controls** are the
inputs, **Watch mode** is the walkthrough, and **settings** are URL values.

## Complete README copy audit

Commands are commands rather than sentences. Headings and the license link are
listed separately below. No README sentence exceeds 22 words or uses a banned
marketing word.

| Sentence | Words | Flag |
| --- | ---: | --- |
| Run water, power, and bakery systems. | 6 | — |
| This free browser simulator is for kids and grown-ups curious about everyday infrastructure. | 13 | — |
| Open the sample demo. | 4 | — |
| One click opens water at 65% settling, 65% filter speed, and 60% disinfectant. | 13 | — |
| The demo banner stays visible while sample data is active. | 10 | — |
| Reset demo restores the sample data. | 6 | — |
| Leave demo and clear sample removes it. | 7 | — |
| Each simulation has three controls, five stages, three live results, a fault, and a worker’s job note. | 17 | — |
| Controls work with arrow keys. | 5 | — |
| If your device reduces motion, flow lines stay still and screen changes do not animate. | 15 | — |
| Each simulation has a link you can copy and reopen. | 10 | F-3-2: declared test does not prove it |
| Watch mode can pause and stops after four captions. | 9 | — |
| Works offline after the first visit. | 6 | — |
| No account; settings stay in the URL. | 7 | — |
| There are no accounts, analytics, cookies, or saved profiles. | 9 | — |
| These simulations are not engineering, food-safety, or operational guidance. | 9 | — |
| Use Node.js 20 or newer. | 5 | F-3-1: unlisted and false for 20.0–20.18 |
| The production build creates the static site in `dist`, with `index.html` at its root. | 14 | — |
| Demo changes use only `demo:how-it-runs:state` in session storage. | 8 | — |
| Real mode does not read or write that key. | 9 | — |
| The generated panorama is original to this product, with its source prompt and generation record included. | 16 | — |
| Deploy `dist/` as an Azure Static Web App. | 8 | Instruction; pass |
| The included hosting file adds security rules and a branded page for missing links. | 14 | — |

| Heading/link | Words | Result |
| --- | ---: | --- |
| How It Runs | 3 | Document heading; pass |
| What is included | 3 | Heading; pass |
| Run locally | 2 | Heading; pass |
| Test and build | 3 | Heading; pass |
| Privacy and demo storage | 4 | Heading; pass |
| Deploy | 1 | Heading; pass |
| License | 1 | Heading; pass |
| MIT License | 2 | Link; pass |

## Structure, accessibility, privacy, and crawl

| Check | Result |
| --- | --- |
| Titles | PASS — home is “How It Runs — Everyday system simulators”; demo, each system, Privacy, Terms, and 404 have route-specific titles. |
| One h1 / landmarks | PASS — every crawled route has `lang=en`, one h1, one main, header/footer, and labelled images/buttons. |
| Metadata | PASS — descriptions, canonicals, Open Graph/Twitter fields, 1200 × 630 image, SVG favicon, and 180 px touch icon are present. |
| Routing | PASS — physical deep links load; home → water → Back → Forward restores URL, state, scroll, headline focus, and polite announcements. |
| 404 | PASS — unknown route returns HTTP 404 with the designed page and links home/demo. |
| Crawl | PASS — `/`, demo, three systems, Privacy, and Terms return 200; all discovered internal links resolve. |
| Header/footer | PASS — common wordmark/nav and Privacy/Terms/factory/build footer information are present on every route. |
| Mobile | PASS — no 390 px page overflow; all checked interactive targets are at least 44 × 44 CSS px. |
| Keyboard/motion | PASS — skip focus, range arrows, Watch Enter/Space, retained focus, and reduced-motion behavior pass. |
| Accessibility | PASS — axe reports zero violations on all eight tested routes; the URL verifier reports no baseline errors. |
| Console | PASS — zero unexpected console errors or page errors in the live browser gate. |
| Privacy | PASS — only same-origin requests; no cookies, account UI, profile storage, analytics, or third-party runtime resources observed. |
| Offline | PASS — service-worker-controlled demo and system routes reopen without a network. |
| Budget | PASS — entry JS is 22.50 kB raw / 8.32 kB gzip; CSS is 24.49 kB raw / 6.30 kB gzip. |
| Visual identity | PASS — the navy/paper/marigold civic poster, ticket shapes, line diagrams, and original panorama are distinct from a generic SaaS template and match `.factory/design.md`. |

The live browser gate returned zero axe violations, zero console errors, no
mobile overflow, valid touch targets, working offline reload, correct caching,
and a designed 404. `/opt/fleet/lib/verify-url.sh` loaded the live home in 550
ms and reported no errors.

## Earlier-finding reconciliation

The checks below use both the live deployment and the current source. “Fixed”
means the behavior was independently exercised, not merely marked complete in
the polish record.

### Review 1

| Prior ID | Status | Confirmation |
| --- | --- | --- |
| R1-B1 | Fixed | Both cold first screens name the product job, audience, and first action. |
| R1-B2 | Fixed | One-click isolated demo, first-viewport product, sticky banner, reset, exit, and namespace isolation pass. |
| R1-B3 | **Reopened by F-3-1** | A manifest now exists, but the earlier unlisted Node requirement remains and is partly false; F-3-2 also leaves one listed claim untested by its declared command. |
| R1-B4 | Fixed | Real routes, 404 status, Back/Forward, route h1 focus, and announcements pass live. |
| R1-M1 | Fixed | Complete route metadata, social image, canonical, and icons confirmed. |
| R1-M2 | Fixed | Standard landing order and shared legal/footer shell confirmed. |
| R1-M3 | Fixed | Product vocabulary is consistently simulation/system/fault/controls/settings. |
| R1-CP01 | Fixed | Headline is the verb-led product job. |
| R1-CP02 | Fixed | Audience sentence names kids and grown-ups. |
| R1-CP03 | Fixed | Primary action is “Try it with sample data.” |
| R1-CP04 | Fixed | Transit metaphors no longer name the product activity. |
| R1-CP05 | Fixed | Section says “Open a system.” |
| R1-CP06 | Fixed | Empty state says how to open controls. |
| R1-CP07 | Fixed | Heading says “For parents and teachers.” |
| R1-CP08 | Fixed | Limitations heading names what is left out. |
| R1-CP09 | Fixed | “Intuition-builders” was removed. |
| R1-CP10 | Fixed | Summary says settings are not saved. |
| R1-CP11 | Fixed | “Kid-safe explorable” was removed. |
| R1-CP12 | Fixed | README loop copy is split into short statements. |
| R1-CP13 | Fixed | The 42-word verifier sentence was removed. |
| R1-CP14 | Fixed | “Explorable explanation” was removed. |
| R1-CP15 | Fixed | Unmeasured intuition language was removed. |
| R1-CP16 | Fixed | URL storage is described in plain words. |
| R1-CP17 | Fixed | “App shell” and “runtime CDNs” were removed from README copy. |
| R1-CP18 | Fixed | Hosting is described as files, security rules, and a missing-page response. |
| R1-CP19 | Fixed | “Browser simulator” and “simulation” are used consistently. |
| R1-U01 | Fixed | Five-minute claim removed. |
| R1-U02 | Fixed | Every system’s worker note is required by `system-loop`. |
| R1-U03 | Fixed | “No score” removed. |
| R1-U04 | Fixed | “No timer” removed. |
| R1-U05 | Fixed | Target, fault effect, and recovery loop are exercised. |
| R1-U06 | Fixed | Fidelity claim replaced by exact control/meter counts and a limitation. |
| R1-U07 | Fixed | Non-empty worker note required for every system. |
| R1-U08 | Fixed | Exact privacy sentence is listed and intercepted/tested. |
| R1-U09 | Fixed | URL keys and restored water setting are asserted. |
| R1-U10 | Fixed | Offline demo and all systems are exercised. |
| R1-U11 | Fixed | “Kid-safe” removed; free claim is listed. |
| R1-U12 | Fixed | Source, prompt, generation record, and disclosure are present. |
| R1-U13 | Fixed | Unmeasured learning outcome removed. |
| R1-U14 | Fixed | All three simulation routes are exercised. |
| R1-U15 | Fixed | Three controls, five stages, three results, fault, note, and limitation are exercised. |
| R1-U16 | Fixed | Watch starts, pauses, resumes, and completes without more input. |
| R1-U17 | Fixed | Only the safety limitation remains. |
| R1-U18 | Fixed | Every simulation must expose its simplification note. |
| R1-U19 | Fixed | URL state is described plainly and round-tripped. |
| R1-U20 | Fixed | URL, network, cookie, and storage behavior are exercised. |
| R1-U21 | Fixed | Service-worker-controlled offline reload passes. |
| R1-U22 | Fixed | Four-caption Watch completion and pause pass. |
| R1-U23 | Fixed | Native range keyboard input passes. |
| R1-U24 | Fixed | All computed animation/transition durations are checked under reduced motion. |
| R1-U25 | Fixed | Full-flow interception rejects other origins and tracking-shaped paths. |
| R1-U26 | Fixed | Retained-source provenance check exists and passes. |
| R1-U27 | Fixed | “Five-minute” and “kid-safe” are absent from metadata. |
| R1-U28 | Fixed | Controls and reactive meters are exercised for every system. |
| R1-U29 | Fixed | Water, power, and bakery loops all reach their target and fault. |
| R1-U30 | Fixed | Social copy is structural and metadata is route-specific. |
| R1-U31 | Fixed | `build-output` asserts the production files. |
| R1-U32 | Fixed | Broad verifier marketing was replaced with individual claim commands. |

### Review 2

| Prior ID | Status | Confirmation |
| --- | --- | --- |
| R2-B1 | Fixed | Demo opens directly on its working water controls; banner is sticky/hidden correctly; leaving clears the demo key. |
| R2-U01 | Fixed | Five-minute claim removed. |
| R2-U02 | Fixed | Exact 65/65/60 settings replace “realistic settings.” |
| R2-U03 | Fixed | Copy now states exact control/meter counts and the loop test checks reactivity. |
| R2-U04 | Fixed | Full privacy wording has its own manifest entry and network/storage test. |
| R2-U05 | Fixed | Leave-demo claim is listed and exercised. |
| R2-C01 | Fixed | System-loop and reduced-motion tests now prove the wording cited in that finding. |
| R2-S01 | Fixed | Raw and executed metadata identify demo, systems, legal pages, and 404. |
| R2-S02 | Fixed | Live region and headline focus update on selection, Back, and Forward. |
| R2-S03 | Fixed | All three facts end above y=900 on desktop. |
| R2-CP01 | Fixed | “Realistic settings” removed. |
| R2-CP02 | Fixed | “Sample data” is used consistently. |
| R2-CP03 | Fixed | “Meet all three targets” replaces “steady zone.” |
| R2-CP04 | Fixed | Exit action says “Leave demo and clear sample.” |
| R2-CP05 | Fixed | Reduced-motion copy is in plain language. |
| R2-CP06 | Fixed as copy | “Link you can copy and reopen” replaces “shareable routes”; its test mapping is separately defective in F-3-2. |
| R2-CP07 | Fixed | Build-output sentence uses plain wording. |
| R2-CP08 | Fixed | Hosting-file sentence uses plain wording. |
| R2 unnumbered Node claim flag | **Not fixed; F-3-1** | The wording changed from “Requires” to “Use,” but it remains unlisted and overstates supported Node 20 versions. |

## Missed leverage

No additional AI, sync, import, or export feature is clearly implied by the
brief. The core job is a short, deterministic causal simulation; adding model
output would reduce explainability and require keys without solving a missing
user step. Copyable URL state already provides the appropriate lightweight
sharing mechanism.

## What would make this perfect

There are exactly two remaining actions:

1. Correct and claim-test the minimum Node versions.
2. Make `@claim:real-routes` prove copy-and-reopen behavior for every system.

After those changes, rerun every manifest command from a new clone and repeat
the live first-read, demo isolation, crawl, metadata, accessibility, offline,
and history checks. Nothing else was found in this round.
