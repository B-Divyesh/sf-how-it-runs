# Adversarial first-read review 1 — FAIL

**Product:** How It Runs
**Live URL:** <https://how-it-runs.sociobot.in>
**Candidate:** `04fe6b527c42238689a4695a7012a6b11f28c26b`
**Reviewed:** 2026-08-28 UTC
**Viewports:** 390 × 844 and 1440 × 900, fresh Chromium contexts

## Verdict

**FAIL.** There are four blocking findings: the first screen does not identify
the audience or plainly name the product, the required one-click sandbox demo
does not exist, the required claims manifest and claim-tagged tests do not
exist, and unknown routes/back navigation are broken. This is above the PASS
limit of zero blocking and at most three minor findings.

## First-read record, before scrolling

| Viewport | What I think it does | For whom | What I would click first |
| --- | --- | --- | --- |
| 390 × 844 | My best guess is an interactive tour where I move controls for water, electricity, and bread systems. The screen never says “simulator.” | Cannot determine. No visible sentence names kids, parents, teachers, or learners. | “Choose your route,” although it only scrolls to choices. |
| 1440 × 900 | Same guess. The illustration supplies more context than the words. | Cannot determine. “For grown-ups” is a secondary navigation label, not an audience statement. | “Choose your route,” positioned at the bottom edge of the viewport. |

The exact first-screen text that fails the check is:

> “THE HIDDEN SYSTEMS BEHIND EVERY DAY.”

> “Turn the levers. Follow the flow. Meet the people who keep water clean,
> lights on, and bread moving.”

> “Choose your route”

The headline is a theme, not the job. The supporting copy describes motions but
does not name a browser simulator or its audience. The action names a transit
metaphor and produces a scroll, not a tried result.

## Findings, ordered by severity

### BLOCKING B1 — The first screen does not say what this is or who it is for

**Quote:** “THE HIDDEN SYSTEMS BEHIND EVERY DAY.” / “A FIVE-MINUTE FIELD TRIP.”

**Why this loses a first-time visitor:** The visitor must infer “browser
simulator” from an illustration and the phrase “turn the levers.” Nothing above
the fold identifies kids as the primary audience. The browser title mentions
“curious kids,” but a visitor does not read metadata as page copy.

**Concrete fix:** Use this first-screen set:

- Headline: **“Run everyday systems in five minutes”**
- Audience sentence: **“For kids and grown-ups who want to see how water,
  power, and bread reach a neighborhood.”**
- Primary action: **“Try it with sample data”**
- Adjacent result: **“Opens a working water system with realistic settings.”**
- Three tested facts: **“Free.” “Works offline after the first visit.” “No
  account; settings stay in the URL.”**

Add claim tests before publishing the three facts.

### BLOCKING B2 — There is no one-click demo or sandbox

**Quote:** The primary action is “Choose your route.” The next action is “Run
this system.”

**Evidence:**

- One click only scrolls to `#routes`; it does not open a working sample.
- A second click opens water at `set=45,75,35`.
- `/?demo=1` is immediately normalized back to `/` with no selected system.
- `/demo` returns the ordinary landing page with HTTP 200.
- “Demo — sample data, nothing is saved,” “Reset demo,” and “Start for real”
  are all absent.
- `.factory/demo.md` is absent.
- No cookies, `localStorage`, or `sessionStorage` entries were created during
  the exercised flow, but absence of storage does not provide a separate demo
  namespace or the required demo controls.

**Why this loses a first-time visitor:** The required trial path takes two
clicks and starts as a normal product state. A visitor cannot tell whether the
settings are sample or personal, cannot reset the complete demo, and cannot
leave demo mode explicitly.

**Concrete fix:** Make `/demo` and `?demo=1` open a seeded, already-running
water scenario in one click. Keep a persistent banner with **Reset demo** and
**Start for real**. Use an in-memory or `demo:` storage namespace even if real
mode remains URL-only. Document the sample, reset behavior, and namespace in
`.factory/demo.md`; add isolation tests that pre-seed real storage, mutate and
reset demo state, then confirm the real keys are unchanged.

