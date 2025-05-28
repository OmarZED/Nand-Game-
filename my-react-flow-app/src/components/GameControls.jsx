import React from 'react';

const GameControls = ({ 
  currentLevelId, 
  toggleInput, 
  handleCheck, 
  setShowLevelSelect 
}) => {
  return (
    <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10 }}>
      {currentLevelId === 'level1' ? (
        <button onClick={() => toggleInput('input')} style={{ marginRight: '10px' }}>
          Toggle Input
        </button>
      ) : (
        <>
          <button onClick={() => toggleInput('input1')} style={{ marginRight: '10px' }}>
            Toggle Input 1
          </button>
          <button onClick={() => toggleInput('input2')} style={{ marginRight: '10px' }}>
            Toggle Input 2
          </button>
        </>
      )}
      <button onClick={handleCheck} style={{ marginRight: '10px' }}>
        Check Solution
      </button>
      <button onClick={() => setShowLevelSelect(true)}>Select Level</button>
    </div>
  );
};

export default GameControls; 