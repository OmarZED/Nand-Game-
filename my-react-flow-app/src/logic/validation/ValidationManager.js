import { useCallback } from 'react';
import {
  validateLevel1,
  validateLevel2,
  validateLevel3,
  validateLevel4,
  validateLevel5,
  validateLevel6,
  validateLevel7,
  validateLevel8,
  validateLevel9,
  validateLevelHalfAdder
} from '../../validators';

export const useValidationManager = () => {
  const getValidator = useCallback((levelId) => {
    const validators = {
      'level1': validateLevel1,
      'level2': validateLevel2,
      'level3': validateLevel3,
      'level4': validateLevel4,
      'level5': validateLevel5,
      'level6': validateLevel6,
      'level7': validateLevel7,
      'level8': validateLevel8,
      'level9': validateLevel9,
      'levelHalfAdder': validateLevelHalfAdder
    };
    return validators[levelId];
  }, []);

  const checkSolution = useCallback((level, circuitState) => {
    const validator = getValidator(level.id);
    if (!validator) {
      return {
        success: false,
        message: 'No validator found for this level'
      };
    }
    return validator(circuitState);
  }, [getValidator]);

  const validateCircuitState = useCallback((level, nodes, edges) => {
    const circuitState = { nodes, edges };
    return checkSolution(level, circuitState);
  }, [checkSolution]);

  return {
    checkSolution,
    validateCircuitState
  };
}; 