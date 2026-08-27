import type { SystemDefinition, SystemId } from './types';

export const systems: SystemDefinition[] = [
  {
    id: 'water', number: '01', title: 'Clean water works', shortTitle: 'Water',
    kicker: 'From river to tap', color: '#5CA9C2', icon: '◒',
    description: 'Guide cloudy river water through settling, filtering, and careful disinfection.',
    question: 'Can you clean enough water without rushing the filters?',
    flowLabel: 'Water moving through the works', throughputLabel: 'Clean water', throughputUnit: 'homes',
    qualityLabel: 'Water quality', costLabel: 'Energy + supplies',
    levers: [
      { id: 'settling', label: 'Settling time', shortLabel: 'Settle', min: 20, max: 100, step: 5, unit: '%', initial: 45, hint: 'Longer gives dirt time to sink.' },
      { id: 'filter', label: 'Filter speed', shortLabel: 'Filter', min: 20, max: 100, step: 5, unit: '%', initial: 75, hint: 'Fast sends more water, but can let dirt through.' },
      { id: 'chlorine', label: 'Disinfectant dose', shortLabel: 'Dose', min: 20, max: 100, step: 5, unit: '%', initial: 35, hint: 'Enough controls germs; too much wastes supplies.' },
    ],
    stages: [
      { name: 'River intake', detail: 'Screens catch sticks and leaves.', icon: '≋' },
      { name: 'Settling tank', detail: 'Heavy dirt sinks to the bottom.', icon: '▽' },
      { name: 'Sand filter', detail: 'Fine grains catch smaller particles.', icon: '▤' },
      { name: 'Disinfection', detail: 'A careful dose controls germs.', icon: '✦' },
      { name: 'Homes', detail: 'Clean water travels through city pipes.', icon: '⌂' },
    ],
    target: 'Serve 65+ homes, reach 80% quality, and keep cost at 70 or less.',
    faultName: 'storm', faultLabel: 'Send a rainstorm',
    faultDescription: 'Heavy rain washes extra mud into the river. Slow down and give settling more time.',
    jobTitle: 'Water treatment operator',
    jobDescription: 'Operators test water, tune pumps and chemical doses, inspect filters, and respond when river conditions change.',
    facts: ['Real plants run many laboratory tests.', 'Disinfectant is only one barrier among several.', 'Used filter water and sludge also need treatment.'],
    watchSteps: [
      { levers: [40, 85, 30], caption: 'First, water moves quickly—but cloudy water slips through the fast filter.' },
      { levers: [65, 65, 45], caption: 'We give dirt time to settle and slow the filter. Quality climbs.' },
      { levers: [65, 65, 60], caption: 'A careful disinfectant dose controls germs without using too much.' },
      { levers: [80, 55, 65], caption: 'Storm water is muddier, so operators slow the flow and settle it longer.' },
    ],
  },
  {
    id: 'grid', number: '02', title: 'Neighborhood power grid', shortTitle: 'Power',
    kicker: 'Match supply to demand', color: '#F2B544', icon: 'ϟ',
    description: 'Balance a small generator, a battery, and flexible uses as the neighborhood changes.',
    question: 'Can you keep supply and demand in balance?',
    flowLabel: 'Electricity moving across the grid', throughputLabel: 'Homes powered', throughputUnit: 'homes',
    qualityLabel: 'Grid balance', costLabel: 'Fuel + battery wear',
    levers: [
      { id: 'generator', label: 'Generator output', shortLabel: 'Generate', min: 20, max: 100, step: 5, unit: '%', initial: 45, hint: 'Steady power costs fuel.' },
      { id: 'battery', label: 'Battery output', shortLabel: 'Battery', min: 0, max: 100, step: 5, unit: '%', initial: 20, hint: 'Batteries react quickly, but wear with use.' },
      { id: 'flex', label: 'Flexible demand moved', shortLabel: 'Shift', min: 0, max: 100, step: 5, unit: '%', initial: 10, hint: 'Some devices can run a little later.' },
    ],
    stages: [
      { name: 'Generator', detail: 'A turbine turns to make electricity.', icon: '⟳' },
      { name: 'Substation', detail: 'Equipment adjusts voltage safely.', icon: '◇' },
      { name: 'Battery', detail: 'Stored energy responds quickly.', icon: '▣' },
      { name: 'Power lines', detail: 'Wires carry energy around town.', icon: '⌁' },
      { name: 'Neighborhood', detail: 'Demand changes throughout the day.', icon: '⌂' },
    ],
    target: 'Power 70+ homes, reach 82% balance, and keep cost at 72 or less.',
    faultName: 'spike', faultLabel: 'Start the big match',
    faultDescription: 'Everyone switches things on at once. Bring in quick battery power or shift flexible demand.',
    jobTitle: 'Grid control operator',
    jobDescription: 'Operators forecast demand, schedule generators, monitor frequency, and coordinate quick responses when conditions change.',
    facts: ['A real grid must stay balanced every second.', 'Batteries can respond faster than many generators.', 'Grid operators coordinate across large regions.'],
    watchSteps: [
      { levers: [40, 10, 0], caption: 'Demand is calm, so a steady generator carries most of the work.' },
      { levers: [65, 25, 20], caption: 'As homes wake up, the operator raises supply and shifts some flexible use.' },
      { levers: [70, 40, 30], caption: 'The battery smooths the last mismatch. Supply and demand line up.' },
      { levers: [75, 70, 55], caption: 'A big match causes a spike. Fast battery output and shifted demand help.' },
    ],
  },
  {
    id: 'bakery', number: '03', title: 'Morning bakery line', shortTitle: 'Bakery',
    kicker: 'Dough to doorstep', color: '#E67549', icon: '◓',
    description: 'Mix, bake, and move loaves through a small production bakery before the morning delivery.',
    question: 'Can you make enough evenly baked loaves?',
    flowLabel: 'Bread moving along the line', throughputLabel: 'Good loaves', throughputUnit: 'loaves',
    qualityLabel: 'Evenly baked', costLabel: 'Energy + waste',
    levers: [
      { id: 'mix', label: 'Mixing time', shortLabel: 'Mix', min: 20, max: 100, step: 5, unit: '%', initial: 40, hint: 'Dough needs time to build structure.' },
      { id: 'heat', label: 'Oven heat', shortLabel: 'Heat', min: 20, max: 100, step: 5, unit: '%', initial: 55, hint: 'Too cool stays pale; too hot burns.' },
      { id: 'belt', label: 'Conveyor speed', shortLabel: 'Belt', min: 20, max: 100, step: 5, unit: '%', initial: 80, hint: 'Fast makes more, but shortens bake time.' },
    ],
    stages: [
      { name: 'Ingredients', detail: 'Flour, water, yeast, and salt are measured.', icon: '✣' },
      { name: 'Mixer', detail: 'Mixing builds stretchy dough.', icon: '↻' },
      { name: 'Proofing room', detail: 'Yeast makes the dough rise.', icon: '◡' },
      { name: 'Oven', detail: 'Heat turns soft dough into bread.', icon: '▰' },
      { name: 'Dispatch', detail: 'Good loaves cool before delivery.', icon: '▥' },
    ],
    target: 'Make 68+ good loaves, reach 82% even baking, and keep cost at 72 or less.',
    faultName: 'rush', faultLabel: 'Add a school order',
    faultDescription: 'A late order needs more bread. Speed alone makes poor loaves—coordinate the whole line.',
    jobTitle: 'Production baker',
    jobDescription: 'Production bakers plan batches, check dough and ovens, keep food safe, and coordinate packing so orders leave on time.',
    facts: ['Dough keeps changing with time and temperature.', 'Proofing and cooling are real production stages.', 'Bakers track waste as well as speed.'],
    watchSteps: [
      { levers: [35, 50, 90], caption: 'The line starts fast, but rushed dough and a short bake make uneven loaves.' },
      { levers: [60, 68, 65], caption: 'More mixing and the right heat build structure and color.' },
      { levers: [60, 70, 60], caption: 'The belt slows just enough. Most loaves now leave the oven evenly baked.' },
      { levers: [70, 78, 75], caption: 'A school order arrives. The whole line speeds up together to protect quality.' },
    ],
  },
];

export const systemMap = new Map<SystemId, SystemDefinition>(systems.map((system) => [system.id, system]));

export function isSystemId(value: string | null): value is SystemId {
  return value === 'water' || value === 'grid' || value === 'bakery';
}