### BLOCKING B3 — All public claims are unlisted and have no claim-tagged tests

**Quote:** `.factory/claims.json` is missing. `rg '@claim:' .` returns no
matches.

**Why this misleads a visitor:** The site makes duration, offline, privacy,
input, accessibility, feature, and provenance promises without a required
claim-to-test mapping. The existing test suite may exercise some behaviors, but
there is no way to run the test for a specific public promise from a clean
sandbox.

**Clean-clone result:** The clone was exactly `04fe6b5`. `npm test` passed 8/8
untagged Vitest tests and `npm run build` passed. There were **zero listed claim
tests to run**. The production browser verifier also passed its current checks,
including offline reload, mobile touch targets, reduced motion, keyboard use,
axe with zero violations, and zero console errors. These results do not satisfy
the missing claims contract.

Every claim-like sentence found on the cold landing page or README is unlisted:

| ID | Exact claim | Location | Concrete fix |
| --- | --- | --- | --- |
| U01 | “A five-minute field trip” / “Each trip takes about five minutes.” | Landing | Add one duration claim and a measured demo-flow test, or replace with “A short system simulation.” |
| U02 | “Meet the people who keep water clean, lights on, and bread moving.” | Landing | Test that every seeded simulation exposes its named job and duties. |
| U03 | “No score.” | Landing | Add a DOM/state test proving no score exists in the complete demo flow. |
| U04 | “No timer.” | Landing | Add a clock/state test proving no countdown or time limit exists. |
| U05 | “Just make a working system—and then see what happens when something changes.” | Landing | Test a seeded target, unlocked fault, changed outcome, and recovery. |
| U06 | “Each model keeps the important relationship—like speed versus quality—while leaving out real-world detail.” | Landing | This fidelity statement is not mechanically established; replace it with a concrete list of included and omitted variables. |
| U07 | “The ‘Who does this?’ notes connect every lever to a job.” | Landing | Test each lever view for a corresponding role explanation, or narrow the sentence to what is actually shown. |
| U08 | “There are no accounts, analytics, cookies, or saved profiles.” | Landing | Add an intercepted full-demo privacy test asserting no auth UI, cookies, tracking calls, or profile storage. |
| U09 | “A share link keeps only the current simulator settings in its URL.” | Landing | Test the copied URL parameters and assert that no other visitor data is present. |
| U10 | “The control room still works; sharing needs a connection.” | Landing, offline banner | Add an offline demo test for every simulator and define whether “sharing” means copying or opening a link. |
| U11 | “A free, kid-safe explorable by Sociobot.” | Landing footer | Remove untestable “kid-safe” and jargon; use “A free browser simulator for kids and grown-ups.” Test that no paywall appears if “free” remains. |
| U12 | “Original generated panorama; diagrams are handmade.” | Landing footer | Add a provenance check against the retained source metadata, or move this to factual documentation without presenting it as a tested product claim. |
| U13 | “How It Runs is a free collection of five-minute browser simulators that helps children understand the jobs and trade-offs inside everyday systems.” | README | Split factual scope from the unmeasured learning outcome; test the scope and remove “helps children understand” unless evaluated. |
| U14 | “The first release includes municipal water treatment, a small power grid, and a bakery production line.” | README | Add a demo/catalog test asserting all three simulations open. |
| U15 | “Each route uses the same learning loop: move three levers, watch material or energy flow through five stages, balance output/quality/cost, unlock a realistic disruption, and learn which real job coordinates the system.” | README | Add one parameterized claim test for three levers, five stages, outcomes, fault, and job in all three systems; remove “realistic” unless separately supported. |
| U16 | “A narrated Watch it run mode plays the loop without requiring game input.” | README | Add a claim test that starts Watch mode once and observes all steps without further input. |
| U17 | “The models build intuition; they are not operational or engineering guidance.” | README | Keep the safety limitation, but remove the unmeasured “build intuition” outcome. |
| U18 | “The interface says this wherever the simplified diagrams appear.” | README | Test that the simplification notice is visible in each simulation. |
| U19 | “State is local-first and encoded as `?system=water&set=65,65,60&fault=1`.” | README | Replace “local-first” with plain wording and add a URL-state round-trip test. |
| U20 | “Share copies that URL; there are no accounts or server-side saves.” | README | Add clipboard, request-interception, cookie, and storage assertions. |
| U21 | “A service worker caches the visited app shell for offline use.” | README | Add `@claim:offline-reload` using a fresh demo context and offline reload. |
| U22 | “Watch mode has an explicit pause control and stops after its four captions.” | README | Add a tagged test for pause and exact completion after four captions. |
| U23 | “Native range inputs support touch, mouse, and arrow keys.” | README | Add pointer and keyboard claim tests; verify the native input type. |
| U24 | “Reduced-motion users receive static flow lines and instant transitions.” | README | Tag the existing computed-motion assertion and verify all animated elements. |
| U25 | “No third-party fonts, scripts, analytics, advertising, or runtime CDNs are used.” | README | Add a full-flow request interception test that allows only the product origin and inspect loaded resource types. |
| U26 | “The generated panorama is original to this product; its exact prompt and generation metadata are recorded in `assets/src/` and `.factory/design.md`.” | README | Add a repository provenance check for the named source files, or remove “original” as an automated claim. |
| U27 | “Try five-minute, kid-safe simulations of water treatment, a power grid, and a bakery line.” | Home meta description | Test the three routes and duration; remove “kid-safe” unless it is defined and verifiable. |
| U28 | “Turn the levers. Follow the flow.” | Landing | Test that each system exposes operable controls and an observable flow response. |
| U29 | “Guide cloudy river water …”; “Balance a small generator …”; “Mix, bake, and move loaves …” | Landing route cards | Add one tagged end-to-end test for the promised behavior of each system. |
| U30 | “Turn the levers, watch the flow, and discover the people who keep everyday systems running.” | Home OG description | Test the controls, flow display, and job content in each system. |
| U31 | “`npm run build` is the production build command. It performs strict TypeScript checking and writes the static deployment to `dist/` …” | README | Add a CI assertion for type-checking and the required `dist/index.html` output, or describe these only under verification evidence. |
| U32 | “`verify:browser` … exercises all three targets plus the water fault …” | README | Keep the check but list its individual assertions beside tagged claim tests rather than presenting one broad coverage claim. |

