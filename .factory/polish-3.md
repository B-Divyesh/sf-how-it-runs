# Polish 3 — cumulative review repair record

Candidate repaired: `1fdb855a7d293df5b602e4a964e532fb334a8304`.
Review base: `e6f730abb6858deea40034f446c676454c50def7`.
Runtime repair commit: `5a95867715458f4061807f878ec62cdb0d925cc8`.
Live URL: <https://how-it-runs.sociobot.in>.

## Evidence key

- **Claims:** all 15 commands in `.factory/claims.json` passed separately from
  clean clone `/tmp/how-it-runs-polish3.BTZCCx/repo` at `5a95867`.
- **Browser:** `npm run verify:browser -- http://127.0.0.1:4174` and the same
  command against the live URL passed. Both reported 0 axe violations, 0
  console errors, no mobile overflow, valid touch targets, offline reload,
  route focus/history, cache headers, and the designed 404.
- **URL:** `/opt/fleet/lib/verify-url.sh` passed locally and live. The live
  report is `.factory/evidence/polish-3/live-url/verify.json`.
- **Cold live:** `.factory/evidence/polish-3/live-cold-check.json` records both
  first screens, demo isolation, all three share round trips, raw metadata,
  route status, history/focus, same-origin requests, and zero cookies.
- **Screenshots:** `.factory/evidence/polish-3/live-home-390.png`,
  `.factory/evidence/polish-3/home-1440.png`,
  `.factory/evidence/polish-3/live-demo-390.png`, and
  `.factory/evidence/polish-3/grid-share-390.png`.
- **Performance:** `.factory/evidence/polish-3/lighthouse-summary.json` records
  both runs. Each scored 100 Performance, Accessibility, Best Practices, and
  SEO. Live LCP was 1.2 s, TBT 30 ms, and CLS 0.

## Review 3

| Finding | Change made | Test evidence | Screenshot | Live URL check |
| --- | --- | --- | --- | --- |
| F-3-1 / R1-B3 reopened | Narrowed `engines.node` and README to `^20.19.0 \|\| >=22.12.0`; added `node-runtime-support`, which creates clean copies and runs install, unit tests, and build at 20.19.0, 22.12.0, and latest 24 LTS. | `npm run test:node-versions` | `live-home-390.png` confirms no product regression. | `/` serves build `polish-3`; runtime contract passed from the clean clone. |
| F-3-2 | Extended `real-routes` to change, copy, validate, and reopen settings for water, grid, and bakery in separate pages. | `@claim:real-routes` | `grid-share-390.png` | `/systems/water/`, `/systems/grid/`, and `/systems/bakery/`; copied values 50, 50, and 45 reopened. |

## Review 2

