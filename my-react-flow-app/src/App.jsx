import React, { useCallback, useState } from 'react';
import { ReactFlow, Controls, Background } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Gate Components
import InputNode from './components/gates/InputNode';
import OutputNode from './components/gates/OutputNode';
import InverterNode from './components/gates/InverterNode';
import AndGate from './components/gates/AndGate';
import OrGate from './components/gates/OrGate';
import NandGate from './components/gates/NandGate';
import NorGate from './components/gates/NorGate';
import XorGate from './components/gates/XorGate';
import XnorGate from './components/gates/XnorGate';

// Sidebar and Level Components
import LevelSidebar from './components/LevelSidebar';
import LevelSelectOverlay from './components/ui/LevelSelectOverlay';
import GameControls from './components/GameControls';
import FeedbackMessage from './components/FeedbackMessage';
import LoginForm from './components/auth/LoginForm';
import TeacherDashboard from './components/teacher/TeacherDashboard';

// Hooks and Data
import { useGameLogic } from './hooks/useGameLogic';

// Define node types for React Flow
const nodeTypes = {
  input: InputNode,
  output: OutputNode,
  inverter: InverterNode,
  and: AndGate,
  or: OrGate,
  nand: NandGate,
  nor: NorGate,
  xor: XorGate,
  xnor: XnorGate,
};

const InverterGame = () => {
  const {
    currentLevelId,
    currentLevel,
    showLevelSelect,
    setShowLevelSelect,
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    handleLevelSelect,
    toggleInput,
    checkSolution,
    allLevels
  } = useGameLogic();

  const { updateProgress, userProgress, userRole } = useAuth();
  const [feedback, setFeedback] = useState(null);

  // Handle check button
  const handleCheck = async () => {
    const result = checkSolution();
    setFeedback(result);
    
    if (result.success) {
      // Update progress when level is completed
      const completedLevels = [...(userProgress?.completedLevels || [])];
      if (!completedLevels.includes(currentLevelId)) {
        completedLevels.push(currentLevelId);
      }
      
      // Find next level using allLevels instead of levels
      const currentIndex = allLevels.findIndex(level => level.id === currentLevelId);
      const nextLevel = allLevels[currentIndex + 1];
      
      await updateProgress({
        completedLevels,
        currentLevel: nextLevel ? nextLevel.id : currentLevelId
      });
    }
    
    setTimeout(() => setFeedback(null), 4000);
  };

  // Handle dropping new nodes
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const gateType = event.dataTransfer.getData('application/reactflow');
      if (!gateType || !nodeTypes[gateType]) return;

      const position = {
        x: event.clientX,
        y: event.clientY,
      };

      const newNode = {
        id: `${nodes.length + 1}`,
        type: gateType,
        position,
        data: {
          label: `${gateType.charAt(0).toUpperCase() + gateType.slice(1)} Gate`,
        },
      };

      onNodesChange([{ type: 'add', item: newNode }]);
    },
    [nodes, nodeTypes, onNodesChange]
  );

  // Allow dragging over canvas
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      {/* Sidebar */}
      <LevelSidebar
        title={currentLevel.title}
        description={currentLevel.description}
        completedLevels={userProgress?.completedLevels || []}
      />

      {/* Main Content */}
      <div style={{ flex: 1, position: 'relative' }}>
        {/* Game Controls */}
        <GameControls
          currentLevelId={currentLevelId}
          toggleInput={toggleInput}
          handleCheck={handleCheck}
          setShowLevelSelect={setShowLevelSelect}
        />

        {/* Canvas */}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          <Background />
          <Controls />
        </ReactFlow>

        {/* Feedback */}
        <FeedbackMessage feedback={feedback} />

        {/* Level Selector Overlay */}
        <LevelSelectOverlay
          showLevelSelect={showLevelSelect}
          setShowLevelSelect={setShowLevelSelect}
          levels={allLevels}
          currentLevelId={currentLevelId}
          onSelectLevel={handleLevelSelect}
          completedLevels={userProgress?.completedLevels || []}
        />
      </div>
    </div>
  );
};

const AppContent = () => {
  const { user, loading, userRole } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <Routes>
      <Route 
        path="/teacher" 
        element={
          userRole === 'teacher' ? (
            <TeacherDashboard />
          ) : (
            <Navigate to="/" replace />
          )
        } 
      />
      <Route path="/" element={<InverterGame />} />
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <DndProvider backend={HTML5Backend}>
          <AppContent />
        </DndProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;