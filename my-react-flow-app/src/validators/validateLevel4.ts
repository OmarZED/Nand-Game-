import { level4 } from '../levels/level4';

export const validateLevel4 = (circuitState) => {
  const { nodes, edges } = circuitState;

  // Find all input nodes, NAND gates, and output nodes by type
  const inputNodes = nodes.filter(n => n.type === 'input');
  const nandNodes = nodes.filter(n => n.type === 'nand');
  const outputNodes = nodes.filter(n => n.type === 'output');

  if (inputNodes.length < 2 || nandNodes.length < 1 || outputNodes.length < 1) {
    return {
      success: false,
      message: "Missing required components. You need at least two inputs, one NAND gate, and one output."
    };
  }

  // Use the first NAND and output node found
  const nandNode = nandNodes[0];
  const outputNode = outputNodes[0];

  // Check if all inputs are connected to the NAND gate
  const allInputsToNand = inputNodes.every(input =>
    edges.some(e => e.source === input.id && e.target === nandNode.id)
  );

  // Check if NAND is connected to output
  const nandToOutput = edges.some(e => e.source === nandNode.id && e.target === outputNode.id);

  if (!allInputsToNand || !nandToOutput) {
    return {
      success: false,
      message: "Incorrect connections. Connect both inputs to the NAND gate, and the NAND gate to the output."
    };
  }

  // Simulate the circuit for all truth table combinations
  const truthTable = level4.expectedTruthTable;
  for (const { input1, input2, output } of truthTable) {
    // Simulate NAND logic
    const nandOutput = !((input1 === 1) && (input2 === 1)) ? 1 : 0;
    if (nandOutput !== output) {
      return {
        success: false,
        message: `Incorrect output for input combination: Input1=${input1}, Input2=${input2}. Expected output: ${output}`
      };
    }
  }

  return {
    success: true,
    message: "Congratulations! You've successfully completed the NAND gate challenge!"
  };
};