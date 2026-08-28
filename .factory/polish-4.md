# Polish 4 — cumulative review repair record

Runtime repair commit: `0e8d9f17f1ece8d7cffa8c25fdbf734ada065876`.
Review base: `f84fdb792817007199b8e5903d861782cecc1350`.
Live URL: <https://how-it-runs.sociobot.in>.

## Evidence key

- **Clean suite:** `.factory/evidence/polish-4/test-summary.json` records the
  fresh-clone install, 8 unit tests, build, every one of the 15 claim commands,
  Node 20.19/22.12/24, browser checks, budgets, and 21/21 deployment hashes.
- **Cold live:** `.factory/evidence/polish-4/live-cold-check.json` records the
  390 × 844 first screen, demo isolation/reset/exit, raw and executed titles,
  route focus/history, request origins, cookies, and console errors.
- **Screenshots:** `.factory/evidence/polish-4/live-home-390.png`,
  `.factory/evidence/polish-4/live-demo-390.png`,
  `.factory/evidence/polish-4/live-water-390.png`, and
  `.factory/evidence/polish-4/live-url/screenshot-desktop.png`.
- **URL gate:** `.factory/evidence/polish-4/live-url/verify.json` records title,
  language, one h1, main landmark, alt text, labels, and zero console errors.
- **Performance:** `.factory/evidence/polish-4/lighthouse-summary.json` records
  local and live mobile Lighthouse scores of 100 in all four categories.

Every row below was rechecked in the clean candidate and on the deployed custom
domain. Reused screenshots are intentional: they show the same complete screen
that proves multiple related findings.

## Review 4

| Finding | Change made | Test evidence | Screenshot | Live URL check |
| --- | --- | --- | --- | --- |
| `F-4-1` | Changed generated and client-side water, grid, and bakery titles to `How It Runs — …`; exact `<title>`, `og:title`, and `twitter:title` values are asserted. | `@claim:real-routes`; cold-live raw/executed metadata | `live-water-390.png` | `/systems/water/`, `/systems/grid/`, and `/systems/bakery/` all return and execute product-first titles. |

## Review 3

| Finding | Change made | Test evidence | Screenshot | Live URL check |
| --- | --- | --- | --- | --- |
| `F-3-1` / reopened `R1-B3` | Documents and enforces `^20.19.0 || >=22.12.0`; clean copies install, test, and build on 20.19.0, 22.12.0, and 24. | `@claim:node-runtime-support` | `live-home-390.png` | `/` serves the verified build without a runtime regression. |
| `F-3-2` | Changes, copies, and reopens one setting for each of water, grid, and bakery in separate pages. | `@claim:real-routes` | `live-water-390.png` | All three `/systems/*/` share round trips pass. |

## Review 2

| Finding | Change made | Test evidence | Screenshot | Live URL check |
| --- | --- | --- | --- | --- |
| `R2-B1` | Demo opens directly on seeded controls; its sticky banner is demo-only; reset restores 65/65/60; exit removes only the demo key. | `@claim:sample-demo-isolated`; `@claim:leave-demo-discards-sample` | `live-demo-390.png` | One click reaches `/demo/`; banner y=0 and first control y=613; isolation/reset/exit pass. |
| `R2-U01` | Removed the untested five-minute promise. | copy audit; cold first-screen audit | `live-home-390.png` | `/` says “Run water, power, and bakery systems.” |
| `R2-U02` | Replaced “realistic settings” with the exact 65/65/60 values. | `@claim:sample-demo-isolated` | `live-home-390.png` | `/demo/` opens those exact values. |
| `R2-U03` | Uses exact controls/results wording and verifies reactive meters in all systems. | `@claim:system-loop` | `live-water-390.png` | All three system routes react to control changes. |
| `R2-U04` | Lists and tests the full no-account/analytics/cookie/profile statement, including tracking-shaped same-origin paths. | `@claim:no-tracking-storage` | `live-demo-390.png` | Cold flow has one origin, no cookies, and no console errors. |
| `R2-U05` | “Leave demo and clear sample” deletes only the demo namespace. | `@claim:leave-demo-discards-sample` | `live-demo-390.png` | Live exit leaves the seeded real key untouched and removes the demo key. |
| `R2-C01` | Requires live results, reachable targets, operated faults, worker notes, simplification notes, and all reduced-motion durations. | `@claim:system-loop`; `@claim:reduced-motion` | `live-water-390.png` | Live browser gate passes every system and reduced-motion mode. |
| `R2-S01` | Physical demo/system documents and legal/404 pages have complete route metadata; demo stays canonical to `/demo/`. | `@claim:real-routes`; `@claim:hosting-routes` | `live-url/screenshot-desktop.png` | Raw and executed route metadata pass; missing route returns 404. |
| `R2-S02` | Route changes focus the h1 and populate the polite announcement. | `@claim:real-routes` | `live-water-390.png` | Live selection, Back, and Forward focus/announcement pass. |
| `R2-S03` | Desktop hero spacing keeps all three facts above y=900. | `verify:browser` | `live-url/screenshot-desktop.png` | Live browser gate reports `desktopFactsInFirstScreen: true`. |
| `R2-CP01` | Removed “realistic” and names exact sample values. | `@claim:sample-demo-isolated` | `live-home-390.png` | Home and demo values match. |
| `R2-CP02` | Uses “sample data” consistently. | copy audit | `live-demo-390.png` | Live banner and actions use the same term. |
| `R2-CP03` | Replaced “steady zone” with “Meet all three targets.” | `@claim:system-loop` | `live-url/screenshot-desktop.png` | Landing steps and live missions agree. |
| `R2-CP04` | Renamed and implemented “Leave demo and clear sample.” | `@claim:leave-demo-discards-sample` | `live-demo-390.png` | Live action performs its label. |
| `R2-CP05` | Explains reduced motion in plain words. | `@claim:reduced-motion` | `live-water-390.png` | Live reduced-motion browser gate passes. |
| `R2-CP06` | Says each simulation has a link that can be copied and reopened. | `@claim:real-routes` | `live-water-390.png` | Water, grid, and bakery links reopen changed settings. |
| `R2-CP07` | Describes the build as site files in `dist`. | `@claim:build-output` | `live-url/screenshot-desktop.png` | Deployed `dist/index.html` matches live. |
| `R2-CP08` | Describes security rules and a branded missing page in plain words. | `@claim:hosting-routes` | `live-url/screenshot-desktop.png` | `/cold-missing-polish-4` returns the branded page with HTTP 404. |

