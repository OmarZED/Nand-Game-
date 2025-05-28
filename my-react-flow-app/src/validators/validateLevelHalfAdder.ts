import { levelHalfAdder } from '../levels/levelHalfAdder';

export const validateLevelHalfAdder = (circuitState) => {
  const { nodes, edges } = circuitState;

  // Find required nodes
  const input1 = nodes.find(n => n.id === 'input1' && n.type === 'input');
  const input2 = nodes.find(n => n.id === 'input2' && n.type === 'input');
  const xor1 = nodes.find(n => n.id === 'xor1' && n.type === 'xor');
  const and1 = nodes.find(n => n.id === 'and1' && n.type === 'and');
  const outputL = nodes.find(n => n.id === 'outputL' && n.type === 'output');
  const outputH = nodes.find(n => n.id === 'outputH' && n.type === 'output');

  if (!input1 || !input2 || !xor1 || !and1 || !outputL || !outputH) {
    return {
      success: false,
      message: "Missing required components. Make sure all gates and nodes are placed correctly."
    };
  }

  // Check connections
  const requiredConnections = [
    { from: 'input1', to: 'xor1' },
    { from: 'input2', to: 'xor1' },
    { from: 'input1', to: 'and1' },
    { from: 'input2', to: 'and1' },
    { from: 'xor1', to: 'outputL' },
    { from: 'and1', to: 'outputH' }
  ];

  for (const conn of requiredConnections) {
    const hasConnection = edges.some(e =>
      e.source === conn.from && e.target === conn.to
    );
    if (!hasConnection) {
      return {
        success: false,
        message: `Missing connection from ${conn.from} to ${conn.to}.`
      };
    }
  }

  // Check all truth table combinations
  const truthTable = [
    { input1: 0, input2: 0, outputL: 0, outputH: 0 },
    { input1: 0, input2: 1, outputL: 1, outputH: 0 },
    { input1: 1, input2: 0, outputL: 1, outputH: 0 },
    { input1: 1, input2: 1, outputL: 0, outputH: 1 }
  ];

  for (const { input1: a, input2: b, outputL: expectedL, outputH: expectedH } of truthTable) {
    const actualL = a ^ b;      // XOR for sum
    const actualH = a & b;      // AND for carry

    if (actualL !== expectedL || actualH !== expectedH) {
      return {
        success: false,
        message: `Incorrect output for inputs (input1=${a}, input2=${b}). Expected (outputL=${expectedL}, outputH=${expectedH}), got (outputL=${actualL}, outputH=${actualH}).`
      };
    }
  }

  return {
    success: true,
    message: "Nice job! You’ve built a working Half Adder!"
  };
};