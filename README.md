# How It Runs

Run everyday systems in five minutes. This free browser simulator is for kids and grown-ups who want to see how water, power, and bread reach a neighborhood.

Open the [sample demo](https://how-it-runs.sociobot.in/demo/). It starts a water simulation with sample settings. The banner says when sample data is active. Reset demo restores the sample. Start for real leaves the sample without keeping it.

## What is included

- Water, power, and bakery simulations have controls, five stages, live results, a fault, and a worker’s job note.
- Controls work with arrow keys.
- Reduced-motion users receive static flow lines and instant transitions.
- Water, power, and bakery simulations have shareable routes.
- Works offline after the first visit.
- No account; settings stay in the URL.

These simulations are not engineering, food-safety, or operational guidance.

## Run locally

Requires Node.js 20 or newer.

```sh
npm ci
npm run dev
```

## Test and build

```sh
npm test
npm run build
npm run preview -- --port 4173
npm run verify:browser -- http://127.0.0.1:4173
npm run test:claims
```

`npm run build` writes the deployable static site to `dist/`.

## Deploy

Deploy `dist/` as an Azure Static Web App. The checked-in configuration sets headers and a styled 404 response.

## License

[MIT License](LICENSE)