The privacy/network behavior itself passed the independent exercise: a fresh
context made requests only to `https://how-it-runs.sociobot.in`, created no
cookies or web-storage keys, and reloaded a steady water simulation while
offline. The responsive hero request failed offline, while the selected
simulator remained usable. Record this observed behavior in tagged claim tests.

### BLOCKING B4 — Unknown routes and browser history are broken

**Quote/evidence:**

- `/not-a-real-route-qa` returned HTTP **200** and rendered the ordinary home
  page. There is no designed 404.
- `/demo` also returned the ordinary home page with the home title.
- Selecting water and then power kept `history.length` unchanged and used
  `replaceState`. Back skipped both simulator states and returned to the page
  visited before Home.
- Water and power kept the landing title, “How It Runs — 5-minute system
  simulators for curious kids.”
- Focus moved to `<section id="simulator">`, not the new route `<h1>`, and no
  route announcement was exposed.

**Why this loses a first-time visitor:** A mistyped or shared path looks valid,
Back does not undo navigation, and assistive-technology users are not told that
the selected system changed.

**Concrete fix:** Add real `/demo` and system URLs, use `pushState` for user
navigation and `replaceState` only for canonicalization, restore state on
`popstate`, set a route-specific title and one route headline, move focus to
that headline, and announce it. Configure a styled 404 that returns 404 and
links home. Add deep-link, reload, Back, Forward, focus, title, and unknown-path
tests.

### MAJOR M1 — Required metadata is incomplete

**Quote/evidence:** Home has a 57-character title, description, SVG favicon,
Open Graph title, and Open Graph description. It has no canonical URL, Open
Graph image, Twitter card metadata, or 180 px apple-touch icon. Privacy and
Terms have route titles but no description, canonical, Open Graph/Twitter
metadata, favicon, or apple-touch icon. The simulator state does not update the
title. The sitemap lists only `/`, `/privacy/`, and `/terms/`.

