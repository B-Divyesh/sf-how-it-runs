# How It Runs

How It Runs is a free collection of five-minute browser simulators that helps
children understand the jobs and trade-offs inside everyday systems. The first
release includes municipal water treatment, a small power grid, and a bakery
production line.

Each route uses the same learning loop: move three levers, watch material or energy
flow through five stages, balance output/quality/cost, unlock a realistic disruption,
and learn which real job coordinates the system. A narrated **Watch it run** mode
plays the loop without requiring game input.

Live site: <https://how-it-runs.sociobot.in>

## Who it is for

- Parents who want to show a child what a technical or industrial job involves
- Teachers introducing infrastructure, systems thinking, and cause and effect
- Curious learners who prefer an explorable explanation to a video

The models build intuition; they are not operational or engineering guidance. The
interface says this wherever the simplified diagrams appear.

## Run locally

Requires Node.js 20 or newer.

```sh
npm install
npm run dev
```

Vite prints a local URL, usually `http://localhost:5173`.

## Test and build

```sh
npm test
npm run build
npm run preview -- --port 4173
npm run verify:browser -- http://127.0.0.1:4173
```

`npm run build` is the production build command. It performs strict TypeScript
checking and writes the static deployment to `dist/`, with `dist/index.html` at its
root. `npm run preview` serves that exact directory using the same Static Web Apps
navigation and cache rules committed for deployment. `verify:browser` expects that
preview server to be running and exercises all three targets plus the water fault,
watch-mode pause, keyboard skip-link focus, mobile overflow, axe accessibility,
offline reload/module MIME behavior, cache headers, and browser console.

## Product behavior

- State is local-first and encoded as `?system=water&set=65,65,60&fault=1`.
- Share copies that URL; there are no accounts or server-side saves.
- A service worker caches the visited app shell for offline use.
- Watch mode has an explicit pause control and stops after its four captions.
- Native range inputs support touch, mouse, and arrow keys.
- Reduced-motion users receive static flow lines and instant transitions.

## Project map

- `src/data.ts` — the three system definitions, captions, stages, and learning copy
- `src/engine.ts` — pure shared outcome calculations
- `src/main.ts` — URL state and simulator interaction layer
- `src/style.css` — the art-deco transit-poster visual system
- `assets/src/` — generated source art and prompt provenance
- `public/` — optimized art, offline worker, legal pages, and deployment headers
- `.factory/design.md` — palette, type, layout, motion, and art direction
- `.factory/handoff.md` — verification record and known gaps

No third-party fonts, scripts, analytics, advertising, or runtime CDNs are used.

## Deploy

Deploy the contents of `dist/` as an Azure Static Web App. The checked-in
`staticwebapp.config.json` supplies security headers, asset types, and the navigation
fallback. Infrastructure, DNS, and billing are intentionally outside this repository.

## License

Software is available under the [MIT License](LICENSE). The generated panorama is
original to this product; its exact prompt and generation metadata are recorded in
`assets/src/` and `.factory/design.md`.
