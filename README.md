# How It Runs

Run water, power, and bakery systems. This free browser simulator is for kids and grown-ups curious about everyday infrastructure.

Open the [sample demo](https://how-it-runs.sociobot.in/demo/). One click opens water at 65% settling, 65% filter speed, and 60% disinfectant.

The demo banner stays visible while sample data is active. **Reset demo** restores the sample data. **Leave demo and clear sample** removes it.

## What is included

- Each simulation has three controls, five stages, three live results, a fault, and a worker’s job note.
- Controls work with arrow keys.
- If your device reduces motion, flow lines stay still and screen changes do not animate.
- Each simulation has a link you can copy and reopen.
- Watch mode can pause and stops after four captions.
- Works offline after the first visit.
- No account; settings stay in the URL.
- There are no accounts, analytics, cookies, or saved profiles.

These simulations are not engineering, food-safety, or operational guidance.

## Run locally

Use Node.js 20.19+ (20.x) or 22.12+.

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
npm run test:node-versions
```

The production build creates the static site in `dist`, with `index.html` at its root.

## Privacy and demo storage

Demo changes use only `demo:how-it-runs:state` in session storage. Real mode does not read or write that key.

The generated panorama is original to this product, with its source prompt and generation record included.

## Deploy

Deploy `dist/` as an Azure Static Web App. The included hosting file adds security rules and a branded page for missing links.

## License

[MIT License](LICENSE)