**Why this matters:** Shared links have no product artwork or canonical target,
legal pages lose identity metadata, and route titles do not tell the visitor
which simulator is open.

**Concrete fix:** Add canonical, OG/Twitter, a real 1200 × 630 image from the
poster art, and SVG plus 180 px icons to every route. Add route descriptions and
titles such as “Clean water simulator — How It Runs.” List every real public
route in the sitemap.

### MAJOR M2 — The standard page skeleton and cross-route shell are incomplete

**Quote/evidence:** The first screen has no three plain facts. There is no
explicit three-step “How it works” section. Privacy and Terms replace the main
header with only “← Back to How It Runs,” omit the skip link and site
navigation, and use a footer with no Privacy/Terms links. No footer contains
“Built by Param Factory” or a version/build ID.

**Why this matters:** Visitors do not get the expected information order, and
moving to a legal page makes the site appear to change products.

**Concrete fix:** Follow the required landing order: clear first screen, seeded
live preview, three verb-led steps, limitations/privacy, then footer. Reuse the
same wordmark/nav/skip link/footer on all routes and add the factory credit plus
build ID.

### MAJOR M3 — Copy uses metaphors and inconsistent terms instead of one plain vocabulary

Every flagged copy item has a direct rewrite:

| ID | Quote | Flag | Proposed rewrite |
| --- | --- | --- | --- |
| CP01 | “The hidden systems behind every day.” | Headline is thematic, has no user job, and does not start with a verb. | “Run everyday systems in five minutes.” |
| CP02 | No audience sentence exists. | The first screen never says who this is for. | “For kids and grown-ups who want to see how water, power, and bread reach a neighborhood.” |
| CP03 | “Choose your route” | Button-styled link names a metaphor, not its result; it only scrolls. | “Try it with sample data.” |
| CP04 | “field trip,” “route,” “departures,” “trip,” “system,” “model,” and “simulator settings” | One product concept has seven names. | Use **simulation** for the activity and **system** for water, power, or bakery. |
| CP05 | “Departures every minute” | Heading has no meaning out of context. | “Choose a system to simulate.” |
| CP06 | “Your control desk is ready” | The empty state has no open controls. | “Choose a system to open its controls.” |
| CP07 | “The grown-up noticeboard” | Heading depends on the transit-poster metaphor. | “For parents and teachers.” |
| CP08 | “Simple on purpose. Truthful about the trade-offs.” | Abstract and claim-like; it does not name the section content. | “What each simulation leaves out.” |
| CP09 | “These are intuition-builders, not engineering tools.” | “Intuition-builders” is jargon. | “These simulations show cause and effect. They are not engineering tools.” |
| CP10 | “Where does progress go?” / “Nowhere.” | The heading-answer pair is indirect. | “Your progress is not saved.” |
| CP11 | “A free, kid-safe explorable by Sociobot.” | “Explorable” is jargon and “kid-safe” is an untested adjective. | “A free browser simulator for kids and grown-ups.” |
| CP12 | README: “Each route uses the same learning loop: …” (32 words) | Exceeds 22 words and uses “learning loop,” “throughput,” “disruption,” and “coordinates.” | “Each simulation has three controls and five stages. Balance output, quality, and cost. Then handle a fault and meet the worker in charge.” |
| CP13 | README: “`verify:browser` expects …” (42 words) | Exceeds 22 words and compresses many checks into one sentence. | “Run `verify:browser` while preview is open. It checks simulator targets, faults, keyboard use, mobile layout, accessibility, offline reload, caching, and console errors.” |
| CP14 | “Curious learners who prefer an explorable explanation to a video” | “Explorable explanation” is nonstandard. | “Learners who prefer an interactive simulation to a video.” |
| CP15 | “The models build intuition” | Abstract, unmeasured outcome. | “The simplified models show how one control changes several results.” |
| CP16 | “State is local-first” | “Local-first” is product jargon. | “Settings stay in the page URL unless you share it.” |
| CP17 | “app shell” / “runtime CDNs” | Developer jargon is unexplained. | “The service worker saves the public app files. The site loads no fonts or scripts from other sites.” |
| CP18 | “Static Web Apps navigation and cache rules” / “navigation fallback” | Platform terms obscure the deployment instruction. | “The preview uses the same routes and cache headers as production. Unknown app routes open `index.html`.” |
| CP19 | “collection,” “experience,” “project,” “explorable,” and “simulators” | README and footer use inconsistent names for the product. | Use **browser simulators** throughout. |

