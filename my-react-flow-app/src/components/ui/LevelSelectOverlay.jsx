import React from 'react';
import LevelSelect from './LevelSelect';

const LevelSelectOverlay = ({ showLevelSelect, setShowLevelSelect, levels, currentLevelId, onSelectLevel, completedLevels }) => {
  if (!showLevelSelect) return null;

  return (
    <>
      <div
        className="level-select-overlay"
        onClick={() => setShowLevelSelect(false)}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.5)',
          zIndex: 10,
        }}
      />
      <LevelSelect
        levels={levels}
        currentLevelId={currentLevelId}
        onSelectLevel={onSelectLevel}
        completedLevels={completedLevels}
        style={{ zIndex: 20 }}
      />
    </>
  );
};

export default LevelSelectOverlay; 