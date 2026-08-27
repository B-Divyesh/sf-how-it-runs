import { describe, expect, it } from 'vitest';
import { normalizeLeverValue, systems } from './data';
import { evaluateSystem } from './engine';

describe('shared simulation engine', () => {
  it.each([
    ['water', [65, 65, 60]],
    ['grid', [70, 40, 30]],
    ['bakery', [60, 70, 60]],
  ] as const)('%s has a reachable mission target', (id, values) => {
    const result = evaluateSystem(id, [...values]);
    expect(result.targetMet).toBe(true);
    expect(result.quality).toBeGreaterThanOrEqual(id === 'water' ? 80 : 82);
  });

  it('a storm makes the water target harder', () => {
    const calm = evaluateSystem('water', [65, 65, 60]);
    const storm = evaluateSystem('water', [65, 65, 60], true);
    expect(storm.quality).toBeLessThan(calm.quality);
    expect(storm.throughput).toBeLessThan(calm.throughput);
  });

  it('a demand spike rewards battery output', () => {
    const withoutBattery = evaluateSystem('grid', [75, 30, 0], true);
    const withBattery = evaluateSystem('grid', [75, 70, 55], true);
    expect(withBattery.quality).toBeGreaterThan(withoutBattery.quality);
  });

  it('all outcomes remain inside their meter range', () => {
    for (const system of systems) {
      for (const values of [[0, 0, 0], [50, 50, 50], [100, 100, 100]]) {
        const result = evaluateSystem(system.id, values, true);
        expect(result.throughput).toBeGreaterThanOrEqual(0);
        expect(result.throughput).toBeLessThanOrEqual(100);
        expect(result.quality).toBeGreaterThanOrEqual(0);
        expect(result.quality).toBeLessThanOrEqual(100);
        expect(result.cost).toBeGreaterThanOrEqual(0);
        expect(result.cost).toBeLessThanOrEqual(100);
      }
    }
  });
});

describe('system definitions', () => {
  it('keep one shared interaction grammar', () => {
    expect(systems).toHaveLength(3);
    for (const system of systems) {
      expect(system.levers).toHaveLength(3);
      expect(system.stages).toHaveLength(5);
      expect(system.watchSteps.length).toBeGreaterThanOrEqual(4);
      expect(system.facts.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('normalizes imported URL values to each lever’s valid range step', () => {
    const settling = systems[0].levers[0];
    const battery = systems[1].levers[1];

    // Regression: a shared 66.6% settling value must agree with its 5% range input.
    expect(normalizeLeverValue(settling, 66.6)).toBe(65);
    expect(normalizeLeverValue(settling, -999)).toBe(20);
    expect(normalizeLeverValue(settling, 999)).toBe(100);
    expect(normalizeLeverValue(battery, 2.6)).toBe(5);
  });
});
