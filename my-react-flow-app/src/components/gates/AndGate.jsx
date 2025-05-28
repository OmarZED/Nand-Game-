import { Handle, Position } from '@xyflow/react';

const AndGate = ({ preview }) => {
  return (
    <div className={`and-gate ${preview ? 'preview-mode' : ''}`}>
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
      <div className="gate-content">AND</div>
      <Handle
        type="source"
        position={Position.Right}
        style={{ top: '50%' }}
      />
    </div>
  );
};

export default AndGate;