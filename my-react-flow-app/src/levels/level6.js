import { GATE_TYPES } from './types';

export const level6 = {
  id: 'level6',
  title: 'XOR Gate Challenge',
  description: 'Build an XOR gate circuit. An XOR gate outputs 1 only when the inputs are different, and 0 when they are the same.',
  difficulty: 2,
  availableGates: [GATE_TYPES.XOR],
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
      id: 'xor',
      type: GATE_TYPES.XOR,
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
    { input1: 0, input2: 0, output: 0 },
    { input1: 0, input2: 1, output: 1 },
    { input1: 1, input2: 0, output: 1 },
    { input1: 1, input2: 1, output: 0 }
  ]
}; 