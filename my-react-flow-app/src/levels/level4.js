import { GATE_TYPES } from './types';

export const level4 = {
  id: 'level4',
  title: 'NAND Gate Challenge',
  description: 'Build a NAND gate circuit. A NAND gate outputs 0 only when both inputs are 1, and 1 otherwise.',
  difficulty: 2,
  availableGates: [GATE_TYPES.NAND],
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
      id: 'nand',
      type: GATE_TYPES.NAND,
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
    { input1: 0, input2: 1, output: 1 },
    { input1: 1, input2: 0, output: 1 },
    { input1: 1, input2: 1, output: 0 }
  ]
}; 