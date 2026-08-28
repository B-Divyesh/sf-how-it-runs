import { defineConfig } from 'vite';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

export default defineConfig({
  plugins: [{
    name: 'route-documents',
    async closeBundle() {
      const home = await readFile('dist/index.html', 'utf8');
      const routes = [
        ['demo/index.html', 'Demo — How It Runs', 'https://how-it-runs.sociobot.in/demo/', 'Try the seeded water simulation with sample settings.'],
        ['systems/water/index.html', 'Clean water simulator — How It Runs', 'https://how-it-runs.sociobot.in/systems/water/', 'Run the clean water works simulation with controls and live results.'],
        ['systems/grid/index.html', 'Power grid simulator — How It Runs', 'https://how-it-runs.sociobot.in/systems/grid/', 'Run the neighborhood power grid simulation with controls and live results.'],
        ['systems/bakery/index.html', 'Bakery line simulator — How It Runs', 'https://how-it-runs.sociobot.in/systems/bakery/', 'Run the morning bakery line simulation with controls and live results.'],
      ];
      for (const [route, title, canonical, description] of routes) {
        await mkdir(`dist/${route.substring(0, route.lastIndexOf('/'))}`, { recursive: true });
        await writeFile(`dist/${route}`, home
          .replace('How It Runs — Everyday system simulators', title)
          .replace('https://how-it-runs.sociobot.in/', canonical)
          .replace('Run water, power, and bakery simulations with clear controls and visible results.', description));
      }
    },
  }],
  build: {
    target: 'es2022',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
  test: {
    environment: 'node',
  },
});
