# Adversarial first-read review 4 — FAIL

- **Product:** How It Runs
- **Live URL:** <https://how-it-runs.sociobot.in>
- **Repository candidate:** `2ef8af0402285bf5e25a5f64e57bb866c84427a6`
- **Reviewed:** 2026-08-28 UTC
- **Contexts:** fresh Chromium at 390 × 844 and 1440 × 900; fresh clean-clone
  build and browser contexts

## Verdict

**FAIL.** One minor metadata finding remains. The three system documents reverse
the required title pattern. The product is otherwise clear, tryable, isolated,
and verified, but the review contract permits `PASS` only with zero findings.

## Cold first read, before scrolling

| Viewport | What this does | For whom | First click |
| --- | --- | --- | --- |
| 390 × 844 | It is a browser simulation where I adjust water, power, or bakery systems. | Kids and grown-ups. | **Try it with sample data**. It says it opens a water system at named values. |
| 1440 × 900 | The same; the poster also depicts the three systems. | Kids and grown-ups. | **Try it with sample data**. |

The required answer is available on the first screen in both contexts. The
relevant exact text is:

> “Run water, power, and bakery systems”

> “For kids and grown-ups who want to see how water, power, and bread reach a neighborhood.”

> “Try it with sample data” / “Opens water at 65% settling, 65% filter speed, and 60% disinfectant.”

The 390 px action, result sentence, and all three facts are visible without a
scroll. At 1440 × 900 the fact list ends at y=643.

## Findings

### F-4-1 — System titles reverse the required product-title pattern

- **Severity:** Minor
- **Exact live locations/quotes:**
  - `/systems/water/`: `<title>Clean water works simulator — How It Runs</title>`
  - `/systems/grid/`: `<title>Neighborhood power grid simulator — How It Runs</title>`
  - `/systems/bakery/`: `<title>Morning bakery line simulator — How It Runs</title>`
  - The same reversed strings appear in `og:title`, and `src/main.ts` sets
    `${definition.title} simulator — How It Runs` after client navigation.
- **Why this fails:** The site-structure requirement specifies the route pattern
  **“Product name — what it does in plain words.”** These three routes put the
  product name second, making their tab and shared-preview identity inconsistent
  with the home route, `How It Runs — Everyday system simulators`.
- **Concrete fix:** Use `How It Runs — Clean water works simulator`,
  `How It Runs — Neighborhood power grid simulator`, and `How It Runs — Morning
  bakery line simulator` in the generated route documents, `og:title`,
  `twitter:title`, and `setDocumentRoute`. Extend `@claim:real-routes` to
  assert the product-first title and social title for all three system routes.

## Demo and sandbox check

One fresh 390 × 844 context clicked the home action once. It reached
`/demo/?demo=1&system=water&set=65%2C65%2C60`; the banner occupied y=0–111 and
the settling control appeared at y=613 with value `65`. This is an immediate
in-use screen, not a second landing page.

- **Banner:** present and sticky: “Demo — sample data, nothing is saved.”
- **Reset:** changing settling to `80`, then choosing **Reset demo**, restored
  `65` (the full documented seed is 65/65/60).
- **Isolation:** a pre-seeded `localStorage` value
  `real:how-it-runs:state=untouched` remained unchanged. Demo used
  `sessionStorage["demo:how-it-runs:state"]` only.
- **Exit:** **Leave demo and clear sample** returned to `/`, removed that demo
  key, and retained the real key.
- **Offline/privacy:** after service-worker control, offline reload retained the
  demo control at `65`. The full flow made requests only to
  `https://how-it-runs.sociobot.in`, set no cookies, and produced no console
  errors.

No demo blocking finding is present.

## Claims check

I read `.factory/claims.json` and ran every listed command from a fresh clone
at `/tmp/how-it-runs-review4.6jVR6S/repo`, after `npm ci`. All passed.

| Claim | Result |
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
| `node-runtime-support` | PASS: clean install, test, and build at Node 20.19.0, 22.12.0, and 24 |

