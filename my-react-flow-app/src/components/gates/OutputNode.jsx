import { Handle, Position } from '@xyflow/react';

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

export default OutputNode; 