# Adversarial first-read review 2 — FAIL

- **Product:** How It Runs
- **Live URL:** <https://how-it-runs.sociobot.in>
- **Repository candidate:** `074ecf29c14647996ee59d6a63a62d97b416d18e`
- **Live build label:** `b2914d5-r1`
- **Reviewed:** 2026-08-28 10:27 UTC
**Viewports:** 390 × 844 and 1440 × 900, fresh Chromium contexts

## Verdict

**FAIL.** The required one-click demo does not show the product in use on the
next screen, and its banner is broken in both demo and real mode. That is one
BLOCKING finding. There are also unlisted and incompletely tested claims,
route-metadata errors, a missing route announcement, and copy/first-screen
issues. This exceeds the PASS limit of zero BLOCKING findings and at most three
minor findings.

## Cold first read, before scrolling

| Viewport | What I think this does | For whom | What I should click first |
| --- | --- | --- | --- |
| 390 × 844 | It is a five-minute browser simulator showing how water, power, and bread systems work. | Kids and grown-ups. | **Try it with sample data**; the adjacent text says it opens a working water system. |
| 1440 × 900 | The same. The large poster makes the three system types visible without relying on the text alone. | Kids and grown-ups. | **Try it with sample data**. |

All three questions can be answered from the first screen. The decisive text is:

> “Run everyday systems in five minutes”

> “For kids and grown-ups who want to see how water, power, and bread reach a neighborhood.”

> “Try it with sample data” / “Opens a working water system with realistic settings.”

The first-screen comprehension check therefore passes. The action itself fails
after it is selected, as described in B1.

## Findings, ordered by severity

### BLOCKING B1 — The one-click demo does not open on the product, and its mode banner is false outside demo mode

**Quote:** “Try it with sample data”; “Demo — sample data, nothing is saved”;
“Start for real leaves the sample without keeping it.”

**Observed:** One tap from the 390 px home page reached
`/demo/?demo=1&system=water&set=65%2C65%2C60`, but the next viewport was another
hero screen. The seeded simulator started about **2,230 px below** the viewport.
The demo banner started about **6,510 px below** it, after the complete page, so
it was neither immediately visible nor persistent. On ordinary `/`, the banner
had `hidden=true` but computed `display:flex` and appeared near the bottom of the
page. “Start for real” returned to `/`, where that false demo banner remained,
and left `demo:how-it-runs:state` in session storage.

Reset did restore the three seeded values to `65,65,60`. A pre-seeded
`real:how-it-runs:state=keep` value was unchanged. All 20 observed requests were
same-origin, and the sample reloaded offline. Those passes do not repair the
missing immediate product view or the incorrect mode indicator.

**Why a first-time visitor is lost or misled:** The promised one-click trial
looks like a second landing page. A visitor must scroll through the hero and
system cards before finding the working controls, and cannot see that they are
in a sandbox. The same banner later labels real mode as demo mode, while “Start
for real” does not discard the demo state it says it leaves behind.

**Concrete fix:** Put the banner before the demo content and keep it visible at
the top. Render or focus the seeded simulator in the first demo viewport. Add a
global `[hidden] { display: none !important; }` rule or an equivalent
`.demo-banner[hidden]` rule. Make **Start for real** clear the `demo:` session
key before opening real mode. Extend the demo claim test to assert the banner
and a seeded control intersect the initial 390 × 844 viewport, the banner is not
rendered on `/`, and the demo key is absent after leaving.

### MAJOR U01 — The five-minute quantitative claim is unlisted

**Quote:** “Run everyday systems in five minutes.” (landing and README)

**Why this can mislead:** `.factory/claims.json` has no duration entry or test.
The core headline makes a measurable completion-time promise.

**Concrete fix:** Replace it with **“Run water, power, and bakery systems”**, or
add `@claim:five-minute-run` with a defined completion path and a measured
five-minute threshold.

### MAJOR U02 — “Realistic settings” is an unlisted, undefined claim

**Quote:** “Opens a working water system with realistic settings.”