## Review 1 — primary, structure, and copy findings

| Finding | Change made | Test evidence | Screenshot | Live URL check |
| --- | --- | --- | --- | --- |
| `R1-B1` | First screen names the job, audience, sample action, exact result, and three facts. | `verify:browser`; cold-live bounds | `live-home-390.png` | All required content is visible by y=700 at 390 × 844. |
| `R1-B2` | Added isolated `/demo/` and `?demo=1`, sticky controls, reset, and explicit exit. | `@claim:sample-demo-isolated`; `@claim:leave-demo-discards-sample` | `live-demo-390.png` | Direct and one-click demo paths pass. |
| `R1-B3` | Maintains 15 claims with one observable sandbox command each. | all 15 manifest commands | `live-home-390.png` | All claimed live behaviors were rechecked after deploy. |
| `R1-B4` | Uses physical routes, push/pop history, route titles, h1 focus, announcements, and a real 404. | `@claim:real-routes`; `@claim:hosting-routes`; `verify:browser` | `live-water-390.png` | Public routes and `/cold-missing-polish-4` pass. |
| `R1-M1` | Canonical, Open Graph/Twitter, social image, icons, route metadata, and sitemap cover every route. | `@claim:real-routes` | `live-url/screenshot-desktop.png` | Raw/executed metadata and all route statuses pass. |
| `R1-M2` | Landing order, three steps, common legal shell, legal links, factory credit, and build ID are complete. | `verify:browser` crawl | `live-url/screenshot-desktop.png` | Home, Privacy, Terms, demo, systems, and 404 share the shell. |
| `R1-M3` | Standardized simulation/system/fault/controls/Watch mode/settings vocabulary. | `.factory/copy-audit.md` | `live-home-390.png` | Cold live copy contains no prior conflicting activity terms. |
| `R1-CP01` | Uses the verb-led job headline. | first-screen assertion | `live-home-390.png` | `/` h1 matches. |
| `R1-CP02` | Names kids and grown-ups in the audience sentence. | first-screen assertion | `live-home-390.png` | Sentence is visible without scrolling. |
| `R1-CP03` | Primary action says “Try it with sample data” and opens seeded controls. | `@claim:sample-demo-isolated` | `live-demo-390.png` | One click opens the in-use demo. |
| `R1-CP04` | Uses “simulation” for the activity and “system” for each choice. | copy audit | `live-home-390.png` | Live home matches. |
| `R1-CP05` | Heading says “Choose a system to simulate.” | copy audit | `live-url/screenshot-desktop.png` | Live home matches. |
| `R1-CP06` | Empty state tells visitors to choose water, power, or bakery. | `verify:browser` | `live-url/screenshot-desktop.png` | Live empty state matches. |
| `R1-CP07` | Uses “For parents and teachers.” | copy audit | `live-url/screenshot-desktop.png` | Live section matches. |
| `R1-CP08` | Names the limitations section “What each simulation leaves out.” | copy audit; `@claim:system-loop` | `live-url/screenshot-desktop.png` | Live section and simulator notes match. |
| `R1-CP09` | Removed “intuition-builders” and states the engineering limitation directly. | copy audit | `live-url/screenshot-desktop.png` | Prior wording is absent. |
| `R1-CP10` | Directly says settings are not saved. | `@claim:no-tracking-storage` | `live-url/screenshot-desktop.png` | Live privacy behavior passes. |
| `R1-CP11` | Removed “kid-safe explorable”; footer says free browser simulator. | `@claim:free` | `live-url/screenshot-desktop.png` | No gate appears on any live system. |
| `R1-CP12` | Splits the README loop into short concrete sentences. | copy audit; `@claim:system-loop` | `live-water-390.png` | Live system loop passes. |
| `R1-CP13` | Replaced long verifier prose with runnable commands. | README audit | `live-home-390.png` | Documented live browser command passes. |
| `R1-CP14` | Removed “explorable explanation.” | copy audit | `live-home-390.png` | Phrase is absent. |
| `R1-CP15` | Removed the unmeasured intuition outcome. | copy audit | `live-home-390.png` | Phrase is absent. |
| `R1-CP16` | Describes settings as URL values in plain words. | `@claim:private-url-settings` | `live-water-390.png` | Live copied URLs contain only settings/fault. |
| `R1-CP17` | Removed “app shell” and “runtime CDN” jargon from public copy. | copy audit; `@claim:no-tracking-storage` | `live-home-390.png` | Live requests remain same-origin. |
| `R1-CP18` | Describes hosting as security rules and a missing page. | `@claim:hosting-routes` | `live-url/screenshot-desktop.png` | Live headers and 404 pass. |
| `R1-CP19` | Uses browser simulator/simulation consistently. | copy audit | `live-home-390.png` | Live page and legal shell match. |

