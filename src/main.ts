import './style.css';
import { systems, systemMap, isSystemId } from './data';
import { evaluateSystem } from './engine';
import type { SystemDefinition, SystemId } from './types';

interface AppState {
  systemId: SystemId | null;
  values: number[];
  fault: boolean;
  faultUnlocked: boolean;
  watch: boolean;
  watchStep: number;
  flowPaused: boolean;
}

function requireElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`The control room could not find ${selector}.`);
  return element;
}

const routeList = requireElement<HTMLDivElement>('#route-list');
const simulator = requireElement<HTMLElement>('#simulator');
const toast = requireElement<HTMLDivElement>('#toast');
const offlineBanner = requireElement<HTMLDivElement>('#offline-banner');

let watchTimer: number | undefined;
let toastTimer: number | undefined;

const params = new URLSearchParams(window.location.search);
const requestedSystem = params.get('system');
const initialId = isSystemId(requestedSystem) ? requestedSystem : null;
const initialDefinition = initialId ? systemMap.get(initialId)! : null;

function valuesFromUrl(definition: SystemDefinition | null): number[] {
  if (!definition) return [];
  const raw = params.get('set')?.split(',').map(Number);
  if (!raw || raw.length !== definition.levers.length || raw.some((value) => !Number.isFinite(value))) {
    return definition.levers.map((lever) => lever.initial);
  }
  return raw.map((value, index) => {
    const lever = definition.levers[index];
    return Math.max(lever.min, Math.min(lever.max, value));
  });
}

const state: AppState = {
  systemId: initialId,
  values: valuesFromUrl(initialDefinition),
  fault: params.get('fault') === '1',
  faultUnlocked: params.get('fault') === '1',
  watch: false,
  watchStep: -1,
  flowPaused: false,
};

function showToast(message: string): void {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.hidden = false;
  toastTimer = window.setTimeout(() => { toast.hidden = true; }, 3200);
}

function renderRoutes(): void {
  routeList.innerHTML = systems.map((system) => `
    <article class="route-card route-${system.id}${state.systemId === system.id ? ' is-selected' : ''}" style="--route-color:${system.color}">
      <div class="ticket-number" aria-hidden="true">${system.number}</div>
      <div class="ticket-icon" aria-hidden="true">${system.icon}</div>
      <p class="ticket-kicker">${system.kicker}</p>
      <h3>${system.title}</h3>
      <p>${system.description}</p>
      <button class="route-button" type="button" data-select-system="${system.id}"${state.systemId === system.id ? ' aria-current="true"' : ''}>
        ${state.systemId === system.id ? 'Running now' : 'Run this system'} <span aria-hidden="true">→</span>
      </button>
    </article>
  `).join('');
}

function outcomeMarkup(label: string, value: number, unit: string, kind: string): string {
  return `
    <div class="outcome ${kind}">
      <div class="outcome-label"><span>${label}</span><strong>${value}<small>${unit}</small></strong></div>
      <div class="meter" role="progressbar" aria-label="${label}: ${value}${unit}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${value}">
        <i style="--meter-value:${value}%"></i>
      </div>
    </div>`;
}