**Why this can mislead:** `sample-demo-isolated` verifies the values `65,65,60`,
but neither the manifest nor the test defines or proves that they are realistic.

**Concrete fix:** Use **“Opens the water simulator at 65% settling, 65% filter
speed, and 60% disinfectant.”**

### MAJOR U03 — Reactive results are claimed but not listed or exercised

**Quote:** “These simulations show how one control changes several results.”

**Why this can mislead:** No claim entry promises that moving a control changes
multiple outputs. The `system-loop` test only counts controls and containers.

**Concrete fix:** Add `@claim:reactive-results`; move each system’s controls and
assert the expected result values change. Otherwise rewrite to the structural,
tested statement: **“Each simulator has three controls and three result meters.”**

### MAJOR U04 — The broad privacy sentence is not represented by its claim entry

**Quote:** “There are no accounts, analytics, cookies, or saved profiles.”

**Why this can mislead:** `private-url-settings` names only accounts and URL
settings. Its same-origin request check would allow same-origin analytics, so it
does not prove the full displayed sentence.

**Concrete fix:** Add the exact sentence to the manifest and assert that the
whole demo flow creates no cookies/profile storage and sends no analytics
request, including same-origin endpoints. Otherwise remove “analytics.”

### MAJOR U05 — The README’s leave-demo claim is unlisted and currently false

**Quote:** “Start for real leaves the sample without keeping it.”

**Why this can mislead:** After using **Start for real**, the fresh context still
contained `demo:how-it-runs:state`. No claim entry or test covers leaving demo.

**Concrete fix:** Clear the demo namespace on exit and add
`@claim:leave-demo-discards-sample` that asserts the real URL, hidden banner,
empty demo namespace, and untouched real namespace.

### MAJOR C01 — Two listed claim tests do not prove their complete wording

**Quote:** “Each simulation has controls, five stages, live results, a fault,
and a worker’s job note.” / “Reduced-motion users receive static flow lines and
instant transitions.”

**Why this can mislead:** `system-loop` checks three range inputs, five list
items, and whether at least one of three containers exists. It never changes a
control, observes a live result, unlocks or operates the fault, or separately
requires the job note. `reduced-motion` checks one flow-line animation duration
but never checks the promised transitions.

**Concrete fix:** For every system, require each results/fault/job container,
move a control and assert result changes, reach the target, trigger the fault,
and assert a changed outcome. In the reduced-motion test, inspect transition and
animation durations for controls, gauges, flow lines, and route changes.

### MAJOR S01 — Demo and route metadata do not identify their actual routes

**Quote/evidence:** After JavaScript runs, `/demo/` has the title “Clean water
works simulator — How It Runs” and canonical URL `/systems/water/`, not “Demo —
How It Runs” and `/demo/`. All three system documents ship the home Twitter
title and a generic Open Graph description. Privacy and Terms omit Twitter
title, description, and image. The 404 omits canonical and Open Graph/Twitter
metadata.

**Why this can mislead:** Shared demo and system URLs identify themselves as a
different route or as the generic home page. Search engines and preview bots may
not execute the JavaScript that repairs only some fields.

**Concrete fix:** Give every physical route complete server-rendered title,
description, canonical, Open Graph, and Twitter fields. In `setDocumentRoute`,
handle demo mode before the selected system so the demo canonical remains
`/demo/`. Add metadata assertions for raw HTML and the executed page.

### MAJOR S02 — Route changes focus the headline but do not announce it

**Quote/evidence:** Selecting water, then using Back and Forward, correctly
focused the changing `<h1>`, but `#route-announcement.textContent` remained
empty after every transition.

**Why this can mislead:** A screen-reader user receives focus movement without
the required polite route-change announcement.

**Concrete fix:** Pass `announce=true` through `renderSimulator` to
`setDocumentRoute`, then test that the live region says “Clean water works
simulator opened” and “How It Runs home opened” after selection and history
navigation.

### MINOR S03 — The three product facts fall below the desktop first screen

**Quote:** “Free.” / “Works offline after the first visit.” / “No account;
settings stay in the URL.”

