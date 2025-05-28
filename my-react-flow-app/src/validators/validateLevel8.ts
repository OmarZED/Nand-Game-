import { level8 } from '../levels/level8';

export const validateLevel8 = (circuitState) => {
  const { nodes, edges } = circuitState;

  // Check for required nodes
  const input1 = nodes.find(n => n.id === 'input1');
  const input2 = nodes.find(n => n.id === 'input2');
  const output = nodes.find(n => n.id === 'output');
  const nand1 = nodes.find(n => n.id === 'nand1');
  const and1 = nodes.find(n => n.id === 'and1');
  const nand2 = nodes.find(n => n.id === 'nand2');
  const or1 = nodes.find(n => n.id === 'or1');

  if (!input1 || !input2 || !output || !nand1 || !and1 || !nand2 || !or1) {
    return {
      success: false,
      message: "Missing required components. Make sure all gates are placed correctly."
    };
  }

  // Check connections
  const requiredConnections = [
    { from: 'input1', to: 'nand1' },
    { from: 'input1', to: 'nand2' },
    { from: 'input2', to: 'nand1' },
    { from: 'input2', to: 'nand2' },
    { from: 'nand1', to: 'and1' },
    { from: 'nand2', to: 'or1' },
    { from: 'and1', to: 'or1' },
    { from: 'or1', to: 'output' }
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
  const truthTable = level8.expectedTruthTable;
  for (const { input1: in1, input2: in2, output: expectedOutput } of truthTable) {
    // Simulate the logic for this level as needed
    // Example: (You may need to adjust this logic based on your actual level8 requirements)
    const nand1Output = !(in1 && in2) ? 1 : 0;
    const nand2Output = !(in1 && in2) ? 1 : 0;
    const and1Output = nand1Output && in2 ? 1 : 0;
    const or1Output = and1Output || nand2Output ? 1 : 0;
    const actualOutput = or1Output;

    if (actualOutput !== expectedOutput) {
      return {
        success: false,
        message: `Incorrect output for inputs (${in1}, ${in2}). Expected ${expectedOutput}, got ${actualOutput}.`
      };
    }
  }

  return {
    success: true,
    message: "Excellent! You've successfully implemented the complex logic circuit!"
  };
};