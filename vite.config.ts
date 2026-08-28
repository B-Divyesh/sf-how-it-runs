import { defineConfig } from 'vite';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

export default defineConfig({
  plugins: [{
    name: 'route-documents',
    async closeBundle() {
      const home = await readFile('dist/index.html', 'utf8');
      const routes = [
        ['demo/index.html', 'Demo — How It Runs', 'https://how-it-runs.sociobot.in/demo/', 'Try water with sample data at 65% settling, 65% filter speed, and 60% disinfectant.'],
        ['systems/water/index.html', 'Clean water works simulator — How It Runs', 'https://how-it-runs.sociobot.in/systems/water/', 'Adjust three controls and read three results in the clean water works simulation.'],
        ['systems/grid/index.html', 'Neighborhood power grid simulator — How It Runs', 'https://how-it-runs.sociobot.in/systems/grid/', 'Adjust three controls and read three results in the neighborhood power grid simulation.'],
        ['systems/bakery/index.html', 'Morning bakery line simulator — How It Runs', 'https://how-it-runs.sociobot.in/systems/bakery/', 'Adjust three controls and read three results in the morning bakery line simulation.'],
      ];
      for (const [route, title, canonical, description] of routes) {
        await mkdir(`dist/${route.substring(0, route.lastIndexOf('/'))}`, { recursive: true });
        const routeHtml = home
          .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
          .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${canonical}" />`)
          .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${description}" />`)
          .replace(/<meta property="og:title"[^>]*>/, `<meta property="og:title" content="${title}" />`)
          .replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${description}" />`)
          .replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${canonical}" />`)
          .replace(/<meta name="twitter:title"[^>]*>/, `<meta name="twitter:title" content="${title}" />`)
          .replace(/<meta name="twitter:description"[^>]*>/, `<meta name="twitter:description" content="${description}" />`);
        await writeFile(`dist/${route}`, routeHtml);
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
