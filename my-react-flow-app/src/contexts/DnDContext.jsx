import React, { useState, useContext } from 'react';

const DnDContext = React.createContext();

export const DnDProvider = ({ children }) => {
  const [type, setType] = useState(null);

  return (
    <DnDContext.Provider value={{ draggedType: type, setDraggedType: setType }}>
      {children}
    </DnDContext.Provider>
  );
};

export const useDnD = () => useContext(DnDContext);

export default DnDContext;