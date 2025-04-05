import { level1 } from './level1';
import { level2 } from './level2';
export { GATE_TYPES } from './types';

// Array of all available levels
export const levels = [level1, level2];

/**
 * Get a level configuration by ID
 * @param {string} levelId - The level ID to find
 * @returns {LevelConfig|undefined} The level configuration or undefined if not found
 */
export const getLevelById = (levelId) => {
  return levels.find(level => level.id === levelId);
};

/**
 * Validate a circuit solution against a level's truth table
 * @param {LevelConfig} level - The level configuration
 * @param {Object} circuitState - Current circuit state
 * @returns {Object} Validation result with success status and message
 */
export const validateCircuit = (level, circuitState) => {
  console.log("Validating circuit for level:", level);
  console.log("Circuit state:", circuitState);
  
  const { nodes, edges } = circuitState;
  const inputNode = nodes.find(n => n.type === 'input');
  const outputNode = nodes.find(n => n.type === 'output');
  const inverterNode = nodes.find(n => n.type === 'inverter');
  
  console.log("Input node:", inputNode);
  console.log("Output node:", outputNode);
  console.log("Inverter node:", inverterNode);

  // Check if all required nodes exist
  if (!inputNode || !outputNode || !inverterNode) {
    console.log("Missing required nodes");
    return {
      success: false,
      message: "Missing required components. Make sure you have input, inverter, and output nodes."
    };
  }

  // Check if output is connected
  if (outputNode.data.value === null) {
    console.log("Output not connected");
    return {
      success: false,
      message: "The output is not connected. Complete the circuit first!"
    };
  }

  // Check if input is connected to inverter
  const hasInputToInverter = edges.some(e => 
    e.source === inputNode.id && e.target === inverterNode.id
  );
  console.log("Has input to inverter:", hasInputToInverter);
  
  if (!hasInputToInverter) {
    console.log("Input not connected to inverter");
    return {
      success: false,
      message: "Connect the input to the inverter!"
    };
  }

  // Check if inverter is connected to output
  const hasInverterToOutput = edges.some(e => 
    e.source === inverterNode.id && e.target === outputNode.id
  );
  console.log("Has inverter to output:", hasInverterToOutput);
  
  if (!hasInverterToOutput) {
    console.log("Inverter not connected to output");
    return {
      success: false,
      message: "Connect the inverter to the output!"
    };
  }

  // Check if the circuit produces the correct output
  const expectedOutput = inputNode.data.value === 0 ? 1 : 0;
  console.log("Expected output:", expectedOutput);
  console.log("Actual output:", outputNode.data.value);
  
  if (outputNode.data.value !== expectedOutput) {
    console.log("Incorrect output value");
    return {
      success: false,
      message: "The circuit is not producing the correct output. A NOT gate should invert the input!"
    };
  }

  console.log("Circuit is valid!");
  return {
    success: true,
    message: "Correct! The circuit is working properly!"
  };
};

/**
 * Get the next level ID after the current one
 * @param {string} currentLevelId - Current level ID
 * @returns {string|undefined} Next level ID or undefined if current is last
 */
export const getNextLevelId = (currentLevelId) => {
  const currentIndex = levels.findIndex(level => level.id === currentLevelId);
  return currentIndex < levels.length - 1 ? levels[currentIndex + 1].id : undefined;
}; 