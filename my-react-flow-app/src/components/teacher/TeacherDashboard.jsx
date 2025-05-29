import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { GATE_TYPES } from '../../levels/types';

const TeacherDashboard = () => {
  const { user, userRole } = useAuth();
  const [levels, setLevels] = useState([]);
  const [newLevel, setNewLevel] = useState({
    title: '',
    description: '',
    difficulty: 1,
    inputs: [],
    outputs: [],
    truthTable: [],
    solution: []
  });
  const [editingLevel, setEditingLevel] = useState(null);
  const [inputCount, setInputCount] = useState(2);
  const [outputCount, setOutputCount] = useState(1);
  const db = getFirestore();

  useEffect(() => {
    if (userRole === 'teacher') {
      loadLevels();
    }
  }, [userRole]);

  // Generate truth table based on input and output count
  const generateTruthTable = (inputs, outputs) => {
    const rows = Math.pow(2, inputs);
    const table = [];
    
    for (let i = 0; i < rows; i++) {
      const row = {
        inputs: [],
        outputs: []
      };
      
      // Convert row number to binary and pad with zeros
      const binary = i.toString(2).padStart(inputs, '0');
      
      // Add input values
      for (let j = 0; j < inputs; j++) {
        row.inputs.push(parseInt(binary[j]));
      }
      
      // Initialize output values as 0
      for (let j = 0; j < outputs; j++) {
        row.outputs.push(0);
      }
      
      table.push(row);
    }
    
    return table;
  };

  // Update truth table when input/output count changes
  useEffect(() => {
    setNewLevel(prev => ({
      ...prev,
      inputs: Array(inputCount).fill(''),
      outputs: Array(outputCount).fill(''),
      truthTable: generateTruthTable(inputCount, outputCount)
    }));
  }, [inputCount, outputCount]);

  const handleTruthTableChange = (rowIndex, outputIndex, value) => {
    setNewLevel(prev => {
      const newTruthTable = [...prev.truthTable];
      newTruthTable[rowIndex].outputs[outputIndex] = parseInt(value);
      return {
        ...prev,
        truthTable: newTruthTable
      };
    });
  };

  const loadLevels = async () => {
    try {
      const levelsSnapshot = await getDocs(collection(db, 'levels'));
      const levelsData = levelsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLevels(levelsData);
    } catch (error) {
      console.error('Error loading levels:', error);
    }
  };

  const handleCreateLevel = async (e) => {
    e.preventDefault();
    try {
      // Validate truth table
      const isValid = newLevel.truthTable.every(row => 
        row.outputs.every(output => output === 0 || output === 1)
      );

      if (!isValid) {
        alert('Please fill in all truth table values (0 or 1)');
        return;
      }

      // Create initial nodes configuration
      const initialNodes = [];
      
      // Add input nodes
      for (let i = 0; i < inputCount; i++) {
        initialNodes.push({
          id: `input${i + 1}`,
          type: GATE_TYPES.INPUT,
          data: { value: 0 },
          position: { x: 100, y: 100 + (i * 100) },
        });
      }

      // Add output nodes
      for (let i = 0; i < outputCount; i++) {
        initialNodes.push({
          id: `output${i + 1}`,
          type: GATE_TYPES.OUTPUT,
          data: { value: null },
          position: { x: 500, y: 100 + (i * 100) },
        });
      }

      // Create level configuration
      const levelConfig = {
        ...newLevel,
        availableGates: [
          GATE_TYPES.INVERTER,
          GATE_TYPES.AND,
          GATE_TYPES.OR,
          GATE_TYPES.NAND,
          GATE_TYPES.NOR,
          GATE_TYPES.XOR,
          GATE_TYPES.XNOR
        ],
        initialNodes,
        createdAt: new Date().toISOString(),
        createdBy: user.uid
      };

      await addDoc(collection(db, 'levels'), levelConfig);
      setNewLevel({
        title: '',
        description: '',
        difficulty: 1,
        inputs: [],
        outputs: [],
        truthTable: [],
        solution: []
      });
      setInputCount(2);
      setOutputCount(1);
      loadLevels();
    } catch (error) {
      console.error('Error creating level:', error);
    }
  };

  const handleUpdateLevel = async (levelId) => {
    try {
      await updateDoc(doc(db, 'levels', levelId), editingLevel);
      setEditingLevel(null);
      loadLevels();
    } catch (error) {
      console.error('Error updating level:', error);
    }
  };

  const handleDeleteLevel = async (levelId) => {
    if (window.confirm('Are you sure you want to delete this level?')) {
      try {
        await deleteDoc(doc(db, 'levels', levelId));
        loadLevels();
      } catch (error) {
        console.error('Error deleting level:', error);
      }
    }
  };

  if (userRole !== 'teacher') {
    return <div>Access denied. Teacher privileges required.</div>;
  }

  return (
    <div style={{ 
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Fixed Header */}
      <div style={{
        padding: '20px',
        backgroundColor: '#fff',
        borderBottom: '1px solid #ddd',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <h1 style={{ margin: 0 }}>Teacher Dashboard</h1>
      </div>

      {/* Scrollable Content */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Create New Level Form */}
          <div style={{ 
            marginBottom: '30px', 
            padding: '20px', 
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ marginTop: 0 }}>Create New Level</h2>
            <form onSubmit={handleCreateLevel}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Title:</label>
                <input
                  type="text"
                  value={newLevel.title}
                  onChange={(e) => setNewLevel({ ...newLevel, title: e.target.value })}
                  style={{ width: '100%', padding: '8px' }}
                  required
                />
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Description:</label>
                <textarea
                  value={newLevel.description}
                  onChange={(e) => setNewLevel({ ...newLevel, description: e.target.value })}
                  style={{ width: '100%', padding: '8px', minHeight: '100px' }}
                  required
                />
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Difficulty (1-5):</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={newLevel.difficulty}
                  onChange={(e) => setNewLevel({ ...newLevel, difficulty: parseInt(e.target.value) })}
                  style={{ width: '100%', padding: '8px' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Number of Inputs:</label>
                <input
                  type="number"
                  min="1"
                  max="4"
                  value={inputCount}
                  onChange={(e) => setInputCount(parseInt(e.target.value))}
                  style={{ width: '100%', padding: '8px' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Number of Outputs:</label>
                <input
                  type="number"
                  min="1"
                  max="4"
                  value={outputCount}
                  onChange={(e) => setOutputCount(parseInt(e.target.value))}
                  style={{ width: '100%', padding: '8px' }}
                  required
                />
              </div>

              {/* Truth Table */}
              <div style={{ marginBottom: '20px' }}>
                <h3>Truth Table</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                    <thead>
                      <tr>
                        {Array(inputCount).fill(0).map((_, i) => (
                          <th key={`input-${i}`} style={{ padding: '8px', border: '1px solid #ddd', backgroundColor: '#f0f0f0' }}>
                            Input {i + 1}
                          </th>
                        ))}
                        {Array(outputCount).fill(0).map((_, i) => (
                          <th key={`output-${i}`} style={{ padding: '8px', border: '1px solid #ddd', backgroundColor: '#f0f0f0' }}>
                            Output {i + 1}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {newLevel.truthTable.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {row.inputs.map((input, inputIndex) => (
                            <td key={`input-${inputIndex}`} style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>
                              {input}
                            </td>
                          ))}
                          {row.outputs.map((output, outputIndex) => (
                            <td key={`output-${outputIndex}`} style={{ padding: '8px', border: '1px solid #ddd' }}>
                              <select
                                value={output}
                                onChange={(e) => handleTruthTableChange(rowIndex, outputIndex, e.target.value)}
                                style={{ width: '100%', padding: '4px' }}
                              >
                                <option value="0">0</option>
                                <option value="1">1</option>
                              </select>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <button
                type="submit"
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Create Level
              </button>
            </form>
          </div>

          {/* Levels List */}
          <div style={{
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ marginTop: 0 }}>Manage Levels</h2>
            <div style={{ display: 'grid', gap: '15px' }}>
              {levels.map((level) => (
                <div
                  key={level.id}
                  style={{
                    padding: '15px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    backgroundColor: 'white',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    ':hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  {editingLevel?.id === level.id ? (
                    <div>
                      <input
                        type="text"
                        value={editingLevel.title}
                        onChange={(e) => setEditingLevel({ ...editingLevel, title: e.target.value })}
                        style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
                      />
                      <textarea
                        value={editingLevel.description}
                        onChange={(e) => setEditingLevel({ ...editingLevel, description: e.target.value })}
                        style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
                      />
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          onClick={() => handleUpdateLevel(level.id)}
                          style={{
                            padding: '5px 10px',
                            backgroundColor: '#2196F3',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingLevel(null)}
                          style={{
                            padding: '5px 10px',
                            backgroundColor: '#9e9e9e',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 style={{ margin: '0 0 10px 0' }}>{level.title}</h3>
                      <p style={{ margin: '0 0 10px 0' }}>{level.description}</p>
                      <p style={{ margin: '0 0 10px 0' }}>Difficulty: {'⭐'.repeat(level.difficulty)}</p>
                      <p style={{ margin: '0 0 10px 0' }}>
                        Inputs: {level.inputs.length}, Outputs: {level.outputs.length}
                      </p>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          onClick={() => setEditingLevel(level)}
                          style={{
                            padding: '5px 10px',
                            backgroundColor: '#2196F3',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteLevel(level.id)}
                          style={{
                            padding: '5px 10px',
                            backgroundColor: '#f44336',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard; 