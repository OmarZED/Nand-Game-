import { GATE_TYPES } from './types';

export const level5 = {
  id: 'level5',
  title: 'NOR Gate Challenge',
  description: 'Build a NOR gate circuit. A NOR gate outputs 1 only when both inputs are 0, and 0 otherwise.',
  difficulty: 2,
  availableGates: [GATE_TYPES.NOR],
  initialNodes: [
    {
      id: 'input1',
      type: GATE_TYPES.INPUT,
      position: { x: 100, y: 100 },
      data: { value: 0 }
    },
    {
      id: 'input2',
      type: GATE_TYPES.INPUT,
      position: { x: 100, y: 300 },
      data: { value: 0 }
    },
    {
      id: 'nor',
      type: GATE_TYPES.NOR,
      position: { x: 300, y: 200 },
      data: {}
    },
    {
      id: 'output',
      type: GATE_TYPES.OUTPUT,
      position: { x: 500, y: 200 },
      data: { value: null }
    }
  ],
  expectedTruthTable: [
    { input1: 0, input2: 0, output: 1 },
    { input1: 0, input2: 1, output: 0 },
    { input1: 1, input2: 0, output: 0 },
    { input1: 1, input2: 1, output: 0 }
  ]
}; 