import { useState, useCallback } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
  Background,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Modified Input Node with signal indicator
const InputNode = ({ data }) => {
  const signalClass = data.value === 1 ? 'signal-high' : 'signal-low';
  return (
    <div className={`input-node ${signalClass}`}>
      <div>
        Input: <span className="signal-indicator"></span>
        {data.value}
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

// Custom Inverter Node
const InverterNode = () => {
  return (
    <div className="inverter-node">
      <Handle type="target" position={Position.Left} />
      <div>INV</div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

// Modified Output Node with signal indicator
const OutputNode = ({ data }) => {
  const signalClass = data.value !== null ? (data.value === 1 ? 'signal-high' : 'signal-low') : '';
  return (
    <div className={`output-node ${signalClass}`}>
      <Handle type="target" position={Position.Left} />
      <div>
        Output: {data.value !== null && <span className="signal-indicator"></span>}
        {data.value !== null ? data.value : '?'}
      </div>
    </div>
  );
};

const nodeTypes = {
  input: InputNode,
  inverter: InverterNode,
  output: OutputNode
};

const initialNodes = [
  {
    id: 'input',
    type: 'input',
    data: { value: 0 },
    position: { x: 100, y: 100 },
  },
  {
    id: 'inverter',
    type: 'inverter',
    data: {},
    position: { x: 300, y: 100 },
  },
  {
    id: 'output',
    type: 'output',
    data: { value: null },
    position: { x: 500, y: 100 },
  },
];

const InverterGame = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [inputValue, setInputValue] = useState(0);

  const onConnect = useCallback((params) => {
    // Modified to add animation and styling to edges
    const edge = {
      ...params,
      animated: true,
      style: { stroke: '#2196F3' },
      className: 'animated'
    };
    setEdges((eds) => addEdge(edge, eds));
    updateOutput();
  }, [setEdges]);

  const updateOutput = () => {
    const hasInputToInverter = edges.some(e => e.source === 'input' && e.target === 'inverter');
    const hasInverterToOutput = edges.some(e => e.source === 'inverter' && e.target === 'output');

    if (hasInputToInverter && hasInverterToOutput) {
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

      // Update edge styles based on signal values
      setEdges((eds) =>
        eds.map((edge) => ({
          ...edge,
          className: `animated ${edge.source === 'input' ? 
            (inputValue === 1 ? 'signal-high' : 'signal-low') :
            (inputValue === 0 ? 'signal-high' : 'signal-low')}`
        }))
      );
    }
  };

  const toggleInput = () => {
    const newValue = inputValue === 0 ? 1 : 0;
    setInputValue(newValue);
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === 'input') {
          return { ...node, data: { value: newValue } };
        }
        if (node.id === 'output' && edges.some(e => e.source === 'inverter' && e.target === 'output')) {
          return { ...node, data: { value: newValue === 0 ? 1 : 0 } };
        }
        return node;
      })
    );
    
    // Update edge styles when input toggles
    setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        className: `animated ${edge.source === 'input' ? 
          (newValue === 1 ? 'signal-high' : 'signal-low') :
          (newValue === 0 ? 'signal-high' : 'signal-low')}`
      }))
    );
  };

  const checkSolution = () => {
    const outputNode = nodes.find(n => n.id === 'output');
    const inputNode = nodes.find(n => n.id === 'input');
    
    if (outputNode.data.value === null) {
      alert('Complete the circuit first!');
      return;
    }

    const isCorrect = 
      (inputNode.data.value === 0 && outputNode.data.value === 1) || 
      (inputNode.data.value === 1 && outputNode.data.value === 0);

    alert(isCorrect ? 'Correct!' : 'Try again!');
  };

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10 }}>
        <button onClick={toggleInput} style={{ marginRight: '10px' }}>Toggle Input</button>
        <button onClick={checkSolution}>Check Solution</button>
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
    </div>
  );
};

export default InverterGame;