Use this terminology table in revised copy:

| Concept | One term |
| --- | --- |
| The activity | simulation |
| A water, power, or bakery choice | system |
| A disruptive event | fault |
| The movable inputs | controls |
| The automatic walkthrough | Watch mode |
| Values preserved in a URL | settings |

Button audit: **Run this system** passes because it names the result. **Choose
your route** fails as CP03. “Pick a system,” “For grown-ups,” Privacy, and Terms
are links rather than buttons; their link behavior is correct.

## Complete landing-page copy audit

Word counts treat hyphenated terms as one word and exclude decorative arrows.
Repeated “Run this system” appears three times.

| Type | Copy | Words | Flag |
| --- | --- | ---: | --- |
| Document title | How It Runs — 5-minute system simulators for curious kids | 9 | U01 |
| Meta description | Try five-minute, kid-safe simulations of water treatment, a power grid, and a bakery line. | 14 | U27 |
| Open Graph title | How It Runs — Try the systems behind everyday life | 9 | — |
| Open Graph description | Turn the levers, watch the flow, and discover the people who keep everyday systems running. | 15 | U30 |
| Skip link | Skip to the simulator | 4 | — |
| Wordmark | How It Runs | 3 | — |
| Nav link | Pick a system | 3 | — |
| Nav link | For grown-ups | 2 | — |
| Eyebrow | A five-minute field trip | 4 | CP04 |
| H1 | The hidden systems behind every day. | 6 | CP01 |
| Sentence | Turn the levers. | 3 | — |
| Sentence | Follow the flow. | 3 | — |
| Sentence | Meet the people who keep water clean, lights on, and bread moving. | 12 | U02 |
| Action | Choose your route | 3 | CP03 |
| Eyebrow | Departures every minute | 3 | CP04, CP05 |
| H2 | Pick a system to run | 5 | — |
| Sentence | No score. | 2 | U03 |
| Sentence | No timer. | 2 | U04 |
| Sentence | Just make a working system—and then see what happens when something changes. | 12 | U05 |
| Label | From river to tap | 4 | CP04 |
| H3 | Clean water works | 3 | — |
| Sentence | Guide cloudy river water through settling, filtering, and careful disinfection. | 10 | — |
| Button ×3 | Run this system | 3 | Pass |
| Label | Match supply to demand | 4 | — |
| H3 | Neighborhood power grid | 3 | — |
| Sentence | Balance a small generator, a battery, and flexible uses as the neighborhood changes. | 13 | — |
| Label | Dough to doorstep | 3 | — |
| H3 | Morning bakery line | 3 | — |
| Sentence | Mix, bake, and move loaves through a small production bakery before the morning delivery. | 14 | — |
| H2 | Your control desk is ready | 5 | CP06 |
| Sentence | Choose one of the three routes above to start. | 9 | CP04 |
| Sentence | Each trip takes about five minutes. | 6 | CP04, U01 |
| Eyebrow | The grown-up noticeboard | 3 | CP07 |
| H2 sentence | Simple on purpose. | 3 | CP08 |
| H2 sentence | Truthful about the trade-offs. | 4 | CP08 |
| Sentence | These are intuition-builders, not engineering tools. | 6 | CP09 |
| Sentence | Each model keeps the important relationship—like speed versus quality—while leaving out real-world detail. | 13 | U06 |
| Sentence | The “Who does this?” notes connect every lever to a job. | 11 | U07 |
| Summary | How to use this with a child or class | 9 | — |
| Sentence | First ask for a prediction. | 5 | — |
| Sentence | Move one lever, name what changed, then try the fault. | 10 | — |
| Sentence | In watch mode, pause after each caption and ask what you would do next. | 14 | — |
| Summary | Where does progress go? | 4 | CP10 |
| Sentence | Nowhere. | 1 | CP10 |
| Sentence | There are no accounts, analytics, cookies, or saved profiles. | 9 | U08 |
| Sentence | A share link keeps only the current simulator settings in its URL. | 12 | U09 |
| Offline sentence | You’re offline. | 2 | — |
| Offline sentence | The control room still works; sharing needs a connection. | 9 | U10 |
| Footer sentence | How It Runs · A free, kid-safe explorable by Sociobot. | 10 | CP11, U11 |
| Footer link | Privacy | 1 | — |
| Footer link | Terms | 1 | — |
| Footer sentence | Original generated panorama; diagrams are handmade. | 6 | U12 |
| Image alt | Poster illustration joining a waterworks, electric grid, and bakery into one neighborhood | 12 | — |