## Review 1 — claim inventory findings

| Finding | Change made | Test evidence | Screenshot | Live URL check |
| --- | --- | --- | --- | --- |
| `R1-U01` | Removed the unmeasured five-minute promise. | copy audit | `live-home-390.png` | Phrase is absent from live copy and metadata. |
| `R1-U02` | Every system exposes a worker job note. | `@claim:system-loop` | `live-water-390.png` | All three system routes pass. |
| `R1-U03` | Removed the “No score” promise. | copy audit | `live-home-390.png` | Phrase is absent. |
| `R1-U04` | Removed the “No timer” promise. | copy audit | `live-home-390.png` | Phrase is absent. |
| `R1-U05` | Tests target, unlocked fault, changed outcome, and recovery. | `@claim:system-loop` | `live-water-390.png` | All three live loops pass. |
| `R1-U06` | Replaced fidelity language with exact controls/meters and a limitation. | `@claim:system-loop` | `live-water-390.png` | Live structure matches. |
| `R1-U07` | Requires a non-empty worker note for every system. | `@claim:system-loop` | `live-water-390.png` | All three pass. |
| `R1-U08` | Lists and tests no accounts, analytics, cookies, or profiles. | `@claim:no-tracking-storage` | `live-demo-390.png` | Cold live capture has no cookies or outside requests. |
| `R1-U09` | Copied links contain and restore only current settings. | `@claim:private-url-settings`; `@claim:real-routes` | `live-water-390.png` | All three round trips pass. |
| `R1-U10` | Tests offline demo and every system; removed the vague sharing sentence. | `@claim:offline-reload` | `live-demo-390.png` | Live offline reload passes. |
| `R1-U11` | Removed “kid-safe” and tests “Free.” | `@claim:free` | `live-home-390.png` | No live route presents a payment gate. |
| `R1-U12` | Retains source art, prompt, design record, and disclosure. | `@claim:art-provenance` | `live-url/screenshot-desktop.png` | Footer discloses generated panorama. |
| `R1-U13` | Removed the learning outcome and states concrete scope. | `@claim:system-loop` | `live-url/screenshot-desktop.png` | Live page shows all three systems. |
| `R1-U14` | Opens and exercises water, grid, and bakery. | `@claim:system-loop` | `live-water-390.png` | Three system routes return 200 and work. |
| `R1-U15` | Verifies three controls, five stages, three results, fault, and job in every system. | `@claim:system-loop` | `live-water-390.png` | All three structures pass. |
| `R1-U16` | Watch mode starts and completes without more input. | `@claim:watch-mode` | `live-water-390.png` | Live Watch control remains functional. |
| `R1-U17` | Retains only the safety limitation. | copy audit | `live-url/screenshot-desktop.png` | Live Terms carries the same limitation. |
| `R1-U18` | Requires each system’s simplification note. | `@claim:system-loop` | `live-water-390.png` | All three notes pass. |
| `R1-U19` | Replaces “local-first” with URL wording and tests round trips. | `@claim:private-url-settings` | `live-water-390.png` | Live URL state reopens. |
| `R1-U20` | Tests clipboard URL, allowed keys, cookies, storage, and requests. | `@claim:private-url-settings`; `@claim:no-tracking-storage` | `live-demo-390.png` | Cold live privacy capture passes. |
| `R1-U21` | Tests service-worker-controlled demo and system reloads offline. | `@claim:offline-reload` | `live-demo-390.png` | Live browser gate reports offline reload true. |
| `R1-U22` | Watch pauses and stops after caption four. | `@claim:watch-mode` | `live-water-390.png` | Live keyboard Watch path passes. |
| `R1-U23` | Native range control changes with ArrowRight. | `@claim:keyboard-controls` | `live-demo-390.png` | Live keyboard gate passes. |
| `R1-U24` | Reduced motion removes computed animations/transitions and smooth scrolling. | `@claim:reduced-motion` | `live-water-390.png` | Live reduced-motion gate passes. |
| `R1-U25` | Rejects outside and tracking-shaped requests through the complete flow. | `@claim:no-tracking-storage` | `live-demo-390.png` | Cold live audit observes only the product origin. |
| `R1-U26` | Verifies source image, prompt, generation record, and disclosure. | `@claim:art-provenance` | `live-url/screenshot-desktop.png` | Live disclosure is present. |
| `R1-U27` | Metadata omits five-minute/kid-safe wording and states concrete scope. | `@claim:real-routes` | `live-home-390.png` | Raw live home metadata passes. |
| `R1-U28` | Every system has operable controls and reactive results. | `@claim:system-loop` | `live-water-390.png` | All three loops pass. |
| `R1-U29` | Exercises each promised water, power, and bakery behavior. | `@claim:system-loop` | `live-water-390.png` | All three systems function live. |
| `R1-U30` | Social copy is structural, route-specific, and now product-first on system routes. | `@claim:real-routes` | `live-home-390.png` | Raw and executed Open Graph/Twitter checks pass. |
| `R1-U31` | Build claim checks type checking and complete `dist` output. | `@claim:build-output` | `live-url/screenshot-desktop.png` | 21/21 live artifacts match `dist`. |
| `R1-U32` | Replaced broad verifier prose with individual claim commands. | all 15 manifest commands | `live-home-390.png` | Browser and URL gates pass live. |

