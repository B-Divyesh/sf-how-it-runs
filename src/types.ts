export type SystemId = 'water' | 'grid' | 'bakery';

export interface Lever {
  id: string;
  label: string;
  shortLabel: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  initial: number;
  hint: string;
}

export interface Stage {
  name: string;
  detail: string;
  icon: string;
}

export interface Outcome {
  throughput: number;
  quality: number;
  cost: number;
  targetMet: boolean;
  message: string;
}

export interface WatchStep {
  levers: number[];
  caption: string;
}

export interface SystemDefinition {
  id: SystemId;
  number: string;
  title: string;
  shortTitle: string;
  kicker: string;
  description: string;
  question: string;
  color: string;
  icon: string;
  flowLabel: string;
  throughputLabel: string;
  throughputUnit: string;
  qualityLabel: string;
  costLabel: string;
  levers: Lever[];
  stages: Stage[];
  target: string;
  faultName: string;
  faultLabel: string;
  faultDescription: string;
  jobTitle: string;
  jobDescription: string;
  facts: string[];
  watchSteps: WatchStep[];
}
