import { spawn, spawnSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from 'playwright';

const grepIndex = process.argv.indexOf('--grep');
const grep = grepIndex >= 0 ? process.argv[grepIndex + 1] : '';
const requested = grep.replace('@claim:', '');
const base = 'http://127.0.0.1:4181';
const claimIds = new Set([
  'sample-demo-isolated', 'leave-demo-discards-sample', 'free', 'offline-reload',
  'no-tracking-storage', 'private-url-settings', 'system-loop', 'keyboard-controls',
  'reduced-motion', 'real-routes', 'watch-mode', 'art-provenance', 'build-output',
  'hosting-routes',
]);
if (requested && !claimIds.has(requested)) throw new Error(`Unknown claim id: ${requested}`);

const build = spawnSync('npm', ['run', 'build'], { stdio: 'inherit' });
if (build.status !== 0) process.exit(build.status ?? 1);
const server = spawn('node', ['scripts/production-preview.mjs', '--port', '4181'], { stdio: 'ignore' });

async function ready() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try { if ((await fetch(base)).ok) return; } catch { /* wait */ }
    await delay(100);
  }
  throw new Error('Claim preview did not start.');
}

const run = (id, fn) => (!requested || requested === id) ? fn() : undefined;
const pass = (id) => console.log(`@claim:${id} PASS`);
const withinViewport = (box, viewport) => box && box.y < viewport.height && box.y + box.height > 0 && box.x < viewport.width && box.x + box.width > 0;
const meterValues = (page) => page.locator('.meter').evaluateAll((meters) => meters.map((meter) => meter.getAttribute('aria-valuenow')));

