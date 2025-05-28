import { GATE_TYPES } from './types';

export const levelHalfAdder = {
    id: 'levelHalfAdder',
    title: 'Half Adder',
    description: 'Build a half adder circuit that takes two inputs and produces a sum (low) and carry (high) output.',
    difficulty: 3,
    availableGates: [
        GATE_TYPES.INPUT,
        GATE_TYPES.OUTPUT,
        GATE_TYPES.XOR,
        GATE_TYPES.AND
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
            id: 'xor1',
            type: GATE_TYPES.XOR,
            position: { x: 300, y: 100 },
            data: { value: null }
        },
        {
            id: 'and1',
            type: GATE_TYPES.AND,
            position: { x: 300, y: 300 },
            data: { value: null }
        },
        {
            id: 'outputL',
            type: GATE_TYPES.OUTPUT,
            position: { x: 500, y: 100 },
            data: { label: 'Low (Sum)', value: null }
        },
        {
            id: 'outputH',
            type: GATE_TYPES.OUTPUT,
            position: { x: 500, y: 300 },
            data: { label: 'High (Carry)', value: null }
        }
    ],
    expectedTruthTable: [
        { inputA: 0, inputB: 0, outputL: 0, outputH: 0 },
        { inputA: 0, inputB: 1, outputL: 1, outputH: 0 },
        { inputA: 1, inputB: 0, outputL: 1, outputH: 0 },
        { inputA: 1, inputB: 1, outputL: 0, outputH: 1 }
    ],

};