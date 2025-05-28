import { GATE_TYPES } from './types';

export const level2 = {
  id: 'level2',
  title: 'AND Gate Challenge',
  description: 'Connect two inputs to an AND gate. The output is 1 only when both inputs are 1.',
  difficulty: 2,
  availableGates: [GATE_TYPES.AND],
  initialNodes: [
    {
      id: 'input1',
      type: GATE_TYPES.INPUT,
      data: { value: 0 },
      position: { x: 100, y: 100 },
    },
    {
      id: 'input2',
      type: GATE_TYPES.INPUT,
      data: { value: 0 },
      position: { x: 100, y: 200 },
    },
 
    {
      id: 'output',
      type: GATE_TYPES.OUTPUT,
      data: { value: null },
      position: { x: 500, y: 150 },
    },
  ],
  
  expectedTruthTable: [
    { input1: 0, input2: 0, output: 0 },
    { input1: 0, input2: 1, output: 0 },
    { input1: 1, input2: 0, output: 0 },
    { input1: 1, input2: 1, output: 1 },
  ],
}; 