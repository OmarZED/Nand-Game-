import { Handle, Position } from '@xyflow/react';

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

export default InputNode; 