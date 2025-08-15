import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import SpaceBackground from '../../components/3d/SpaceBackground';
import AsteroidField from '../../components/3d/AsteroidField';
import FloatingParticles from '../../components/3d/FloatingParticles';
import CosmicDustOverlay from '../../components/CosmicDustOverlay';
import StackControls from './StackControls';
import StackVisualization from './StackVisualization';
import StackLogic from './StackLogic';
import CodeDisplay from './CodeDisplay';
import MemoryVisualization from './MemoryVisualization';
import '../../styles/globals.css';
import './StackStyles.css';

const StackVisualizerPage = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stack, setStack] = useState([]);
  const [maxSize, setMaxSize] = useState(8);
  const [codeLanguage, setCodeLanguage] = useState('python');
  const [operation, setOperation] = useState('push');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [pushValue, setPushValue] = useState('');
  const [currentElementIndex, setCurrentElementIndex] = useState(-1);
  const [currentCodeLine, setCurrentCodeLine] = useState(-1);
  const [elementStates, setElementStates] = useState({});
  const [animationStep, setAnimationStep] = useState('Ready for operation');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const initializeStack = useCallback(() => {
    try {
      setIsLoading(true);
      const initialStack = Array.from({ length: 3 }, (_, i) => Math.floor(Math.random() * 100));
      setStack(initialStack);
      setElementStates({});
      setCurrentElementIndex(-1);
      setCurrentCodeLine(-1);
      setAnimationStep('Stack initialized');
      setError(null);
      setTimeout(() => setIsLoading(false), 300); // Small delay for loading effect
    } catch (err) {
      setError(`Failed to initialize stack: ${err.message}`);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initializeStack();
  }, [initializeStack]);

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
            onClick={() => navigate('/stack-info')}
            className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-2 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Stack Info
          </button>
        </div>
      </div>
      <div className={`relative z-10 p-4 transition-all duration-300 ${sidebarOpen ? 'stack-sidebar-overlay' : ''}`}>
        {error ? (
          <div className="flex items-center justify-center h-[calc(100vh-120px)]">
            <div className="bg-red-900/50 border border-red-500/50 rounded-lg p-8 text-center">
              <h3 className="text-xl font-bold text-red-200 mb-4">Something went wrong</h3>
              <p className="text-red-300 mb-4">{error}</p>
              <button 
                onClick={() => {
                  setError(null);
                  initializeStack();
                }}
                className="bg-red-600/80 hover:bg-red-500/80 px-4 py-2 rounded-lg text-white"
              >
                Reset and Try Again
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-4 h-[calc(100vh-200px)] stack-visualizer-grid lg:grid-cols-12 md:grid-cols-1 sm:grid-cols-1">
            <CodeDisplay
              codeLanguage={codeLanguage}
              operation={operation}
              currentCodeLine={currentCodeLine}
              animationStep={animationStep}
            />
            <StackVisualization 
              stack={stack}
              elementStates={elementStates}
              currentElementIndex={currentElementIndex}
              maxSize={maxSize}
            />
            <MemoryVisualization 
              stack={stack}
              top={stack.length - 1}
              maxSize={maxSize}
              codeLanguage={codeLanguage}
            />
          </div>
        )}
      </div>
      
      <StackControls 
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
        onReset={initializeStack}
        speed={speed}
        setSpeed={setSpeed}
        pushValue={pushValue}
        setPushValue={setPushValue}
        stack={stack}
        elementStates={elementStates}
        currentElementIndex={currentElementIndex}
      />
      
      <StackLogic 
        operation={operation}
        isPlaying={isPlaying}
        speed={speed}
        pushValue={pushValue}
        stack={stack}
        maxSize={maxSize}
        setIsAnimating={setIsAnimating}
        setIsPlaying={setIsPlaying}
        setStack={setStack}
        setCurrentElementIndex={setCurrentElementIndex}
        setCurrentCodeLine={setCurrentCodeLine}
        setElementStates={setElementStates}
        setAnimationStep={setAnimationStep}
      />
    </div>
  );
};

export default StackVisualizerPage;
