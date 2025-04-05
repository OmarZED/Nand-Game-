import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

const ColorSelectorNode = memo(({ data, isConnectable }) => (
  <div className="color-selector-node">
    <Handle
      type="target"
      position={Position.Left}
      isConnectable={isConnectable}
    />
    <div className="color-label">
      Custom Color Picker Node: <strong>{data.color}</strong>
    </div>
    <input
      className="nodrag color-input"
      type="color"
      onChange={data.onChange}
      defaultValue={data.color}
    />
    <Handle
      type="source"
      position={Position.Right}
      id="a"
      style={{ top: '30%' }}
      isConnectable={isConnectable}
    />
    <Handle
      type="source"
      position={Position.Right}
      id="b"
      style={{ top: '70%' }}
      isConnectable={isConnectable}
    />
  </div>
));

export default ColorSelectorNode;