The fresh clone also passed `npm test` (8/8) and `npm run build`. The build
produced `dist/index.html`. `npm run verify:browser -- http://127.0.0.1:4173`
passed with zero axe violations, zero serious/critical issues, zero console
errors, valid mobile targets, working offline reload, and a styled 404.

The current landing page and README were re-read after testing. Their claim-like
statements map to the tested entries: sample/demo isolation, leave-demo,
free, offline reload, privacy/storage, URL settings, system loop, keyboard,
reduced motion, routes, watch mode, art provenance, build output, hosting, and
the Node range. No unlisted claim finding is added.

## Structure and route check

Live checks confirmed one h1, `lang="en"`, a meta description, canonical URL,
Open Graph fields, favicon, and a distinct title on `/`, `/demo/`, all three
systems, `/privacy/`, `/terms/`, and a missing route. The missing route returns
HTTP 404 with the designed “This page does not exist.” screen and links home and
to the demo. Deep system links show a control in the first mobile viewport.
Back/Forward restores the route, focuses the changed h1, and fills the polite
announcement. The header/footer provide the consistent brand, Demo, Systems,
Privacy, Privacy, Terms, and factory credit. The local browser crawler reported
four internal destinations and no dead link.

The product uses its documented civic art-deco poster system—paper panels,
midnight control room, punched tickets, original panorama, and a distinct
system-flow stage—not a generic SaaS card/gradient template. No additional AI,
import/export, or sync feature is an obvious expectation from the brief: copyable
URL state already supplies the useful hand-off, and an AI step would not improve
the stated learning loop.

## Copy audit

Counts are whitespace-delimited. The following are every prose sentence on the
landing page and README; headings, navigation labels, and control labels are
checked separately below. No prose sentence exceeds 22 words.

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
| Move one lever, name what changed, then try the fault. | 10 | Pass |
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

Headings make sense in context and out of context: for example, “Open a
system,” “Run a system in three steps,” and “What each simulation leaves out.”
The primary and supporting action labels name their outcomes: **Try it with
sample data**, **Run this system**, **Reset demo**, **Leave demo and clear
sample**, **Copy share link**, **Watch it run**, and **Pause flow**. The scan
found no banned marketing adjective, plain-words banned term, terminology
conflict, or non-result-naming button. Therefore there is no copy finding.

## Earlier-findings regression check

I read every earlier review, polish record, and handoff. I independently
rechecked the cumulative IDs in the live product and source:

| Earlier findings | Confirmation |
| --- | --- |
| `R1-B1`–`R1-B4`; `R1-CP01`–`R1-CP19`; `R1-M1`–`R1-M3` | First-read copy, one-click demo, claims manifest, physical routes, metadata, shell, and terminology remain fixed. |
| `R1-U01`–`R1-U32` | The live/README claim inventory is listed and every manifest test above passed; unmeasured wording remains absent. |
| `R2-B1`, `R2-C01`, `R2-U01`–`R2-U05`, `R2-S01`–`R2-S03`, `R2-CP01`–`R2-CP08` | Demo opens on seeded controls, stays visibly marked, clears on exit, operates faults/results, has route metadata/announcements, fits the first desktop screen, and retains the repaired wording. |
| `F-3-1` / Node runtime support and `F-3-2` / all-system share links | The Node 20/22/24 claim passed; water, grid, and bakery copied links reopen their changed settings. |
| Earlier verification `P1`–`P3` (skip focus, offline/cache/404, Watch focus, touch targets, URL normalization) | The complete local browser gate passed each behavior; no regression was observed. |

These prior findings are fixed, not merely marked fixed. `F-4-1` is a newly
identified title-pattern defect, not a regression of a prior implementation.

## What would make this perfect

Make the three system document and social titles product-first and add that
assertion to `@claim:real-routes`. After that change and a fresh live check,
there is no other identified work item from this review.
