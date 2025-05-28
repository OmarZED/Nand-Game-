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
      const inputNodes = nodes.filter(n => n.type === 'input');
      const andGates = nodes.filter(n => n.type === 'and');
      const outputNode = nodes.find(n => n.type === 'output');
    
      let outputSet = false;
    
      for (const andGate of andGates) {
        const hasAllInputsToAnd = inputNodes.every(input =>
          edges.some(e => e.source === input.id && e.target === andGate.id)
        );
    
        const hasAndToOutput = edges.some(e =>
          e.source === andGate.id && e.target === outputNode?.id
        );
    
        if (hasAllInputsToAnd && hasAndToOutput) {
          // Get input values dynamically from input IDs
          const inputValuesList = inputNodes.map(n => inputValues[n.id] || 0);
          const andOutput = inputValuesList.every(v => v === 1) ? 1 : 0;
    
          setNodes((nds) =>
            nds.map((node) => {
              if (node.id === outputNode.id) {
                return {
                  ...node,
                  data: { value: andOutput }
                };
              }
              return node;
            })
          );
    
          outputSet = true;
          break;
        }
      }
    
      if (!outputSet && outputNode) {
        setNodes((nds) =>
          nds.map((node) => {
            if (node.id === outputNode.id) {
              return {
                ...node,
                data: { value: null }
              };
            }
            return node;
          })
        );
      }
    } else if (currentLevelId === 'level3') {
      const inputNodes = nodes.filter(n => n.type === 'input');
      const orGates = nodes.filter(n => n.type === 'or');
      const outputNode = nodes.find(n => n.type === 'output');
    
      let outputSet = false;
    
      for (const orGate of orGates) {
        const hasAllInputsToOr = inputNodes.every(input =>
          edges.some(e => e.source === input.id && e.target === orGate.id)
        );
    
        const hasOrToOutput = edges.some(e =>
          e.source === orGate.id && e.target === outputNode?.id
        );
    
        if (hasAllInputsToOr && hasOrToOutput) {
          // Calculate OR output from dynamic input values
          const inputValuesList = inputNodes.map(n => inputValues[n.id] || 0);
          const orOutput = inputValuesList.some(v => v === 1) ? 1 : 0;
    
          setNodes((nds) =>
            nds.map((node) => {
              if (node.id === outputNode.id) {
                return {
                  ...node,
                  data: { value: orOutput }
                };
              }
              return node;
            })
          );
    
          outputSet = true;
          break;
        }
      }
    
      if (!outputSet && outputNode) {
        setNodes((nds) =>
          nds.map((node) => {
            if (node.id === outputNode.id) {
              return {
                ...node,
                data: { value: null }
              };
            }
            return node;
          })
        );
      }
    } else if (currentLevelId === 'level4') {
      const inputNodes = nodes.filter(n => n.type === 'input');
      const nandGates = nodes.filter(n => n.type === 'nand');
      const outputNode = nodes.find(n => n.type === 'output');
    
      let outputSet = false;
    
      for (const nandGate of nandGates) {
        const hasAllInputsToNand = inputNodes.every(input =>
          edges.some(e => e.source === input.id && e.target === nandGate.id)
        );
    
        const hasNandToOutput = edges.some(e =>
          e.source === nandGate.id && e.target === outputNode?.id
        );
    
        if (hasAllInputsToNand && hasNandToOutput) {
          const inputValuesList = inputNodes.map(n => inputValues[n.id] || 0);
          const andResult = inputValuesList.every(v => v === 1) ? 1 : 0;
          const nandOutput = andResult === 1 ? 0 : 1;
    
          setNodes((nds) =>
            nds.map((node) => {
              if (node.id === outputNode.id) {
                return {
                  ...node,
                  data: { value: nandOutput }
                };
              }
              return node;
            })
          );
    
          outputSet = true;
          break;
        }
      }
    
      if (!outputSet && outputNode) {
        setNodes((nds) =>
          nds.map((node) => {
            if (node.id === outputNode.id) {
              return {
                ...node,
                data: { value: null }
              };
            }
            return node;
          })
        );
      }
    } else if (currentLevelId === 'level5') {
      const inputNodes = nodes.filter(n => n.type === 'input');
      const norGates = nodes.filter(n => n.type === 'nor');
      const outputNode = nodes.find(n => n.type === 'output');
    
      let outputSet = false;
    
      for (const norGate of norGates) {
        const hasAllInputsToNor = inputNodes.every(input =>
          edges.some(e => e.source === input.id && e.target === norGate.id)
        );
    
        const hasNorToOutput = edges.some(e =>
          e.source === norGate.id && e.target === outputNode?.id
        );
    
        if (hasAllInputsToNor && hasNorToOutput) {
          const inputValuesList = inputNodes.map(n => inputValues[n.id] || 0);
          const orResult = inputValuesList.some(v => v === 1) ? 1 : 0;
          const norOutput = orResult === 1 ? 0 : 1;
    
          setNodes((nds) =>
            nds.map((node) => {
              if (node.id === outputNode.id) {
                return {
                  ...node,
                  data: { value: norOutput }
                };
              }
              return node;
            })
          );
    
          outputSet = true;
          break;
        }
      }
    
      if (!outputSet && outputNode) {
        setNodes((nds) =>
          nds.map((node) => {
            if (node.id === outputNode.id) {
              return {
                ...node,
                data: { value: null }
              };
            }
            return node;
          })
        );
      }
    } else if (currentLevelId === 'level6') {
      const inputNodes = nodes.filter(n => n.type === 'input');
      const xorGates = nodes.filter(n => n.type === 'xor');
      const outputNode = nodes.find(n => n.type === 'output');
    
      let outputSet = false;
    
      for (const xorGate of xorGates) {
        const hasAllInputsToXor = inputNodes.every(input =>
          edges.some(e => e.source === input.id && e.target === xorGate.id)
        );
    
        const hasXorToOutput = edges.some(e =>
          e.source === xorGate.id && e.target === outputNode?.id
        );
    
        if (hasAllInputsToXor && hasXorToOutput) {
          const input1Value = inputValues['input1'] || 0;
          const input2Value = inputValues['input2'] || 0;
          const xorOutput = input1Value !== input2Value ? 1 : 0;
    
          setNodes((nds) =>
            nds.map((node) => {
              if (node.id === outputNode.id) {
                return {
                  ...node,
                  data: { value: xorOutput }
                };
              }
              return node;
            })
          );
    
          outputSet = true;
          break;
        }
      }
    
      if (!outputSet && outputNode) {
        setNodes((nds) =>
          nds.map((node) => {
            if (node.id === outputNode.id) {
              return {
                ...node,
                data: { value: null }
              };
            }
            return node;
          })
        );
      }
    } else if (currentLevelId === 'level7') {
      const inputNodes = nodes.filter(n => n.type === 'input');
      const xnorGates = nodes.filter(n => n.type === 'xnor');
      const outputNode = nodes.find(n => n.type === 'output');
    
      let outputSet = false;
    
      for (const xnorGate of xnorGates) {
        const hasAllInputsToXnor = inputNodes.every(input =>
          edges.some(e => e.source === input.id && e.target === xnorGate.id)
        );
    
        const hasXnorToOutput = edges.some(e =>
          e.source === xnorGate.id && e.target === outputNode?.id
        );
    
        if (hasAllInputsToXnor && hasXnorToOutput) {
          const input1Value = inputValues['input1'] || 0;
          const input2Value = inputValues['input2'] || 0;
          const xnorOutput = input1Value === input2Value ? 1 : 0;
    
          setNodes((nds) =>
            nds.map((node) => {
              if (node.id === outputNode.id) {
                return {
                  ...node,
                  data: { value: xnorOutput }
                };
              }
              return node;
            })
          );
    
          outputSet = true;
          break;
        }
      }
    
      if (!outputSet && outputNode) {
        setNodes((nds) =>
          nds.map((node) => {
            if (node.id === outputNode.id) {
              return {
                ...node,
                data: { value: null }
              };
            }
            return node;
          })
        );
      }
    } else if (currentLevelId === 'level8') {
      // Check all required connections
      const hasInput1ToNand1 = edges.some(e => e.source === 'input1' && e.target === 'nand1');
      const hasInput1ToNand2 = edges.some(e => e.source === 'input1' && e.target === 'nand2');
      const hasInput2ToNand1 = edges.some(e => e.source === 'input2' && e.target === 'nand1');
      const hasInput2ToNand2 = edges.some(e => e.source === 'input2' && e.target === 'nand2');
      const hasNand1ToAnd1 = edges.some(e => e.source === 'nand1' && e.target === 'and1');
      const hasNand2ToOr1 = edges.some(e => e.source === 'nand2' && e.target === 'or1');
      const hasAnd1ToOr1 = edges.some(e => e.source === 'and1' && e.target === 'or1');
      const hasOr1ToOutput = edges.some(e => e.source === 'or1' && e.target === 'output');

      if (hasInput1ToNand1 && hasInput1ToNand2 && hasInput2ToNand1 && 
          hasInput2ToNand2 && hasNand1ToAnd1 && hasNand2ToOr1 && 
          hasAnd1ToOr1 && hasOr1ToOutput) {
        const input1Value = inputValues['input1'] || 0;
        const input2Value = inputValues['input2'] || 0;

        // Calculate NAND gate outputs
        const nand1Output = !(input1Value && input2Value) ? 1 : 0;
        const nand2Output = !(input1Value && input2Value) ? 1 : 0;

        // Calculate AND gate output
        const and1Output = nand1Output && input2Value ? 1 : 0;

        // Calculate OR gate output
        const or1Output = and1Output || nand2Output ? 1 : 0;

        setNodes((nds) =>
          nds.map((node) => {
            if (node.id === 'output') {
              return {
                ...node,
                data: { value: or1Output }
              };
            }
            return node;
          })
        );
      }
    }
    else if (currentLevelId === 'level9') {
      // Level 9 logic
      const hasInput1ToNand1 = edges.some(e => e.source === 'input1' && e.target === 'nand1');
      const hasInput2ToNand1 = edges.some(e => e.source === 'input2' && e.target === 'nand1');
      const hasNand1ToAnd1 = edges.some(e => e.source === 'nand1' && e.target === 'and1');
      const hasAnd1ToOr1 = edges.some(e => e.source === 'and1' && e.target === 'or1');
      const hasOr1ToOutput = edges.some(e => e.source === 'or1' && e.target === 'output');

      if (hasInput1ToNand1 && hasInput2ToNand1 && hasNand1ToAnd1 && hasAnd1ToOr1 && hasOr1ToOutput) {
        const input1Value = inputValues['input1'] || 0;
        const input2Value = inputValues['input2'] || 0;

        // NAND1 output
        const nand1Output = !(input1Value && input2Value) ? 1 : 0;
        // AND1 output
        const and1Output = nand1Output && input2Value ? 1 : 0;
        // OR1 output
        const or1Output = and1Output || input1Value ? 1 : 0;

        setNodes((nds) =>
          nds.map((node) => {
            if (node.id === 'output') {
              return {
                ...node,
                data: { value: or1Output }
              };
            }
            return node;
          })
        );
      }
    }
    // --- Half Adder Logic ---
    else if (currentLevelId === 'levelHalfAdder') {
      // Check required connections for half adder
      const hasInputAToXor1 = edges.some(e => e.source === 'input1' && e.target === 'xor1');
      const hasInputBToXor1 = edges.some(e => e.source === 'input2' && e.target === 'xor1');
      const hasInputAToAnd1 = edges.some(e => e.source === 'input1' && e.target === 'and1');
      const hasInputBToAnd1 = edges.some(e => e.source === 'input2' && e.target === 'and1');
      const hasXor1ToOutputL = edges.some(e => e.source === 'xor1' && e.target === 'outputL');
      const hasAnd1ToOutputH = edges.some(e => e.source === 'and1' && e.target === 'outputH');

      if (
        hasInputAToXor1 && hasInputBToXor1 &&
        hasInputAToAnd1 && hasInputBToAnd1 &&
        hasXor1ToOutputL && hasAnd1ToOutputH
      ) {
        const inputA = inputValues['input1'] || 0;
        const inputB = inputValues['input2'] || 0;
        const sum = inputA ^ inputB; // XOR for sum
        const carry = inputA & inputB; // AND for carry

        setNodes((nds) =>
          nds.map((node) => {
            if (node.id === 'outputL') {
              return {
                ...node,
                data: { ...node.data, value: sum }
              };
            }
            if (node.id === 'outputH') {
              return {
                ...node,
                data: { ...node.data, value: carry }
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