No landing sentence exceeds 22 words. The problem is clarity and terminology,
not sentence length.

## Complete README copy audit

Commands in fenced code blocks are commands, not sentences, and are excluded.
Headings and list items are included because the copy rules explicitly cover
them.

| Type | Copy | Words | Flag |
| --- | --- | ---: | --- |
| H1 | How It Runs | 3 | CP19 |
| Sentence | How It Runs is a free collection of five-minute browser simulators that helps children understand the jobs and trade-offs inside everyday systems. | 22 | U13 |
| Sentence | The first release includes municipal water treatment, a small power grid, and a bakery production line. | 16 | U14 |
| Sentence | Each route uses the same learning loop: move three levers, watch material or energy flow through five stages, balance output/quality/cost, unlock a realistic disruption, and learn which real job coordinates the system. | 32 | CP12, U15 |
| Sentence | A narrated **Watch it run** mode plays the loop without requiring game input. | 13 | CP19, U16 |
| Label | Live site: `https://how-it-runs.sociobot.in` | 3 | — |
| H2 | Who it is for | 4 | — |
| List item | Parents who want to show a child what a technical or industrial job involves | 14 | — |
| List item | Teachers introducing infrastructure, systems thinking, and cause and effect | 9 | — |
| List item | Curious learners who prefer an explorable explanation to a video | 10 | CP14 |
| Sentence | The models build intuition; they are not operational or engineering guidance. | 11 | CP15, U17 |
| Sentence | The interface says this wherever the simplified diagrams appear. | 9 | U18 |
| H2 | Run locally | 2 | — |
| Sentence | Requires Node.js 20 or newer. | 5 | — |
| Sentence | Vite prints a local URL, usually `http://localhost:5173`. | 7 | — |
| H2 | Test and build | 3 | — |
| Sentence | `npm run build` is the production build command. | 8 | — |
| Sentence | It performs strict TypeScript checking and writes the static deployment to `dist/`, with `dist/index.html` at its root. | 17 | — |
| Sentence | `npm run preview` serves that exact directory using the same Static Web Apps navigation and cache rules committed for deployment. | 20 | CP18 |
| Sentence | `verify:browser` expects that preview server to be running and exercises all three targets plus the water fault, the exact Watch-mode Enter-then-Space pause path, unknown-route URL recovery, keyboard skip-link focus, mobile overflow, axe accessibility, offline reload/module MIME behavior, cache headers, and browser console. | 42 | CP13 |
| H2 | Product behavior | 2 | — |
| List item | State is local-first and encoded as `?system=water&set=65,65,60&fault=1`. | 7 | CP16, U19 |
| List item | Share copies that URL; there are no accounts or server-side saves. | 11 | U20 |
| List item | A service worker caches the visited app shell for offline use. | 11 | CP17, U21 |
| List item | Watch mode has an explicit pause control and stops after its four captions. | 13 | U22 |
| List item | Native range inputs support touch, mouse, and arrow keys. | 9 | U23 |
| List item | Reduced-motion users receive static flow lines and instant transitions. | 9 | U24 |
| H2 | Project map | 2 | — |
| List item | `src/data.ts` — the three system definitions, captions, stages, and learning copy | 11 | — |
| List item | `src/engine.ts` — pure shared outcome calculations | 6 | — |
| List item | `src/main.ts` — URL state and simulator interaction layer | 8 | — |
| List item | `src/style.css` — the art-deco transit-poster visual system | 7 | — |
| List item | `assets/src/` — generated source art and prompt provenance | 8 | — |
| List item | `public/` — optimized art, offline worker, legal pages, and deployment headers | 11 | — |
| List item | `.factory/design.md` — palette, type, layout, motion, and art direction | 9 | — |
| List item | `.factory/handoff.md` — verification record and known gaps | 7 | — |
| Sentence | No third-party fonts, scripts, analytics, advertising, or runtime CDNs are used. | 11 | CP17, U25 |
| H2 | Deploy | 1 | — |
| Sentence | Deploy the contents of `dist/` as an Azure Static Web App. | 11 | — |
| Sentence | The checked-in `staticwebapp.config.json` supplies security headers, asset types, and the navigation fallback. | 12 | CP18 |
| Sentence | Infrastructure, DNS, and billing are intentionally outside this repository. | 9 | — |
| H2 | License | 1 | — |
| Sentence | Software is available under the [MIT License](../LICENSE). | 7 | — |
| Sentence | The generated panorama is original to this product; its exact prompt and generation metadata are recorded in `assets/src/` and `.factory/design.md`. | 20 | U26 |

