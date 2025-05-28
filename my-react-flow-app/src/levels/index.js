import { level1 } from './level1';
import { level2 } from './level2';
import { level3 } from './level3';
import { level4 } from './level4';
import { level5 } from './level5';
import { level6 } from './level6';
import { level7 } from './level7';
import { level8 } from './level8';
import { level9 } from './level9';
import { levelHalfAdder } from './levelHalfAdder.js'; 

export { GATE_TYPES } from './types';

import {validateLevel1, validateLevel2,validateLevel3,validateLevel4,validateLevel5,validateLevel6,validateLevel7,validateLevel8,validateLevelHalfAdder,validateLevel9} from "../validators/index.js";

// Array of all available levels
export const levels = [level1, level2, level3, level4, level5, level6, level7, level8, level9,levelHalfAdder];

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
    case 'level9':
      return validateLevel9(circuitState);

      case 'levelHalfAdder':
        return validateLevelHalfAdder(circuitState);
    default:
      return {
        success: false,
        message: `No validation logic implemented for level: ${level.id}`
      };
  }
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