**Why this matters:** At 1440 × 900, the facts began at y=899.64 and ended at
y=947.92. They are effectively absent before scrolling, although all three fit
at 390 × 844.

**Concrete fix:** Reduce the desktop headline size/line count or vertical hero
padding so the complete fact list ends above y=900.

### Copy findings

No sentence exceeds 22 words, and none contains a banned plain-words term. The
following remaining flags are individual findings:

| ID | Severity | Quote | Why it fails first-read copy | Proposed rewrite |
| --- | --- | --- | --- | --- |
| CP01 | Major; same issue as U02 | “realistic settings” | “Realistic” is an undefined marketing adjective. | “settings of 65% settling, 65% filter speed, and 60% disinfectant” |
| CP02 | Minor | “sample data” / “sample settings” / “the sample” | One set of demo values has three names. | Use **sample data** consistently, including “It starts a water simulation with sample data.” |
| CP03 | Minor | “Reach the steady zone, then try a fault.” | “Steady zone” is simulator jargon before the targets are visible. | “Meet all three targets, then try a fault.” |
| CP04 | Major; same issue as B1/U05 | “Start for real” | The action does not name its result, and currently retains the demo key. | “Leave demo and clear sample” |
| CP05 | Minor | “Reduced-motion users receive static flow lines and instant transitions.” | “Reduced-motion” and “transitions” are technical UI terms. | “If your device reduces motion, flow lines stay still and screen changes do not animate.” |
| CP06 | Minor | “Water, power, and bakery simulations have shareable routes.” | “Shareable routes” is web jargon and conflicts with **system** as the product term. | “Each simulation has a link you can copy and reopen.” |
| CP07 | Minor | “`npm run build` writes the deployable static site to `dist/`.” | “Deployable static site” is avoidable build jargon. | “`npm run build` creates the site files in `dist/`.” |
| CP08 | Minor | “The checked-in configuration sets headers and a styled 404 response.” | “Configuration,” “headers,” and “404 response” assume deployment knowledge. | “The included hosting file adds security rules and a branded page for missing links.” |

All landing headings make sense out of context. **Try it with sample data**,
**Run this system**, and **Reset demo** name their results sufficiently. **Start
for real** is the only action-label failure.

## Complete landing-page copy inventory

Counts use whitespace-delimited words. Repeated text is marked by occurrence.

