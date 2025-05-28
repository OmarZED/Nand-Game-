import React from 'react';
import { useCallback } from 'react';

const gateTypes = ['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR', 'XNOR'];

const LevelSidebar = ({ title, description }) => {
  const onDragStart = useCallback((event, gateType) => {
    event.dataTransfer.setData('application/reactflow', gateType);
    event.dataTransfer.effectAllowed = 'move';
  }, []);

  return (
    <aside style={{
      width: '280px',
      padding: '1.5rem',
      background: '#f5f5f5',
      borderRight: '1px solid #ddd',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <h2>{title}</h2>
      <p>{description}</p>
      
      <div style={{ marginTop: '2rem' }}>
        <h3>Logic Gates</h3>
        {gateTypes.map((gate) => (
          <div 
            key={gate}
            style={{
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              marginBottom: '0.5rem',
              cursor: 'grab',
              backgroundColor: 
                             gate === 'NOT' ? '#ffebee' :
                             gate === 'AND' ? '#e0f7fa' :
                             gate === 'OR' ? '#fff3e0' :
                             gate === 'NAND' ? '#f3e5f5' :
                             gate === 'NOR' ? '#fbe9e7' :
                             gate === 'XOR' ? '#e8f5e9' :
                             '#f1f8e9'
            }}
            draggable
            onDragStart={(event) => onDragStart(event, gate.toLowerCase())}
          >
            {gate} Gate
          </div>
        ))}
      </div>
    </aside>
  );
};

export default LevelSidebar;