import { Handle, Position } from '@xyflow/react';

const InverterNode = () => {
  return (
    <div className="inverter-node">
      <Handle type="target" position={Position.Left} />
      <div>INV</div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default InverterNode; 