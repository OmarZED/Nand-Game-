import React, { useCallback, useState } from 'react';
import { ReactFlow, Controls, Background } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Gate Components
import InputNode from './components/gates/InputNode';
import OutputNode from './components/gates/OutputNode';
import InverterNode from './components/gates/InverterNode';
import AndGate from './components/gates/AndGate';
import OrGate from './components/gates/OrGate';
import NandGate from './components/gates/NandGate';
import NorGate from './components/gates/NorGate';
import XorGate from './components/gates/XorGate';
import XnorGate from './components/gates/XnorGate';

// Sidebar and Level Components
import LevelSidebar from './components/LevelSidebar';
import LevelSelect from './components/ui/LevelSelect';

// Hooks and Data
import { useGameLogic } from './hooks/useGameLogic';
import { levels } from './levels';

// Context
import { DnDProvider } from './contexts/DnDContext';

// Define node types for React Flow
const nodeTypes = {
  input: InputNode,
  output: OutputNode,
  inverter: InverterNode,
  and: AndGate,
  or: OrGate,
  nand: NandGate,
  nor: NorGate,
  xor: XorGate,
  xnor: XnorGate,
};

const InverterGame = () => {
  const {
    currentLevelId,
    currentLevel,
    showLevelSelect,
    setShowLevelSelect,
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    handleLevelSelect,
    toggleInput,
    checkSolution,
  } = useGameLogic();

  const [feedback, setFeedback] = useState(null);

  // Handle check button
  const handleCheck = () => {
    const result = checkSolution();
    setFeedback(result);
    setTimeout(() => setFeedback(null), 4000);
  };

  // Handle dropping new nodes
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const gateType = event.dataTransfer.getData('application/reactflow');
      if (!gateType || !nodeTypes[gateType]) return;

      const position = {
        x: event.clientX,
        y: event.clientY,
      };

      const newNode = {
        id: `${nodes.length + 1}`,
        type: gateType,
        position,
        data: {
          label: `${gateType.charAt(0).toUpperCase() + gateType.slice(1)} Gate`,
        },
      };

      onNodesChange([{ type: 'add', item: newNode }]);
    },
    [nodes, nodeTypes, onNodesChange]
  );

  // Allow dragging over canvas
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      {/* Sidebar */}
      <LevelSidebar
        title={currentLevel.title}
        description={currentLevel.description}
      />

      {/* Main Content */}
      <div style={{ flex: 1, position: 'relative' }}>
        {/* Game Controls */}
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

        {/* Canvas */}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          <Background />
          <Controls />
        </ReactFlow>

        {/* Feedback */}
        {feedback && (
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              backgroundColor: feedback.success ? '#d0f8ce' : '#ffcccb',
              padding: '1rem',
              borderRadius: '6px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
              zIndex: 20,
              maxWidth: '300px',
            }}
          >
            {feedback.message}
          </div>
        )}

        {/* Level Selector Overlay */}
        {showLevelSelect && (
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
              onSelectLevel={handleLevelSelect}
              style={{ zIndex: 20 }}
            />
          </>
        )}
      </div>
    </div>
  );
};

// Wrap everything in DnDProvider
export default function App() {
  return (
    <DnDProvider>
      <InverterGame />
    </DnDProvider>
  );
}