import { GATE_TYPES } from './types';

export const level8 = {
    id: 'level8',
    title: 'Advanced Logic Circuit Challenge',
    description: 'Create a complex circuit using NAND, AND, and OR gates. This level requires careful planning and understanding of how different gates can be combined to achieve the desired output. Hint: Try breaking down the problem into smaller sub-circuits.',
    difficulty: 4,
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
            position: { x: 250, y: 150 },
            data: { value: null }
        },
        {
            id: 'and1',
            type: GATE_TYPES.AND,
            position: { x: 400, y: 200 },
            data: { value: null }
        },
        {
            id: 'nand2',
            type: GATE_TYPES.NAND,
            position: { x: 250, y: 350 },
            data: { value: null }
        },
        {
            id: 'or1',
            type: GATE_TYPES.OR,
            position: { x: 400, y: 350 },
            data: { value: null }
        },
        {
            id: 'output',
            type: GATE_TYPES.OUTPUT,
            position: { x: 600, y: 250 },
            data: { value: null }
        }
    ],
    expectedTruthTable: [
        { input1: 0, input2: 0, output: 1 },
        { input1: 0, input2: 1, output: 0 },
        { input1: 1, input2: 0, output: 0 },
        { input1: 1, input2: 1, output: 1 }
    ]
};