function renderSimulator(announce = false): void {
  if (!state.systemId) {
    simulator.innerHTML = `
      <div class="empty-stage" id="empty-stage">
        <span class="empty-symbol" aria-hidden="true">↟</span>
        <h2>Your control desk is ready</h2>
        <p>Choose one of the three routes above to start. Each trip takes about five minutes.</p>
      </div>`;
    return;
  }

  const definition = systemMap.get(state.systemId)!;
  const outcome = evaluateSystem(state.systemId, state.values, state.fault);
  if (outcome.targetMet) state.faultUnlocked = true;
  const caption = state.watch && state.watchStep >= 0 ? definition.watchSteps[state.watchStep].caption : '';

  simulator.style.setProperty('--system-color', definition.color);
  simulator.innerHTML = `
    <div class="sim-titlebar">
      <div>
        <p class="eyebrow">Route ${definition.number} · ${definition.kicker}</p>
        <h2>${definition.title}</h2>
        <p>${definition.question}</p>
      </div>
      <div class="sim-actions">
        <button class="button button-watch${state.watch ? ' is-active' : ''}" type="button" data-action="watch" aria-pressed="${state.watch}">
          <span aria-hidden="true">${state.watch ? 'Ⅱ' : '▶'}</span> ${state.watch ? 'Pause watch mode' : state.watchStep >= definition.watchSteps.length - 1 ? 'Replay watch mode' : 'Watch it run'}
        </button>
        <button class="icon-button" type="button" data-action="share"><span aria-hidden="true">↗</span> <span>Copy share link</span></button>
        <button class="icon-button" type="button" data-action="close"><span aria-hidden="true">×</span> <span>Close</span></button>
      </div>
    </div>

    <div class="watch-caption" role="status" aria-live="polite" ${caption ? '' : 'hidden'}>
      <span class="watch-pulse" aria-hidden="true"></span>
      <p><strong>Watch guide ${Math.max(1, state.watchStep + 1)} of ${definition.watchSteps.length}</strong>${caption}</p>
    </div>

    <div class="control-room">
      <section class="system-stage${state.flowPaused ? ' is-paused' : ''}" aria-labelledby="flow-title">
        <div class="stage-head">
          <div><span class="live-dot" aria-hidden="true"></span><strong id="flow-title">${definition.flowLabel}</strong></div>
          <button type="button" data-action="flow" aria-pressed="${state.flowPaused}">${state.flowPaused ? 'Resume flow' : 'Pause flow'}</button>
        </div>
        <ol class="flow-line" tabindex="0" aria-label="System stages; scroll horizontally on small screens">
          ${definition.stages.map((stage, index) => `
            <li>
              <div class="flow-node" style="--node-delay:${index * -0.55}s"><span aria-hidden="true">${stage.icon}</span></div>
              <h3>${stage.name}</h3>
              <p>${stage.detail}</p>
            </li>`).join('')}
        </ol>
        <div class="flow-note"><span>SIMPLIFIED MODEL</span><p>Real systems use more stages, instruments, safety checks, and people than this five-minute view.</p></div>
      </section>

      <aside class="results-panel" aria-label="Live system results">
        <p class="panel-label">Live results</p>
        ${outcomeMarkup(definition.throughputLabel, outcome.throughput, ` ${definition.throughputUnit}`, 'throughput')}
        ${outcomeMarkup(definition.qualityLabel, outcome.quality, '%', 'quality')}
        ${outcomeMarkup(definition.costLabel, outcome.cost, '/100', 'cost')}
        <div class="result-message ${outcome.targetMet ? 'success' : ''}" role="status">
          <span aria-hidden="true">${outcome.targetMet ? '✓' : '↗'}</span>
          <p><strong>${outcome.targetMet ? 'System steady' : 'Keep experimenting'}</strong>${outcome.message}</p>
        </div>
      </aside>
    </div>

    <div class="dispatch-desk">
      <section class="levers-panel" aria-labelledby="levers-title">
        <div class="desk-heading">
          <div><p class="panel-label">Your control desk</p><h3 id="levers-title">Move one lever at a time</h3></div>
          <button type="button" class="text-button" data-action="reset">Reset levers</button>
        </div>
        <div class="lever-list">
          ${definition.levers.map((lever, index) => `
            <div class="lever">
              <div class="lever-label">
                <label for="lever-${lever.id}">${lever.label}</label>
                <output for="lever-${lever.id}" id="value-${lever.id}">${state.values[index]}${lever.unit}</output>
              </div>
              <input type="range" id="lever-${lever.id}" data-lever-index="${index}" min="${lever.min}" max="${lever.max}" step="${lever.step}" value="${state.values[index]}" aria-describedby="hint-${lever.id}" />
              <p id="hint-${lever.id}">${lever.hint}</p>
            </div>`).join('')}
        </div>
      </section>

      <aside class="target-panel" aria-labelledby="target-title">
        <p class="panel-label">Today’s mission</p>
        <h3 id="target-title">Find the steady zone</h3>
        <p>${definition.target}</p>
        <div class="target-stamps" aria-label="Target checks">
          <span class="${outcome.throughput >= (state.systemId === 'bakery' ? 68 : state.systemId === 'grid' ? 70 : 65) ? 'met' : ''}">Enough output</span>
          <span class="${outcome.quality >= (state.systemId === 'water' ? 80 : 82) ? 'met' : ''}">Good quality</span>
          <span class="${outcome.cost <= (state.systemId === 'water' ? 70 : 72) ? 'met' : ''}">Sensible cost</span>
        </div>
      </aside>
    </div>

    <div class="fault-zone ${state.fault ? 'is-faulting' : ''}">
      <div class="fault-sign"><span aria-hidden="true">!</span><div><p class="panel-label">What could go wrong?</p><h3>${definition.faultLabel}</h3></div></div>
      <p>${definition.faultDescription}</p>
      <button type="button" class="button button-fault" data-action="fault" aria-pressed="${state.fault}" ${state.faultUnlocked ? '' : 'disabled aria-describedby="fault-lock-note"'}>
        ${state.fault ? 'Return to normal' : definition.faultLabel}
      </button>
      <p class="fault-lock" id="fault-lock-note">${state.faultUnlocked ? (state.fault ? 'The disruption is active. Tune the levers to recover.' : 'Unlocked—try the disruption whenever you’re ready.') : 'Reach the mission target to unlock this disruption.'}</p>
    </div>

    <div class="job-board">
      <div class="job-badge" aria-hidden="true">WHO<br />RUNS<br />THIS?</div>
      <div><p class="panel-label">A job inside this system</p><h3>${definition.jobTitle}</h3><p>${definition.jobDescription}</p></div>
      <details><summary>What the tiny model leaves out</summary><ul>${definition.facts.map((fact) => `<li>${fact}</li>`).join('')}</ul></details>
    </div>`;

  if (announce) simulator.focus({ preventScroll: true });
  updateUrl();
}

