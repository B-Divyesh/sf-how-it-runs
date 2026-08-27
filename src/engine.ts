import type { Outcome, SystemId } from './types';

const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

export function evaluateSystem(id: SystemId, values: number[], fault = false): Outcome {
  const [a, b, c] = values;
  let throughput = 0;
  let quality = 0;
  let cost = 0;

  if (id === 'water') {
    throughput = b * 0.92 + 18 - (fault ? 7 : 0);
    quality = 102 - Math.max(0, 58 - a) * 0.48 - Math.max(0, b - 70) * 0.72
      - Math.abs(c - (fault ? 64 : 54)) * 0.48 - (fault ? Math.max(0, 78 - a) * 0.45 + 8 : 0);
    cost = 22 + a * 0.18 + b * 0.24 + c * 0.22;
  } else if (id === 'grid') {
    const demand = fault ? 104 : 78;
    const available = a + c * 0.42;
    const served = Math.min(demand - b * 0.18, available);
    throughput = served * (fault ? 0.88 : 1.03);
    quality = 100 - Math.abs(available + b * 0.18 - demand) * 1.35;
    cost = 18 + a * 0.48 + c * 0.22 + b * 0.08;
  } else {
    const coordinated = Math.min(c, a + 22, b + 10);
    throughput = coordinated * 1.08 + 8 - (fault ? 3 : 0);
    const idealHeat = 46 + c * 0.35;
    quality = 101 - Math.abs(a - 62) * 0.55 - Math.abs(b - idealHeat) * 0.95
      - Math.max(0, c - a - 22) * 0.6 - (fault ? Math.max(0, 68 - a) * 0.25 : 0);
    cost = 19 + a * 0.2 + b * 0.3 + c * 0.2;
  }

  const result = { throughput: clamp(throughput), quality: clamp(quality), cost: clamp(cost) };
  const targetMet = id === 'water'
    ? result.throughput >= 65 && result.quality >= 80 && result.cost <= 70
    : id === 'grid'
      ? result.throughput >= 70 && result.quality >= 82 && result.cost <= 72
      : result.throughput >= 68 && result.quality >= 82 && result.cost <= 72;

  let message = 'Try moving one lever and watch all three results.';
  if (targetMet) message = fault ? 'Strong recovery—the system is steady again.' : 'Target reached! You balanced the whole system.';
  else if (result.quality < 70) message = 'Quality needs attention. Slower or better-balanced work may help.';
  else if (result.cost > 72) message = 'It works, but uses a lot. Can you trim the cost?';
  else if (result.throughput < 65) message = 'Quality is promising. Now find a little more capacity.';

  return { ...result, targetMet, message };
}
