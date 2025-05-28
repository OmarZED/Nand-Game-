import React from 'react';

const LevelSelect = ({ levels, currentLevelId, onSelectLevel, completedLevels }) => {
  return (
    <div className="level-select">
      <h2>Select Level</h2>
      <div className="level-grid">
        {levels.map(level => (
          <button
            key={level.id}
            onClick={() => onSelectLevel(level.id)}
            className={`level-button ${level.id === currentLevelId ? 'active' : ''}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3>{level.title}</h3>
              {completedLevels?.includes(level.id) && (
                <span style={{ 
                  color: '#4CAF50', 
                  marginLeft: '8px',
                  fontSize: '1.2em'
                }}>✓</span>
              )}
            </div>
            <p>{level.description}</p>
            <div className="level-difficulty">
              Difficulty: {'⭐'.repeat(level.difficulty)}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LevelSelect; 