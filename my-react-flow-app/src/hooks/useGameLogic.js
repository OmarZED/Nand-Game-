import { useState, useCallback, useEffect } from 'react';
import { useNodesState, useEdgesState, addEdge } from '@xyflow/react';
import { levels, getLevelById, validateCircuit } from '../levels';

export const useGameLogic = () => {
  // Game state management
  const [currentLevelId, setCurrentLevelId] = useState(levels[0].id);
  const [showLevelSelect, setShowLevelSelect] = useState(false);
  const currentLevel = getLevelById(currentLevelId);
  
  // React Flow state management
  const [nodes, setNodes, onNodesChange] = useNodesState(currentLevel.initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [inputValues, setInputValues] = useState({});

  // Initialize level state when level changes
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

  const handleLevelSelect = useCallback((levelId) => {
    setCurrentLevelId(levelId);
    setShowLevelSelect(false);
  }, []);

  const onConnect = useCallback((params) => {
    const edge = {
      ...params,
      animated: true,
      style: { stroke: '#2196F3' },
      className: 'animated'
    };
    
    const isHighSignal = inputValues[params.source] === 1 && inputValues[params.target] === 1;
    const edgeClass = isHighSignal ? 'signal-high' : 'signal-low';
    edge.className = `${edge.className} ${edgeClass}`;

    setEdges((eds) => addEdge(edge, eds));
    setTimeout(() => updateOutput(), 0);
  }, [setEdges, inputValues]);

  const updateOutput = useCallback(() => {
    if (currentLevelId === 'level1') {
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
    } else if (currentLevelId === 'level3') {
      const hasInput1ToOr = edges.some(e => e.source === 'input1' && e.target === 'or');
      const hasInput2ToOr = edges.some(e => e.source === 'input2' && e.target === 'or');
      const hasOrToOutput = edges.some(e => e.source === 'or' && e.target === 'output');

      if (hasInput1ToOr && hasInput2ToOr && hasOrToOutput) {
        const input1Value = inputValues['input1'] || 0;
        const input2Value = inputValues['input2'] || 0;
        const orOutput = input1Value === 1 || input2Value === 1 ? 1 : 0;

        setNodes((nds) =>
          nds.map((node) => {
            if (node.id === 'output') {
              return {
                ...node,
                data: { value: orOutput }
              };
            }
            return node;
          })
        );
      }
    } else if (currentLevelId === 'level4') {
      const hasInput1ToNand = edges.some(e => e.source === 'input1' && e.target === 'nand');
      const hasInput2ToNand = edges.some(e => e.source === 'input2' && e.target === 'nand');
      const hasNandToOutput = edges.some(e => e.source === 'nand' && e.target === 'output');

      if (hasInput1ToNand && hasInput2ToNand && hasNandToOutput) {
        const input1Value = inputValues['input1'] || 0;
        const input2Value = inputValues['input2'] || 0;
        // NAND gate output is the inverse of AND gate
        const nandOutput = (input1Value === 1 && input2Value === 1) ? 0 : 1;

        setNodes((nds) =>
          nds.map((node) => {
            if (node.id === 'output') {
              return {
                ...node,
                data: { value: nandOutput }
              };
            }
            return node;
          })
        );
      }
    } else if (currentLevelId === 'level5') {
      const hasInput1ToNor = edges.some(e => e.source === 'input1' && e.target === 'nor');
      const hasInput2ToNor = edges.some(e => e.source === 'input2' && e.target === 'nor');
      const hasNorToOutput = edges.some(e => e.source === 'nor' && e.target === 'output');

      if (hasInput1ToNor && hasInput2ToNor && hasNorToOutput) {
        const input1Value = inputValues['input1'] || 0;
        const input2Value = inputValues['input2'] || 0;
        // NOR gate output is 1 only when both inputs are 0
        const norOutput = (input1Value === 0 && input2Value === 0) ? 1 : 0;

        setNodes((nds) =>
          nds.map((node) => {
            if (node.id === 'output') {
              return {
                ...node,
                data: { value: norOutput }
              };
            }
            return node;
          })
        );
      }
    } else if (currentLevelId === 'level6') {
      const hasInput1ToXor = edges.some(e => e.source === 'input1' && e.target === 'xor');
      const hasInput2ToXor = edges.some(e => e.source === 'input2' && e.target === 'xor');
      const hasXorToOutput = edges.some(e => e.source === 'xor' && e.target === 'output');

      if (hasInput1ToXor && hasInput2ToXor && hasXorToOutput) {
        const input1Value = inputValues['input1'] || 0;
        const input2Value = inputValues['input2'] || 0;
        // XOR gate output is 1 when inputs are different, 0 when they are the same
        const xorOutput = input1Value !== input2Value ? 1 : 0;

        setNodes((nds) =>
          nds.map((node) => {
            if (node.id === 'output') {
              return {
                ...node,
                data: { value: xorOutput }
              };
            }
            return node;
          })
        );
      }
    } else if (currentLevelId === 'level7') {
      const hasInput1ToXnor = edges.some(e => e.source === 'input1' && e.target === 'xnor');
      const hasInput2ToXnor = edges.some(e => e.source === 'input2' && e.target === 'xnor');
      const hasXnorToOutput = edges.some(e => e.source === 'xnor' && e.target === 'output');

      if (hasInput1ToXnor && hasInput2ToXnor && hasXnorToOutput) {
        const input1Value = inputValues['input1'] || 0;
        const input2Value = inputValues['input2'] || 0;
        // XNOR gate output is 1 when inputs are the same, 0 when they are different
        const xnorOutput = input1Value === input2Value ? 1 : 0;

        setNodes((nds) =>
          nds.map((node) => {
            if (node.id === 'output') {
              return {
                ...node,
                data: { value: xnorOutput }
              };
            }
            return node;
          })
        );
      }
    }
  }, [currentLevelId, edges, inputValues, setNodes]);

  useEffect(() => {
    updateOutput();
  }, [edges, inputValues, updateOutput]);

  const toggleInput = useCallback((inputId) => {
    setInputValues(prev => {
      const newValue = prev[inputId] === 0 ? 1 : 0;
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
  }, [setNodes]);

  const checkSolution = useCallback(() => {
    const circuitState = { nodes, edges };
    const result = validateCircuit(currentLevel, circuitState);

    if (result.success) {
      alert(result.message);
      setShowLevelSelect(true);
    } else {
      alert(result.message);
    }
  }, [currentLevel, nodes, edges]);

  return {
    // Game state
    currentLevelId,
    currentLevel,
    showLevelSelect,
    setShowLevelSelect,
    
    // Flow state
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    
    // Game actions
    handleLevelSelect,
    toggleInput,
    checkSolution
  };
}; 