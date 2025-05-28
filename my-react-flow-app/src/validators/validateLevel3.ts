export const validateLevel3 = (circuitState) => {
  const { nodes, edges } = circuitState;

  const inputNodes = nodes.filter(n => n.type === 'input');
  const orGates = nodes.filter(n => n.type === 'or');
  const outputNode = nodes.find(n => n.type === 'output');

  if (inputNodes.length < 2 || orGates.length < 1 || !outputNode) {
    return {
      success: false,
      message: "Missing components. You need two inputs, one OR gate, and one output."
    };
  }

  const orGate = orGates[0];

  const hasAllInputsToOr = inputNodes.every(input =>
    edges.some(e => e.source === input.id && e.target === orGate.id)
  );

  const hasOrToOutput = edges.some(e =>
    e.source === orGate.id && e.target === outputNode.id
  );

  if (!hasAllInputsToOr || !hasOrToOutput) {
    return {
      success: false,
      message: "Make sure both inputs are connected to the OR gate and the OR gate is connected to the output!"
    };
  }

  const expectedOutput = inputNodes.some(n => n.data.value === 1) ? 1 : 0;
  const actualOutput = outputNode.data.value;

  if (actualOutput !== expectedOutput) {
    return {
      success: false,
      message: "Incorrect output. The OR gate should output 1 if either input is 1."
    };
  }

  return {
    success: true,
    message: "Great job! The OR gate works as expected!"
  };
};