| Finding | Change retained or completed | Test evidence | Screenshot | Live URL check |
| --- | --- | --- | --- | --- |
| R2-B1 | Demo opens directly on water controls; the sticky banner is demo-only; reset restores 65/65/60; leaving removes only its namespaced key. | `@claim:sample-demo-isolated`, `@claim:leave-demo-discards-sample` | `live-demo-390.png` | `/?demo=1` canonicalized to `/demo/?demo=1&system=water&set=65%2C65%2C60`. |
| R2-U01 | Removed the untested five-minute promise. | copy audit; `@claim:real-routes` | `live-home-390.png` | `/` headline is “Run water, power, and bakery systems.” |
| R2-U02 | Replaced “realistic settings” with exact 65/65/60 values. | `@claim:sample-demo-isolated` | `live-home-390.png` | `/demo/` opens the exact values. |
| R2-U03 | Uses the structural three-controls/three-results wording and tests reactive meters in all systems. | `@claim:system-loop` | `grid-share-390.png` | All three `/systems/*/` routes passed. |
| R2-U04 | Listed the full privacy sentence and tests network, cookies, storage, streams, and account UI. | `@claim:no-tracking-storage` | `live-demo-390.png` | Cold demo saw 16 same-origin requests, 0 third-party requests, and 0 cookies. |
| R2-U05 | Renamed and implemented “Leave demo and clear sample.” | `@claim:leave-demo-discards-sample` | `live-demo-390.png` | Live exit removed only `demo:how-it-runs:state`. |
| R2-C01 | Requires reactive results, reachable targets, operated faults, job notes, and all reduced-motion durations. | `@claim:system-loop`, `@claim:reduced-motion` | `grid-share-390.png` | Live browser gate passed all systems and reduced motion. |
| R2-S01 | Physical demo/system documents and every legal/404 route carry their own title, description, canonical, and social fields. | `@claim:real-routes`, `@claim:hosting-routes` | `live-demo-390.png` | Cold raw-HTML checks passed `/`, demo, all systems, Privacy, Terms, and 404. |
| R2-S02 | Route changes populate the polite live region and focus the new h1. | `@claim:real-routes` | `grid-share-390.png` | Live Back/Forward focus and announcements passed. |
| R2-S03 | Reduced desktop hero height so all three facts fit before y=900. | `verify:browser` | `home-1440.png` | Live desktop first-screen bounding-box check passed. |
| R2-CP01 | Removed “realistic”; names exact sample values. | `@claim:sample-demo-isolated` | `live-home-390.png` | `/` and `/demo/` match. |
| R2-CP02 | Uses “sample data” consistently. | copy audit | `live-demo-390.png` | `/demo/` banner and actions match. |
| R2-CP03 | Uses “Meet all three targets.” | `@claim:system-loop` | `grid-share-390.png` | All system missions passed. |
| R2-CP04 | Uses “Leave demo and clear sample” and performs that result. | `@claim:leave-demo-discards-sample` | `live-demo-390.png` | Live exit behavior passed. |
| R2-CP05 | Explains reduced motion in ordinary words. | `@claim:reduced-motion` | `grid-share-390.png` | Live reduced-motion browser gate passed. |
| R2-CP06 | Says each simulation has a link that can be copied and reopened; round-trips all three systems now. | `@claim:real-routes` | `grid-share-390.png` | Three live copied URLs reopened correctly. |
| R2-CP07 | Describes build output as site files in `dist`. | `@claim:build-output` | `home-1440.png` | Deployed artifact contains root `index.html`. |
| R2-CP08 | Describes the hosting file as security rules and a branded missing page. | `@claim:hosting-routes` | `live-url/screenshot-desktop.png` | `/cold-missing-polish-3` returned the branded 404 with HTTP 404. |
| R2 unnumbered Node claim | Corrected and listed the exact supported range. | `@claim:node-runtime-support` | `live-home-390.png` | Live build label confirms the repaired bundle. |

## Review 1 — primary, structure, and copy findings

| Finding | Change retained or completed | Test evidence | Screenshot | Live URL check |
| --- | --- | --- | --- | --- |
| R1-B1 | First screen names the job, audience, sample action, result, and three facts. | `verify:browser` first-screen checks | `live-home-390.png`, `home-1440.png` | Cold `/` passed at 390×844 and 1440×900. |
| R1-B2 | One-click/direct demo uses isolated session data with persistent reset and exit controls. | `@claim:sample-demo-isolated`, `@claim:leave-demo-discards-sample` | `live-demo-390.png` | `/demo/` and `/?demo=1` passed. |
| R1-B3 | Claims manifest now has 15 observable tests, including the corrected Node range and complete all-system share test. | every command in `.factory/claims.json` | `live-home-390.png` | Live product behaviors were rechecked after deployment. |
| R1-B4 | Physical routes, push/pop history, route titles, h1 focus, polite announcements, and a real 404 remain working. | `@claim:real-routes`, `@claim:hosting-routes`, `verify:browser` | `grid-share-390.png` | All public routes and `/cold-missing-polish-3` passed. |
| R1-M1 | Canonical, Open Graph/Twitter, product image, favicon, touch icon, and sitemap cover every route. | `@claim:real-routes` | `live-url/screenshot-desktop.png` | Raw metadata passed on seven live 200 routes; 404 metadata/status passed. |
| R1-M2 | Landing order, three steps, shared shell, legal links, factory credit, and build ID remain complete. | `verify:browser` crawl | `live-url/screenshot-desktop.png` | `/privacy/` and `/terms/` returned 200 with common navigation/footer. |
| R1-M3 | Product vocabulary remains simulation/system/fault/controls/Watch mode/settings. | `.factory/copy-audit.md` | `live-home-390.png` | Cold live copy audit found no conflicting activity term. |
| R1-CP01 | Uses the verb-led job headline. | first-screen assertion | `live-home-390.png` | `/` h1 matches. |
| R1-CP02 | Audience sentence names kids and grown-ups. | first-screen assertion | `live-home-390.png` | `/` sentence is visible before scrolling. |
| R1-CP03 | Primary action says “Try it with sample data” and opens the product. | `@claim:sample-demo-isolated` | `live-demo-390.png` | One live click opened seeded controls. |
| R1-CP04 | Uses “simulation” for the activity and “system” for the choice. | copy audit | `live-url/screenshot-desktop.png` | Live full-page copy matches. |
| R1-CP05 | Section heading says “Choose a system to simulate.” | copy audit | `live-url/screenshot-desktop.png` | Live `/` matches. |
| R1-CP06 | Empty state tells visitors to choose water, power, or bakery. | browser crawl | `live-url/screenshot-desktop.png` | Live `/` matches. |
| R1-CP07 | Uses “For parents and teachers.” | copy audit | `live-url/screenshot-desktop.png` | Live `/` matches. |
| R1-CP08 | Limitations heading names what simulations leave out. | `@claim:system-loop` | `grid-share-390.png` | Every live system includes its limitation. |
| R1-CP09 | Removed “intuition-builders”; states the engineering limitation plainly. | copy audit | `live-url/screenshot-desktop.png` | Live `/` matches. |
| R1-CP10 | Summary directly says settings are not saved. | `@claim:no-tracking-storage` | `live-url/screenshot-desktop.png` | Live privacy behavior passed. |
| R1-CP11 | Removed “kid-safe explorable”; footer says free browser simulator. | `@claim:free` | `live-url/screenshot-desktop.png` | Live footer matches. |
| R1-CP12 | Split the README loop into short, concrete statements. | copy audit; `@claim:system-loop` | `grid-share-390.png` | All live system loops passed. |
| R1-CP13 | Replaced the long verifier sentence with runnable commands. | README audit | `live-home-390.png` | Live browser command passed. |
| R1-CP14 | Removed “explorable explanation.” | copy audit | `live-home-390.png` | Absent from live copy. |
| R1-CP15 | Removed the unmeasured intuition outcome. | copy audit | `live-home-390.png` | Absent from live copy. |
| R1-CP16 | Describes settings as URL values in plain words. | `@claim:private-url-settings` | `grid-share-390.png` | Live copied links contain only `set`/`fault`. |
| R1-CP17 | Removed “app shell” and “runtime CDN” jargon from public copy. | copy audit; `@claim:no-tracking-storage` | `live-home-390.png` | Live requests remain same-origin. |
| R1-CP18 | Describes hosting behavior as security rules and a missing page. | `@claim:hosting-routes` | `live-url/screenshot-desktop.png` | Live 404/security checks passed. |
| R1-CP19 | Uses browser simulator/simulation consistently. | copy audit | `live-url/screenshot-desktop.png` | Live page and legal shell match. |

