import React, { useState, useEffect, useCallback, useMemo } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import SpaceBackground from '../../components/3d/SpaceBackground';
import AsteroidField from '../../components/3d/AsteroidField';
import FloatingParticles from '../../components/3d/FloatingParticles';
import CosmicDustOverlay from '../../components/CosmicDustOverlay';
import SearchingControls from './SearchingControls';
import SearchingVisualization from './SearchingVisualization';
import SearchingLogic from './SearchingLogic';
import CodeDisplay from './CodeDisplay';
import MemoryVisualization from './MemoryVisualization';
import '../../styles/globals.css';
import './SearchingStyles.css';

const SearchingVisualizerPage = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [arraySize, setArraySize] = useState(6);
  const [displayArray, setDisplayArray] = useState([]);
  const [memoryArray, setMemoryArray] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [originalArray, setOriginalArray] = useState([]);
  const [codeLanguage, setCodeLanguage] = useState('python');
  const [operation, setOperation] = useState('linearSearch');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [currentElementIndex, setCurrentElementIndex] = useState(-1);
  const [currentCodeLine, setCurrentCodeLine] = useState(-1);
  const [currentMemoryIndex, setCurrentMemoryIndex] = useState(-1);
  const [elementStates, setElementStates] = useState({});
  const [animationStep, setAnimationStep] = useState('Ready for operation');
  const [foundIndex, setFoundIndex] = useState(-1);
  const [searchTarget, setSearchTarget] = useState(null);
  const [heapMemory, setHeapMemory] = useState({
    arrayObject: { address: '0x7f8b1c000000', size: 0, data: [] },
    elements: []
  });
  const [currentStackFrame, setCurrentStackFrame] = useState(null);
  const [currentIteration, setCurrentIteration] = useState(-1);
  const [comparisons, setComparisons] = useState(0);
  const [searchRange, setSearchRange] = useState({ left: -1, right: -1, mid: -1 });

  const generateNewArray = useCallback(() => {
    const newArray = Array.from({ length: Math.min(arraySize, 10) }, () =>
      Math.floor(Math.random() * 100)
    );
    
    // Sort array for binary search
    if (operation === 'binarySearch') {
      newArray.sort((a, b) => a - b);
    }
    
    setDisplayArray(newArray);
    setMemoryArray(newArray);
    setOriginalArray(newArray);
    setElementStates({});
    setCurrentElementIndex(-1);
    setCurrentCodeLine(-1);
    setCurrentMemoryIndex(-1);
    setAnimationStep('New array generated');
    setFoundIndex(-1);
    setSearchTarget(null);
    setCurrentStackFrame(null);
    setCurrentIteration(-1);
    setComparisons(0);
    setSearchRange({ left: -1, right: -1, mid: -1 });
    setHeapMemory({
      arrayObject: { address: '0x7f8b1c000000', size: newArray.length, data: newArray },
      elements: newArray.map((value, index) => ({
        address: `0x${(parseInt('7f8b1c000000', 16) + index * 4).toString(16)}`,
        value
      }))
    });
  }, [arraySize, operation]);

  const initializeMemoryModel = useCallback(() => {
    setHeapMemory({
      arrayObject: { address: '0x7f8b1c000000', size: displayArray.length, data: displayArray },
      elements: displayArray.map((value, index) => ({
        address: `0x${(parseInt('7f8b1c000000', 16) + index * 4).toString(16)}`,
        value
      }))
    });
    setCurrentStackFrame(null);
  }, [displayArray]);

  // Initialize with a default array on mount and when arraySize changes
  useEffect(() => {
    const newArray = Array.from({ length: Math.min(arraySize, 10) }, () =>
      Math.floor(Math.random() * 100)
    );
    
    // Sort array for binary search
    if (operation === 'binarySearch') {
      newArray.sort((a, b) => a - b);
    }
    
    setDisplayArray(newArray);
    setMemoryArray(newArray);
    setOriginalArray(newArray);
    setElementStates({});
    setCurrentElementIndex(-1);
    setCurrentCodeLine(-1);
    setCurrentMemoryIndex(-1);
    setAnimationStep('New array generated');
    setFoundIndex(-1);
    setSearchTarget(null);
    setCurrentStackFrame(null);
    setCurrentIteration(-1);
    setComparisons(0);
    setSearchRange({ left: -1, right: -1, mid: -1 });
    setHeapMemory({
      arrayObject: { address: '0x7f8b1c000000', size: newArray.length, data: newArray },
      elements: newArray.map((value, index) => ({
        address: `0x${(parseInt('7f8b1c000000', 16) + index * 4).toString(16)}`,
        value
      }))
    });
  }, [arraySize, operation]);

  // Memoize the Canvas to prevent re-mounting
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
  ), []); // Empty dependency array to render once

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-space-deep to-space-dark">
      {memoizedCanvas}
      <CosmicDustOverlay />
      <div className="relative z-10 p-6">
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate('/searching-info')}
            className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-2 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Searching Info
          </button>
        </div>
      </div>
      <div className={`relative z-10 p-4 transition-all duration-300 ${sidebarOpen ? 'searching-sidebar-overlay' : ''}`}>
        <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-4 h-[calc(100vh-200px)]">
          <CodeDisplay
            codeLanguage={codeLanguage}
            operation={operation}
            currentCodeLine={currentCodeLine}
            animationStep={animationStep}
            currentIteration={currentIteration}
          />
          <SearchingVisualization
            displayArray={displayArray}
            currentElementIndex={currentElementIndex}
            elementStates={elementStates}
            codeLanguage={codeLanguage}
            comparisons={comparisons}
            foundIndex={foundIndex}
            searchTarget={searchTarget}
            searchRange={searchRange}
            operation={operation}
          />
          <MemoryVisualization
            stackMemory={currentStackFrame}
            heapMemory={heapMemory}
            currentMemoryIndex={currentMemoryIndex}
            elementStates={elementStates}
            currentStackFrame={currentStackFrame}
            codeLanguage={codeLanguage}
            displayArray={displayArray}
            searchTarget={searchTarget}
          />
        </div>
      </div>
      <SearchingControls
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        arraySize={arraySize}
        setArraySize={setArraySize}
        codeLanguage={codeLanguage}
        setCodeLanguage={setCodeLanguage}
        operation={operation}
        setOperation={setOperation}
        isAnimating={isAnimating}
        isPlaying={isPlaying}
        onStart={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onReset={generateNewArray}
        speed={speed}
        setSpeed={setSpeed}
        displayArray={displayArray}
        currentElementIndex={currentElementIndex}
        elementStates={elementStates}
        comparisons={comparisons}
        searchTarget={searchTarget}
        setSearchTarget={setSearchTarget}
        foundIndex={foundIndex}
      />
      <SearchingLogic
        operation={operation}
        isPlaying={isPlaying}
        speed={speed}
        displayArray={displayArray}
        memoryArray={memoryArray}
        codeLanguage={codeLanguage}
        arraySize={arraySize}
        setIsAnimating={setIsAnimating}
        setIsPlaying={setIsPlaying}
        setDisplayArray={setDisplayArray}
        setMemoryArray={setMemoryArray}
        setOriginalArray={setOriginalArray}
        setCurrentElementIndex={setCurrentElementIndex}
        setCurrentCodeLine={setCurrentCodeLine}
        setCurrentMemoryIndex={setCurrentMemoryIndex}
        setElementStates={setElementStates}
        setAnimationStep={setAnimationStep}
        setFoundIndex={setFoundIndex}
        setHeapMemory={setHeapMemory}
        setCurrentStackFrame={setCurrentStackFrame}
        setCurrentIteration={setCurrentIteration}
        setComparisons={setComparisons}
        searchTarget={searchTarget}
        setSearchTarget={setSearchTarget}
        searchRange={searchRange}
        setSearchRange={setSearchRange}
        initializeMemoryModel={initializeMemoryModel}
        isAnimating={isAnimating}
      />
    </div>
  );
};

export default SearchingVisualizerPage;