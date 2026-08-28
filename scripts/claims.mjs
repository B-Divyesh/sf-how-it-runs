import { spawn, spawnSync } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from 'playwright';

const grepIndex = process.argv.indexOf('--grep');
const grep = grepIndex >= 0 ? process.argv[grepIndex + 1] : '';
const requested = grep.replace('@claim:', '');
const base = 'http://127.0.0.1:4181';
const claimIds = new Set([
  'sample-demo-isolated', 'free', 'offline-reload', 'private-url-settings',
  'system-loop', 'keyboard-controls', 'reduced-motion', 'real-routes',
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

try {
  await ready();
  await run('sample-demo-isolated', async () => {
    const browser = await chromium.launch(); const context = await browser.newContext(); const page = await context.newPage();
    await page.addInitScript(() => localStorage.setItem('real:how-it-runs:state', 'keep'));
    await page.goto(`${base}/demo/`, { waitUntil: 'networkidle' });
    await page.getByText('Demo — sample data, nothing is saved').waitFor();
    if (await page.locator('#lever-settling').inputValue() !== '65') throw new Error('Demo was not seeded with realistic water settings.');
    await page.locator('#lever-settling').fill('80');
    await page.getByRole('button', { name: 'Reset demo' }).click();
    if (await page.locator('#lever-settling').inputValue() !== '65') throw new Error('Demo reset did not restore sample settings.');
    const storage = await page.evaluate(() => ({ real: localStorage.getItem('real:how-it-runs:state'), demo: sessionStorage.getItem('demo:how-it-runs:state') }));
    if (storage.real !== 'keep' || !storage.demo) throw new Error(`Demo isolation failed: ${JSON.stringify(storage)}`);
    await browser.close(); console.log('@claim:sample-demo-isolated PASS');
  });
  await run('free', async () => {
    const browser = await chromium.launch(); const page = await (await browser.newContext()).newPage(); await page.goto(base);
    for (const id of ['water', 'grid', 'bakery']) await page.goto(`${base}/systems/${id}/`, { waitUntil: 'networkidle' });
    if (await page.locator('text=/paywall|subscribe|checkout|sign in/i').count()) throw new Error('Free claim exposed a payment or account gate.');
    await browser.close(); console.log('@claim:free PASS');
  });
  await run('offline-reload', async () => {
    const browser = await chromium.launch(); const context = await browser.newContext(); const page = await context.newPage();
    await page.goto(`${base}/demo/`, { waitUntil: 'networkidle' }); await page.evaluate(() => navigator.serviceWorker.ready);
    if (!await page.evaluate(() => Boolean(navigator.serviceWorker.controller))) { await page.reload({ waitUntil: 'networkidle' }); await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller)); }
    await context.setOffline(true); await page.reload({ waitUntil: 'domcontentloaded' }); await page.getByRole('heading', { name: 'Clean water works simulator' }).waitFor();
    await context.setOffline(false); await browser.close(); console.log('@claim:offline-reload PASS');
  });
  await run('private-url-settings', async () => {
    const browser = await chromium.launch(); const context = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'] }); const page = await context.newPage(); const urls = [];
    page.on('request', request => urls.push(request.url())); await page.goto(`${base}/demo/`, { waitUntil: 'networkidle' }); await page.locator('#lever-settling').fill('80'); await page.getByRole('button', { name: /Copy share link/ }).click();
    const result = await page.evaluate(() => ({ cookies: document.cookie, local: Object.keys(localStorage), session: Object.keys(sessionStorage), href: location.href }));
    if (urls.some(url => new URL(url).origin !== base) || result.cookies || result.local.length || result.session.some(key => !key.startsWith('demo:')) || !result.href.includes('set=80%2C65%2C60')) throw new Error(`Privacy or URL-state assertion failed: ${JSON.stringify({ urls, result })}`);
    await browser.close(); console.log('@claim:private-url-settings PASS');
  });
  await run('system-loop', async () => {
    const browser = await chromium.launch(); const page = await (await browser.newContext()).newPage();
    for (const id of ['water', 'grid', 'bakery']) { await page.goto(`${base}/systems/${id}/`, { waitUntil: 'networkidle' }); if (await page.locator('input[type="range"]').count() !== 3 || await page.locator('.flow-line li').count() !== 5 || !await page.locator('.results-panel, .fault-zone, .job-board').count()) throw new Error(`${id} does not expose the complete simulation loop.`); }
    await browser.close(); console.log('@claim:system-loop PASS');
  });
  await run('keyboard-controls', async () => {
    const browser = await chromium.launch(); const page = await (await browser.newContext()).newPage(); await page.goto(`${base}/systems/water/`); const lever = page.locator('#lever-settling'); await lever.focus(); const before = await lever.inputValue(); await page.keyboard.press('ArrowRight'); if (before === await lever.inputValue()) throw new Error('Arrow key did not operate the range input.'); await browser.close(); console.log('@claim:keyboard-controls PASS');
  });
  await run('reduced-motion', async () => {
    const browser = await chromium.launch(); const page = await (await browser.newContext({ reducedMotion: 'reduce' })).newPage(); await page.goto(`${base}/systems/water/`); const duration = await page.locator('.flow-line li').first().evaluate(node => getComputedStyle(node, '::after').animationDuration); if (Number.parseFloat(duration) > 0.02) throw new Error(`Flow animation was not reduced: ${duration}`); await browser.close(); console.log('@claim:reduced-motion PASS');
  });
  await run('real-routes', async () => {
    const browser = await chromium.launch(); const page = await (await browser.newContext()).newPage();
    for (const [id, title] of [['water', 'Clean water works'], ['grid', 'Neighborhood power grid'], ['bakery', 'Morning bakery line']]) { await page.goto(`${base}/systems/${id}/`); if (!await page.title().then(value => value.includes(title)) || !await page.getByRole('heading', { name: `${title} simulator` }).count()) throw new Error(`${id} route lacks a route title or heading.`); }
    await page.goto(base); await page.getByRole('button', { name: 'Run this system' }).first().click(); await page.goBack(); if (new URL(page.url()).pathname !== '/') throw new Error('Back did not restore home.'); await page.goForward(); await page.waitForURL(/\/systems\/water\//); if (!page.url().includes('/systems/water/')) throw new Error('Forward did not restore the simulator.'); await browser.close(); console.log('@claim:real-routes PASS');
  });
} finally { server.kill('SIGTERM'); }
