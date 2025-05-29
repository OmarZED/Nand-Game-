import { useCallback } from 'react';
import { useLevelManager } from '../logic/levels/LevelManager';
import { useCircuitManager } from '../logic/circuit/CircuitManager';
import { useValidationManager } from '../logic/validation/ValidationManager';

export const useGameLogic = () => {
  // Initialize managers
  const levelManager = useLevelManager();
  const circuitManager = useCircuitManager(levelManager.currentLevel);
  const validationManager = useValidationManager();

  // Handle solution check
  const checkSolution = useCallback(() => {
    const circuitState = {
      nodes: circuitManager.nodes,
      edges: circuitManager.edges
    };
    const result = validationManager.checkSolution(levelManager.currentLevel, circuitState);

    if (result.success) {
      levelManager.setShowLevelSelect(true);
    }

    return result;
  }, [circuitManager.nodes, circuitManager.edges, levelManager, validationManager]);

  return {
    // Level state and actions
    currentLevelId: levelManager.currentLevelId,
    currentLevel: levelManager.currentLevel,
    showLevelSelect: levelManager.showLevelSelect,
    setShowLevelSelect: levelManager.setShowLevelSelect,
    handleLevelSelect: levelManager.handleLevelSelect,
    allLevels: levelManager.allLevels,
    
    // Circuit state and actions
    nodes: circuitManager.nodes,
    edges: circuitManager.edges,
    onNodesChange: circuitManager.onNodesChange,
    onEdgesChange: circuitManager.onEdgesChange,
    onConnect: circuitManager.onConnect,
    toggleInput: circuitManager.toggleInput,
    
    // Game actions
    checkSolution
  };
};