| Copy | Words | Occurrence/note |
| --- | ---: | --- |
| How It Runs — Everyday system simulators | 6 | Document title |
| Run water, power, and bakery simulations with clear controls and visible results. | 11 | Meta description; C01 |
| Run water, power, and bakery systems with sample settings. | 9 | Open Graph/Twitter description |
| Skip to main content | 4 | Keyboard action |
| How It Runs | 3 | Wordmark |
| Demo | 1 | Navigation |
| Systems | 1 | Navigation |
| Privacy | 1 | Navigation/footer |
| Browser simulations for everyday systems | 5 | Eyebrow |
| Run everyday systems in five minutes | 6 | H1; U01 |
| For kids and grown-ups who want to see how water, power, and bread reach a neighborhood. | 16 | Hero sentence |
| Try it with sample data | 5 | Primary action; CP02 |
| Opens a working water system with realistic settings. | 8 | Hero sentence; U02/CP01 |
| Free. | 1 | Fact |
| Works offline after the first visit. | 6 | Fact |
| No account; settings stay in the URL. | 7 | Fact |
| Poster illustration joining a waterworks, electric grid, and bakery into one neighborhood | 11 | Image alternative text |
| Choose a system to simulate | 5 | Eyebrow |
| Open a system | 3 | H2 |
| Each simulation has controls, five stages, live results, a fault, and a worker’s job note. | 15 | Section sentence; C01 |
| From river to tap | 4 | Card label |
| Clean water works | 3 | H3 |
| Guide cloudy river water through settling, filtering, and careful disinfection. | 10 | Card sentence |
| Run this system | 3 | Action 1 of 3 |
| Match supply to demand | 4 | Card label |
| Neighborhood power grid | 3 | H3 |
| Balance a small generator, a battery, and flexible uses as the neighborhood changes. | 13 | Card sentence |
| Run this system | 3 | Action 2 of 3 |
| Dough to doorstep | 3 | Card label |
| Morning bakery line | 3 | H3 |
| Mix, bake, and move loaves through a small production bakery before the morning delivery. | 14 | Card sentence |
| Run this system | 3 | Action 3 of 3 |
| Your controls appear here | 4 | H2 |
| Choose water, power, or bakery to open a simulation. | 9 | Empty-state sentence |
| How it works | 3 | Eyebrow |
| Run a system in three steps | 6 | H2 |
| Open | 1 | Step label |
| Choose water, power, or bakery. | 5 | Step sentence |
| Adjust | 1 | Step label |
| Move the controls and read the live results. | 8 | Step sentence |
| Respond | 1 | Step label |
| Reach the steady zone, then try a fault. | 8 | Step sentence; CP03 |
| For parents and teachers | 4 | Eyebrow |
| What each simulation leaves out | 5 | H2 |
| These simulations show how one control changes several results. | 9 | Sentence; U03 |
| They are not engineering tools. | 5 | Sentence |
| Each system shows three controls and five stages. | 8 | Sentence |
| How to use this with a child or class | 9 | Summary heading |
| First ask for a prediction. | 5 | Sentence |
| Move one lever, name what changed, then try the fault. | 10 | Sentence |
| In watch mode, pause after each caption and ask what you would do next. | 14 | Sentence |
| Your settings are not saved | 5 | Summary heading |
| There are no accounts, analytics, cookies, or saved profiles. | 9 | Sentence; U04 |
| A share link contains only the current system settings. | 9 | Sentence |
| Demo — sample data, nothing is saved | 7 | Banner; CP02 |
| Reset demo | 2 | Action |
| Start for real | 3 | Action; B1/U05/CP04 |
| How It Runs · A free browser simulator for kids and grown-ups. | 12 | Footer sentence |
| Terms | 1 | Footer link |
| Built by Param Factory · build b2914d5-r1 | 7 | Footer label |

## Complete README copy inventory

Shell commands are commands rather than sentences and are not counted.

| Copy | Words | Note |
| --- | ---: | --- |
| How It Runs | 3 | H1 |
| Run everyday systems in five minutes. | 6 | Sentence; U01 |
| This free browser simulator is for kids and grown-ups who want to see how water, power, and bread reach a neighborhood. | 21 | Sentence |
| Open the sample demo. | 4 | Sentence/link |
| It starts a water simulation with sample settings. | 8 | Sentence; CP02 |
| The banner says when sample data is active. | 8 | Sentence |
| Reset demo restores the sample. | 5 | Sentence; CP02 |
| Start for real leaves the sample without keeping it. | 9 | Sentence; B1/U05 |
| What is included | 3 | H2 |
| Water, power, and bakery simulations have controls, five stages, live results, a fault, and a worker’s job note. | 18 | List sentence; C01 |
| Controls work with arrow keys. | 5 | List sentence |
| Reduced-motion users receive static flow lines and instant transitions. | 9 | List sentence; C01/CP05 |
| Water, power, and bakery simulations have shareable routes. | 8 | List sentence; CP06 |
| Works offline after the first visit. | 6 | List sentence |
| No account; settings stay in the URL. | 7 | List sentence |
| These simulations are not engineering, food-safety, or operational guidance. | 9 | Sentence |
| Run locally | 2 | H2 |
| Requires Node.js 20 or newer. | 5 | Sentence; unlisted operational claim |
| Test and build | 3 | H2 |
| `npm run build` writes the deployable static site to `dist/`. | 10 | Sentence; CP07 and unlisted operational claim |
| Deploy | 1 | H2 |
| Deploy `dist/` as an Azure Static Web App. | 8 | Sentence |
| The checked-in configuration sets headers and a styled 404 response. | 10 | Sentence; CP08 and unlisted operational claim |
| License | 1 | H2 |
| MIT License | 2 | Link label |

