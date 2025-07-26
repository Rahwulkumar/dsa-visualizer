import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronDown, 
  Search, 
  Plus, 
  Minus, 
  MousePointer,
  ArrowLeft,
  Activity,
  Cpu,
  HelpCircle,
  Settings,
  Code,
  Menu,
  X,
  Layers,
  Database
} from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import SpaceBackground from '../components/3d/SpaceBackground';
import AsteroidField from '../components/3d/AsteroidField';
import FloatingParticles from '../components/3d/FloatingParticles';

const ArrayVisualizerPage = () => {
  const navigate = useNavigate();
  
  // Enhanced state management for TRUE visual movement animation
  const [arraySize, setArraySize] = useState(8); // User-configurable array size
  const [originalArray, setOriginalArray] = useState([42, 17, 89, 23, 56, 91, 34, 78]);
  const [displayArray, setDisplayArray] = useState([42, 17, 89, 23, 56, 91, 34, 78]); 
  const [memoryArray, setMemoryArray] = useState([42, 17, 89, 23, 56, 91, 34, 78]);
  const [operation, setOperation] = useState('search');
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  
  // Enhanced UI state
  const [codeLanguage, setCodeLanguage] = useState('python'); // python, java, c
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Enhanced animation state tracking with visual movement
  const [currentElementIndex, setCurrentElementIndex] = useState(-1);
  const [currentCodeLine, setCurrentCodeLine] = useState(-1);
  const [currentMemoryIndex, setCurrentMemoryIndex] = useState(-1);
  const [elementStates, setElementStates] = useState({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationStep, setAnimationStep] = useState('Ready to start...');
  const [foundIndex, setFoundIndex] = useState(-1);
  
  // Enhanced memory visualization
  const [heapMemory, setHeapMemory] = useState({});
  const [stackMemory, setStackMemory] = useState([]);
  const [currentStackFrame, setCurrentStackFrame] = useState(null);
  const [currentIteration, setCurrentIteration] = useState(-1);
  const [loopVariable, setLoopVariable] = useState('');
  
  // Visual movement tracking for TRUE animations
  const [movingElements, setMovingElements] = useState({}); // Track elements that are visually moving
  const [cursorPosition, setCursorPosition] = useState(-1); // Visual cursor for search operations
  const [shiftingElements, setShiftingElements] = useState({}); // Track elements being shifted
  const [loopIteration, setLoopIteration] = useState(0); // Current iteration counter
  
  // Input values
  const [searchValue, setSearchValue] = useState('');
  const [accessIndex, setAccessIndex] = useState('');
  const [insertValue, setInsertValue] = useState('');
  const [insertIndex, setInsertIndex] = useState('');
  const [deleteIndex, setDeleteIndex] = useState('');
  
  // Animation control and memory
  const animationRef = useRef(null);
  const baseMemoryAddress = 0x2000;
  
  // Tooltip state
  const [tooltip, setTooltip] = useState({ show: false, content: '', x: 0, y: 0 });

  // Get base memory address based on language
  const getBaseAddress = () => {
    switch(codeLanguage) {
      case 'c': return 0x7fff5fbff000;
      case 'java': return 0x00007f8b1c000000;
      case 'python': return 0x7f8b1c000000;
      default: return 0x7fff5fbff000;
    }
  };

  // Initialize memory model based on programming language
  const initializeMemoryModel = useCallback(() => {
    const baseAddr = getBaseAddress();
    
    if (codeLanguage === 'c') {
      // C uses stack allocation for arrays
      setStackMemory([
        { name: 'main()', variables: { arr: `int[${arraySize}]`, i: 'int', temp: 'int' } },
      ]);
      setHeapMemory({});
    } else if (codeLanguage === 'java') {
      // Java uses heap for arrays, stack for references
      setStackMemory([
        { name: 'main()', variables: { arr: 'int[]', i: 'int', temp: 'int' } },
      ]);
      setHeapMemory({
        arrayObject: { type: `int[${arraySize}]`, address: baseAddr, data: [...displayArray] }
      });
    } else {
      // Python uses heap for everything
      setStackMemory([
        { name: 'main()', variables: { arr: 'list', i: 'int', temp: 'object' } },
      ]);
      setHeapMemory({
        listObject: { type: 'list', address: baseAddr, data: [...displayArray] }
      });
    }
  }, [codeLanguage, arraySize, displayArray]);

  // Get element style based on state
  const getElementStyle = (index) => {
    const state = elementStates[index];
    let className = "relative w-16 h-16 rounded-xl flex items-center justify-center transition-all duration-500 border-2 cursor-pointer ";
    
    switch(state) {
      case 'checking':
        className += "bg-blue-500/30 border-blue-400 text-blue-100 scale-110 shadow-lg shadow-blue-500/50";
        break;
      case 'found':
        className += "bg-green-500/30 border-green-400 text-green-100 scale-110 shadow-lg shadow-green-500/50 animate-pulse";
        break;
      case 'checked':
        className += "bg-red-500/20 border-red-400/50 text-red-200";
        break;
      case 'accessing':
        className += "bg-cyan-500/30 border-cyan-400 text-cyan-100 scale-110 shadow-lg shadow-cyan-500/50";
        break;
      case 'accessed':
        className += "bg-cyan-500/30 border-cyan-400 text-cyan-100 shadow-lg shadow-cyan-500/50";
        break;
      case 'shifting':
        className += "bg-yellow-500/30 border-yellow-400 text-yellow-100 scale-105 shadow-lg shadow-yellow-500/50";
        break;
      case 'moved':
        className += "bg-purple-500/30 border-purple-400 text-purple-100";
        break;
      case 'inserted':
        className += "bg-green-500/30 border-green-400 text-green-100 scale-110 shadow-lg shadow-green-500/50 animate-pulse";
        break;
      case 'toDelete':
        className += "bg-red-500/30 border-red-400 text-red-100 scale-110 shadow-lg shadow-red-500/50";
        break;
      case 'deleting':
        className += "bg-red-500/30 border-red-400 text-red-100 opacity-30 scale-90";
        break;
      default:
        if (index === currentElementIndex) {
          className += "bg-blue-500/20 border-blue-400/70 text-blue-100 scale-105";
        } else {
          className += "bg-white/10 border-white/30 text-white hover:bg-white/20 hover:scale-105";
        }
        break;
    }
    
    return className;
  };

  // Initialize effects
  useEffect(() => {
    initializeMemoryModel();
  }, [initializeMemoryModel]);

  // Initialize array based on size
  useEffect(() => {
    generateNewArray();
  }, [arraySize]);

  // Ensure page starts at top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Initialize array based on size
  useEffect(() => {
    generateNewArray();
  }, [arraySize]);

  // Ensure page starts at top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Generate array with user-specified size
  const generateNewArray = () => {
    const newArray = Array.from({ length: arraySize }, () => 
      Math.floor(Math.random() * 99) + 1
    );
    setOriginalArray(newArray);
    setDisplayArray([...newArray]);
    setMemoryArray([...newArray]);
    resetAnimation();
  };

  // Multi-language code templates with enhanced detail
  const codeTemplates = {
    python: {
      search: [
        "def linear_search(arr, target):",
        "    for i in range(len(arr)):",
        "        if arr[i] == target:",
        "            return i",
        "    return -1"
      ],
      insert: [
        "def insert_element(arr, index, value):",
        "    arr.append(None)  # Expand array",
        "    for i in range(len(arr)-1, index, -1):",
        "        arr[i] = arr[i-1]  # Shift right",
        "    arr[index] = value  # Insert new value"
      ],
      delete: [
        "def delete_element(arr, index):",
        "    for i in range(index, len(arr)-1):",
        "        arr[i] = arr[i+1]  # Shift left",
        "    arr.pop()  # Remove last element"
      ],
      access: [
        "def access_element(arr, index):",
        "    return arr[index]  # O(1) access"
      ]
    },
    java: {
      search: [
        "public int linearSearch(int[] arr, int target) {",
        "    for (int i = 0; i < arr.length; i++) {",
        "        if (arr[i] == target) {",
        "            return i;",
        "        }",
        "    }",
        "    return -1;",
        "}"
      ],
      insert: [
        "public void insertElement(int[] arr, int index, int value) {",
        "    for (int i = arr.length - 1; i > index; i--) {",
        "        arr[i] = arr[i - 1];  // Shift right",
        "    }",
        "    arr[index] = value;  // Insert new value",
        "}"
      ],
      delete: [
        "public void deleteElement(int[] arr, int index) {",
        "    for (int i = index; i < arr.length - 1; i++) {",
        "        arr[i] = arr[i + 1];  // Shift left",
        "    }",
        "}"
      ],
      access: [
        "public int accessElement(int[] arr, int index) {",
        "    return arr[index];  // O(1) direct access",
        "}"
      ]
    },
    c: {
      search: [
        "int linear_search(int arr[], int n, int target) {",
        "    for (int i = 0; i < n; i++) {",
        "        if (arr[i] == target) {",
        "            return i;",
        "        }",
        "    }",
        "    return -1;",
        "}"
      ],
      insert: [
        "void insert_element(int arr[], int n, int index, int value) {",
        "    for (int i = n; i > index; i--) {",
        "        arr[i] = arr[i-1];  // Shift right",
        "    }",
        "    arr[index] = value;  // Insert new value",
        "}"
      ],
      delete: [
        "void delete_element(int arr[], int n, int index) {",
        "    for (int i = index; i < n-1; i++) {",
        "        arr[i] = arr[i+1];  // Shift left",
        "    }",
        "}"
      ],
      access: [
        "int access_element(int arr[], int index) {",
        "    return arr[index];  // O(1) pointer arithmetic",
        "}"
      ]
    }
  };

  // Tooltip content for code lines (enhanced for multi-language support)
  const codeExplanations = {
    search: [
      "Define a function that searches for a target value in an array",
      "Start a loop to check each element from index 0 to the end",
      "Compare the current element with our target value",
      "If we found a match, return the current index position",
      "Close the if statement block",
      "Close the for loop block",
      "If we've checked all elements without finding the target, return -1",
      "Close the function definition"
    ],
    insert: [
      "Define a function to insert a value at a specific index",
      "Comment explaining we need to create space first",
      "Loop backwards from the end to make room for the new element",
      "Shift each element one position to the right",
      "Close the shifting loop",
      "Comment explaining the insertion step",
      "Place the new value at the target index position",
      "Close the function definition"
    ],
    delete: [
      "Define a function to remove an element at a specific index",
      "Comment explaining we need to fill the gap",
      "Loop from the deletion point to the second-to-last element",
      "Move each element one position to the left",
      "Close the shifting loop",
      "Comment explaining array size reduction",
      "Reduce the array length to remove the last duplicate",
      "Close the function definition"
    ],
    access: [
      "Define a function to access an element at a specific index",
      "Comment explaining bounds checking",
      "Verify the index is within valid array bounds",
      "Comment explaining direct access efficiency",
      "Calculate memory address and return the value (O(1) operation)",
      "Close the if statement",
      "Throw an error if the index is invalid",
      "Close the function definition"
    ]
  };

  // Sleep function for animation timing
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Reset all animation states
  const resetAnimation = () => {
    setIsPlaying(false);
    setIsAnimating(false);
    setCurrentElementIndex(-1);
    setCurrentCodeLine(-1);
    setCurrentMemoryIndex(-1);
    setElementStates({});
    setMovingElements({});
    setCursorPosition(-1);
    setShiftingElements({});
    setLoopIteration(0);
    setAnimationStep('Ready for operation');
    setFoundIndex(-1);
    setDisplayArray([...originalArray]);
    setMemoryArray([...originalArray]);
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
  };

  // TRUE STEP-BY-STEP SEARCH ANIMATION
  const animateSearch = async () => {
    const target = parseInt(searchValue);
    if (isNaN(target)) {
      alert('Please enter a valid search value');
      return;
    }

    setAnimationStep('Starting linear search...');
    setCurrentCodeLine(0); // Function definition
    await sleep(speed * 0.5);
    
    setCurrentCodeLine(1); // For loop line
    setAnimationStep('Beginning loop through array elements');
    await sleep(speed * 0.7);
    
    // TRUE step-by-step search - each element individually
    for (let i = 0; i < displayArray.length; i++) {
      if (!isPlaying) break;
      
      // Highlight current loop iteration
      setCurrentCodeLine(1);
      setCurrentElementIndex(i);
      setCurrentMemoryIndex(i);
      setAnimationStep(`Checking element at index ${i}`);
      
      // Show element being examined (blue highlight)
      setElementStates(prev => ({ ...prev, [i]: 'examining' }));
      await sleep(speed * 0.8);
      
      // Highlight the if condition
      setCurrentCodeLine(2);
      setAnimationStep(`Comparing ${displayArray[i]} with target ${target}`);
      await sleep(speed * 0.6);
      
      // Check if it's a match
      if (displayArray[i] === target) {
        // FOUND! Highlight return statement
        setCurrentCodeLine(3);
        setElementStates(prev => ({ ...prev, [i]: 'found' }));
        setFoundIndex(i);
        setAnimationStep(`Target found at index ${i}!`);
        await sleep(speed * 1.5);
        return;
      } else {
        // Not a match - show red briefly then fade
        setElementStates(prev => ({ ...prev, [i]: 'notMatch' }));
        await sleep(speed * 0.4);
        setElementStates(prev => ({ ...prev, [i]: 'checked' }));
        await sleep(speed * 0.3);
      }
    }
    
    // Not found
    setCurrentCodeLine(6);
    setAnimationStep('Target not found in array');
    setCurrentElementIndex(-1);
    setCurrentMemoryIndex(-1);
    await sleep(speed);
  };

  // TRUE STEP-BY-STEP INSERT ANIMATION
  const animateInsert = async () => {
    const index = parseInt(insertIndex);
    const value = parseInt(insertValue);
    
    if (isNaN(index) || isNaN(value) || index < 0 || index > displayArray.length) {
      alert(`Please enter valid index (0 to ${displayArray.length}) and value`);
      return;
    }

    setAnimationStep('Starting insertion operation...');
    setCurrentCodeLine(0); // Function definition
    await sleep(speed * 0.5);
    
    // Show insertion marker
    setCurrentElementIndex(index);
    setCurrentMemoryIndex(index);
    setAnimationStep(`Preparing to insert ${value} at index ${index}`);
    await sleep(speed * 0.8);
    
    setCurrentCodeLine(1); // Comment about shifting
    setAnimationStep('Need to create space by shifting elements right');
    await sleep(speed * 0.7);
    
    setCurrentCodeLine(2); // For loop for shifting
    setAnimationStep('Starting shift operation from the end...');
    await sleep(speed * 0.6);
    
    // TRUE step-by-step shifting - ONE element at a time
    const newDisplayArray = [...displayArray];
    const newMemoryArray = [...memoryArray];
    
    for (let i = displayArray.length - 1; i >= index; i--) {
      if (!isPlaying) break;
      
      setCurrentCodeLine(3); // Array assignment line
      setCurrentElementIndex(i);
      setCurrentMemoryIndex(i);
      setElementStates(prev => ({ ...prev, [i]: 'shifting' }));
      setAnimationStep(`Shifting element ${displayArray[i]} from index ${i} to ${i + 1}`);
      
      // Visual shift - element moves right
      await sleep(speed * 0.4);
      
      // Update both display and memory arrays step by step
      if (i === displayArray.length - 1) {
        // Adding new element at the end
        newDisplayArray.push(displayArray[i]);
        newMemoryArray.push(memoryArray[i]);
      } else {
        // Shifting existing element
        newDisplayArray[i + 1] = displayArray[i];
        newMemoryArray[i + 1] = memoryArray[i];
      }
      
      setDisplayArray([...newDisplayArray]);
      setMemoryArray([...newMemoryArray]);
      setElementStates(prev => ({ ...prev, [i]: 'shifted', [i + 1]: 'shifted' }));
      
      await sleep(speed * 0.6);
    }
    
    // Insert the new element
    setCurrentCodeLine(5); // Comment about insertion
    setAnimationStep('Space created, now inserting new element...');
    await sleep(speed * 0.5);
    
    setCurrentCodeLine(6); // Actual insertion line
    newDisplayArray[index] = value;
    newMemoryArray[index] = value;
    setDisplayArray([...newDisplayArray]);
    setMemoryArray([...newMemoryArray]);
    setOriginalArray([...newDisplayArray]);
    
    setElementStates(prev => ({ ...prev, [index]: 'inserted' }));
    setAnimationStep(`Successfully inserted ${value} at index ${index}`);
    await sleep(speed);
  };

  // TRUE STEP-BY-STEP DELETE ANIMATION  
  const animateDelete = async () => {
    const index = parseInt(deleteIndex);
    
    if (isNaN(index) || index < 0 || index >= displayArray.length) {
      alert(`Please enter valid index (0 to ${displayArray.length - 1})`);
      return;
    }

    const deletedValue = displayArray[index];
    setAnimationStep('Starting deletion operation...');
    setCurrentCodeLine(0); // Function definition
    await sleep(speed * 0.5);
    
    // Highlight element to be deleted
    setCurrentElementIndex(index);
    setCurrentMemoryIndex(index);
    setElementStates(prev => ({ ...prev, [index]: 'toDelete' }));
    setAnimationStep(`Marking element ${deletedValue} at index ${index} for deletion`);
    await sleep(speed * 0.8);
    
    // Fade out the deleted element
    setElementStates(prev => ({ ...prev, [index]: 'deleting' }));
    setAnimationStep('Removing element...');
    await sleep(speed * 0.6);
    
    setCurrentCodeLine(1); // Comment about shifting
    setAnimationStep('Shifting elements left to fill the gap...');
    await sleep(speed * 0.7);
    
    setCurrentCodeLine(2); // For loop for shifting
    
    // TRUE step-by-step left shifting - ONE element at a time
    const newDisplayArray = [...displayArray];
    const newMemoryArray = [...memoryArray];
    
    for (let i = index; i < displayArray.length - 1; i++) {
      if (!isPlaying) break;
      
      setCurrentCodeLine(3); // Array assignment line
      setCurrentElementIndex(i + 1);
      setCurrentMemoryIndex(i + 1);
      setElementStates(prev => ({ 
        ...prev, 
        [i + 1]: 'shifting',
        [i]: 'receiving'
      }));
      setAnimationStep(`Moving element ${displayArray[i + 1]} from index ${i + 1} to ${i}`);
      
      await sleep(speed * 0.4);
      
      // Update arrays step by step
      newDisplayArray[i] = displayArray[i + 1];
      newMemoryArray[i] = memoryArray[i + 1];
      setDisplayArray([...newDisplayArray]);
      setMemoryArray([...newMemoryArray]);
      
      setElementStates(prev => ({ ...prev, [i]: 'shifted' }));
      await sleep(speed * 0.6);
    }
    
    // Remove the last duplicate element
    setCurrentCodeLine(5); // Comment about size reduction
    setAnimationStep('Removing duplicate element...');
    await sleep(speed * 0.5);
    
    setCurrentCodeLine(6); // Array length reduction
    newDisplayArray.pop();
    newMemoryArray.pop();
    setDisplayArray([...newDisplayArray]);
    setMemoryArray([...newMemoryArray]);
    setOriginalArray([...newDisplayArray]);
    
    setAnimationStep(`Successfully deleted ${deletedValue}`);
    await sleep(speed);
  };

  // TRUE STEP-BY-STEP ACCESS ANIMATION
  const animateAccess = async () => {
    const index = parseInt(accessIndex);
    if (isNaN(index) || index < 0 || index >= displayArray.length) {
      alert(`Please enter valid index (0 to ${displayArray.length - 1})`);
      return;
    }

    setAnimationStep('Starting access operation...');
    setCurrentCodeLine(0); // Function definition
    await sleep(speed * 0.5);
    
    setCurrentCodeLine(1); // Comment about bounds checking
    setAnimationStep('Checking if index is within bounds...');
    await sleep(speed * 0.7);
    
    setCurrentCodeLine(2); // Bounds check condition
    setAnimationStep(`Verifying index ${index} is valid for array of length ${displayArray.length}`);
    await sleep(speed * 0.8);
    
    setCurrentCodeLine(3); // Comment about O(1) access
    setAnimationStep('Index is valid, performing direct memory access...');
    await sleep(speed * 0.6);
    
    setCurrentCodeLine(4); // Return statement
    setCurrentElementIndex(index);
    setCurrentMemoryIndex(index);
    setElementStates(prev => ({ ...prev, [index]: 'accessed' }));
    setAnimationStep(`Accessing value ${displayArray[index]} at index ${index} - O(1) operation`);
    await sleep(speed * 1.2);
  };

  // Main animation starter
  const startAnimation = async () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setIsPlaying(true);
    resetAnimation();
    
    try {
      switch (operation) {
        case 'search':
          await animateSearch();
          break;
        case 'insert':
          await animateInsert();
          break;
        case 'delete':
          await animateDelete();
          break;
        case 'access':
          await animateAccess();
          break;
      }
    } catch (error) {
      console.error('Animation error:', error);
    }
    
    setIsAnimating(false);
    setIsPlaying(false);
    setCurrentCodeLine(-1);
    setCurrentElementIndex(-1);
    setCurrentMemoryIndex(-1);
  };

  const initializeArray = () => {
    generateNewArray(); // Use the new generation function
  };

  // Tooltip handlers
  const showTooltip = (content, event) => {
    setTooltip({
      show: true,
      content,
      x: event.clientX,
      y: event.clientY
    });
  };

  const hideTooltip = () => {
    setTooltip({ show: false, content: '', x: 0, y: 0 });
  };



  // Get memory block style based on state
  const getMemoryStyle = (index) => {
    const isCurrentMemory = currentMemoryIndex === index;
    const elementState = elementStates[index];
    
    if (isCurrentMemory || elementState === 'examining' || elementState === 'found' || elementState === 'shifting' || elementState === 'inserted' || elementState === 'accessed') {
      return 'bg-cyan-500/30 border-cyan-500/60 shadow-lg shadow-cyan-500/20 scale-105';
    } else if (elementState === 'deleting') {
      return 'bg-red-500/20 border-red-500/40 opacity-50';
    }
    
    return 'bg-gray-800/50 border-gray-600/30 hover:border-gray-500/50';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-space-deep to-space-dark">
      {/* 3D Space Background */}
      <div className="fixed inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          style={{ background: 'radial-gradient(circle at 30% 20%, #0a0a0f 0%, #000000 100%)' }}
        >
          <ambientLight intensity={0.1} />
          <pointLight position={[10, 10, 10]} intensity={0.5} />
          
          {/* Starfield background */}
          <Stars 
            radius={400} 
            depth={60} 
            count={3000} 
            factor={3} 
            saturation={0} 
            fade={true}
            speed={0.3}
          />
          
          {/* Custom space elements */}
          <SpaceBackground />
          <AsteroidField />
          <FloatingParticles />
          
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={true}
            autoRotate={true}
            autoRotateSpeed={0.2}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
        </Canvas>
      </div>

      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-cyan-400 rounded-full animate-twinkle opacity-30" />
        <div className="absolute top-1/3 right-1/3 w-0.5 h-0.5 bg-blue-400 rounded-full animate-twinkle opacity-20" 
             style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/6 w-1 h-1 bg-purple-400 rounded-full animate-twinkle opacity-25" 
             style={{ animationDelay: '2s' }} />
      </div>

      {/* Minimal Navigation */}
      <div className="relative z-10 p-6">
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate('/array-info')}
            className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-2 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Array Info
          </button>
          
          {/* Minimal Status Indicator */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isAnimating ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
              <span className="text-white/60 text-sm">
                {isAnimating ? 'Animation Running' : 'Ready'}
              </span>
            </div>
            
            {/* Sidebar Toggle Button */}
            <motion.button
              onClick={() => setSidebarOpen(true)}
              disabled={isAnimating}
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 0 25px rgba(6, 182, 212, 0.5)"
              }}
              whileTap={{ scale: 0.95 }}
              className="relative bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 shadow-lg group overflow-hidden"
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              
              <Settings className="w-4 h-4 relative z-10 group-hover:rotate-90 transition-transform duration-300" />
              <span className="relative z-10">Open Controls</span>
              
              {/* Pulsing indicator when animation is ready */}
              {!isAnimating && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Floating Status Widget (when sidebar is closed) */}
      {/* Status widget removed - opens only when user clicks controls */}

      {/* Sidebar Controls */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop with blur effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 enhanced-backdrop"
              onClick={() => setSidebarOpen(false)}
            />
            
            {/* Sidebar */}
            <motion.div
              initial={{ x: -450, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -450, opacity: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 26 }}
              className="fixed left-0 top-0 h-full w-[420px] sidebar-glass z-50"
            >
              {/* Sidebar Header with Gradient */}
              <div className="relative bg-gradient-to-r from-cyan-600/20 via-blue-600/20 to-purple-600/20 border-b border-gray-700/60 backdrop-blur-sm">
                <div className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-500/20 rounded-lg border border-cyan-500/30">
                      <Settings className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Array Controls</h2>
                      <p className="text-sm text-gray-400">Configure your visualization</p>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => setSidebarOpen(false)}
                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(239, 68, 68, 0.2)' }}
                    whileTap={{ scale: 0.95 }}
                    className="text-gray-400 hover:text-white transition-all p-2 rounded-lg border border-gray-600/50 hover:border-red-500/50"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>
                
                {/* Progress indicator */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  />
                </div>
              </div>
              
              {/* Sidebar Content */}
              <div className="flex flex-col h-full">
                <div className="flex-1 p-6 space-y-8 overflow-y-auto custom-scrollbar">
                  
                  {/* Array Configuration */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">⚙️</span>
                      </div>
                      <label className="text-white font-semibold text-lg">Array Configuration</label>
                    </div>

                    <div className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 rounded-xl p-5 border border-gray-700/50 space-y-4">
                      {/* Array Size */}
                      <div>
                        <label className="block text-white font-medium mb-2">Array Size</label>
                        <div className="flex items-center gap-3">
                          <select
                            value={arraySize}
                            onChange={(e) => setArraySize(parseInt(e.target.value))}
                            disabled={isAnimating}
                            className="flex-1 bg-gray-800/80 text-white border border-gray-600 rounded-xl px-4 py-3 text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all backdrop-blur-sm"
                          >
                            {[3,4,5,6,7,8,9,10].map(size => (
                              <option key={size} value={size}>{size} elements</option>
                            ))}
                          </select>
                          <motion.button
                            onClick={generateNewArray}
                            disabled={isAnimating}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 disabled:opacity-50 text-white px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2"
                          >
                            <RotateCcw className="w-4 h-4" />
                            New
                          </motion.button>
                        </div>
                        <div className="text-xs text-gray-400 mt-2">
                          Current array length: {displayArray.length} elements
                        </div>
                      </div>

                      {/* Code Language */}
                      <div>
                        <label className="block text-white font-medium mb-2">Code Language</label>
                        <select
                          value={codeLanguage}
                          onChange={(e) => setCodeLanguage(e.target.value)}
                          className="w-full bg-gray-800/80 text-white border border-gray-600 rounded-xl px-4 py-3 text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all backdrop-blur-sm"
                        >
                          <option value="python">🐍 Python</option>
                          <option value="java">☕ Java</option>
                          <option value="c">⚡ C</option>
                        </select>
                        <div className="text-xs text-gray-400 mt-2">
                          Choose your preferred programming language for code display
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Current Operation Status */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 rounded-xl p-4 border border-gray-700/50"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-3 h-3 rounded-full ${isAnimating ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
                      <span className="text-white font-semibold">Status</span>
                    </div>
                    <p className="text-sm text-gray-300">
                      {isAnimating ? 'Animation in progress...' : 'Ready for operation'}
                    </p>
                    {isAnimating && (
                      <div className="mt-2 bg-gray-800 rounded-full h-2 overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                          animate={{ width: ["0%", "100%"] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </div>
                    )}
                  </motion.div>

                  {/* Operation Selection */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">1</span>
                      </div>
                      <label className="text-white font-semibold text-lg">Choose Operation</label>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        { 
                          value: 'search', 
                          icon: '🔍', 
                          label: 'Linear Search', 
                          complexity: 'O(n)',
                          desc: 'Find element by value', 
                          color: 'from-emerald-500/20 to-teal-500/20',
                          borderColor: 'border-emerald-500/30'
                        },
                        { 
                          value: 'access', 
                          icon: '⚡', 
                          label: 'Direct Access', 
                          complexity: 'O(1)',
                          desc: 'Get value by index', 
                          color: 'from-yellow-500/20 to-orange-500/20',
                          borderColor: 'border-yellow-500/30'
                        },
                        { 
                          value: 'insert', 
                          icon: '➕', 
                          label: 'Insert Element', 
                          complexity: 'O(n)',
                          desc: 'Add element at position', 
                          color: 'from-blue-500/20 to-indigo-500/20',
                          borderColor: 'border-blue-500/30'
                        },
                        { 
                          value: 'delete', 
                          icon: '❌', 
                          label: 'Delete Element', 
                          complexity: 'O(n)',
                          desc: 'Remove element from array', 
                          color: 'from-red-500/20 to-pink-500/20',
                          borderColor: 'border-red-500/30'
                        }
                      ].map((op, index) => (
                        <motion.button
                          key={op.value}
                          onClick={() => setOperation(op.value)}
                          disabled={isAnimating}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                          className={`relative p-4 rounded-xl border-2 transition-all text-left group operation-button ${
                            operation === op.value
                              ? `${op.color} ${op.borderColor} shadow-lg scale-105`
                              : 'bg-gray-800/50 border-gray-600/50 hover:border-gray-500/70 hover:bg-gray-800/70'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`text-2xl p-2 rounded-lg ${operation === op.value ? 'bg-white/10' : 'bg-gray-700/50'} transition-all`}>
                                {op.icon}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`font-semibold ${operation === op.value ? 'text-white' : 'text-gray-300'}`}>
                                    {op.label}
                                  </span>
                                  <span className={`text-xs px-2 py-1 rounded-full font-mono ${
                                    operation === op.value ? 'bg-white/20 text-white' : 'bg-gray-700 text-gray-400'
                                  }`}>
                                    {op.complexity}
                                  </span>
                                </div>
                                <div className={`text-sm ${operation === op.value ? 'text-gray-200' : 'text-gray-500'}`}>
                                  {op.desc}
                                </div>
                              </div>
                            </div>
                            {operation === op.value && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center"
                              >
                                <motion.div
                                  initial={{ pathLength: 0 }}
                                  animate={{ pathLength: 1 }}
                                  transition={{ duration: 0.3 }}
                                  className="w-3 h-3 text-white"
                                >
                                  ✓
                                </motion.div>
                              </motion.div>
                            )}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                  
                  {/* Operation Parameters */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">2</span>
                      </div>
                      <label className="text-white font-semibold text-lg">Configure Parameters</label>
                    </div>

                    <AnimatePresence mode="wait">
                      {operation === 'access' && (
                        <motion.div
                          key="access"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-3"
                        >
                          <label className="block text-white font-medium">Array Index</label>
                          <div className="relative">
                            <input
                              type="number"
                              value={accessIndex}
                              onChange={(e) => setAccessIndex(e.target.value)}
                              disabled={isAnimating}
                              className="w-full bg-gray-800/80 text-white border border-gray-600 rounded-xl px-4 py-3 text-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all backdrop-blur-sm"
                              placeholder={`Enter index (0-${displayArray.length - 1})`}
                              min="0"
                              max={displayArray.length - 1}
                            />
                            <div className="absolute right-3 top-3 text-gray-400 text-sm">
                              Max: {displayArray.length - 1}
                            </div>
                          </div>
                          <div className="text-xs text-gray-400 bg-gray-800/50 p-2 rounded-lg">
                            💡 Access any element in constant time O(1)
                          </div>
                        </motion.div>
                      )}
                      
                      {operation === 'search' && (
                        <motion.div
                          key="search"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-3"
                        >
                          <label className="block text-white font-medium">Search Value</label>
                          <div className="relative">
                            <input
                              type="number"
                              value={searchValue}
                              onChange={(e) => setSearchValue(e.target.value)}
                              disabled={isAnimating}
                              className="w-full bg-gray-800/80 text-white border border-gray-600 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all backdrop-blur-sm"
                              placeholder="Enter value to find"
                            />
                            <div className="absolute right-3 top-3 text-gray-400">
                              🔍
                            </div>
                          </div>
                          <div className="text-xs text-gray-400 bg-gray-800/50 p-2 rounded-lg">
                            💡 Linear search checks each element sequentially
                          </div>
                        </motion.div>
                      )}
                      
                      {operation === 'insert' && (
                        <motion.div
                          key="insert"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-4"
                        >
                          <div>
                            <label className="block text-white font-medium mb-2">New Value</label>
                            <input
                              type="number"
                              value={insertValue}
                              onChange={(e) => setInsertValue(e.target.value)}
                              disabled={isAnimating}
                              className="w-full bg-gray-800/80 text-white border border-gray-600 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all backdrop-blur-sm"
                              placeholder="Enter new value"
                            />
                          </div>
                          <div>
                            <label className="block text-white font-medium mb-2">Insert Position</label>
                            <div className="relative">
                              <input
                                type="number"
                                value={insertIndex}
                                onChange={(e) => setInsertIndex(e.target.value)}
                                disabled={isAnimating}
                                className="w-full bg-gray-800/80 text-white border border-gray-600 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all backdrop-blur-sm"
                                placeholder={`Position (0-${displayArray.length})`}
                                min="0"
                                max={displayArray.length}
                              />
                              <div className="absolute right-3 top-3 text-gray-400 text-sm">
                                Max: {displayArray.length}
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-400 bg-gray-800/50 p-2 rounded-lg">
                            💡 Elements after insertion point will shift right
                          </div>
                        </motion.div>
                      )}
                      
                      {operation === 'delete' && (
                        <motion.div
                          key="delete"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="space-y-3"
                        >
                          <label className="block text-white font-medium">Index to Delete</label>
                          <div className="relative">
                            <input
                              type="number"
                              value={deleteIndex}
                              onChange={(e) => setDeleteIndex(e.target.value)}
                              disabled={isAnimating}
                              className="w-full bg-gray-800/80 text-white border border-gray-600 rounded-xl px-4 py-3 text-sm focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all backdrop-blur-sm"
                              placeholder={`Index (0-${displayArray.length - 1})`}
                              min="0"
                              max={displayArray.length - 1}
                            />
                            <div className="absolute right-3 top-3 text-gray-400 text-sm">
                              Max: {displayArray.length - 1}
                            </div>
                          </div>
                          <div className="text-xs text-gray-400 bg-gray-800/50 p-2 rounded-lg">
                            💡 Elements after deletion point will shift left
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                  
                  {/* Animation Settings */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">3</span>
                      </div>
                      <label className="text-white font-semibold text-lg">Animation Settings</label>
                    </div>

                    <div className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 rounded-xl p-5 border border-gray-700/50">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-white font-medium">Speed</span>
                        <span className="text-cyan-400 font-mono text-sm bg-cyan-500/20 px-2 py-1 rounded">
                          {speed}ms
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type="range"
                          min="300"
                          max="2000"
                          value={speed}
                          onChange={(e) => setSpeed(Number(e.target.value))}
                          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-slider"
                          style={{
                            background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${((speed - 300) / 1700) * 100}%, #374151 ${((speed - 300) / 1700) * 100}%, #374151 100%)`
                          }}
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-2">
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            Fast
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                            Slow
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
                
                {/* Action Buttons - Fixed at bottom */}
                <div className="p-6 border-t border-gray-700/50 bg-gradient-to-t from-gray-900/95 to-transparent backdrop-blur-sm">
                  <div className="space-y-3">
                    <motion.button
                      onClick={() => {
                        startAnimation();
                        setSidebarOpen(false);
                      }}
                      disabled={isAnimating}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-400 hover:via-blue-400 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 px-6 rounded-xl text-lg font-bold transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-cyan-500/25 relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                      <Play className="w-5 h-5 relative z-10" />
                      <span className="relative z-10">
                        {isAnimating ? 'Animation Running...' : 'Start Visualization'}
                      </span>
                    </motion.button>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <motion.button
                        onClick={resetAnimation}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-gray-700/80 hover:bg-gray-600/80 text-white py-3 px-4 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 border border-gray-600/50"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Reset
                      </motion.button>
                      
                      <motion.button
                        onClick={() => setSidebarOpen(false)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-gray-800/80 hover:bg-gray-700/80 text-gray-300 hover:text-white py-3 px-4 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 border border-gray-600/50"
                      >
                        <X className="w-4 h-4" />
                        Close
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* FIXED LAYOUT - Everything Visible Simultaneously */}
      <div className={`relative z-10 p-4 transition-all duration-300 ${sidebarOpen ? 'blur-sm pointer-events-none' : ''}`}>
        <div className="max-w-[1600px] mx-auto">
          
          {/* THREE-PANEL SIMULTANEOUS VIEW */}
          <div className="grid grid-cols-12 gap-4 h-[calc(100vh-200px)]">
            
            {/* LEFT PANEL: CODE EXECUTION (4 columns) */}
            <div className="col-span-4 flex flex-col">
              <div className="glass-card p-4 h-full flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Code className="w-5 h-5 text-cyan-400" />
                    Code ({codeLanguage.toUpperCase()})
                  </h3>
                  <div className="flex items-center gap-2 text-sm">
                    <div className={`w-2 h-2 rounded-full ${isAnimating ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
                    <span className="text-white/70">{isAnimating ? 'Running' : 'Ready'}</span>
                  </div>
                </div>
                
                {/* Code Display with Real-time Highlighting */}
                <div className="bg-gray-900/90 rounded-lg p-4 font-mono text-sm flex-1 overflow-auto">
                  {(codeTemplates[codeLanguage]?.[operation] || []).map((line, index) => (
                    <motion.div
                      key={index}
                      className={`py-1 px-2 rounded transition-all duration-300 ${
                        currentCodeLine === index 
                          ? 'bg-cyan-500/30 border-l-4 border-cyan-400 text-cyan-100 shadow-lg' 
                          : 'text-gray-300 hover:bg-gray-800/50'
                      }`}
                      animate={{
                        scale: currentCodeLine === index ? 1.02 : 1,
                        x: currentCodeLine === index ? 8 : 0
                      }}
                    >
                      <span className="text-gray-500 mr-3 w-6 inline-block text-right">{index + 1}</span>
                      {line}
                    </motion.div>
                  ))}
                </div>
                
                {/* Live Status */}
                <div className="mt-3 p-3 bg-black/40 rounded-lg border border-cyan-500/30">
                  <div className="text-cyan-400 text-sm font-medium mb-1">Live Status:</div>
                  <div className="text-white text-sm">{animationStep}</div>
                  {loopVariable && (
                    <div className="text-yellow-400 text-xs mt-1">Loop: {loopVariable}</div>
                  )}
                </div>
              </div>
            </div>
            
            {/* CENTER PANEL: ARRAY VISUALIZATION (5 columns) */}
            <div className="col-span-5 flex flex-col">
              <div className="glass-card p-4 h-full flex flex-col">
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-cyan-400" />
                    Array Visualization
                    <span className="text-sm text-gray-400">({displayArray.length} elements)</span>
                  </h3>
                </div>
                
                {/* Array Elements - Responsive Grid */}
                <div className="flex-1 flex items-center justify-center">
                  <div className="w-full max-w-full overflow-x-auto">
                    <div className="flex justify-center items-center gap-3 p-4 min-w-max">
                      <AnimatePresence mode="popLayout">
                        {displayArray.map((value, index) => (
                          <motion.div
                            key={`array-${index}-${value}`}
                            layout
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ 
                              opacity: elementStates[index] === 'deleting' ? 0.3 : 1,
                              scale: currentElementIndex === index ? 1.15 : 1,
                              y: 0,
                              rotateY: currentElementIndex === index ? [0, 10, -10, 0] : 0
                            }}
                            exit={{ opacity: 0, scale: 0.8, y: -20 }}
                            transition={{ 
                              duration: 0.5,
                              type: "spring",
                              stiffness: 300,
                              damping: 20
                            }}
                            className="relative flex flex-col items-center"
                          >
                            {/* Index label */}
                            <div className="text-white/60 font-mono text-xs mb-1 font-semibold">
                              [{index}]
                            </div>
                            
                            {/* Element box */}
                            <div className={getElementStyle(index)}>
                              <span className="relative z-10 text-lg font-bold">{value}</span>
                              
                              {/* Current element indicator */}
                              {currentElementIndex === index && (
                                <motion.div
                                  className="absolute -inset-1 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-xl"
                                  animate={{ opacity: [0.5, 1, 0.5] }}
                                  transition={{ duration: 1, repeat: Infinity }}
                                />
                              )}
                            </div>
                            
                            {/* Memory address */}
                            <div className="text-white/40 font-mono text-xs mt-1">
                              0x{(getBaseAddress() + index * 4).toString(16).toUpperCase()}
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
                
                {/* Operation Status */}
                <div className="mt-3 text-center">
                  {currentIteration >= 0 && operation === 'search' && (
                    <div className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-lg text-sm">
                      Iteration {currentIteration + 1} of {displayArray.length}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* RIGHT PANEL: MEMORY LAYOUT (3 columns) */}
            <div className="col-span-3 flex flex-col gap-4">
              
              {/* Stack Memory */}
              <div className="glass-card p-3 flex-1">
                <h4 className="text-md font-bold text-white mb-2 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-green-400" />
                  Stack Memory
                </h4>
                <div className="space-y-2">
                  {stackMemory.map((frame, index) => (
                    <div key={index} className="bg-green-500/10 border border-green-500/30 rounded-lg p-2">
                      <div className="text-green-300 text-sm font-semibold mb-1">{frame.name}</div>
                      {Object.entries(frame.variables).map(([name, type]) => (
                        <div key={name} className="text-xs text-gray-300 flex justify-between">
                          <span>{name}:</span>
                          <span className="text-green-400">{type}</span>
                        </div>
                      ))}
                      {currentStackFrame && (
                        <div className="mt-1 pt-1 border-t border-green-500/20">
                          <div className="text-xs text-yellow-300">
                            i = {currentStackFrame.i || 0}
                          </div>
                          {currentStackFrame.currentValue && (
                            <div className="text-xs text-cyan-300">
                              current = {currentStackFrame.currentValue}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Heap Memory */}
              <div className="glass-card p-3 flex-1">
                <h4 className="text-md font-bold text-white mb-2 flex items-center gap-2">
                  <Database className="w-4 h-4 text-purple-400" />
                  Heap Memory
                </h4>
                <div className="space-y-2">
                  {Object.entries(heapMemory).map(([key, obj]) => (
                    <div key={key} className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-2">
                      <div className="text-purple-300 text-sm font-semibold mb-1">{obj.type}</div>
                      <div className="text-xs text-gray-400 mb-1">
                        {obj.address.toString(16).toUpperCase()}
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        {obj.data.slice(0, 6).map((val, idx) => (
                          <div 
                            key={idx} 
                            className={`text-xs p-1 rounded text-center ${
                              currentMemoryIndex === idx 
                                ? 'bg-purple-500 text-white' 
                                : 'bg-purple-500/20 text-purple-200'
                            }`}
                          >
                            {val}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Memory Stats */}
              <div className="glass-card p-3">
                <h4 className="text-sm font-bold text-white mb-2">Memory Stats</h4>
                <div className="space-y-1 text-xs text-gray-300">
                  <div className="flex justify-between">
                    <span>Array Size:</span>
                    <span className="text-cyan-400">{displayArray.length * 4} bytes</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Elements:</span>
                    <span className="text-white">{displayArray.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Language:</span>
                    <span className="text-yellow-400">{codeLanguage.toUpperCase()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {tooltip.show && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed z-50 bg-black/90 text-white px-3 py-2 rounded-lg text-sm pointer-events-none"
            style={{ left: tooltip.x, top: tooltip.y - 40 }}
          >
            {tooltip.content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ArrayVisualizerPage;