## Review 1 — claim inventory findings

| Finding | Change retained or completed | Test evidence | Screenshot | Live URL check |
| --- | --- | --- | --- | --- |
| R1-U01 | Removed the unmeasured five-minute claim. | copy audit | `live-home-390.png` | Absent from live page and metadata. |
| R1-U02 | Every system exposes a worker job note. | `@claim:system-loop` | `grid-share-390.png` | All three live systems passed. |
| R1-U03 | Removed the “No score” promise. | copy audit | `live-home-390.png` | Absent live. |
| R1-U04 | Removed the “No timer” promise. | copy audit | `live-home-390.png` | Absent live. |
| R1-U05 | Exercises a reachable target, fault effect, and recovery state. | `@claim:system-loop` | `grid-share-390.png` | All three live system targets/faults passed the browser gate. |
| R1-U06 | Replaced fidelity language with exact controls/meters and a limitation. | `@claim:system-loop` | `grid-share-390.png` | Live system structure passed. |
| R1-U07 | Requires a non-empty worker note for every system. | `@claim:system-loop` | `grid-share-390.png` | All three live routes passed. |
| R1-U08 | Lists and tests the exact no-account/analytics/cookie/profile statement. | `@claim:no-tracking-storage` | `live-demo-390.png` | Cold live check found same-origin traffic and zero cookies. |
| R1-U09 | Copied URLs contain only current simulator settings and reopen them. | `@claim:private-url-settings`, `@claim:real-routes` | `grid-share-390.png` | All three live URL round trips passed. |
| R1-U10 | Offline demo and every system route reopen after first visit. | `@claim:offline-reload` | `live-demo-390.png` | Live browser offline gate passed. |
| R1-U11 | Removed “kid-safe”; retained and tests “Free.” | `@claim:free` | `live-home-390.png` | No gate on any live system. |
| R1-U12 | Retained source art, prompt, design record, and disclosure. | `@claim:art-provenance` | `home-1440.png` | Live footer discloses generated panorama. |
| R1-U13 | Removed the unmeasured learning outcome; states concrete scope. | `@claim:free`, `@claim:system-loop` | `home-1440.png` | Live page shows the three systems. |
| R1-U14 | Opens and exercises water, grid, and bakery. | `@claim:system-loop` | `grid-share-390.png` | Three live system routes returned 200. |
| R1-U15 | Requires three controls, five stages, three results, a fault, and job note in every system. | `@claim:system-loop` | `grid-share-390.png` | All three live system routes passed. |
| R1-U16 | Watch mode starts and completes without more input. | `@claim:watch-mode` | `grid-share-390.png` | Live browser gate starts and pauses Watch mode. |
| R1-U17 | Retains only the safety limitation. | copy audit | `live-url/screenshot-desktop.png` | `/terms/` returned 200 with the same limitation. |
| R1-U18 | Requires each system’s simplification note. | `@claim:system-loop` | `grid-share-390.png` | All three live systems passed. |
| R1-U19 | Replaces “local-first” with URL wording and round-trips settings. | `@claim:private-url-settings` | `grid-share-390.png` | Live URL round trips passed. |
| R1-U20 | Tests clipboard URL, allowed keys, cookies, storage, and requests. | `@claim:private-url-settings`, `@claim:no-tracking-storage` | `grid-share-390.png` | Live cold check passed all three URLs and privacy capture. |
| R1-U21 | Service-worker-controlled demo and every system route reopen offline. | `@claim:offline-reload` | `live-demo-390.png` | Live offline browser gate passed. |
| R1-U22 | Watch pauses and stops at caption four. | `@claim:watch-mode` | `grid-share-390.png` | Live Watch keyboard path passed. |
| R1-U23 | Native range control changes with ArrowRight. | `@claim:keyboard-controls` | `live-demo-390.png` | Live keyboard browser gate passed. |
| R1-U24 | Reduced motion removes all computed animations/transitions and smooth scrolling. | `@claim:reduced-motion` | `grid-share-390.png` | Live reduced-motion gate passed. |
| R1-U25 | Rejects external and tracking-shaped requests throughout demo and systems. | `@claim:no-tracking-storage` | `live-demo-390.png` | Cold live check saw 0 third-party requests. |
| R1-U26 | Verifies source image, prompt, generation record, and disclosure. | `@claim:art-provenance` | `home-1440.png` | Live generated-art disclosure is present. |
| R1-U27 | Metadata omits “five-minute” and “kid-safe” and names the concrete scope. | `@claim:real-routes` | `home-1440.png` | Raw live home metadata passed. |
| R1-U28 | Every system exposes controls and reactive results. | `@claim:system-loop` | `grid-share-390.png` | All three live loops passed. |
| R1-U29 | Each route exercises its stated water, power, or bakery behavior. | `@claim:system-loop` | `grid-share-390.png` | All three live routes returned 200 and functioned. |
| R1-U30 | Social copy is structural and route-specific. | `@claim:real-routes` | `home-1440.png` | Raw live Open Graph/Twitter checks passed. |
| R1-U31 | Build claim checks type checking and the complete `dist` root. | `@claim:build-output` | `home-1440.png` | The deployed `dist` returned 200. |
| R1-U32 | Broad verifier prose was replaced with individual claim commands. | all 15 manifest commands | `live-home-390.png` | Live browser and URL gates passed. |

