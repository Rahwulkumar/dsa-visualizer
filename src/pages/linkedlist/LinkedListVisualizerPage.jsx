import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import SpaceBackground from '../../components/3d/SpaceBackground';
import AsteroidField from '../../components/3d/AsteroidField';
import FloatingParticles from '../../components/3d/FloatingParticles';
import CosmicDustOverlay from '../../components/CosmicDustOverlay';
import LinkedListControls from './LinkedListControls';
import LinkedListVisualization from './LinkedListVisualization';
import LinkedListLogic from './LinkedListLogic';
import CodeDisplay from './CodeDisplay';
import MemoryVisualization from './MemoryVisualization';
import '../../styles/globals.css';
import './LinkedListStyles.css';

const LinkedListVisualizerPage = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [listSize, setListSize] = useState(6);
  const [displayList, setDisplayList] = useState([]);
  const [memoryList, setMemoryList] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [originalList, setOriginalList] = useState([]);
  const [codeLanguage, setCodeLanguage] = useState('python');
  const [operation, setOperation] = useState('search');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [searchValue, setSearchValue] = useState('25');
  const [insertValue, setInsertValue] = useState('50');
  const [insertPosition, setInsertPosition] = useState('0');
  const [deleteValue, setDeleteValue] = useState('25');
  const [deletePosition, setDeletePosition] = useState('');
  const [currentNodeIndex, setCurrentNodeIndex] = useState(-1);
  const [currentCodeLine, setCurrentCodeLine] = useState(-1);
  const [currentMemoryIndex, setCurrentMemoryIndex] = useState(-1);
  const [nodeStates, setNodeStates] = useState({});
  const [animationStep, setAnimationStep] = useState('Ready for operation');
  // eslint-disable-next-line no-unused-vars
  const [foundIndex, setFoundIndex] = useState(-1);
  const [heapMemory, setHeapMemory] = useState({
    listHead: null,
    nodes: []
  });
  // eslint-disable-next-line no-unused-vars
  const [currentStackFrame, setCurrentStackFrame] = useState(null);
  const [currentIteration, setCurrentIteration] = useState(-1);

  const generateNewList = useCallback(() => {
    const nodes = [];
    const baseAddress = 0x7f8b1c000000;
    
    // Generate random values and create nodes with scattered addresses
    for (let i = 0; i < Math.min(listSize, 8); i++) {
      const nodeAddress = baseAddress + (Math.random() * 0x10000 | 0) + i * 0x20;
      nodes.push({
        id: i,
        data: Math.floor(Math.random() * 100),
        next: i < Math.min(listSize, 8) - 1 ? (baseAddress + (Math.random() * 0x10000 | 0) + (i + 1) * 0x20) : null,
        address: `0x${nodeAddress.toString(16)}`,
        index: i
      });
    }
    
    // Update next addresses to match actual node addresses
    for (let i = 0; i < nodes.length - 1; i++) {
      nodes[i].next = nodes[i + 1].address;
    }
    
    setDisplayList(nodes);
    setMemoryList(nodes);
    setOriginalList(nodes);
    setNodeStates({});
    setCurrentNodeIndex(-1);
    setCurrentCodeLine(-1);
    setCurrentMemoryIndex(-1);
    setAnimationStep('New linked list generated');
    setFoundIndex(-1);
    setCurrentStackFrame(null);
    setCurrentIteration(-1);
    setHeapMemory({
      linkedList: {
        type: 'LinkedList',
        address: nodes.length > 0 ? nodes[0].address : null,
        data: nodes.map(node => node.data),
        nodes: nodes.map((node, index) => ({
          address: node.address,
          data: node.data,
          next: node.next,
          index: index
        }))
      }
    });
  }, [listSize]);

  const initializeMemoryModel = useCallback(() => {
    const updatedHeapMemory = {
      linkedList: {
        type: 'LinkedList',
        address: displayList.length > 0 ? (displayList[0].address || '0x7F8B1C000000') : null,
        data: displayList.map(node => node.data),
        nodes: displayList.map((node, index) => ({
          address: node.address || `0x${(0x7F8B1C000000 + index * 0x1000).toString(16).toUpperCase()}`,
          data: node.data,
          next: index < displayList.length - 1 ? 
            (displayList[index + 1].address || `0x${(0x7F8B1C000000 + (index + 1) * 0x1000).toString(16).toUpperCase()}`) : 
            'NULL',
          index: index
        }))
      }
    };
    
    setHeapMemory(updatedHeapMemory);
    setCurrentStackFrame(null);
  }, [displayList]);

  // Initialize list on mount and size change
  useEffect(() => {
    generateNewList();
  }, [generateNewList]);

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
  ), []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-space-deep to-space-dark">
      {memoizedCanvas}
      <CosmicDustOverlay />
      <div className="relative z-10 p-6">
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate('/linked-list-info')}
            className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-2 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to LinkedList Info
          </button>
        </div>
      </div>
      <div className={`relative z-10 p-4 transition-all duration-300 ${sidebarOpen ? 'linkedlist-sidebar-overlay' : ''}`}>
        <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-4 h-[calc(100vh-200px)]">
          <CodeDisplay
            codeLanguage={codeLanguage}
            operation={operation}
            currentCodeLine={currentCodeLine}
            animationStep={animationStep}
            currentIteration={currentIteration}
          />
          <LinkedListVisualization
            displayList={displayList}
            currentNodeIndex={currentNodeIndex}
            nodeStates={nodeStates}
            codeLanguage={codeLanguage}
          />
          <MemoryVisualization
            heapMemory={heapMemory}
            currentMemoryIndex={currentMemoryIndex}
            nodeStates={nodeStates}
            codeLanguage={codeLanguage}
            displayList={displayList}
            currentStackFrame={currentStackFrame}
          />
        </div>
      </div>
      <LinkedListControls
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        listSize={listSize}
        setListSize={setListSize}
        codeLanguage={codeLanguage}
        setCodeLanguage={setCodeLanguage}
        operation={operation}
        setOperation={setOperation}
        isAnimating={isAnimating}
        isPlaying={isPlaying}
        onStart={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onReset={generateNewList}
        speed={speed}
        setSpeed={setSpeed}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        insertValue={insertValue}
        setInsertValue={setInsertValue}
        insertPosition={insertPosition}
        setInsertPosition={setInsertPosition}
        deleteValue={deleteValue}
        setDeleteValue={setDeleteValue}
        deletePosition={deletePosition}
        setDeletePosition={setDeletePosition}
        displayList={displayList}
        currentNodeIndex={currentNodeIndex}
        nodeStates={nodeStates}
      />
      <LinkedListLogic
        operation={operation}
        isPlaying={isPlaying}
        speed={speed}
        searchValue={searchValue}
        insertValue={insertValue}
        insertPosition={insertPosition}
        deleteValue={deleteValue}
        deletePosition={deletePosition}
        displayList={displayList}
        memoryList={memoryList}
        codeLanguage={codeLanguage}
        listSize={listSize}
        setIsAnimating={setIsAnimating}
        setIsPlaying={setIsPlaying}
        setDisplayList={setDisplayList}
        setMemoryList={setMemoryList}
        setOriginalList={setOriginalList}
        setCurrentNodeIndex={setCurrentNodeIndex}
        setCurrentCodeLine={setCurrentCodeLine}
        setCurrentMemoryIndex={setCurrentMemoryIndex}
        setNodeStates={setNodeStates}
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

export default LinkedListVisualizerPage;