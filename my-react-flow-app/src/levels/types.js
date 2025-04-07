/**
 * @typedef {Object} LevelNode
 * @property {string} id - Unique identifier for the node
 * @property {string} type - Type of the node (input, output, gate type)
 * @property {Object} data - Node data (value, label, etc)
 * @property {Object} position - Node position {x, y}
 */

/**
 * @typedef {Object} LevelConfig
 * @property {string} id - Unique level identifier
 * @property {string} title - Level title
 * @property {string} description - Level description/objective
 * @property {string[]} availableGates - Gates that can be used in this level
 * @property {LevelNode[]} initialNodes - Initial node setup
 * @property {Object[]} expectedTruthTable - Expected truth table for validation
 * @property {number} difficulty - Level difficulty (1-5)
 */

export const GATE_TYPES = {
  INPUT: 'input',
  OUTPUT: 'output',
  INVERTER: 'inverter',
  AND: 'and',
  OR: 'or',
  NAND: 'nand',
  NOR: 'nor',
  XOR: 'xor',
  XNOR: 'xnor'
}; 