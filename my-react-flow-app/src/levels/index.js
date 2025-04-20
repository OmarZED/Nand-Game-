import { level1 } from './level1';
import { level2 } from './level2';
import { level3 } from './level3';
import { level4 } from './level4';
import { level5 } from './level5';
import { level6 } from './level6';
import { level7 } from './level7';
import { level8 } from './level8';
export { GATE_TYPES } from './types';

// Array of all available levels
export const levels = [level1, level2, level3, level4, level5, level6, level7, level8];

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
    case 'level3':
      return validateLevel3(circuitState);
    case 'level4':
      return validateLevel4(circuitState);
    case 'level5':
      return validateLevel5(circuitState);
    case 'level6':
      return validateLevel6(circuitState);
    case 'level7':
      return validateLevel7(circuitState);
    case 'level8':
      return validateLevel8(circuitState);
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
 * Validation logic for Level 3 (OR gate)
 */
const validateLevel3 = (circuitState) => {
  const { nodes, edges } = circuitState;
  const input1Node = nodes.find(n => n.id === 'input1');
  const input2Node = nodes.find(n => n.id === 'input2');
  const outputNode = nodes.find(n => n.id === 'output');
  const orNode = nodes.find(n => n.id === 'or');

  if (!input1Node || !input2Node || !outputNode || !orNode) {
    return {
      success: false,
      message: "Missing required components. Make sure you have both inputs, OR gate, and output nodes."
    };
  }

  // Check if inputs are connected to the OR gate
  const input1ToOr = edges.some(e => e.source === 'input1' && e.target === 'or');
  const input2ToOr = edges.some(e => e.source === 'input2' && e.target === 'or');
  const orToOutput = edges.some(e => e.source === 'or' && e.target === 'output');

  if (!input1ToOr || !input2ToOr || !orToOutput) {
    return {
      success: false,
      message: "Incorrect connections. Connect both inputs to the OR gate, and the OR gate to the output."
    };
  }

  // Check all truth table combinations
  const truthTable = level3.expectedTruthTable;
  let allCorrect = true;
  let incorrectCombination = null;

  for (const combination of truthTable) {
    // Set input values
    const input1Value = combination.input1;
    const input2Value = combination.input2;
    const expectedOutput = combination.output;

    // Calculate OR gate output
    const actualOutput = input1Value === 1 || input2Value === 1 ? 1 : 0;

    if (actualOutput !== expectedOutput) {
      allCorrect = false;
      incorrectCombination = combination;
      break;
    }
  }

  if (!allCorrect) {
    return {
      success: false,
      message: `Incorrect output for input combination: Input1=${incorrectCombination.input1}, Input2=${incorrectCombination.input2}. Expected output: ${incorrectCombination.output}`
    };
  }

  return {
    success: true,
    message: "Congratulations! You've successfully completed the OR gate challenge!"
  };
};

/**
 * Validation logic for Level 4 (NAND gate)
 */
const validateLevel4 = (circuitState) => {
  const { nodes, edges } = circuitState;
  const input1Node = nodes.find(n => n.id === 'input1');
  const input2Node = nodes.find(n => n.id === 'input2');
  const outputNode = nodes.find(n => n.id === 'output');
  const nandNode = nodes.find(n => n.id === 'nand');

  if (!input1Node || !input2Node || !outputNode || !nandNode) {
    return {
      success: false,
      message: "Missing required components. Make sure you have both inputs, NAND gate, and output nodes."
    };
  }

  // Check if inputs are connected to the NAND gate
  const input1ToNand = edges.some(e => e.source === 'input1' && e.target === 'nand');
  const input2ToNand = edges.some(e => e.source === 'input2' && e.target === 'nand');
  const nandToOutput = edges.some(e => e.source === 'nand' && e.target === 'output');

  if (!input1ToNand || !input2ToNand || !nandToOutput) {
    return {
      success: false,
      message: "Incorrect connections. Connect both inputs to the NAND gate, and the NAND gate to the output."
    };
  }

  // Check all truth table combinations
  const truthTable = level4.expectedTruthTable;
  let allCorrect = true;
  let incorrectCombination = null;

  for (const combination of truthTable) {
    // Set input values
    const input1Value = combination.input1;
    const input2Value = combination.input2;
    const expectedOutput = combination.output;

    // Calculate NAND gate output (inverse of AND)
    const actualOutput = (input1Value === 1 && input2Value === 1) ? 0 : 1;

    if (actualOutput !== expectedOutput) {
      allCorrect = false;
      incorrectCombination = combination;
      break;
    }
  }

  if (!allCorrect) {
    return {
      success: false,
      message: `Incorrect output for input combination: Input1=${incorrectCombination.input1}, Input2=${incorrectCombination.input2}. Expected output: ${incorrectCombination.output}`
    };
  }

  return {
    success: true,
    message: "Congratulations! You've successfully completed the NAND gate challenge!"
  };
};

