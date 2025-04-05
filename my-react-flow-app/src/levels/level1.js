import { GATE_TYPES } from './types';

export const level1 = {
  id: 'level1',
  title: 'Introduction to NOT Gate',
  description: 'Learn how a NOT gate works! Connect the input to the inverter, and the inverter to the output. A NOT gate (inverter) changes 1 to 0 and 0 to 1.',
  difficulty: 1,
  availableGates: [GATE_TYPES.INVERTER],
  initialNodes: [
    {
      id: 'input',
      type: GATE_TYPES.INPUT,
      data: { value: 0 },
      position: { x: 100, y: 100 },
    },
    {
      id: 'inverter',
      type: GATE_TYPES.INVERTER,
      data: {},
      position: { x: 300, y: 100 },
    },
    {
      id: 'output',
      type: GATE_TYPES.OUTPUT,
      data: { value: null },
      position: { x: 500, y: 100 },
    },
  ],
  expectedTruthTable: [
    { input: 0, output: 1 },
    { input: 1, output: 0 },
  ],
}; 