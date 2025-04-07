import { Handle, Position } from '@xyflow/react';

const OrGate = () => {
  return (
    <div className="or-gate">
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
      <div className="gate-content">OR</div>
      <Handle
        type="source"
        position={Position.Right}
        style={{ top: '50%' }}
      />
    </div>
  );
};

export default OrGate; 