## Earlier polish verification findings

| Finding | Change retained | Test evidence | Screenshot | Live URL check |
| --- | --- | --- | --- | --- |
| Verification 1 P1 — skip focus | Skip activates and focuses `main`. | `verify:browser` | `live-home-390.png` | Live keyboard check passed. |
| Verification 1 P1 — local browser gate | Service-worker asset handling and 404 crawl handling remain fixed. | `verify:browser` | `live-url/screenshot-desktop.png` | Live gate completed. |
| Verification 1 P2 — immutable assets | Hashed `/assets/*` are immutable; HTML and worker revalidate. | `verify:browser` | `live-home-390.png` | Live cache checks passed. |
| Verification 1 P3 — URL recovery | Invalid system paths normalize to valid product state. | `verify:browser` | `grid-share-390.png` | Live route gate passed. |
| Verification 2 P1 — Watch focus | Enter starts Watch mode and Space pauses while focus stays on the replacement control. | `verify:browser`, `@claim:watch-mode` | `grid-share-390.png` | Live keyboard path passed. |
| Verification 2 P3 — unknown system URL | Unknown system state returns to a valid canonical URL. | `verify:browser` | `live-url/screenshot-desktop.png` | Live route gate passed. |
| Verification 3 P2 — touch targets | Visible mobile links and controls are at least 44×44 CSS px. | `verify:browser` | `live-home-390.png`, `live-demo-390.png` | Live mobile target audit passed. |
| Verification 4 P2 — fractional state | Imported numbers snap to the native 5% step and the URL is rewritten. | `verify:browser` | `grid-share-390.png` | Live `66.6` water value normalized to `65`. |

## Result

No blocking, major, minor, copy, structure, accessibility, privacy, offline,
performance, or earlier verification finding remains open.
