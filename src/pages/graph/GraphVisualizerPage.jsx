import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Components
import GraphControls from './GraphControls';
import GraphVisualization from './GraphVisualization';
import CodeDisplay from './CodeDisplay';
import MemoryVisualization from './MemoryVisualization';

// Logic and Utils
import GraphLogic from './GraphLogic';
import AnimationController from '../../utils/AnimationController';

// Styles
import './GraphStyles.css';

const GraphVisualizerPage = () => {
  const navigate = useNavigate();
  
  // Core state
  const [graph, setGraph] = useState({ vertices: [], edges: [] });
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentElementIndex, setCurrentElementIndex] = useState(-1);
  const [elementStates, setElementStates] = useState({});
  const [currentOperationState, setCurrentOperationState] = useState({});
  
  // Control state
  const [isControlsOpen, setIsControlsOpen] = useState(false);
  const [maxVertices, setMaxVertices] = useState(8);
  const [codeLanguage, setCodeLanguage] = useState('python');
  const [operation, setOperation] = useState('addVertex');
  const [speed, setSpeed] = useState(1000);
  
  // Operation parameters
  const [addVertexValue, setAddVertexValue] = useState('');
  const [addEdgeFrom, setAddEdgeFrom] = useState('');
  const [addEdgeTo, setAddEdgeTo] = useState('');
  const [addEdgeWeight, setAddEdgeWeight] = useState('1');
  const [searchVertex, setSearchVertex] = useState('');
  const [startVertex, setStartVertex] = useState('');
  
  // Refs
  const graphLogicRef = useRef(null);
  const animationControllerRef = useRef(null);
  
  // Initialize graph logic and animation controller
  useEffect(() => {
    // Initialize animation controller
    animationControllerRef.current = new AnimationController();
    
    // Initialize graph logic
    graphLogicRef.current = new GraphLogic();
    graphLogicRef.current.setAnimationController(animationControllerRef.current);
    
    // Set up callbacks
    graphLogicRef.current.initialize({
      onStateUpdate: (state) => {
        setGraph(state.graph);
        setIsAnimating(state.isAnimating);
        setCurrentElementIndex(state.currentElementIndex);
        setElementStates(state.elementStates);
        setCurrentOperationState(state.currentOperationState);
        
        if (!state.isAnimating) {
          setIsPlaying(false);
        }
      },
      onStepUpdate: (step, stepIndex, totalSteps) => {
        // Update UI with step information
        console.log(`Step ${stepIndex + 1}/${totalSteps}: ${step.message}`);
      },
      onComplete: () => {
        setIsAnimating(false);
        setIsPlaying(false);
        console.log('Animation completed');
      }
    });
    
    // Set up animation controller
    animationControllerRef.current.setSpeed(speed);
    animationControllerRef.current.setStepFunction(() => {
      if (graphLogicRef.current) {
        graphLogicRef.current.executeStep();
      }
    });
    
    // Generate initial graph
    graphLogicRef.current.generateRandomGraph(maxVertices);
    
    return () => {
      if (animationControllerRef.current) {
        animationControllerRef.current.cleanup();
      }
    };
  }, []);
  
  // Update animation speed when speed changes
  useEffect(() => {
    if (animationControllerRef.current) {
      animationControllerRef.current.setSpeed(speed);
    }
  }, [speed]);
  
  // Handle operation start
  const handleStart = () => {
    if (!graphLogicRef.current || isAnimating) return;
    
    let success = false;
    
    switch (operation) {
      case 'addVertex':
        success = graphLogicRef.current.addVertex(addVertexValue.trim());
        if (success) {
          setAddVertexValue('');
        }
        break;
        
      case 'addEdge':
        const weight = parseInt(addEdgeWeight) || 1;
        success = graphLogicRef.current.addEdge(
          addEdgeFrom.trim(),
          addEdgeTo.trim(),
          weight
        );
        if (success) {
          setAddEdgeFrom('');
          setAddEdgeTo('');
          setAddEdgeWeight('1');
        }
        break;
        
      case 'dfs':
        success = graphLogicRef.current.dfs(startVertex.trim());
        break;
        
      case 'bfs':
        success = graphLogicRef.current.bfs(startVertex.trim());
        break;
        
      case 'dijkstra':
        success = graphLogicRef.current.dijkstra(startVertex.trim());
        break;
        
      case 'mst':
        success = graphLogicRef.current.mst();
        break;
        
      default:
        console.warn('Unknown operation:', operation);
    }
    
    if (success) {
      setIsPlaying(true);
    }
  };
  
  // Handle pause
  const handlePause = () => {
    if (graphLogicRef.current) {
      graphLogicRef.current.pauseAnimation();
      setIsPlaying(false);
    }
  };
  
  // Handle reset
  const handleReset = () => {
    if (graphLogicRef.current) {
      if (isAnimating) {
        graphLogicRef.current.pauseAnimation();
      }
      graphLogicRef.current.generateRandomGraph(maxVertices);
      setIsPlaying(false);
      setCurrentElementIndex(-1);
      setElementStates({});
      setCurrentOperationState({});
    }
  };
  
  // Handle resume (when play is clicked while paused)
  const handleResume = () => {
    if (graphLogicRef.current && !isPlaying && isAnimating) {
      graphLogicRef.current.resumeAnimation();
      setIsPlaying(true);
    }
  };
  
  // Get operation-specific code template
  const getCodeTemplate = () => {
    switch (operation) {
      case 'addVertex':
        return { operation: 'addVertex', parameters: { vertex: addVertexValue } };
      case 'addEdge':
        return { 
          operation: 'addEdge', 
          parameters: { 
            from: addEdgeFrom, 
            to: addEdgeTo, 
            weight: parseInt(addEdgeWeight) || 1 
          } 
        };
      case 'dfs':
        return { operation: 'dfs', parameters: { start: startVertex } };
      case 'bfs':
        return { operation: 'bfs', parameters: { start: startVertex } };
      case 'dijkstra':
        return { operation: 'dijkstra', parameters: { start: startVertex } };
      case 'mst':
        return { operation: 'mst', parameters: {} };
      default:
        return { operation: 'addVertex', parameters: {} };
    }
  };

  return (
    <div id="graph-visualizer-page" className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900/50 to-gray-900"></div>
      
      {/* Navigation Header */}
      <motion.header
        id="graph-visualizer-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 flex items-center justify-between p-6 border-b border-white/10 backdrop-blur-xl bg-black/20"
      >
        <div className="flex items-center gap-4">
          <motion.button
            id="graph-back-button"
            onClick={() => navigate('/graph-info')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-700/80 to-gray-600/80 backdrop-blur-xl rounded-xl border border-gray-500/30 hover:from-gray-600/80 hover:to-gray-500/80 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Info</span>
          </motion.button>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl">
              <motion.div
                animate={{ rotate: isAnimating ? 360 : 0 }}
                transition={{ duration: 2, repeat: isAnimating ? Infinity : 0, ease: 'linear' }}
                className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center"
              >
                <span className="text-white font-bold text-sm">G</span>
              </motion.div>
            </div>
            <div>
              <h1 id="graph-visualizer-title" className="text-2xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                Graph Visualizer
              </h1>
              <p id="graph-visualizer-subtitle" className="text-gray-400 text-sm">
                Interactive graph algorithm visualization
              </p>
            </div>
          </div>
        </div>
        
        <div id="graph-stats" className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-300">Vertices: <span id="graph-vertex-count" className="text-blue-400 font-mono">{graph.vertices.length}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-300">Edges: <span id="graph-edge-count" className="text-green-400 font-mono">{graph.edges.length}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${isAnimating ? 'bg-yellow-500 animate-pulse' : 'bg-gray-500'}`}></div>
            <span className="text-gray-300">Status: <span id="graph-status" className={`font-mono ${isAnimating ? 'text-yellow-400' : 'text-gray-400'}`}>
              {isAnimating ? 'Running' : 'Ready'}
            </span></span>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div id="graph-main-content" className="relative flex h-[calc(100vh-88px)]">
        {/* Left Panel - Code and Memory */}
        <motion.div
          id="graph-left-panel"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="w-[450px] border-r border-white/10 flex flex-col bg-black/10 backdrop-blur-xl"
        >
          {/* Code Display */}
          <div id="graph-code-section" className="flex-1 min-h-0">
            <CodeDisplay
              language={codeLanguage}
              operation={getCodeTemplate().operation}
              parameters={getCodeTemplate().parameters}
              isAnimating={isAnimating}
              currentStep={currentElementIndex}
              graph={graph}
            />
          </div>
          
          {/* Memory Visualization */}
          <div id="graph-memory-section" className="h-[280px] border-t border-white/10">
            <MemoryVisualization
              graph={graph}
              operation={operation}
              currentOperationState={currentOperationState}
              elementStates={elementStates}
              isAnimating={isAnimating}
            />
          </div>
        </motion.div>

        {/* Right Panel - Visualization */}
        <motion.div
          id="graph-right-panel"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="flex-1 relative"
        >
          <GraphVisualization
            graph={graph}
            isAnimating={isAnimating}
            currentOperationState={currentOperationState}
            elementStates={elementStates}
            operation={operation}
            currentElementIndex={currentElementIndex}
          />
        </motion.div>
      </div>

      {/* Controls */}
      <GraphControls
        isOpen={isControlsOpen}
        setIsOpen={setIsControlsOpen}
        maxVertices={maxVertices}
        setMaxVertices={setMaxVertices}
        codeLanguage={codeLanguage}
        setCodeLanguage={setCodeLanguage}
        operation={operation}
        setOperation={setOperation}
        isAnimating={isAnimating}
        isPlaying={isPlaying}
        onStart={isPlaying ? handleResume : handleStart}
        onPause={handlePause}
        onReset={handleReset}
        speed={speed}
        setSpeed={setSpeed}
        addVertexValue={addVertexValue}
        setAddVertexValue={setAddVertexValue}
        addEdgeFrom={addEdgeFrom}
        setAddEdgeFrom={setAddEdgeFrom}
        addEdgeTo={addEdgeTo}
        setAddEdgeTo={setAddEdgeTo}
        addEdgeWeight={addEdgeWeight}
        setAddEdgeWeight={setAddEdgeWeight}
        searchVertex={searchVertex}
        setSearchVertex={setSearchVertex}
        startVertex={startVertex}
        setStartVertex={setStartVertex}
        graph={graph}
        currentElementIndex={currentElementIndex}
        elementStates={elementStates}
      />

      {/* Loading Overlay */}
      {isAnimating && (
        <motion.div
          id="graph-animation-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 z-50"
        >
          <motion.div
            className="h-full bg-white/30"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: speed / 1000, ease: 'linear' }}
          />
        </motion.div>
      )}
    </div>
  );
};

export default GraphVisualizerPage;
