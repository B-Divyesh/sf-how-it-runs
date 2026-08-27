import AxeBuilder from '@axe-core/playwright';
import { chromium } from 'playwright';

const base = process.argv[2] || 'http://127.0.0.1:4173';
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
const page = await context.newPage();
const errors = [];
page.on('pageerror', (error) => errors.push(String(error)));
page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });

await page.goto(base, { waitUntil: 'networkidle' });
if (await page.locator('h1').count() !== 1) throw new Error('Expected exactly one h1.');
await page.keyboard.press('Tab');
if (await page.locator(':focus').innerText() !== 'Skip to the simulator') throw new Error('Skip link is not the first keyboard stop.');

for (const [system, settings] of [
  ['water', '65,65,60'],
  ['grid', '70,40,30'],
  ['bakery', '60,70,60'],
]) {
  await page.goto(`${base}/?system=${system}&set=${settings}`, { waitUntil: 'networkidle' });
  await page.getByText('System steady', { exact: true }).waitFor();
  const fault = page.locator('[data-action="fault"]');
  if (await fault.isDisabled()) throw new Error(`${system} fault did not unlock at its documented target.`);
}

await page.goto(base, { waitUntil: 'networkidle' });
await page.getByRole('button', { name: /Run this system/ }).first().click();
await page.locator('#lever-settling').fill('65');
await page.locator('#lever-filter').fill('65');
await page.locator('#lever-chlorine').fill('60');
await page.getByText('System steady', { exact: true }).waitFor();
if (await page.getByRole('button', { name: 'Send a rainstorm' }).isDisabled()) throw new Error('Fault did not unlock.');
await page.getByRole('button', { name: 'Send a rainstorm' }).click();
if (!page.url().includes('fault=1')) throw new Error('Fault state was not written to the share URL.');
await page.getByRole('button', { name: /Watch it run/ }).click();
await page.getByRole('button', { name: /Pause watch mode/ }).waitFor();
await page.getByRole('button', { name: /Pause watch mode/ }).click();

const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
if (horizontalOverflow) throw new Error('Page has horizontal overflow at 390px.');

const axe = await new AxeBuilder({ page }).analyze();
const serious = axe.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact || ''));
if (serious.length) {
  console.error(JSON.stringify(serious, null, 2));
  throw new Error(`${serious.length} serious/critical axe violations.`);
}
if (errors.length) throw new Error(`Browser errors: ${errors.join('; ')}`);

await page.evaluate(async () => { await navigator.serviceWorker.ready; });
if (!await page.evaluate(() => Boolean(navigator.serviceWorker.controller))) {
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
}
await context.setOffline(true);
await page.reload({ waitUntil: 'domcontentloaded' });
await page.getByRole('heading', { name: 'Clean water works' }).first().waitFor();
await context.setOffline(false);

console.log(JSON.stringify({
  route: 'water',
  targetReached: true,
  faultUnlocked: true,
  watchModePaused: true,
  mobileOverflow: false,
  offlineReload: true,
  axeViolations: axe.violations.length,
  seriousOrCritical: serious.length,
  consoleErrors: errors.length,
}, null, 2));
await browser.close();
