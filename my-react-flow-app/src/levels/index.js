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
 * Validate a circuit solution based on the level ID
 * @param {LevelConfig} level - The level configuration
 * @param {Object} circuitState - Current circuit state
 * @returns {Object} Validation result with success status and message
 */
export const validateCircuit = (level, circuitState) => {
  switch (level.id) {
    case 'level1':
      return validateLevel1(circuitState);
    case 'level2':
      return validateLevel2(circuitState);
    default:
      return {
        success: false,
        message: `No validation logic implemented for level: ${level.id}`
      };
  }
};

/**
 * Validation logic for Level 1 (NOT gate)
 */
const validateLevel1 = (circuitState) => {
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

/**
 * Validation logic for Level 2 (AND gate)
 */
const validateLevel2 = (circuitState) => {
  const { nodes, edges } = circuitState;

  const inputNodes = nodes.filter(n => n.type === 'input');
  const outputNode = nodes.find(n => n.type === 'output');
  const andNode = nodes.find(n => n.type === 'and');

  console.log("Level 2 Validation");
  console.log("Inputs:", inputNodes.map(n => ({ id: n.id, value: n.data.value })));
  console.log("AND Node:", andNode);
  console.log("Output Node:", outputNode);

  // Check if all required nodes are present
  if (inputNodes.length < 2 || !andNode || !outputNode) {
    return {
      success: false,
      message: "Missing required components. You need 2 inputs, an AND gate, and an output node."
    };
  }

  // Check if both inputs are connected to the AND gate
  const allInputsConnected = inputNodes.every(input =>
    edges.some(edge => edge.source === input.id && edge.target === andNode.id)
  );

  if (!allInputsConnected) {
    return {
      success: false,
      message: "Each input must be connected to the AND gate."
    };
  }

  // Check if AND gate is connected to the output
  const andToOutputConnected = edges.some(edge =>
    edge.source === andNode.id && edge.target === outputNode.id
  );

  if (!andToOutputConnected) {
    return {
      success: false,
      message: "The AND gate must be connected to the output."
    };
  }

  // Check if input values are defined
  if (inputNodes.some(n => typeof n.data.value !== 'number')) {
    return {
      success: false,
      message: "All input nodes must have a value (0 or 1)."
    };
  }

  // Check if both input values are either both true (1) or both false (0)
  const inputValues = inputNodes.map(n => n.data.value);
  if (inputValues[0] !== inputValues[1]) {
    return {
      success: false,
      message: "Wrong connection! Both inputs must either be true (1) or false (0) for the AND gate to work correctly."
    };
  }

  // Logic check: AND gate outputs 1 only if both inputs are 1
  const expectedOutput = inputValues[0] === 1 && inputValues[1] === 1 ? 1 : 0;
  const actualOutput = outputNode.data.value;

  console.log("Expected Output:", expectedOutput);
  console.log("Actual Output:", actualOutput);

  if (actualOutput !== expectedOutput) {
    return {
      success: false,
      message: `Incorrect output! The AND gate should output ${expectedOutput}, but got ${actualOutput}.`
    };
  }

  // Only return success if everything is correct
  return {
    success: true,
    message: "Great job! The AND gate is wired correctly and the logic works!"
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