function updateUrl(): void {
  const next = new URL(window.location.href);
  if (state.systemId) {
    next.searchParams.set('system', state.systemId);
    next.searchParams.set('set', state.values.join(','));
    state.fault ? next.searchParams.set('fault', '1') : next.searchParams.delete('fault');
  } else {
    next.search = '';
  }
  history.replaceState(null, '', next);
}

function selectSystem(id: SystemId): void {
  stopWatch(false);
  const definition = systemMap.get(id)!;
  state.systemId = id;
  state.values = definition.levers.map((lever) => lever.initial);
  state.fault = false;
  state.faultUnlocked = false;
  state.watchStep = -1;
  state.flowPaused = false;
  renderRoutes();
  renderSimulator();
  simulator.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  simulator.setAttribute('tabindex', '-1');
  simulator.focus({ preventScroll: true });
}

function applyWatchStep(step: number): void {
  if (!state.systemId) return;
  const definition = systemMap.get(state.systemId)!;
  state.watchStep = step;
  state.values = [...definition.watchSteps[step].levers];
  if (step === definition.watchSteps.length - 1) {
    state.faultUnlocked = true;
    state.fault = true;
  }
  renderSimulator();
}

function stopWatch(render = true): void {
  window.clearInterval(watchTimer);
  watchTimer = undefined;
  state.watch = false;
  if (render && state.systemId) renderSimulator();
}

function toggleWatch(): void {
  if (!state.systemId) return;
  const definition = systemMap.get(state.systemId)!;
  if (state.watch) {
    stopWatch();
    showToast('Watch mode paused. Your controls are ready.');
    return;
  }
  state.watch = true;
  const firstStep = state.watchStep >= definition.watchSteps.length - 1 ? 0 : Math.max(0, state.watchStep);
  applyWatchStep(firstStep);
  watchTimer = window.setInterval(() => {
    if (state.watchStep >= definition.watchSteps.length - 1) {
      stopWatch();
      showToast('Guided run complete. Now try the controls yourself.');
      return;
    }
    applyWatchStep(state.watchStep + 1);
  }, 3600);
}

async function copyShareLink(): Promise<void> {
  updateUrl();
  try {
    await navigator.clipboard.writeText(window.location.href);
    showToast('Share link copied. It includes these lever settings.');
  } catch {
    window.prompt('Copy this share link:', window.location.href);
  }
}

routeList.addEventListener('click', (event) => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-select-system]');
  const id = button?.dataset.selectSystem ?? null;
  if (isSystemId(id)) selectSystem(id);
});

simulator.addEventListener('input', (event) => {
  const input = (event.target as HTMLElement).closest<HTMLInputElement>('[data-lever-index]');
  if (!input || !state.systemId) return;
  stopWatch(false);
  state.values[Number(input.dataset.leverIndex)] = Number(input.value);
  renderSimulator();
  simulator.querySelector<HTMLInputElement>(`#${input.id}`)?.focus();
});

simulator.addEventListener('click', (event) => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-action]');
  if (!button || !state.systemId) return;
  switch (button.dataset.action) {
    case 'watch': toggleWatch(); break;
    case 'share': void copyShareLink(); break;
    case 'flow': state.flowPaused = !state.flowPaused; renderSimulator(); break;
    case 'fault': state.fault = !state.fault; renderSimulator(); break;
    case 'reset': {
      stopWatch(false);
      const definition = systemMap.get(state.systemId)!;
      state.values = definition.levers.map((lever) => lever.initial);
      state.fault = false;
      renderSimulator();
      showToast('Levers reset.');
      break;
    }
    case 'close': {
      stopWatch(false);
      state.systemId = null;
      state.values = [];
      state.fault = false;
      renderRoutes();
      renderSimulator();
      document.querySelector('#routes')?.scrollIntoView({ behavior: 'smooth' });
      break;
    }
  }
});

function updateOnlineState(): void {
  offlineBanner.hidden = navigator.onLine;
}

window.addEventListener('online', updateOnlineState);
window.addEventListener('offline', updateOnlineState);
updateOnlineState();
renderRoutes();
renderSimulator();

if (requestedSystem && !initialId) showToast('That route does not exist, so we brought you back to departures.');

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register('/sw.js').catch(() => {
      // The app remains fully usable without offline caching.
    });
  });
}