## Earlier verification findings carried through the polish records

| Finding | Change made | Test evidence | Screenshot | Live URL check |
| --- | --- | --- | --- | --- |
| `V1-P1-skip-focus` | Skip link explicitly focuses the programmatic main target. | `verify:browser` | `live-home-390.png` | Live skip-focus check passes. |
| `V1-P1-browser-gate` | Service worker serves JavaScript correctly offline and the crawler handles the intentional 404. | `verify:browser` | `live-demo-390.png` | Live browser gate completes. |
| `V1-P2-immutable-assets` | Hashed assets are immutable; HTML and worker revalidate. | `verify:browser` | `live-home-390.png` | Live cache-header checks pass. |
| `V1-P3-invalid-url` | Invalid system state recovers to a valid canonical URL. | `verify:browser` | `live-water-390.png` | Live normalization check passes. |
| `V2-P1-watch-focus` | Watch replacement controls retain focus for Enter and Space. | `verify:browser`; `@claim:watch-mode` | `live-water-390.png` | Live keyboard Watch path passes. |
| `V2-P3-unknown-system` | Unknown system input returns to the valid home state. | `verify:browser` | `live-home-390.png` | Live route recovery passes. |
| `V3-P2-touch-targets` | Visible mobile links, buttons, inputs, and summaries are at least 44 × 44 CSS px. | `verify:browser` | `live-demo-390.png` | Live gate reports mobile targets true. |
| `V4-P2-fractional-state` | Imported values snap to 5% steps and rewrite the URL. | `verify:browser` | `live-water-390.png` | Live `66.6` case normalizes to `65`. |

## Prior polish records

`.factory/polish-2.md` and `.factory/polish-3.md` contain no additional unique
finding IDs. Their changes are represented above and were retested from the
round-4 clean clone and again on production. No blocking, major, minor, copy,
claims, accessibility, privacy, offline, routing, metadata, mobile, performance,
or deployment finding remains open.
