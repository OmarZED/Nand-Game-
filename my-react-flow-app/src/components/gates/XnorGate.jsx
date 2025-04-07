import { Handle, Position } from '@xyflow/react';

const XnorGate = () => {
  return (
    <div className="xnor-gate">
      <Handle
        type="target"
        position={Position.Left}
        id="a"
        style={{ top: '30%' }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="b"
        style={{ top: '70%' }}
      />
      <div className="gate-content">XNOR</div>
      <Handle
        type="source"
        position={Position.Right}
        style={{ top: '50%' }}
      />
    </div>
  );
};

export default XnorGate; 