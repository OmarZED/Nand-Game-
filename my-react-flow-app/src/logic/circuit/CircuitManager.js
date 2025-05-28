import { useState, useCallback, useEffect } from 'react';
import { useNodesState, useEdgesState, addEdge } from '@xyflow/react';

export const useCircuitManager = (level) => {
  // Circuit state
  const [nodes, setNodes, onNodesChange] = useNodesState(level.initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [inputValues, setInputValues] = useState({});

  // Initialize circuit when level changes
  useEffect(() => {
    const initialValues = {};
    level.initialNodes.forEach(node => {
      if (node.type === 'input') {
        initialValues[node.id] = node.data.value;
      }
    });
    setInputValues(initialValues);
    setNodes(level.initialNodes);
    setEdges([]);
  }, [level, setNodes, setEdges]);

  // Calculate gate output based on input values
  const calculateGateOutput = useCallback((gateType, inputValues) => {
    switch (gateType) {
      case 'and':
        return inputValues.every(v => v === 1) ? 1 : 0;
      case 'or':
        return inputValues.some(v => v === 1) ? 1 : 0;
      case 'nand':
        return inputValues.every(v => v === 1) ? 0 : 1;
      case 'nor':
        return inputValues.some(v => v === 1) ? 0 : 1;
      case 'xor':
        return inputValues.filter(v => v === 1).length % 2 === 1 ? 1 : 0;
      case 'xnor':
        return inputValues.filter(v => v === 1).length % 2 === 0 ? 1 : 0;
      case 'inverter':
        return inputValues[0] === 1 ? 0 : 1;
      default:
        return null;
    }
  }, []);

  // Get node value considering gate logic
  const getNodeValue = useCallback((nodeId, nds, eds) => {
    const node = nds.find(n => n.id === nodeId);
    if (!node) return null;

    // If it's an input node, return its value
    if (node.type === 'input') {
      return inputValues[nodeId] ?? 0;
    }

    // If it's a gate, calculate its output
    if (['and', 'or', 'nand', 'nor', 'xor', 'xnor', 'inverter'].includes(node.type)) {
      const incomingEdges = eds.filter(edge => edge.target === nodeId);
      const inputValues = incomingEdges.map(edge => {
        const sourceNode = nds.find(n => n.id === edge.source);
        return sourceNode ? getNodeValue(sourceNode.id, nds, eds) : 0;
      });
      return calculateGateOutput(node.type, inputValues);
    }

    // For other nodes, return their current value
    return node.data.value;
  }, [inputValues, calculateGateOutput]);

  // Update output signals when circuit changes
  const updateOutputSignals = useCallback(() => {
    setNodes((nds) => {
      return nds.map((node) => {
        if (node.type === 'output') {
          const incomingEdges = edges.filter(edge => edge.target === node.id);
          if (incomingEdges.length === 0) {
            return { ...node, data: { ...node.data, value: null } };
          }

          const sourceNodeId = incomingEdges[0].source;
          const newValue = getNodeValue(sourceNodeId, nds, edges);

          return {
            ...node,
            data: {
              ...node.data,
              value: newValue
            }
          };
        }
        return node;
      });
    });
  }, [edges, getNodeValue, setNodes]);

  // Update output signals when edges or input values change
  useEffect(() => {
    updateOutputSignals();
  }, [edges, inputValues, updateOutputSignals]);

  // Handle connections
  const onConnect = useCallback((params) => {
    const edge = {
      ...params,
      animated: true,
      style: { stroke: '#2196F3' },
      className: 'animated'
    };
    
    setEdges((eds) => addEdge(edge, eds));
  }, [setEdges]);

  // Toggle input values
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

  return {
    // Circuit state
    nodes,
    edges,
    inputValues,
    
    // Circuit actions
    onNodesChange,
    onEdgesChange,
    onConnect,
    toggleInput,
    
    // Circuit operations
    setNodes,
    setEdges,
    setInputValues
  };
}; 