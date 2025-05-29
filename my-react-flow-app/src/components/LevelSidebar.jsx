import React, { useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { logoutUser } from '../firebase';
import { useNavigate } from 'react-router-dom';

const gateTypes = ['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR', 'XNOR'];

const LevelSidebar = ({ title, description, completedLevels }) => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();

  const onDragStart = useCallback((event, gateType) => {
    event.dataTransfer.setData('application/reactflow', gateType.toLowerCase());
    event.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div style={{
      width: '300px',
      padding: '20px',
      backgroundColor: '#f5f5f5',
      borderRight: '1px solid #ddd',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}>
      {/* User Profile Section */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        marginBottom: '20px',
        padding: '10px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#2196F3',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          marginRight: '10px'
        }}>
          {user?.email?.[0].toUpperCase()}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: '0', fontWeight: 'bold' }}>{user?.email}</p>
          <p style={{ margin: '0', fontSize: '0.9rem', color: '#666' }}>
            Completed: {completedLevels.length} levels
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {userRole === 'teacher' && (
            <button
              onClick={() => navigate('/teacher')}
              style={{
                padding: '6px 12px',
                backgroundColor: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                marginBottom: '5px'
              }}
            >
              Teacher Dashboard
            </button>
          )}
          <button
            onClick={handleLogout}
            style={{
              padding: '6px 12px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Level Info */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ margin: '0 0 10px 0' }}>{title}</h2>
        <p style={{ margin: '0', color: '#666' }}>{description}</p>
      </div>

      {/* Logic Gates */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ margin: '0 0 10px 0' }}>Logic Gates</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {gateTypes.map((gate) => (
            <div
              key={gate}
              draggable
              onDragStart={(event) => onDragStart(event, gate)}
              style={{
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'grab',
                backgroundColor: 
                  gate === 'NOT' ? '#ffebee' :
                  gate === 'AND' ? '#e0f7fa' :
                  gate === 'OR' ? '#fff3e0' :
                  gate === 'NAND' ? '#f3e5f5' :
                  gate === 'NOR' ? '#fbe9e7' :
                  gate === 'XOR' ? '#e8f5e9' :
                  '#f1f8e9',
                transition: 'transform 0.2s',
                ':hover': {
                  transform: 'scale(1.02)'
                }
              }}
            >
              {gate} Gate
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LevelSidebar;