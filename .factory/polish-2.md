# Polish 2 — cumulative review repair record

Candidate repaired: `f4de14593cc1d319cb029f98e28f8d5db6dbde60`.

Local visual evidence: `.factory/evidence/home-390.png`,
`.factory/evidence/demo-390.png`, and `.factory/evidence/home-1440.png`.
Live URL check: `npm run verify:browser -- https://how-it-runs.sociobot.in`
passed after deployment, including every public route, the designed 404,
metadata, focus/announcement history, mobile/touch, offline reload, privacy
request behavior, cache policy, and axe scans (0 violations). A cold 390 px
visit to `https://how-it-runs.sociobot.in/demo/` also showed the banner and
the 65/65/60 controls in the first viewport. This live check is evidence for
each mapped row below.

## Review 1

| Finding | Change made | Evidence |
| --- | --- | --- |
| B1, CP01–CP03 | Rewrote the first screen around the plain job, audience, one-click sample action, concrete sample values, and three facts. | `verify:browser` desktop/mobile first-screen check; `home-390.png`; `home-1440.png` |
| B2 | Added `/demo/` and `?demo=1`, fixed water sample data, demo-only session key, reset, leave-and-clear action, persistent banner, and documentation. | `@claim:sample-demo-isolated`; `@claim:leave-demo-discards-sample`; `demo-390.png` |
| B3 | Added the claims manifest and one tagged, observable sandbox check for every published claim. Removed untestable outcome language. | all commands in `.factory/claims.json`; `npm run test:claims` |
| B4 | Added physical demo/system documents, push/pop history, route-specific titles, heading focus, live announcement, and designed 404. | `@claim:real-routes`; `@claim:hosting-routes`; `verify:browser` |
| M1 | Added canonical, Open Graph, Twitter, social image, favicon/apple icon, route metadata, and full sitemap coverage. | `@claim:real-routes` raw and executed metadata assertions |
| M2 | Added the standard landing order, three-step section, shared legal shell, complete footer, and legal links. | `verify:browser` route crawl and axe scan |
| M3, CP04–CP19 | Standardized on simulation/system/fault/controls/settings and rewrote metaphor/jargon-heavy copy. | `.factory/copy-audit.md`; manual copy audit |
| U01 | Removed the unmeasured five-minute promise. | `index.html`, `README.md`, `copy-audit.md` |
| U02 | Kept named worker content and verifies every job note. | `@claim:system-loop` |
| U03 | Removed the “No score” promise. | `index.html` copy audit |
| U04 | Removed the “No timer” promise. | `index.html` copy audit |
| U05 | Verifies targets, fault activation, changed result, and recovery loop. | `@claim:system-loop` |
| U06 | Replaced the unprovable fidelity statement with concrete controls and meters. | `index.html`; `@claim:system-loop` |
| U07 | Verifies a non-empty worker job note for every system. | `@claim:system-loop` |
| U08 | Published the exact privacy statement and tests requests, storage, cookies, and account UI. | `@claim:no-tracking-storage` |
| U09 | Verifies copied URLs contain and restore only simulator settings. | `@claim:private-url-settings` |
| U10 | Removed the connection-dependent sharing statement; exercises offline demos and systems. | `@claim:offline-reload` |
| U11 | Removed “kid-safe” and verifies the remaining free claim. | `@claim:free` |
| U12 | Added provenance disclosure and a retained-source verification. | `@claim:art-provenance` |
| U13 | Removed the unmeasured learning outcome; states concrete product scope. | `README.md`; `@claim:free`, `@claim:system-loop` |
| U14 | Verifies water, power, and bakery routes. | `@claim:system-loop` |
| U15 | Verifies exact controls, stages, results, fault, simplification note, and worker note for all systems. | `@claim:system-loop` |
| U16 | Verifies Watch mode starts, pauses, resumes, and completes. | `@claim:watch-mode` |
| U17 | Retained only the safety limitation. | `README.md`, `terms/index.html` |
| U18 | Verifies the simplification note for every system. | `@claim:system-loop` |
| U19 | Uses plain URL wording and verifies round-trip settings. | `@claim:private-url-settings` |
| U20 | Verifies clipboard URL, cookies, profile storage, and network behavior. | `@claim:private-url-settings`; `@claim:no-tracking-storage` |
| U21 | Verifies reload while offline after service-worker control. | `@claim:offline-reload` |
| U22 | Verifies exact four-caption Watch completion and pause control. | `@claim:watch-mode` |
| U23 | Verifies native range keyboard operation. | `@claim:keyboard-controls` |
| U24 | Verifies reduced-motion animation/transition duration and scroll behavior. | `@claim:reduced-motion` |
| U25 | Rejects external and tracking-like requests across demo and all systems. | `@claim:no-tracking-storage` |
| U26 | Verifies source art, prompt, design record, and disclosure. | `@claim:art-provenance` |
| U27 | Rewrote metadata without “five-minute” or “kid-safe”; verifies physical route metadata. | `@claim:real-routes` |
| U28 | Verifies operable controls and reactive result meters. | `@claim:system-loop` |
| U29 | Exercises each water/power/bakery simulation to its stated loop. | `@claim:system-loop` |
| U30 | Rewrote Open Graph text to structural, tested wording. | `@claim:real-routes`; `@claim:system-loop` |
| U31 | Added a build-output claim. | `@claim:build-output` |
| U32 | Replaced broad verifier marketing with individual claim checks. | `.factory/claims.json`; `npm run test:claims` |

