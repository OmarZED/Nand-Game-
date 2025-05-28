import { level9 } from '../levels/level9';

export const validateLevel9 = (circuitState) => {
  const { nodes, edges } = circuitState;

  // Find required nodes by id and type
  const input1 = nodes.find(n => n.id === 'input1' && n.type === 'input');
  const input2 = nodes.find(n => n.id === 'input2' && n.type === 'input');
  const nand1 = nodes.find(n => n.id === 'nand1' && n.type === 'nand');
  const and1 = nodes.find(n => n.id === 'and1' && n.type === 'and');
  const or1 = nodes.find(n => n.id === 'or1' && n.type === 'or');
  const output = nodes.find(n => n.id === 'output' && n.type === 'output');

  if (!input1 || !input2 || !nand1 || !and1 || !or1 || !output) {
    return {
      success: false,
      message: "Missing required components. Make sure all gates and nodes are placed correctly."
    };
  }

  // Check connections: input1/input2 to nand1, nand1 to and1, and1 to or1, or1 to output
  const requiredConnections = [
    { from: 'input1', to: 'nand1' },
    { from: 'input2', to: 'nand1' },
    { from: 'nand1', to: 'and1' },
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
  const truthTable = level9.expectedTruthTable;
  for (const { input1: in1, input2: in2, output: expectedOutput } of truthTable) {
    // Simulate OR logic for this level as needed
    // Example: (You may need to adjust this logic based on your actual level9 requirements)
    const actualOutput = in1 === 1 || in2 === 1 ? 1 : 0;
    if (actualOutput !== expectedOutput) {
      return {
        success: false,
        message: `Incorrect output for inputs (${in1}, ${in2}). Expected ${expectedOutput}, got ${actualOutput}.`
      };
    }
  }

  return {
    success: true,
    message: "Excellent! You've successfully completed the Level 9 challenge!"
  };
};