import { GATE_TYPES } from './types';

export const level9 = {
    id: 'level9',
    title: 'Complex Gate Challenge',
    description: 'Create a circuit that implements a complex logic function using multiple gates. You must connect the gates in the correct order to achieve the desired output.',
    difficulty: 5,
    availableGates: [
        GATE_TYPES.INPUT,
        GATE_TYPES.OUTPUT,
        GATE_TYPES.AND,
        GATE_TYPES.OR,
        GATE_TYPES.NAND
    ],
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
            id: 'nand1',
            type: GATE_TYPES.NAND,
            position: { x: 300, y: 100 },
            data: { value: null }
        },
        {
            id: 'and1',
            type: GATE_TYPES.AND,
            position: { x: 500, y: 200 },
            data: { value: null }
        },
        {
            id: 'or1',
            type: GATE_TYPES.OR,
            position: { x: 700, y: 200 },
            data: { value: null }
        },
        {
            id: 'output',
            type: GATE_TYPES.OUTPUT,
            position: { x: 900, y: 200 },
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