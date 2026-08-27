import AxeBuilder from '@axe-core/playwright';
import { chromium } from 'playwright';

const base = process.argv[2] || 'http://127.0.0.1:4173';
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
const page = await context.newPage();
const errors = [];
page.on('pageerror', (error) => errors.push(String(error)));
page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });

async function assertMobileTouchTargets() {
  const undersized = await page.locator('a, button, input, summary').evaluateAll((controls) => controls
    .filter((control) => {
      const style = getComputedStyle(control);
      const rect = control.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
    })
    .map((control) => {
      const rect = control.getBoundingClientRect();
      return {
        label: control.getAttribute('aria-label') || control.textContent?.trim() || control.id || control.tagName,
        width: Math.round(rect.width * 100) / 100,
        height: Math.round(rect.height * 100) / 100,
      };
    })
    .filter(({ width, height }) => width < 44 || height < 44));
  if (undersized.length) throw new Error(`Visible mobile controls must be at least 44 × 44 CSS px: ${JSON.stringify(undersized)}`);
}

const homeResponse = await page.goto(base, { waitUntil: 'networkidle' });
if (!homeResponse?.headers()['cache-control']?.includes('no-cache')) throw new Error('HTML shell must revalidate instead of being immutable.');
if (await page.locator('h1').count() !== 1) throw new Error('Expected exactly one h1.');
await page.keyboard.press('Tab');
if (await page.locator(':focus').innerText() !== 'Skip to the simulator') throw new Error('Skip link is not the first keyboard stop.');
await page.keyboard.press('Enter');
await page.waitForFunction(() => document.activeElement?.id === 'main');
if (!page.url().endsWith('#main')) throw new Error('Skip link did not preserve its main-content fragment.');
await assertMobileTouchTargets();

const moduleUrl = await page.locator('script[type="module"]').getAttribute('src');
if (!moduleUrl?.startsWith('/assets/')) throw new Error('Production build did not emit a content-hashed module asset.');
const assetHeaders = await page.evaluate(async (url) => Object.fromEntries((await fetch(url)).headers.entries()), moduleUrl);
if (!assetHeaders['cache-control']?.includes('immutable')) throw new Error('Content-hashed assets must be served with immutable caching.');
const workerHeaders = await page.evaluate(async () => Object.fromEntries((await fetch('/sw.js', { cache: 'no-store' })).headers.entries()));
if (!workerHeaders['cache-control']?.includes('no-store')) throw new Error('Service worker script must revalidate instead of being immutable.');
const workerSource = await page.evaluate(async () => (await fetch('/sw.js', { cache: 'no-store' })).text());
if (!workerSource.includes('skipWaiting') || !workerSource.includes('clients.claim') || !workerSource.includes('caches.delete')) {
  throw new Error('Service worker update lifecycle contract is incomplete.');
}

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

await page.goto(`${base}/?system=water&set=66.6,65,60`, { waitUntil: 'networkidle' });
const importedSettling = page.locator('#lever-settling');
const importedSettlingOutput = page.locator('#value-settling');
if (await importedSettling.inputValue() !== '65' || await importedSettlingOutput.innerText() !== '65%') {
  throw new Error('Fractional URL input was not normalized to the settling lever’s 5% step.');
}
const normalizedUrl = new URL(page.url());
if (normalizedUrl.searchParams.get('set') !== '65,65,60') {
  throw new Error(`Fractional URL input was not rewritten to its canonical stepped state: ${page.url()}`);
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
await assertMobileTouchTargets();

await page.goto(`${base}/?system=water&set=65,65,60`, { waitUntil: 'networkidle' });
const watchControl = page.getByRole('button', { name: 'Watch it run' });
await watchControl.focus();
await page.keyboard.press('Enter');
const pauseControl = page.getByRole('button', { name: 'Pause watch mode' });
await pauseControl.waitFor();
if (!await pauseControl.evaluate((button) => document.activeElement === button)) {
  throw new Error('Watch mode did not retain keyboard focus on Pause watch mode after Enter.');
}
await page.keyboard.press('Space');
await page.getByRole('button', { name: 'Watch it run' }).waitFor();
if (!await page.getByRole('button', { name: 'Watch it run' }).evaluate((button) => document.activeElement === button)) {
  throw new Error('Watch mode did not retain keyboard focus after pausing with Space.');
}

await page.goto(`${base}/?system=does-not-exist&set=1,2,3`, { waitUntil: 'networkidle' });
await page.getByRole('heading', { name: 'Your control desk is ready' }).waitFor();
const recoveredUrl = new URL(page.url());
if (recoveredUrl.search || recoveredUrl.hash) {
  throw new Error(`Unknown system recovery retained an invalid share URL: ${page.url()}`);
}

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
const offlineModule = await page.evaluate(async (url) => {
  const response = await fetch(url);
  return {
    contentType: response.headers.get('content-type'),
    status: response.status,
    startsAsHtml: (await response.text()).trimStart().startsWith('<'),
  };
}, moduleUrl);
if (offlineModule.status !== 200 || !offlineModule.contentType?.includes('javascript') || offlineModule.startsAsHtml) {
  throw new Error(`Offline module response was not JavaScript: ${JSON.stringify(offlineModule)}`);
}
await context.setOffline(false);

console.log(JSON.stringify({
  route: 'water',
  targetReached: true,
  faultUnlocked: true,
  watchModePaused: true,
  enterThenSpaceWatchControl: true,
  unknownRouteUrlNormalized: true,
  fractionalUrlStateNormalized: true,
  mobileOverflow: false,
  offlineReload: true,
  offlineModuleJavaScript: true,
  skipLinkFocus: true,
  immutableAssetCaching: true,
  shellAndWorkerRevalidate: true,
  serviceWorkerUpdateContract: true,
  mobileTouchTargets: true,
  axeViolations: axe.violations.length,
  seriousOrCritical: serious.length,
  consoleErrors: errors.length,
}, null, 2));
await browser.close();
