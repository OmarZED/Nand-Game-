export const validateLevel1 = (circuitState) => {
    const { nodes, edges } = circuitState;
    const inputNode = nodes.find(n => n.type === 'input');
    const outputNode = nodes.find(n => n.type === 'output');
    const inverterNode = nodes.find(n => n.type === 'inverter');
  
    if (!inputNode || !outputNode || !inverterNode) {
      return {
        success: false,
        message: "Missing required components. Make sure you have input, inverter, and output nodes."
      };
    }
  
    if (outputNode.data.value === null) {
      return {
        success: false,
        message: "The output is not connected. Complete the circuit first!"
      };
    }
  
    const hasInputToInverter = edges.some(e =>
      e.source === inputNode.id && e.target === inverterNode.id
    );
  
    if (!hasInputToInverter) {
      return {
        success: false,
        message: "Connect the input to the inverter!"
      };
    }
  
    const hasInverterToOutput = edges.some(e =>
      e.source === inverterNode.id && e.target === outputNode.id
    );
  
    if (!hasInverterToOutput) {
      return {
        success: false,
        message: "Connect the inverter to the output!"
      };
    }
  
    const expectedOutput = inputNode.data.value === 0 ? 1 : 0;
    if (outputNode.data.value !== expectedOutput) {
      return {
        success: false,
        message: "The circuit is not producing the correct output. A NOT gate should invert the input!"
      };
    }
  
    return {
      success: true,
      message: "Correct! The NOT gate works perfectly!"
    };
  };