## Review 2

| Finding | Change made | Evidence |
| --- | --- | --- |
| B1 | Places the demo banner before the shell, uses compact demo layout with controls in the first 390 px viewport, hides it in real mode, clears demo data on exit, and now rejects demo URL overrides. | `@claim:sample-demo-isolated`; `@claim:leave-demo-discards-sample`; `demo-390.png` |
| U01 | Replaced the quantitative headline with “Run water, power, and bakery systems.” | `home-390.png`; `.factory/copy-audit.md` |
| U02, CP01 | Replaced “realistic settings” with exact water values. | `@claim:sample-demo-isolated`; `home-390.png` |
| U03 | Replaced broad reactive copy with exact controls/meters and verifies reactivity. | `@claim:system-loop` |
| U04 | Tests the full displayed privacy sentence, including same-origin tracking-shaped paths. | `@claim:no-tracking-storage` |
| U05, CP04 | Renamed the exit action “Leave demo and clear sample” and removes only the demo key. | `@claim:leave-demo-discards-sample` |
| C01 | Expanded loop coverage to mutate controls, observe meters, reach targets, run faults, and require job/simplification content. | `@claim:system-loop` |
| S01 | Generates server-rendered metadata for demo and every system; completed legal/404 metadata. | `@claim:real-routes`; `@claim:hosting-routes` |
| S02 | Announces opening/home routes and focuses the page headline on navigation and history. | `@claim:real-routes` |
| S03 | Reduced desktop hero spacing/scale so all three facts fit in 1440 × 900. | `verify:browser`; `home-1440.png` |
| CP02 | Uses “sample data” consistently. | `index.html`, `README.md`, `.factory/demo.md` |
| CP03 | Replaced “steady zone” with “Meet all three targets.” | `index.html` |
| CP05 | Rewrote reduced-motion copy in plain language. | `README.md`; `@claim:reduced-motion` |
| CP06 | Rewrote “shareable routes” as a copyable/reopenable link. | `README.md`; `@claim:real-routes` |
| CP07 | Rewrote build output copy in plain language. | `README.md`; `@claim:build-output` |
| CP08 | Rewrote hosting-file copy in plain language. | `README.md`; `@claim:hosting-routes` |

## Earlier verification findings

| Finding | Change made | Evidence |
| --- | --- | --- |
| P1 skip focus | Makes `main` programmatically focusable and focuses it after skip activation. | `verify:browser` |
| P1 local browser gate | Corrected service-worker asset handling and the 404 same-document-link crawler false positive. | `verify:browser` completes locally |
| P2 immutable assets | Applies immutable caching to `/assets/*` and revalidation to shell/worker. | `verify:browser` |
| P3 URL normalization | Snaps imported values to native range steps and rewrites canonical URLs. | `verify:browser` fractional-input assertion |