try {
  await ready();

  await run('sample-demo-isolated', async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    await page.addInitScript(() => localStorage.setItem('real:how-it-runs:state', 'keep'));
    await page.goto(base, { waitUntil: 'networkidle' });
    if (await page.locator('#demo-banner').isVisible() || await page.locator('#demo-banner').evaluate((node) => getComputedStyle(node).display !== 'none')) throw new Error('Demo banner appeared in real mode.');
    await page.getByRole('link', { name: /Try it with sample data/ }).click();
    await page.waitForURL(/\/demo\//);
    const banner = page.locator('#demo-banner');
    const lever = page.locator('#lever-settling');
    await banner.waitFor();
    await lever.waitFor();
    const viewport = page.viewportSize();
    if (!viewport || !withinViewport(await banner.boundingBox(), viewport) || !withinViewport(await lever.boundingBox(), viewport)) {
      throw new Error('One-click demo did not show its banner and a seeded control in the first mobile viewport.');
    }
    await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
    const stickyBanner = await banner.boundingBox();
    if (!stickyBanner || stickyBanner.y > 1) throw new Error('Demo banner did not remain at the top while scrolling.');
    await page.evaluate(() => scrollTo(0, 0));
    if (await lever.inputValue() !== '65') throw new Error('Demo did not seed the documented water data.');
    await lever.fill('80');
    await page.getByRole('button', { name: 'Reset demo' }).click();
    if (await lever.inputValue() !== '65') throw new Error('Demo reset did not restore sample data.');
    const storage = await page.evaluate(() => ({ real: localStorage.getItem('real:how-it-runs:state'), demo: sessionStorage.getItem('demo:how-it-runs:state') }));
    if (storage.real !== 'keep' || !storage.demo) throw new Error(`Demo isolation failed: ${JSON.stringify(storage)}`);
    await page.goto(`${base}/?demo=1`, { waitUntil: 'networkidle' });
    if (!await banner.isVisible() || await lever.inputValue() !== '65') throw new Error('?demo=1 did not enter the same isolated sample.');
    await browser.close();
    pass('sample-demo-isolated');
  });

  await run('leave-demo-discards-sample', async () => {
    const browser = await chromium.launch();
    const page = await (await browser.newContext()).newPage();
    await page.addInitScript(() => localStorage.setItem('real:how-it-runs:state', 'keep'));
    await page.goto(`${base}/demo/`, { waitUntil: 'networkidle' });
    await page.locator('#lever-settling').fill('80');
    await page.getByRole('button', { name: 'Leave demo and clear sample' }).click();
    await page.waitForURL(`${base}/`);
    const state = await page.evaluate(() => ({ demo: sessionStorage.getItem('demo:how-it-runs:state'), real: localStorage.getItem('real:how-it-runs:state') }));
    if (state.demo !== null || state.real !== 'keep' || await page.locator('#demo-banner').isVisible()) throw new Error(`Leaving demo did not discard only sample data: ${JSON.stringify(state)}`);
    await browser.close();
    pass('leave-demo-discards-sample');
  });

  await run('free', async () => {
    const browser = await chromium.launch();
    const page = await (await browser.newContext()).newPage();
    for (const id of ['water', 'grid', 'bakery']) {
      await page.goto(`${base}/systems/${id}/`, { waitUntil: 'networkidle' });
      if (await page.locator('text=/paywall|subscribe|checkout|sign in|payment/i').count()) throw new Error(`${id} exposed a payment or account gate.`);
    }
    await browser.close();
    pass('free');
  });

  await run('offline-reload', async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(`${base}/demo/`, { waitUntil: 'networkidle' });
    await page.evaluate(() => navigator.serviceWorker.ready);
    if (!await page.evaluate(() => Boolean(navigator.serviceWorker.controller))) {
      await page.reload({ waitUntil: 'networkidle' });
      await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
    }
    await context.setOffline(true);
    for (const [path, selector, value] of [
      ['/demo/', '#lever-settling', '65'],
      ['/systems/water/', '#lever-settling', '45'],
      ['/systems/grid/', '#lever-generator', '45'],
      ['/systems/bakery/', '#lever-mix', '40'],
    ]) {
      await page.goto(`${base}${path}`, { waitUntil: 'domcontentloaded' });
      await page.locator(selector).waitFor();
      if (await page.locator(selector).inputValue() !== value) throw new Error(`${path} lost its seeded control while offline.`);
    }
    await context.setOffline(false);
    await browser.close();
    pass('offline-reload');
  });

  await run('no-tracking-storage', async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    const requests = [];
    page.on('request', (request) => requests.push({ url: request.url(), type: request.resourceType() }));
    await page.goto(`${base}/demo/`, { waitUntil: 'networkidle' });
    await page.locator('#lever-settling').fill('80');
    await page.getByRole('button', { name: 'Reset demo' }).click();
    for (const id of ['water', 'grid', 'bakery']) await page.goto(`${base}/systems/${id}/`, { waitUntil: 'networkidle' });
    const browserData = await page.evaluate(() => ({ cookies: document.cookie, local: Object.keys(localStorage), session: Object.keys(sessionStorage) }));
    const unexpected = requests.filter(({ url, type }) => {
      const parsed = new URL(url);
      return parsed.origin !== base || /analytics|collect|telemetry|track|beacon|events?/i.test(parsed.pathname) || ['websocket', 'eventsource'].includes(type);
    });
    if (unexpected.length || browserData.cookies || browserData.local.length || browserData.session.some((key) => !key.startsWith('demo:'))) {
      throw new Error(`Tracking or profile storage detected: ${JSON.stringify({ unexpected, browserData })}`);
    }
    if (await page.locator('a, button, form').filter({ hasText: /create account|sign in|profile/i }).count()) throw new Error('Account or profile interface appeared.');
    await browser.close();
    pass('no-tracking-storage');
  });

  await run('private-url-settings', async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'] });
    const page = await context.newPage();
    await page.goto(`${base}/systems/water/`, { waitUntil: 'networkidle' });
    await page.locator('#lever-settling').fill('80');
    await page.getByRole('button', { name: /Copy share link/ }).click();
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    const url = new URL(copied);
    const keys = [...url.searchParams.keys()];
    if (url.pathname !== '/systems/water/' || url.searchParams.get('set') !== '80,75,35' || keys.some((key) => !['set', 'fault'].includes(key))) throw new Error(`Share URL exposed more than simulator settings: ${copied}`);
    await page.goto(copied, { waitUntil: 'networkidle' });
    if (await page.locator('#lever-settling').inputValue() !== '80') throw new Error('Copied settings did not reopen.');
    await browser.close();
    pass('private-url-settings');
  });

  await run('system-loop', async () => {
    const browser = await chromium.launch();
    const page = await (await browser.newContext()).newPage();
    const fixtures = [
      ['water', ['65', '65', '60']],
      ['grid', ['70', '40', '30']],
      ['bakery', ['60', '70', '60']],
    ];
    for (const [id, steady] of fixtures) {
      await page.goto(`${base}/systems/${id}/`, { waitUntil: 'networkidle' });
      if (await page.locator('input[type="range"]').count() !== 3 || await page.locator('.flow-line li').count() !== 5 || await page.locator('.meter').count() !== 3) throw new Error(`${id} has the wrong control, stage, or result count.`);
      for (const selector of ['.results-panel', '.fault-zone', '.job-board', '.flow-note']) if (await page.locator(selector).count() !== 1) throw new Error(`${id} is missing ${selector}.`);
      const before = await meterValues(page);
      const first = page.locator('input[type="range"]').first();
      const next = await first.getAttribute('max');
      await first.fill(next);
      const changed = await meterValues(page);
      if (before.join(',') === changed.join(',')) throw new Error(`${id} results did not react to a control.`);
      for (let index = 0; index < steady.length; index += 1) await page.locator('input[type="range"]').nth(index).fill(steady[index]);
      await page.getByText('System steady', { exact: true }).waitFor();
      const fault = page.locator('[data-action="fault"]');
      if (await fault.isDisabled()) throw new Error(`${id} fault did not unlock at the target.`);
      const calm = await meterValues(page);
      await fault.click();
      const disrupted = await meterValues(page);
      if (calm.join(',') === disrupted.join(',')) throw new Error(`${id} fault did not change a result.`);
      if (!(await page.locator('.job-board').innerText()).trim()) throw new Error(`${id} worker job note was empty.`);
    }
    await browser.close();
    pass('system-loop');
  });

  await run('keyboard-controls', async () => {
    const browser = await chromium.launch();
    const page = await (await browser.newContext()).newPage();
    await page.goto(`${base}/systems/water/`);
    const lever = page.locator('#lever-settling');
    await lever.focus();
    const before = await lever.inputValue();
    await page.keyboard.press('ArrowRight');
    if (before === await lever.inputValue()) throw new Error('Arrow key did not operate the range input.');
    await browser.close();
    pass('keyboard-controls');
  });

  await run('reduced-motion', async () => {
    const browser = await chromium.launch();
    const page = await (await browser.newContext({ reducedMotion: 'reduce' })).newPage();
    await page.goto(`${base}/systems/water/`);
    const motion = await page.locator('body').evaluate(() => {
      const seconds = (value) => value.split(',').map((part) => part.trim()).map((part) => part.endsWith('ms') ? Number.parseFloat(part) / 1000 : Number.parseFloat(part)).filter(Number.isFinite);
      const values = [];
      for (const element of document.querySelectorAll('*')) {
        for (const pseudo of [null, '::before', '::after']) {
          const style = getComputedStyle(element, pseudo);
          values.push(...seconds(style.animationDuration), ...seconds(style.transitionDuration));
        }
      }
      return { maxSeconds: Math.max(...values), scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior };
    });
    if (motion.maxSeconds > 0.02 || motion.scrollBehavior !== 'auto') throw new Error(`Reduced-motion styles still animate: ${JSON.stringify(motion)}`);
    await browser.close();
    pass('reduced-motion');
  });

  await run('real-routes', async () => {
    const browser = await chromium.launch();
    const page = await (await browser.newContext()).newPage();
    const routes = [
      ['/demo/', 'Demo — How It Runs', 'https://how-it-runs.sociobot.in/demo/'],
      ['/systems/water/', 'Clean water works simulator — How It Runs', 'https://how-it-runs.sociobot.in/systems/water/'],
      ['/systems/grid/', 'Neighborhood power grid simulator — How It Runs', 'https://how-it-runs.sociobot.in/systems/grid/'],
      ['/systems/bakery/', 'Morning bakery line simulator — How It Runs', 'https://how-it-runs.sociobot.in/systems/bakery/'],
      ['/privacy/', 'Privacy — How It Runs', 'https://how-it-runs.sociobot.in/privacy/'],
      ['/terms/', 'Terms — How It Runs', 'https://how-it-runs.sociobot.in/terms/'],
    ];
    for (const [path, title, canonical] of routes) {
      const html = await (await fetch(`${base}${path}`)).text();
      for (const needle of [`<title>${title}</title>`, `rel="canonical" href="${canonical}"`, `property="og:title" content="${title}"`, `property="og:url" content="${canonical}"`, `name="twitter:title" content="${title}"`, 'name="twitter:description"', 'name="twitter:image"']) {
        if (!html.includes(needle)) throw new Error(`${path} raw HTML lacks ${needle}.`);
      }
      await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
      if (await page.title() !== title || await page.locator('link[rel="canonical"]').getAttribute('href') !== canonical) throw new Error(`${path} executed metadata is wrong.`);
    }
    const missingResponse = await fetch(`${base}/missing-metadata-check`);
    const missingHtml = await missingResponse.text();
    for (const needle of ['<title>Page not found — How It Runs</title>', 'rel="canonical" href="https://how-it-runs.sociobot.in/404.html"', 'property="og:title"', 'name="twitter:title"', 'name="twitter:image"']) {
      if (!missingHtml.includes(needle)) throw new Error(`404 raw HTML lacks ${needle}.`);
    }
    if (missingResponse.status !== 404) throw new Error('Missing route did not preserve status 404.');
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Run this system' }).first().click();
    await page.waitForURL(/\/systems\/water\//);
    await page.waitForFunction(() => document.querySelector('#route-announcement')?.textContent === 'Clean water works simulator opened.');
    if (!await page.getByRole('heading', { name: 'Clean water works simulator' }).evaluate((node) => document.activeElement === node)) throw new Error('Route heading did not receive focus.');
    await page.goBack();
    await page.waitForFunction(() => document.querySelector('#route-announcement')?.textContent === 'How It Runs home opened.');
    if (new URL(page.url()).pathname !== '/') throw new Error('Back did not restore home.');
    await page.goForward();
    await page.waitForURL(/\/systems\/water\//);
    await page.waitForFunction(() => document.querySelector('#route-announcement')?.textContent === 'Clean water works simulator opened.');
    await browser.close();
    pass('real-routes');
  });

  await run('watch-mode', async () => {
    const browser = await chromium.launch();
    const page = await (await browser.newContext()).newPage();
    await page.clock.install();
    await page.goto(`${base}/systems/water/?set=65,65,60`, { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Watch it run' }).click();
    await page.getByText('Watch guide 1 of 4').waitFor();
    await page.getByRole('button', { name: 'Pause watch mode' }).click();
    await page.getByRole('button', { name: 'Watch it run' }).waitFor();
    await page.getByRole('button', { name: 'Watch it run' }).click();
    await page.clock.fastForward(15000);
    await page.getByText('Guided run complete. Now try the controls yourself.').waitFor();
    if (!await page.getByRole('button', { name: 'Replay watch mode' }).count() || !await page.getByText('Watch guide 4 of 4').count()) throw new Error('Watch mode did not stop after four captions.');
    await browser.close();
    pass('watch-mode');
  });

  await run('art-provenance', async () => {
    const prompt = JSON.parse(await readFile('assets/src/hero-poster.json', 'utf8'));
    const design = await readFile('.factory/design.md', 'utf8');
    const home = await readFile('index.html', 'utf8');
    if (!existsSync('assets/src/hero-poster.png') || statSync('assets/src/hero-poster.png').size < 100_000 || !JSON.stringify(prompt).includes('art-deco transit poster') || !design.includes('/opt/fleet/lib/gen-image.sh') || !home.includes('Original generated panorama.')) throw new Error('Generated-art source, prompt, disclosure, or provenance is missing.');
    pass('art-provenance');
  });

  await run('build-output', async () => {
    if (!existsSync('dist/index.html') || !existsSync('dist/assets') || !existsSync('dist/staticwebapp.config.json')) throw new Error('Production build output is incomplete.');
    pass('build-output');
  });

  await run('hosting-routes', async () => {
    const response = await fetch(`${base}/missing-claim-check`);
    const html = await response.text();
    if (response.status !== 404 || !html.includes('This page does not exist.')) throw new Error('Missing links do not receive the branded 404.');
    if (response.headers.get('x-content-type-options') !== 'nosniff' || !response.headers.get('content-security-policy')?.includes("default-src 'self'")) throw new Error('Security headers are missing.');
    pass('hosting-routes');
  });
} finally {
  server.kill('SIGTERM');
}
