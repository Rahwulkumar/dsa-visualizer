import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import SpaceBackground from '../../components/3d/SpaceBackground';
import AsteroidField from '../../components/3d/AsteroidField';
import FloatingParticles from '../../components/3d/FloatingParticles';
import CosmicDustOverlay from '../../components/CosmicDustOverlay';
import TreeControls from './TreeControls';
import TreeVisualization from './TreeVisualization';
import TreeLogic from './TreeLogic';
import CodeDisplay from './CodeDisplay';
import MemoryVisualization from './MemoryVisualization';
import '../../styles/globals.css';

const TreeVisualizerPage = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tree, setTree] = useState([]);
  const [maxSize, setMaxSize] = useState(10);
  const [codeLanguage, setCodeLanguage] = useState('python');
  const [operation, setOperation] = useState('insert');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [insertValue, setInsertValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [deleteValue, setDeleteValue] = useState('');
  const [currentElementIndex, setCurrentElementIndex] = useState(-1);
  const [currentCodeLine, setCurrentCodeLine] = useState(-1);
  const [elementStates, setElementStates] = useState({});
  const [animationStep, setAnimationStep] = useState('Ready for operation');
  const [currentMemoryIndex, setCurrentMemoryIndex] = useState(-1);
  const [currentIteration, setCurrentIteration] = useState(-1);
  const [currentStackFrame, setCurrentStackFrame] = useState(null);
  const [heapMemory, setHeapMemory] = useState({ 
    treeObject: { 
      address: '0x7f8b1c000000', 
      size: 0, 
      root: null, 
      height: 0, 
      nodes: [] 
    } 
  });
  const [foundIndex, setFoundIndex] = useState(-1);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const initializeTree = useCallback(() => {
    try {
      setIsLoading(true);
      // Create a simple BST with a few nodes
      const initialNodes = [
        { value: 50, left: 1, right: 2, isRoot: true },
        { value: 30, left: null, right: null, isRoot: false },
        { value: 70, left: null, right: null, isRoot: false }
      ];
      setTree(initialNodes);
      setElementStates({});
      setCurrentElementIndex(-1);
      setCurrentCodeLine(-1);
      setAnimationStep('Tree initialized');
      setFoundIndex(-1);
      setError(null);
      
      // Update heap memory
      const heap = {
        treeObject: {
          address: '0x7f8b1c000000',
          size: initialNodes.length,
          root: 50,
          height: 2,
          nodes: initialNodes.map((node, i) => ({ 
            address: `0x${(parseInt('7f8b1c000000', 16) + i * 24).toString(16)}`,
            value: node.value,
            left: node.left,
            right: node.right
          }))
        }
      };
      setHeapMemory(heap);
      
      setTimeout(() => setIsLoading(false), 300); // Small delay for loading effect
    } catch (err) {
      setError(`Failed to initialize tree: ${err.message}`);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeTree();
  }, [initializeTree]);

  const memoizedCanvas = useMemo(() => (
    <Canvas camera={{ position: [0, 0, 5], fov: 75 }} style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
      <ambientLight intensity={0.1} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <Stars radius={400} depth={60} count={3000} factor={3} saturation={0} fade speed={0.3} />
      <SpaceBackground />
      <AsteroidField />
      <FloatingParticles />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate
        autoRotate
        autoRotateSpeed={0.2}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      />
    </Canvas>
  ), []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-space-deep to-space-dark text-white">
      {memoizedCanvas}
      <CosmicDustOverlay />
      
      {/* Error Display */}
      {error && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-red-900/90 border border-red-500 rounded-lg p-4 max-w-md">
          <div className="flex items-center justify-between">
            <span className="text-red-100">{error}</span>
            <button 
              onClick={() => setError(null)}
              className="text-red-300 hover:text-red-100 ml-4"
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      <div className="relative z-10 p-6">
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate('/tree-info')}
            className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-2 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Tree Info
          </button>
        </div>
      </div>
      <div className={`relative z-10 p-4 transition-all duration-300 ${sidebarOpen ? 'tree-sidebar-overlay' : ''}`}>
        {error ? (
          <div className="flex items-center justify-center h-[calc(100vh-120px)]">
            <div className="bg-red-900/50 border border-red-500/50 rounded-lg p-8 text-center">
              <h3 className="text-xl font-bold text-red-200 mb-4">Something went wrong</h3>
              <p className="text-red-300 mb-4">{error}</p>
              <button 
                onClick={() => {
                  setError(null);
                  initializeTree();
                }}
                className="bg-red-600/80 hover:bg-red-500/80 px-4 py-2 rounded-lg text-white"
              >
                Reset and Try Again
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-4 h-[calc(100vh-200px)] tree-visualizer-grid lg:grid-cols-12 md:grid-cols-1 sm:grid-cols-1">
            <CodeDisplay
              codeLanguage={codeLanguage}
              operation={operation}
              currentCodeLine={currentCodeLine}
              animationStep={animationStep}
              currentIteration={currentIteration}
            />
            <TreeVisualization 
              tree={tree}
              elementStates={elementStates}
              currentElementIndex={currentElementIndex}
              maxSize={maxSize}
              codeLanguage={codeLanguage}
              root={tree.length > 0 ? tree[0].value : null}
            />
            <MemoryVisualization 
              stackMemory={currentStackFrame}
              heapMemory={heapMemory}
              currentMemoryIndex={currentMemoryIndex}
              elementStates={elementStates}
              currentStackFrame={currentStackFrame}
              codeLanguage={codeLanguage}
            />
          </div>
        )}
      </div>
      
      <TreeControls 
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        maxSize={maxSize}
        setMaxSize={setMaxSize}
        codeLanguage={codeLanguage}
        setCodeLanguage={setCodeLanguage}
        operation={operation}
        setOperation={setOperation}
        isAnimating={isAnimating}
        isPlaying={isPlaying}
        onStart={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onReset={initializeTree}
        speed={speed}
        setSpeed={setSpeed}
        insertValue={insertValue}
        setInsertValue={setInsertValue}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        deleteValue={deleteValue}
        setDeleteValue={setDeleteValue}
        tree={tree}
        elementStates={elementStates}
        currentElementIndex={currentElementIndex}
        root={tree.length > 0 ? tree[0].value : null}
      />
      
      <TreeLogic 
        operation={operation}
        isPlaying={isPlaying}
        speed={speed}
        insertValue={insertValue}
        searchValue={searchValue}
        deleteValue={deleteValue}
        tree={tree}
        maxSize={maxSize}
        setIsAnimating={setIsAnimating}
        setIsPlaying={setIsPlaying}
        setTree={setTree}
        setCurrentElementIndex={setCurrentElementIndex}
        setCurrentCodeLine={setCurrentCodeLine}
        setElementStates={setElementStates}
        setAnimationStep={setAnimationStep}
        setCurrentMemoryIndex={setCurrentMemoryIndex}
        setCurrentIteration={setCurrentIteration}
        setCurrentStackFrame={setCurrentStackFrame}
        setHeapMemory={setHeapMemory}
        setFoundIndex={setFoundIndex}
        isAnimating={isAnimating}
      />
    </div>
  );
};

export default TreeVisualizerPage;