/**
 * Validation logic for Level 5 (NOR gate)
 */
const validateLevel5 = (circuitState) => {
  const { nodes, edges } = circuitState;
  const input1Node = nodes.find(n => n.id === 'input1');
  const input2Node = nodes.find(n => n.id === 'input2');
  const outputNode = nodes.find(n => n.id === 'output');
  const norNode = nodes.find(n => n.id === 'nor');

  if (!input1Node || !input2Node || !outputNode || !norNode) {
    return {
      success: false,
      message: "Missing required components. Make sure you have both inputs, NOR gate, and output nodes."
    };
  }

  // Check if inputs are connected to the NOR gate
  const input1ToNor = edges.some(e => e.source === 'input1' && e.target === 'nor');
  const input2ToNor = edges.some(e => e.source === 'input2' && e.target === 'nor');
  const norToOutput = edges.some(e => e.source === 'nor' && e.target === 'output');

  if (!input1ToNor || !input2ToNor || !norToOutput) {
    return {
      success: false,
      message: "Incorrect connections. Connect both inputs to the NOR gate, and the NOR gate to the output."
    };
  }

  // Check all truth table combinations
  const truthTable = level5.expectedTruthTable;
  let allCorrect = true;
  let incorrectCombination = null;

  for (const combination of truthTable) {
    // Set input values
    const input1Value = combination.input1;
    const input2Value = combination.input2;
    const expectedOutput = combination.output;

    // Calculate NOR gate output (inverse of OR)
    const actualOutput = (input1Value === 0 && input2Value === 0) ? 1 : 0;

    if (actualOutput !== expectedOutput) {
      allCorrect = false;
      incorrectCombination = combination;
      break;
    }
  }

  if (!allCorrect) {
    return {
      success: false,
      message: `Incorrect output for input combination: Input1=${incorrectCombination.input1}, Input2=${incorrectCombination.input2}. Expected output: ${incorrectCombination.output}`
    };
  }

  return {
    success: true,
    message: "Congratulations! You've successfully completed the NOR gate challenge!"
  };
};

/**
 * Validation logic for Level 6 (XOR gate)
 */
const validateLevel6 = (circuitState) => {
  const { nodes, edges } = circuitState;
  const input1Node = nodes.find(n => n.id === 'input1');
  const input2Node = nodes.find(n => n.id === 'input2');
  const outputNode = nodes.find(n => n.id === 'output');
  const xorNode = nodes.find(n => n.id === 'xor');

  if (!input1Node || !input2Node || !outputNode || !xorNode) {
    return {
      success: false,
      message: "Missing required components. Make sure you have both inputs, XOR gate, and output nodes."
    };
  }

  // Check if inputs are connected to the XOR gate
  const input1ToXor = edges.some(e => e.source === 'input1' && e.target === 'xor');
  const input2ToXor = edges.some(e => e.source === 'input2' && e.target === 'xor');
  const xorToOutput = edges.some(e => e.source === 'xor' && e.target === 'output');

  if (!input1ToXor || !input2ToXor || !xorToOutput) {
    return {
      success: false,
      message: "Incorrect connections. Connect both inputs to the XOR gate, and the XOR gate to the output."
    };
  }

  // Check all truth table combinations
  const truthTable = level6.expectedTruthTable;
  let allCorrect = true;
  let incorrectCombination = null;

  for (const combination of truthTable) {
    // Set input values
    const input1Value = combination.input1;
    const input2Value = combination.input2;
    const expectedOutput = combination.output;

    // Calculate XOR gate output (1 when inputs are different, 0 when they are the same)
    const actualOutput = input1Value !== input2Value ? 1 : 0;

    if (actualOutput !== expectedOutput) {
      allCorrect = false;
      incorrectCombination = combination;
      break;
    }
  }

  if (!allCorrect) {
    return {
      success: false,
      message: `Incorrect output for input combination: Input1=${incorrectCombination.input1}, Input2=${incorrectCombination.input2}. Expected output: ${incorrectCombination.output}`
    };
  }

  return {
    success: true,
    message: "Congratulations! You've successfully completed the XOR gate challenge!"
  };
};

/**
 * Validation logic for Level 7 (XNOR gate)
 */
