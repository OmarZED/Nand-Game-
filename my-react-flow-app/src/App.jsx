import { ReactFlow, Controls, Background } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { InputNode, InverterNode, OutputNode, AndGate, OrGate } from './components/gates';
import { levels } from './levels';
import LevelSelect from './components/ui/LevelSelect';
import { useGameLogic } from './hooks/useGameLogic';

const nodeTypes = {
  input: InputNode,
  inverter: InverterNode,
  output: OutputNode,
  and: AndGate,
  or: OrGate
};

/**
 * Main game component that handles the logic gate puzzle game
 * Manages game state, level progression, and circuit validation
 */
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
    checkSolution
  } = useGameLogic();

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      {/* Game controls and level information */}
      <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10 }}>
        <h2>{currentLevel.title}</h2>
        <p>{currentLevel.description}</p>
        {/* Render different input controls based on level */}
        {currentLevelId === 'level1' ? (
          <button onClick={() => toggleInput('input')} style={{ marginRight: '10px' }}>Toggle Input</button>
        ) : (
          <div>
            <button onClick={() => toggleInput('input1')} style={{ marginRight: '10px' }}>Toggle Input 1</button>
            <button onClick={() => toggleInput('input2')} style={{ marginRight: '10px' }}>Toggle Input 2</button>
          </div>
        )}
        <button onClick={checkSolution} style={{ marginRight: '10px' }}>Check Solution</button>
        <button onClick={() => setShowLevelSelect(true)}>Select Level</button>
      </div>

      {/* Main React Flow canvas */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>

      {/* Level selection overlay */}
      {showLevelSelect && (
        <>
          <div className="level-select-overlay" onClick={() => setShowLevelSelect(false)} />
          <LevelSelect
            levels={levels}
            currentLevelId={currentLevelId}
            onSelectLevel={handleLevelSelect}
          />
        </>
      )}
    </div>
  );
};

export default InverterGame;