README sentences over the 22-word hard cap: the 32-word learning-loop sentence
and the 42-word browser-verifier sentence.

## Structure, accessibility, privacy, and crawl checks

| Check | Result | Evidence |
| --- | --- | --- |
| Distinct visual identity | Pass | The navy, cream, marigold, coral, transit-poster lettering, original civic panorama, ticket cards, and control-room layout match `.factory/design.md` and are not a generic SaaS hero/card template. |
| Home semantics | Pass | `lang="en"`, one h1, one main, labelled image, labelled buttons, visible skip link. `/opt/fleet/lib/verify-url.sh` reported no errors. |
| Axe / keyboard / touch | Pass | Independent axe runs found 0 violations on Home, a selected simulator, Privacy, and Terms. The production gate also confirmed working skip focus, keyboard Watch pause, no 390 px overflow, and all tested controls at least 44 × 44 CSS px. |
| Reduced motion | Pass | Production gate confirmed the reduced-motion path. |
| Console | Pass | No console or page errors in the production gate or cold-page contexts. |
| Deep link/reload | Partial | `/?system=water&set=65,65,60` opens and reloads the correct steady simulator. Back/Forward history fails as B4. |
| Link crawl | Pass | `/`, `#main`, `#routes`, `#about`, `/privacy/`, and `/terms/` returned 200; the two `mailto:` links were explicitly skipped. No dead HTTP link was found. |
| Privacy during exercised flow | Pass behavior, unlisted claim | Requests were same-origin only; cookies, local storage, and session storage stayed empty. |
| Offline | Pass behavior, unlisted claim | A service-worker-controlled steady water simulation reloaded offline. The responsive hero request failed offline, but the simulator remained usable. |
| Titles | Partial | Home, Privacy, and Terms follow the title pattern and are under 60 characters. Selected simulator and fallback paths retain the home title. |
| Metadata | Fail | Canonical, OG image, Twitter card, and apple-touch icon are absent; legal-page metadata is mostly absent. |
| 404 | **Blocking fail** | Unknown paths return HTTP 200 and the home screen. |
| Header/footer consistency | Fail | Legal pages use a different shell and omit required links/credit/build ID. |
| Standard skeleton | Fail | No one-click demo, three first-screen facts, or explicit three-step “How it works” section. |

## Verification commands

Run from a clean clone of the candidate:

```sh
npm ci
npm test
npm run build
timeout 150s npm run verify:browser -- https://how-it-runs.sociobot.in
/opt/fleet/lib/verify-url.sh https://how-it-runs.sociobot.in <evidence-directory>
```

Observed results: install passed with 0 reported vulnerabilities; Vitest passed
8/8; production build passed; the repository browser gate passed; the URL
verifier returned HTTP 200 and no baseline errors. Those passing implementation
checks do not clear B1–B4.
