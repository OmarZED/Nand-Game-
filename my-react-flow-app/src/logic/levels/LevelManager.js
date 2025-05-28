import { useState, useCallback } from 'react';
import { levels, getLevelById, getNextLevelId } from '../../levels';

export const useLevelManager = () => {
  const [currentLevelId, setCurrentLevelId] = useState(levels[0].id);
  const [showLevelSelect, setShowLevelSelect] = useState(false);
  const currentLevel = getLevelById(currentLevelId);

  const handleLevelSelect = useCallback((levelId) => {
    setCurrentLevelId(levelId);
    setShowLevelSelect(false);
  }, []);

  const goToNextLevel = useCallback(() => {
    const nextLevelId = getNextLevelId(currentLevelId);
    if (nextLevelId) {
      setCurrentLevelId(nextLevelId);
      return true;
    }
    return false;
  }, [currentLevelId]);

  const resetLevel = useCallback(() => {
    setCurrentLevelId(levels[0].id);
  }, []);

  return {
    // Level state
    currentLevelId,
    currentLevel,
    showLevelSelect,
    setShowLevelSelect,
    
    // Level actions
    handleLevelSelect,
    goToNextLevel,
    resetLevel,
    
    // Level info
    totalLevels: levels.length,
    currentLevelIndex: levels.findIndex(level => level.id === currentLevelId) + 1
  };
}; 