The three operational README statements marked “unlisted” are lower-risk than
the public product promises, but they are still assertions without entries in
the current exhaustive manifest. Add Node 20 CI, a `dist/index.html` assertion,
and header/404 assertions to the manifest, or move them into a clearly labelled
verification record.

## Claims execution from a clean clone

Clean clone: `/tmp/how-it-runs-claims.zfzLFM`, at candidate `074ecf2` before
review files were added. Every exact `test` command from `.factory/claims.json`
was run separately.

| Claim ID | Result | Evidence |
| --- | --- | --- |
| `sample-demo-isolated` | PASS | Seed `65,65,60`, reset, `demo:` session key, and untouched real key asserted. |
| `free` | PASS | Water, grid, and bakery opened; no checked gate on the final route. |
| `offline-reload` | PASS | Service-worker-controlled demo reloaded offline. |
| `private-url-settings` | PASS | Same-origin requests, no cookies/real storage, URL settings, and share action asserted. |
| `system-loop` | PASS, inadequate coverage | DOM counts passed; live updates and the fault outcome were not exercised. |
| `keyboard-controls` | PASS | ArrowRight changed a native range input. |
| `reduced-motion` | PASS, inadequate coverage | One flow animation duration passed; transitions were not asserted. |
| `real-routes` | PASS | Route title/headline and water Back/Forward checks passed. |

There was no command-level claim failure, so no BLOCKING finding is assigned for
a failing listed test. C01 records the observable coverage gaps.

## Sandbox, structure, and accessibility checks

| Check | Result |
| --- | --- |
| Demo real-data isolation | PASS: `real:how-it-runs:state=keep` remained unchanged. |
| Demo namespace | PARTIAL: only `demo:how-it-runs:state` was written, but it remained after **Start for real**. |
| Demo reset | PASS: changed settling 65 → 80 → reset to 65. |
| Network privacy | PASS: 20 captured requests, all to `https://how-it-runs.sociobot.in`. |
| Offline | PASS: service-worker-controlled `/demo/` reloaded with the seeded water simulator while offline. |
| Route status | PASS: home/demo/system/legal routes returned 200; unknown route returned a designed 404. |
| Deep links | PASS with usability caveat: state loaded, but simulator controls were 2,230 px below the mobile viewport. |
| Back/Forward | PASS: home ↔ water route and title/headline state restored. |
| Route focus | PASS: focus moved to the changed h1. |
| Route announcement | FAIL: polite live region stayed empty; S02. |
| Link crawl | PASS: every internal navigation target returned 200; the intentional current-page anchor on the 404 retained the route’s 404 status; `mailto:` links were explicit. |
| Titles/lang/landmarks/images | PASS: one h1, `lang=en`, main landmark, alt text, and route titles after JavaScript. |
| Metadata | FAIL: route-specific canonical/social defects; S01. |
| Header/footer | PASS: common wordmark/navigation and Privacy/Terms/factory/build footer content were present. |
| Visual identity | PASS: the navy, paper, marigold, ticket-card, and original civic-poster system is distinct rather than a generic SaaS template. |
| Mobile layout/touch targets | PASS: no horizontal overflow; checked controls met 44 px targets. |
| Accessibility scan | PASS: Playwright Axe reported zero violations on all eight checked routes. |
| Console | PASS on normal routes; the browser logged the expected document 404 on the deliberate unknown route. |
| Asset budget | PASS: JS 8,239 bytes gzip; CSS 5,906 bytes gzip. |
| Social/icon dimensions | PASS: social card 1200 × 630; apple-touch icon 180 × 180. |

Additional verification passed: `/opt/fleet/lib/verify-url.sh` against production,
`npm test` (8/8), `npm run build`, and the local `npm run verify:browser` suite.

## Final decision

**FAIL.** Repair B1 first. A qualifying re-review must also register or remove
the unlisted claims, make listed tests prove their full wording, correct route
metadata and announcements, and resolve the copy findings.
