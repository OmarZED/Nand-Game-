import { level5 } from '../levels/level5';

export const validateLevel5 = (circuitState) => {
  const { nodes, edges } = circuitState;
  const inputNodes = nodes.filter(n => n.type === 'input');
  const norNodes = nodes.filter(n => n.type === 'nor');
  const outputNodes = nodes.filter(n => n.type === 'output');

  if (inputNodes.length < 2 || norNodes.length < 1 || outputNodes.length < 1) {
    return {
      success: false,
      message: "Missing required components. You need at least two inputs, one NOR gate, and one output."
    };
  }

  const norNode = norNodes[0];
  const outputNode = outputNodes[0];

  // Check if all inputs are connected to the NOR gate
  const allInputsToNor = inputNodes.every(input =>
    edges.some(e => e.source === input.id && e.target === norNode.id)
  );

  // Check if NOR is connected to output
  const norToOutput = edges.some(e => e.source === norNode.id && e.target === outputNode.id);

  if (!allInputsToNor || !norToOutput) {
    return {
      success: false,
      message: "Incorrect connections. Connect both inputs to the NOR gate, and the NOR gate to the output."
    };
  }

  // Simulate the circuit for all truth table combinations
  const truthTable = level5.expectedTruthTable;
  for (const { input1, input2, output } of truthTable) {
    // NOR: output is 1 only if both inputs are 0
    const norOutput = (input1 === 0 && input2 === 0) ? 1 : 0;
    if (norOutput !== output) {
      return {
        success: false,
        message: `Incorrect output for input combination: Input1=${input1}, Input2=${input2}. Expected output: ${output}`
      };
    }
  }

  return {
    success: true,
    message: "Congratulations! You've successfully completed the NOR gate challenge!"
  };
};