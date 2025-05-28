import React from 'react';
 
 const LevelSelect = ({ levels, currentLevelId, onSelectLevel }) => {
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
             <h3>{level.title}</h3>
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