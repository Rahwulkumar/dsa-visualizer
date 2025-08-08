import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import SpaceBackground from '../../components/3d/SpaceBackground';
import AsteroidField from '../../components/3d/AsteroidField';
import FloatingParticles from '../../components/3d/FloatingParticles';
import CosmicDustOverlay from '../../components/CosmicDustOverlay';
import ArrayControls from '../../components/array/ArrayControls';
import ArrayVisualization from '../../components/array/ArrayVisualization';
import ArrayOperations from '../../components/array/ArrayOperations';
import CodeDisplay from '../../components/CodeDisplay';
import MemoryVisualization from '../../components/MemoryVisualization';
import '../../styles/globals.css';
import '../../components/array/ArrayStyles.css';

const ArrayVisualizerPage = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [arraySize, setArraySize] = useState(6);
  const [displayArray, setDisplayArray] = useState([]);
  const [memoryArray, setMemoryArray] = useState([]);
  const [originalArray, setOriginalArray] = useState([]);
  const [codeLanguage, setCodeLanguage] = useState('python');
  const [operation, setOperation] = useState('search');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [searchValue, setSearchValue] = useState('');
  const [accessIndex, setAccessIndex] = useState('');
  const [insertValue, setInsertValue] = useState('');
  const [insertIndex, setInsertIndex] = useState('');
  const [deleteIndex, setDeleteIndex] = useState('');
  const [currentElementIndex, setCurrentElementIndex] = useState(-1);
  const [currentCodeLine, setCurrentCodeLine] = useState(-1);
  const [currentMemoryIndex, setCurrentMemoryIndex] = useState(-1);
  const [elementStates, setElementStates] = useState({});
  const [animationStep, setAnimationStep] = useState('Ready for operation');
  const [foundIndex, setFoundIndex] = useState(-1);
  const [heapMemory, setHeapMemory] = useState({
    arrayObject: { address: '0x7f8b1c000000', size: 0, data: [] },
    elements: []
  });
  const [currentStackFrame, setCurrentStackFrame] = useState(null);
  const [currentIteration, setCurrentIteration] = useState(-1);

  const generateNewArray = useCallback(() => {
    const newArray = Array.from({ length: Math.min(arraySize, 10) }, () =>
      Math.floor(Math.random() * 100)
    );
    setDisplayArray(newArray);
    setMemoryArray(newArray);
    setOriginalArray(newArray);
    setElementStates({});
    setCurrentElementIndex(-1);
    setCurrentCodeLine(-1);
    setCurrentMemoryIndex(-1);
    setAnimationStep('New array generated');
    setFoundIndex(-1);
    setCurrentStackFrame(null);
    setCurrentIteration(-1);
    setHeapMemory({
      arrayObject: { address: '0x7f8b1c000000', size: newArray.length, data: newArray },
      elements: newArray.map((value, index) => ({
        address: `0x${(parseInt('7f8b1c000000', 16) + index * 4).toString(16)}`,
        value
      }))
    });
  }, [arraySize]);

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

  // Fix infinite render loop by using useEffect with proper dependencies
  useEffect(() => {
    generateNewArray();
  }, [generateNewArray]); // Only run when generateNewArray changes

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
            onClick={() => navigate('/array-info')}
            className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-2 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Array Info
          </button>
          <motion.button
            onClick={() => setSidebarOpen(true)}
            disabled={isAnimating}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 shadow-lg"
          >
            <Settings className="w-4 h-4" />
            Open Controls
          </motion.button>
        </div>
      </div>
      <div className={`relative z-10 p-4 transition-all duration-300 ${sidebarOpen ? 'array-sidebar-overlay' : ''}`}>
        <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-4 h-[calc(100vh-200px)]">
          <CodeDisplay
            codeLanguage={codeLanguage}
            operation={operation}
            currentCodeLine={currentCodeLine}
            animationStep={animationStep}
            currentIteration={currentIteration}
          />
          <ArrayVisualization
            displayArray={displayArray}
            currentElementIndex={currentElementIndex}
            elementStates={elementStates}
            codeLanguage={codeLanguage}
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
      </div>
      <ArrayControls
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
        setIsPlaying={setIsPlaying}
        speed={speed}
        setSpeed={setSpeed}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        accessIndex={accessIndex}
        setAccessIndex={setAccessIndex}
        insertValue={insertValue}
        setInsertValue={setInsertValue}
        insertIndex={insertIndex}
        setInsertIndex={setInsertIndex}
        deleteIndex={deleteIndex}
        setDeleteIndex={setDeleteIndex}
        generateNewArray={generateNewArray}
      />
      <ArrayOperations
        operation={operation}
        isPlaying={isPlaying}
        speed={speed}
        searchValue={searchValue}
        accessIndex={accessIndex}
        insertValue={insertValue}
        insertIndex={insertIndex}
        deleteIndex={deleteIndex}
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
        initializeMemoryModel={initializeMemoryModel}
        isAnimating={isAnimating}
      />
    </div>
  );
};

export default ArrayVisualizerPage;