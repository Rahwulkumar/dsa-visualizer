import React, { useState, useEffect, useRef } from 'react';
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
  X
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
  const [controlsVisible, setControlsVisible] = useState(true);
  
  // Enhanced animation state tracking with visual movement
  const [currentElementIndex, setCurrentElementIndex] = useState(-1);
  const [currentCodeLine, setCurrentCodeLine] = useState(-1);
  const [currentMemoryIndex, setCurrentMemoryIndex] = useState(-1);
  const [elementStates, setElementStates] = useState({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationStep, setAnimationStep] = useState('');
  const [foundIndex, setFoundIndex] = useState(-1);
  
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

  // Get element style based on state
  const getElementStyle = (index) => {
    const state = elementStates[index];
    const isCurrentElement = currentElementIndex === index;
    
    if (state === 'examining' || isCurrentElement) {
      return 'bg-gradient-to-br from-blue-400 to-blue-600 border-blue-300 shadow-2xl shadow-blue-500/50 scale-110';
    } else if (state === 'found' || foundIndex === index) {
      return 'bg-gradient-to-br from-green-400 to-green-600 border-green-300 shadow-2xl shadow-green-500/50 scale-110';
    } else if (state === 'notMatch') {
      return 'bg-gradient-to-br from-red-400 to-red-600 border-red-300 shadow-xl shadow-red-500/50';
    } else if (state === 'checked') {
      return 'bg-gradient-to-br from-gray-400 to-gray-600 border-gray-300 opacity-60';
    } else if (state === 'shifting') {
      return 'bg-gradient-to-br from-yellow-400 to-orange-500 border-yellow-300 shadow-xl shadow-yellow-500/50 scale-105';
    } else if (state === 'shifted') {
      return 'bg-gradient-to-br from-purple-400 to-purple-600 border-purple-300';
    } else if (state === 'inserted') {
      return 'bg-gradient-to-br from-cyan-400 to-cyan-600 border-cyan-300 shadow-2xl shadow-cyan-500/50 scale-110';
    } else if (state === 'toDelete') {
      return 'bg-gradient-to-br from-red-500 to-red-700 border-red-400 shadow-xl shadow-red-500/50';
    } else if (state === 'deleting') {
      return 'bg-gradient-to-br from-red-600 to-red-800 border-red-500 opacity-30 scale-90';
    } else if (state === 'receiving') {
      return 'bg-gradient-to-br from-green-400 to-teal-500 border-green-300 shadow-lg shadow-green-500/30';
    } else if (state === 'accessed') {
      return 'bg-gradient-to-br from-cyan-400 to-blue-500 border-cyan-300 shadow-2xl shadow-cyan-500/50 scale-110';
    }
    
    return 'bg-gradient-to-br from-purple-500 to-pink-500 border-purple-300/50 shadow-lg';
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

      {/* Tooltip */}
      <AnimatePresence>
        {tooltip.show && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed z-50 bg-gray-900/95 text-white p-3 rounded-lg border border-cyan-500/30 backdrop-blur-sm max-w-xs shadow-xl"
            style={{ left: tooltip.x + 10, top: tooltip.y - 40 }}
          >
            <div className="text-sm leading-relaxed">{tooltip.content}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-cyan-400 rounded-full animate-twinkle opacity-30" />
        <div className="absolute top-1/3 right-1/3 w-0.5 h-0.5 bg-blue-400 rounded-full animate-twinkle opacity-20" 
             style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/6 w-1 h-1 bg-purple-400 rounded-full animate-twinkle opacity-25" 
             style={{ animationDelay: '2s' }} />
      </div>

      {/* Navigation */}
      <div className="relative z-10 p-6">
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate('/array-info')}
            className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-2 group"
            onMouseEnter={(e) => showTooltip('Return to the Array information page', e)}
            onMouseLeave={hideTooltip}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Array Info
          </button>
          
          {/* Array Size Configuration */}
          <div className="flex items-center gap-4">
            <label className="text-white/70 text-sm font-medium">Array Size:</label>
            <select
              value={arraySize}
              onChange={(e) => setArraySize(parseInt(e.target.value))}
              disabled={isAnimating}
              className="bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm"
              onMouseEnter={(e) => showTooltip('Choose the size of your array (3-12 elements)', e)}
              onMouseLeave={hideTooltip}
            >
              {[3,4,5,6,7].map(size => (
                <option key={size} value={size}>{size} elements</option>
              ))}
            </select>
            
            <button
              onClick={generateNewArray}
              disabled={isAnimating}
              className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-400 hover:to-teal-400 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
              onMouseEnter={(e) => showTooltip('Generate a new random array', e)}
              onMouseLeave={hideTooltip}
            >
              New Array
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Layout - Operation Controls at Top, Three Panels Below */}
      <div className="relative z-10 px-4 pb-4">
        <div className="max-w-7xl mx-auto space-y-4">
          
          {/* TOP SECTION: Operation Controls (Panel A) */}
          <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Settings className="w-4 h-4 text-cyan-400" />
                Operation Controls
              </h3>
              
              {/* Controls Toggle Button */}
              <motion.button
                onClick={() => setControlsVisible(!controlsVisible)}
                className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-lg transition-all"
                animate={{ rotate: controlsVisible ? 0 : 180 }}
                onMouseEnter={(e) => showTooltip('Toggle controls panel', e)}
                onMouseLeave={hideTooltip}
              >
                {controlsVisible ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </motion.button>
            </div>
            
            {/* Collapsible Controls Content */}
            <AnimatePresence>
              {controlsVisible && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="overflow-hidden"
                >
                  <div className="grid lg:grid-cols-4 gap-4">
                    {/* Operation Selection */}
                    <div>
                      <label className="block text-white/70 text-xs font-medium mb-1">Choose Operation</label>
                      <div className="relative">
                        <select
                          value={operation}
                          onChange={(e) => setOperation(e.target.value)}
                          disabled={isAnimating}
                          className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm appearance-none pr-8"
                          onMouseEnter={(e) => showTooltip('Select array operation to visualize', e)}
                          onMouseLeave={hideTooltip}
                        >
                          <option value="search">🔍 Search (O(n))</option>
                          <option value="access">⚡ Access (O(1))</option>
                          <option value="insert">➕ Insert (O(n))</option>
                          <option value="delete">❌ Delete (O(n))</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    
                    {/* Operation-specific inputs */}
                    <div>
                      {operation === 'access' && (
                        <>
                          <label className="block text-white/70 text-xs font-medium mb-1">Index to Access</label>
                          <input
                            type="number"
                            value={accessIndex}
                            onChange={(e) => setAccessIndex(e.target.value)}
                            disabled={isAnimating}
                            className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm"
                            placeholder={`0 to ${displayArray.length - 1}`}
                            min="0"
                            max={displayArray.length - 1}
                          />
                        </>
                      )}
                      
                      {operation === 'search' && (
                        <>
                          <label className="block text-white/70 text-xs font-medium mb-1">Value to Find</label>
                          <input
                            type="number"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            disabled={isAnimating}
                            className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm"
                            placeholder="Search target"
                          />
                        </>
                      )}
                      
                      {operation === 'insert' && (
                        <>
                          <label className="block text-white/70 text-xs font-medium mb-1">Value to Insert</label>
                          <input
                            type="number"
                            value={insertValue}
                            onChange={(e) => setInsertValue(e.target.value)}
                            disabled={isAnimating}
                            className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm"
                            placeholder="New value"
                          />
                        </>
                      )}
                      
                      {operation === 'delete' && (
                        <>
                          <label className="block text-white/70 text-xs font-medium mb-1">Index to Delete</label>
                          <input
                            type="number"
                            value={deleteIndex}
                            onChange={(e) => setDeleteIndex(e.target.value)}
                            disabled={isAnimating}
                            className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm"
                            placeholder={`0 to ${displayArray.length - 1}`}
                            min="0"
                            max={displayArray.length - 1}
                          />
                        </>
                      )}
                    </div>
                    
                    {/* Additional input for insert position */}
                    {operation === 'insert' && (
                      <div>
                        <label className="block text-white/70 text-xs font-medium mb-1">Insert Position</label>
                        <input
                          type="number"
                          value={insertIndex}
                          onChange={(e) => setInsertIndex(e.target.value)}
                          disabled={isAnimating}
                          className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm"
                          placeholder={`0 to ${displayArray.length}`}
                          min="0"
                          max={displayArray.length}
                        />
                      </div>
                    )}
                    
                    {/* Animation Controls */}
                    <div className="flex gap-2">
                      <button
                        onClick={startAnimation}
                        disabled={isAnimating}
                        className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 text-white py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1"
                      >
                        <Play className="w-3 h-3" />
                        {isAnimating ? 'Running' : 'Start'}
                      </button>
                      <button
                        onClick={resetAnimation}
                        className="bg-gray-600 hover:bg-gray-500 text-white py-2 px-3 rounded-lg text-sm transition-all"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Speed Control */}
                  <div className="mt-3">
                    <label className="block text-white/70 text-xs font-medium mb-1">Animation Speed</label>
                    <input
                      type="range"
                      min="300"
                      max="2000"
                      value={speed}
                      onChange={(e) => setSpeed(Number(e.target.value))}
                      className="w-full accent-cyan-500 h-1"
                    />
                    <div className="flex justify-between text-xs text-white/40 mt-1">
                      <span>Fast</span>
                      <span>Slow</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* BOTTOM SECTION: Three Panels Horizontally */}
          <div className="grid lg:grid-cols-3 gap-4">
            
            {/* PANEL B: Code Execution (Left) */}
            <div className="glass-card p-4">
              {/* Language Selector */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Code className="w-4 h-4 text-cyan-400" />
                  Code Execution
                </h3>
                <div className="flex gap-1 bg-gray-800 rounded-lg p-1">
                  {['python', 'java', 'c'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setCodeLanguage(lang)}
                      className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                        codeLanguage === lang
                          ? 'bg-cyan-500 text-white'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {lang.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Code Display */}
              <div className="bg-gray-900/80 rounded-xl p-3 border border-gray-700/50 h-64 overflow-auto">
                <div className="space-y-1">
                  {(codeTemplates[codeLanguage]?.[operation] || []).map((line, index) => (
                    <motion.div
                      key={`${codeLanguage}-${operation}-${index}`}
                      className={`
                        py-1 px-2 rounded font-mono text-xs transition-all duration-300
                        ${currentCodeLine === index
                          ? 'bg-cyan-500/30 text-cyan-200 border-l-2 border-cyan-400'
                          : 'text-green-400 hover:bg-white/5'
                        }
                      `}
                      animate={{
                        scale: currentCodeLine === index ? 1.02 : 1,
                      }}
                    >
                      <span className="text-gray-500 mr-2 select-none text-xs">{index + 1}</span>
                      {line}
                    </motion.div>
                  )) || []}
                </div>
              </div>
            </div>
            
            {/* PANEL C: Array Canvas (Center) */}
            <div className="glass-card p-4">
              <div className="text-center mb-3">
                <h3 className="text-lg font-bold text-white mb-1">Array Canvas</h3>
                <div className="flex items-center justify-center gap-2 text-cyan-400 text-xs">
                  <Activity className="w-3 h-3" />
                  <span>{animationStep || 'Ready for operation'}</span>
                </div>
              </div>
              
              {/* Array Visualization with Dynamic Sizing */}
              <div className="flex items-center justify-center py-4 min-h-[200px]">
                <div className="relative w-full max-w-full overflow-hidden">
                  {/* Visual Cursor for Search Operations */}
                  {cursorPosition >= 0 && operation === 'search' && (
                    <motion.div
                      className={`absolute -top-6 bg-cyan-500 rounded-full flex items-center justify-center shadow-lg ${
                        displayArray.length <= 6 ? 'w-4 h-4' : 
                        displayArray.length <= 8 ? 'w-3 h-3' : 'w-2 h-2'
                      }`}
                      animate={{ 
                        x: cursorPosition * (displayArray.length <= 6 ? 64 : 
                                            displayArray.length <= 8 ? 52 : 
                                            displayArray.length <= 10 ? 44 : 36),
                      }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 400, 
                        damping: 30 
                      }}
                    >
                      <Search className={`text-white ${
                        displayArray.length <= 6 ? 'w-2 h-2' : 
                        displayArray.length <= 8 ? 'w-1.5 h-1.5' : 'w-1 h-1'
                      }`} />
                    </motion.div>
                  )}
                  
                  {/* Array Elements with Dynamic Sizing */}
                  <div className={`flex justify-center items-center ${
                    displayArray.length <= 6 ? 'gap-2' : 
                    displayArray.length <= 8 ? 'gap-1.5' : 
                    displayArray.length <= 10 ? 'gap-1' : 'gap-0.5'
                  }`}>
                    <AnimatePresence mode="popLayout">
                      {displayArray.map((value, index) => {
                        // Dynamic sizing based on array length
                        const elementSize = displayArray.length <= 6 ? 'w-14 h-14' : 
                                           displayArray.length <= 8 ? 'w-12 h-12' : 
                                           displayArray.length <= 10 ? 'w-10 h-10' : 'w-8 h-8';
                        const fontSize = displayArray.length <= 6 ? 'text-sm' : 
                                        displayArray.length <= 8 ? 'text-xs' : 
                                        displayArray.length <= 10 ? 'text-xs' : 'text-xs';
                        const labelSize = displayArray.length <= 6 ? 'text-xs' : 'text-xs';
                        const gapSize = displayArray.length <= 6 ? 64 : 
                                       displayArray.length <= 8 ? 52 : 
                                       displayArray.length <= 10 ? 44 : 36;
                        
                        return (
                          <motion.div
                            key={`element-${index}-${value}`}
                            layout
                            initial={{ opacity: 0, scale: 0.8, y: 10 }}
                            animate={{ 
                              opacity: elementStates[index] === 'deleting' ? 0.3 : 1,
                              scale: currentElementIndex === index ? 1.1 : 1,
                              y: 0,
                              x: shiftingElements[index] ? (index < parseInt(insertIndex || deleteIndex || 0) ? gapSize : -gapSize) : 0,
                            }}
                            exit={{ opacity: 0, scale: 0.8, y: -10 }}
                            transition={{ 
                              duration: 0.6,
                              type: "spring",
                              stiffness: 300,
                              damping: 25,
                              layout: { duration: 0.8 }
                            }}
                            className="relative flex flex-col items-center"
                            onMouseEnter={(e) => showTooltip(`Value: ${value}, Index: ${index}, Memory: 0x${(baseMemoryAddress + index * 4).toString(16).toUpperCase()}`, e)}
                            onMouseLeave={hideTooltip}
                          >
                            {/* Index label */}
                            <div className={`text-white/60 font-mono mb-1 ${labelSize}`}>[{index}]</div>
                            
                            {/* Element box with dynamic sizing */}
                            <motion.div
                              animate={{
                                scale: currentElementIndex === index ? 1.1 : 1,
                                rotateY: currentElementIndex === index ? [0, 5, -5, 0] : 0,
                              }}
                              transition={{ duration: 0.3 }}
                              className={`
                                ${elementSize} rounded-lg flex items-center justify-center text-white font-bold ${fontSize}
                                transition-all duration-500 border cursor-pointer
                                ${getElementStyle(index)}
                              `}
                            >
                              {value}
                            </motion.div>
                            
                            {/* Memory address label */}
                            <div className={`text-white/40 font-mono mt-1 ${
                              displayArray.length <= 8 ? 'text-xs' : 'text-xs'
                            }`}>
                              0x{(baseMemoryAddress + index * 4).toString(16).toUpperCase()}
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
              
              {/* Status display */}
              <div className="text-center mt-3">
                {foundIndex !== -1 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-1 bg-green-500/20 text-green-400 px-3 py-1 rounded-lg border border-green-500/30 text-xs"
                  >
                    <Search className="w-3 h-3" />
                    <span className="font-semibold">Found at index {foundIndex}!</span>
                  </motion.div>
                )}
              </div>
            </div>
            
            {/* PANEL D: Memory Layout (Right) */}
            <div className="glass-card p-4">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                Memory Layout
              </h3>
              <p className="text-white/60 text-xs mb-4 leading-relaxed">
                Real-time memory view showing contiguous storage.
              </p>
              
              <div className="space-y-2 max-h-64 overflow-auto">
                <AnimatePresence mode="popLayout">
                  {memoryArray.map((value, index) => (
                    <motion.div
                      key={`memory-${index}-${value}`}
                      layout
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ 
                        opacity: elementStates[index] === 'deleting' ? 0.3 : 1,
                        x: 0,
                        scale: currentMemoryIndex === index ? 1.02 : 1
                      }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ 
                        duration: 0.3,
                        layout: { duration: 0.6 }
                      }}
                      className={`
                        flex justify-between items-center p-2 rounded-lg border transition-all duration-500
                        ${getMemoryStyle(index)}
                      `}
                      onMouseEnter={(e) => showTooltip(`Memory: 0x${(baseMemoryAddress + index * 4).toString(16).toUpperCase()}, Value: ${value}, Index: ${index}`, e)}
                      onMouseLeave={hideTooltip}
                    >
                      <div className="flex items-center gap-2">
                        <div className="text-cyan-400 font-mono text-xs font-bold">
                          0x{(baseMemoryAddress + index * 4).toString(16).toUpperCase()}
                        </div>
                        <div className="text-white/40 text-xs">
                          [{index}]
                        </div>
                      </div>
                      <div className={`
                        px-2 py-1 rounded font-bold text-xs transition-all duration-300
                        ${currentMemoryIndex === index || elementStates[index] === 'examining' || elementStates[index] === 'found' || elementStates[index] === 'inserted' || elementStates[index] === 'accessed'
                          ? 'bg-cyan-500 text-white shadow-lg'
                          : elementStates[index] === 'shifting' || shiftingElements[index]
                          ? 'bg-yellow-500 text-white'
                          : elementStates[index] === 'deleting'
                          ? 'bg-red-500/50 text-red-200'
                          : 'bg-purple-500/20 text-purple-300'
                        }
                      `}>
                        {value}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              
              <div className="mt-4 p-2 bg-black/20 rounded-lg">
                <div className="text-xs text-white/50 space-y-1">
                  <div><strong>Base:</strong> 0x{baseMemoryAddress.toString(16).toUpperCase()}</div>
                  <div><strong>Size:</strong> 4 bytes per element</div>
                  <div><strong>Total:</strong> {memoryArray.length * 4} bytes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArrayVisualizerPage;