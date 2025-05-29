import { useState, useCallback, useEffect } from 'react';
import { levels as hardcodedLevels, getLevelById as getHardcodedLevelById } from '../../levels';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

export const useLevelManager = () => {
  const [currentLevelId, setCurrentLevelId] = useState(hardcodedLevels[0].id);
  const [showLevelSelect, setShowLevelSelect] = useState(false);
  const [customLevels, setCustomLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const db = getFirestore();

  // Load custom levels from Firestore
  useEffect(() => {
    const loadCustomLevels = async () => {
      try {
        const levelsSnapshot = await getDocs(collection(db, 'levels'));
        const levelsData = levelsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCustomLevels(levelsData);
      } catch (error) {
        console.error('Error loading custom levels:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCustomLevels();
  }, []);

  // Combine hardcoded and custom levels
  const allLevels = [...hardcodedLevels, ...customLevels];

  const getLevelById = (levelId) => {
    // First check hardcoded levels
    const hardcodedLevel = getHardcodedLevelById(levelId);
    if (hardcodedLevel) return hardcodedLevel;

    // Then check custom levels
    return customLevels.find(level => level.id === levelId);
  };

  const currentLevel = getLevelById(currentLevelId);

  const handleLevelSelect = useCallback((levelId) => {
    setCurrentLevelId(levelId);
    setShowLevelSelect(false);
  }, []);

  const getNextLevelId = (currentLevelId) => {
    const currentIndex = allLevels.findIndex(level => level.id === currentLevelId);
    if (currentIndex === -1 || currentIndex === allLevels.length - 1) {
      return null;
    }
    return allLevels[currentIndex + 1].id;
  };

  const goToNextLevel = useCallback(() => {
    const nextLevelId = getNextLevelId(currentLevelId);
    if (nextLevelId) {
      setCurrentLevelId(nextLevelId);
      return true;
    }
    return false;
  }, [currentLevelId]);

  const resetLevel = useCallback(() => {
    setCurrentLevelId(allLevels[0].id);
  }, [allLevels]);

  return {
    // Level state
    currentLevelId,
    currentLevel,
    showLevelSelect,
    setShowLevelSelect,
    loading,
    
    // Level actions
    handleLevelSelect,
    goToNextLevel,
    resetLevel,
    
    // Level info
    totalLevels: allLevels.length,
    currentLevelIndex: allLevels.findIndex(level => level.id === currentLevelId) + 1,
    allLevels
  };
}; 