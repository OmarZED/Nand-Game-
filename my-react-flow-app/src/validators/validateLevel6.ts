import { level6 } from '../levels/level6';

export const validateLevel6 = (circuitState) => {
  const { nodes, edges } = circuitState;

  // Find all input nodes, XOR gates, and output nodes by type
  const inputNodes = nodes.filter(n => n.type === 'input');
  const xorNodes = nodes.filter(n => n.type === 'xor');
  const outputNodes = nodes.filter(n => n.type === 'output');

  if (inputNodes.length < 2 || xorNodes.length < 1 || outputNodes.length < 1) {
    return {
      success: false,
      message: "Missing required components. You need at least two inputs, one XOR gate, and one output."
    };
  }

  // Use the first XOR and output node found
  const xorNode = xorNodes[0];
  const outputNode = outputNodes[0];

  // Check if all inputs are connected to the XOR gate
  const allInputsToXor = inputNodes.every(input =>
    edges.some(e => e.source === input.id && e.target === xorNode.id)
  );

  // Check if XOR is connected to output
  const xorToOutput = edges.some(e => e.source === xorNode.id && e.target === outputNode.id);

  if (!allInputsToXor || !xorToOutput) {
    return {
      success: false,
      message: "Incorrect connections. Connect both inputs to the XOR gate, and the XOR gate to the output."
    };
  }

  // Simulate the circuit for all truth table combinations
  const truthTable = level6.expectedTruthTable;
  for (const { input1, input2, output } of truthTable) {
    // XOR: output is 1 when inputs are different, 0 when the same
    const xorOutput = input1 !== input2 ? 1 : 0;
    if (xorOutput !== output) {
      return {
        success: false,
        message: `Incorrect output for input combination: Input1=${input1}, Input2=${input2}. Expected output: ${output}`
      };
    }
  }

  return {
    success: true,
    message: "Congratulations! You've successfully completed the XOR gate challenge!"
  };
};