const validateLevel7 = (circuitState) => {
  const { nodes, edges } = circuitState;
  const input1Node = nodes.find(n => n.id === 'input1');
  const input2Node = nodes.find(n => n.id === 'input2');
  const outputNode = nodes.find(n => n.id === 'output');
  const xnorNode = nodes.find(n => n.id === 'xnor');

  if (!input1Node || !input2Node || !outputNode || !xnorNode) {
    return {
      success: false,
      message: "Missing required components. Make sure you have both inputs, XNOR gate, and output nodes."
    };
  }

  // Check if inputs are connected to the XNOR gate
  const input1ToXnor = edges.some(e => e.source === 'input1' && e.target === 'xnor');
  const input2ToXnor = edges.some(e => e.source === 'input2' && e.target === 'xnor');
  const xnorToOutput = edges.some(e => e.source === 'xnor' && e.target === 'output');

  if (!input1ToXnor || !input2ToXnor || !xnorToOutput) {
    return {
      success: false,
      message: "Incorrect connections. Connect both inputs to the XNOR gate, and the XNOR gate to the output."
    };
  }

  // Check all truth table combinations
  const truthTable = level7.expectedTruthTable;
  let allCorrect = true;
  let incorrectCombination = null;

  for (const combination of truthTable) {
    // Set input values
    const input1Value = combination.input1;
    const input2Value = combination.input2;
    const expectedOutput = combination.output;

    // Calculate XNOR gate output (1 when inputs are the same, 0 when they are different)
    const actualOutput = input1Value === input2Value ? 1 : 0;

    if (actualOutput !== expectedOutput) {
      allCorrect = false;
      incorrectCombination = combination;
      break;
    }
  }

  if (!allCorrect) {
    return {
      success: false,
      message: `Incorrect output for input combination: Input1=${incorrectCombination.input1}, Input2=${incorrectCombination.input2}. Expected output: ${incorrectCombination.output}`
    };
  }

  return {
    success: true,
    message: "Congratulations! You've successfully completed the XNOR gate challenge!"
  };
};

/**
 * Validation logic for Level 8 (Complex Gate Combination)
 */
const validateLevel8 = (circuitState) => {
  const { nodes, edges } = circuitState;

  // Check for required nodes
  const input1 = nodes.find(n => n.id === 'input1');
  const input2 = nodes.find(n => n.id === 'input2');
  const output = nodes.find(n => n.id === 'output');
  const nand1 = nodes.find(n => n.id === 'nand1');
  const and1 = nodes.find(n => n.id === 'and1');
  const nand2 = nodes.find(n => n.id === 'nand2');
  const or1 = nodes.find(n => n.id === 'or1');

  if (!input1 || !input2 || !output || !nand1 || !and1 || !nand2 || !or1) {
    return {
      success: false,
      message: "Missing required components. Make sure all gates are placed correctly."
    };
  }

  // Check connections
  const requiredConnections = [
    { from: 'input1', to: 'nand1' },
    { from: 'input1', to: 'nand2' },
    { from: 'input2', to: 'nand1' },
    { from: 'input2', to: 'nand2' },
    { from: 'nand1', to: 'and1' },
    { from: 'nand2', to: 'or1' },
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

  // Check truth table
  const truthTable = [
    { input1: 0, input2: 0, output: 1 },
    { input1: 0, input2: 1, output: 0 },
    { input1: 1, input2: 0, output: 0 },
    { input1: 1, input2: 1, output: 1 }
  ];

  for (const testCase of truthTable) {
    // Set input values
    input1.data.value = testCase.input1;
    input2.data.value = testCase.input2;

    // Calculate expected output
    const nand1Output = !(testCase.input1 && testCase.input2) ? 1 : 0;
    const nand2Output = !(testCase.input1 && testCase.input2) ? 1 : 0;
    const and1Output = nand1Output && testCase.input2 ? 1 : 0;
    const or1Output = and1Output || nand2Output ? 1 : 0;
    const expectedOutput = or1Output;

    if (output.data.value !== expectedOutput) {
      return {
        success: false,
        message: `Incorrect output for inputs (${testCase.input1}, ${testCase.input2}). Expected ${expectedOutput}, got ${output.data.value}.`
      };
    }
  }

  return {
    success: true,
    message: "Excellent! You've successfully implemented the complex logic circuit!"
  };
};

/**
 * Get the next level ID based on the current level
 * @param {string} currentLevelId - The current level ID
 * @returns {string|null} The next level ID or null if there is no next level
 */
export const getNextLevelId = (currentLevelId) => {
  const currentIndex = levels.findIndex(level => level.id === currentLevelId);
  if (currentIndex === -1 || currentIndex === levels.length - 1) {
    return null;
  }
  return levels[currentIndex + 1].id;
};