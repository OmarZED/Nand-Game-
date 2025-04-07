import { Handle, Position } from '@xyflow/react';

const XorGate = () => {
  return (
    <div className="xor-gate">
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
      <div className="gate-content">XOR</div>
      <Handle
        type="source"
        position={Position.Right}
        style={{ top: '50%' }}
      />
    </div>
  );
};

export default XorGate; 