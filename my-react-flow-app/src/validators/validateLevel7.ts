import { level7 } from '../levels/level7';

export const validateLevel7 = (circuitState) => {
  const { nodes, edges } = circuitState;

  // Find all input nodes, XNOR gates, and output nodes by type
  const inputNodes = nodes.filter(n => n.type === 'input');
  const xnorNodes = nodes.filter(n => n.type === 'xnor');
  const outputNodes = nodes.filter(n => n.type === 'output');

  if (inputNodes.length < 2 || xnorNodes.length < 1 || outputNodes.length < 1) {
    return {
      success: false,
      message: "Missing required components. You need at least two inputs, one XNOR gate, and one output."
    };
  }

  // Use the first XNOR and output node found
  const xnorNode = xnorNodes[0];
  const outputNode = outputNodes[0];

  // Check if all inputs are connected to the XNOR gate
  const allInputsToXnor = inputNodes.every(input =>
    edges.some(e => e.source === input.id && e.target === xnorNode.id)
  );

  // Check if XNOR is connected to output
  const xnorToOutput = edges.some(e => e.source === xnorNode.id && e.target === outputNode.id);

  if (!allInputsToXnor || !xnorToOutput) {
    return {
      success: false,
      message: "Incorrect connections. Connect both inputs to the XNOR gate, and the XNOR gate to the output."
    };
  }

  // Simulate the circuit for all truth table combinations
  const truthTable = level7.expectedTruthTable;
  for (const { input1, input2, output } of truthTable) {
    // XNOR: output is 1 when inputs are the same, 0 when different
    const xnorOutput = input1 === input2 ? 1 : 0;
    if (xnorOutput !== output) {
      return {
        success: false,
        message: `Incorrect output for input combination: Input1=${input1}, Input2=${input2}. Expected output: ${output}`
      };
    }
  }

  return {
    success: true,
    message: "Congratulations! You've successfully completed the XNOR gate challenge!"
  };
};