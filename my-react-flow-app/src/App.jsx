import { useState, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
  Background,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { InputNode, InverterNode, OutputNode, AndGate } from './components/gates';
import { levels, getLevelById } from './levels';
import LevelSelect from './components/ui/LevelSelect';

const nodeTypes = {
  input: InputNode,
  inverter: InverterNode,
  output: OutputNode,
  and: AndGate
};

const InverterGame = () => {
  const [currentLevelId, setCurrentLevelId] = useState(levels[0].id);
  const [showLevelSelect, setShowLevelSelect] = useState(false);
  const currentLevel = getLevelById(currentLevelId);
  
  const [nodes, setNodes, onNodesChange] = useNodesState(currentLevel.initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [inputValues, setInputValues] = useState({});

  // Initialize input values when level changes
  useEffect(() => {
    const initialValues = {};
    currentLevel.initialNodes.forEach(node => {
      if (node.type === 'input') {
        initialValues[node.id] = node.data.value;
      }
    });
    setInputValues(initialValues);
    setNodes(currentLevel.initialNodes);
    setEdges([]);
  }, [currentLevelId, currentLevel, setNodes, setEdges]);

  const handleLevelSelect = (levelId) => {
    setCurrentLevelId(levelId);
    setShowLevelSelect(false);
  };

  const onConnect = useCallback((params) => {
    const edge = {
      ...params,
      animated: true,
      style: { stroke: '#2196F3' },
      className: 'animated'
    };
    setEdges((eds) => addEdge(edge, eds));
    // Update output after connection is made
    setTimeout(() => updateOutput(), 0);
  }, [setEdges]);

  const updateOutput = useCallback(() => {
    if (currentLevelId === 'level1') {
      // NOT gate logic
      const hasInputToInverter = edges.some(e => e.source === 'input' && e.target === 'inverter');
      const hasInverterToOutput = edges.some(e => e.source === 'inverter' && e.target === 'output');

      if (hasInputToInverter && hasInverterToOutput) {
        const inputValue = inputValues['input'] || 0;
        setNodes((nds) =>
          nds.map((node) => {
            if (node.id === 'output') {
              return {
                ...node,
                data: { value: inputValue === 0 ? 1 : 0 }
              };
            }
            return node;
          })
        );
      }
    } else if (currentLevelId === 'level2') {
      // AND gate logic
      const hasInput1ToAnd = edges.some(e => e.source === 'input1' && e.target === 'and');
      const hasInput2ToAnd = edges.some(e => e.source === 'input2' && e.target === 'and');
      const hasAndToOutput = edges.some(e => e.source === 'and' && e.target === 'output');

      if (hasInput1ToAnd && hasInput2ToAnd && hasAndToOutput) {
        const input1Value = inputValues['input1'] || 0;
        const input2Value = inputValues['input2'] || 0;
        const andOutput = input1Value === 1 && input2Value === 1 ? 1 : 0;

        setNodes((nds) =>
          nds.map((node) => {
            if (node.id === 'output') {
              return {
                ...node,
                data: { value: andOutput }
              };
            }
            return node;
          })
        );
      }
    }
  }, [currentLevelId, edges, inputValues, setNodes]);

  // Update output whenever edges or input values change
  useEffect(() => {
    updateOutput();
  }, [edges, inputValues, updateOutput]);

  const toggleInput = (inputId) => {
    setInputValues(prev => {
      const newValue = prev[inputId] === 0 ? 1 : 0;
      // Update the node value immediately with the new value
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === inputId) {
            return { ...node, data: { value: newValue } };
          }
          return node;
        })
      );
      return { ...prev, [inputId]: newValue };
    });
  };

  const checkSolution = () => {
    const outputNode = nodes.find(n => n.id === 'output');
    
    if (outputNode.data.value === null) {
      alert('Complete the circuit first!');
      return;
    }

    let isCorrect = false;
    if (currentLevelId === 'level1') {
      // NOT gate validation
      const inputNode = nodes.find(n => n.id === 'input');
      const hasInputToInverter = edges.some(e => e.source === 'input' && e.target === 'inverter');
      const hasInverterToOutput = edges.some(e => e.source === 'inverter' && e.target === 'output');

      isCorrect = hasInputToInverter && 
                 hasInverterToOutput && 
                 ((inputNode.data.value === 0 && outputNode.data.value === 1) || 
                  (inputNode.data.value === 1 && outputNode.data.value === 0));
    } else if (currentLevelId === 'level2') {
      // AND gate validation
      const input1Node = nodes.find(n => n.id === 'input1');
      const input2Node = nodes.find(n => n.id === 'input2');
      const hasInput1ToAnd = edges.some(e => e.source === 'input1' && e.target === 'and');
      const hasInput2ToAnd = edges.some(e => e.source === 'input2' && e.target === 'and');
      const hasAndToOutput = edges.some(e => e.source === 'and' && e.target === 'output');

      // Check if all connections are made
      const allConnectionsMade = hasInput1ToAnd && hasInput2ToAnd && hasAndToOutput;

      // Check if the output matches the AND gate truth table
      const correctOutput = (input1Node.data.value === 1 && input2Node.data.value === 1) ? 1 : 0;
      const outputMatches = outputNode.data.value === correctOutput;

      isCorrect = allConnectionsMade && outputMatches;
    }

    if (isCorrect) {
      alert('Correct! You can now move to the next level!');
      setShowLevelSelect(true);
    } else {
      if (currentLevelId === 'level1') {
        alert('Try again! Make sure you have connected the input to the inverter and the inverter to the output.');
      } else {
        alert('Try again! Make sure you have connected both inputs to the AND gate and the AND gate to the output.');
      }
    }
  };

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10 }}>
        <h2>{currentLevel.title}</h2>
        <p>{currentLevel.description}</p>
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