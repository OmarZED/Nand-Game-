export const validateLevel2 = (circuitState) => {
  const { nodes, edges } = circuitState;

  const inputNodes = nodes.filter(n => n.type === 'input');
  const andGates = nodes.filter(n => n.type === 'and');
  const outputNode = nodes.find(n => n.type === 'output');

  if (inputNodes.length < 2 || andGates.length < 1 || !outputNode) {
    return {
      success: false,
      message: "Missing components. You need two inputs, one AND gate, and one output."
    };
  }

  const andGate = andGates[0];

  const hasAllInputsToAnd = inputNodes.every(input =>
    edges.some(e => e.source === input.id && e.target === andGate.id)
  );

  const hasAndToOutput = edges.some(e =>
    e.source === andGate.id && e.target === outputNode.id
  );

  if (!hasAllInputsToAnd || !hasAndToOutput) {
    return {
      success: false,
      message: "Make sure both inputs are connected to the AND gate and the AND gate is connected to the output!"
    };
  }

  const expectedOutput = inputNodes.every(n => n.data.value === 1) ? 1 : 0;
  const actualOutput = outputNode.data.value;

  if (actualOutput !== expectedOutput) {
    return {
      success: false,
      message: "Incorrect output. The AND gate should only output 1 if both inputs are 1."
    };
  }

  return {
    success: true,
    message: "Great job! The AND gate works as expected!"
  };
};