import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Database, Clock, Code, Layers, MemoryStick } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import SpaceBackground from '../components/3d/SpaceBackground';
import AsteroidField from '../components/3d/AsteroidField';
import FloatingParticles from '../components/3d/FloatingParticles';

const SortingInfoPage = () => {
  const navigate = useNavigate();

  const operations = [
    {
      operation: "Bubble Sort",
      complexity: "O(n²)",
      explanation: "Compare adjacent elements and swap if they're in wrong order. Simple but inefficient."
    },
    {
      operation: "Quick Sort",
      complexity: "O(n log n) avg, O(n²) worst",
      explanation: "Divide-and-conquer with pivot partitioning. Fast average case, poor worst case."
    },
    {
      operation: "Merge Sort",
      complexity: "O(n log n)",
      explanation: "Stable divide-and-conquer approach. Consistent performance but uses extra space."
    },
    {
      operation: "Heap Sort",
      complexity: "O(n log n)",
      explanation: "Build max-heap then repeatedly extract maximum. In-place with guaranteed performance."
    },
    {
      operation: "Insertion Sort",
      complexity: "O(n²) worst, O(n) best",
      explanation: "Build sorted portion one element at a time. Efficient for small or nearly sorted arrays."
    },
    {
      operation: "Selection Sort",
      complexity: "O(n²)",
      explanation: "Find minimum element and place at beginning. Simple but always O(n²)."
    }
  ];

  const codeExample = `// JavaScript Sorting Algorithms Comparison

// Bubble Sort - O(n²)
function bubbleSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
}

// Quick Sort - O(n log n) average
function quickSort(arr, low = 0, high = arr.length - 1) {
    if (low < high) {
        const pivotIndex = partition(arr, low, high);
        quickSort(arr, low, pivotIndex - 1);
        quickSort(arr, pivotIndex + 1, high);
    }
    return arr;
}

function partition(arr, low, high) {
    const pivot = arr[high];
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
}

// Merge Sort - O(n log n) guaranteed
function mergeSort(arr) {
    if (arr.length <= 1) return arr;
    
    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));
    
    return merge(left, right);
}

function merge(left, right) {
    const result = [];
    let i = 0, j = 0;
    
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            result.push(left[i]);
            i++;
        } else {
            result.push(right[j]);
            j++;
        }
    }
    
    return result.concat(left.slice(i)).concat(right.slice(j));
}

// Heap Sort - O(n log n)
function heapSort(arr) {
    const n = arr.length;
    
    // Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(arr, n, i);
    }
    
    // Extract elements from heap
    for (let i = n - 1; i > 0; i--) {
        [arr[0], arr[i]] = [arr[i], arr[0]];
        heapify(arr, i, 0);
    }
    
    return arr;
}

function heapify(arr, n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    
    if (left < n && arr[left] > arr[largest]) {
        largest = left;
    }
    
    if (right < n && arr[right] > arr[largest]) {
        largest = right;
    }
    
    if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        heapify(arr, n, largest);
    }
}

// Insertion Sort - O(n²) worst, O(n) best
function insertionSort(arr) {
    for (let i = 1; i < arr.length; i++) {
        const key = arr[i];
        let j = i - 1;
        
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        
        arr[j + 1] = key;
    }
    return arr;
}

// Usage Example
const unsortedArray = [64, 34, 25, 12, 22, 11, 90];

console.log("Original:", unsortedArray);
console.log("Bubble Sort:", bubbleSort([...unsortedArray]));
console.log("Quick Sort:", quickSort([...unsortedArray]));
console.log("Merge Sort:", mergeSort([...unsortedArray]));
console.log("Heap Sort:", heapSort([...unsortedArray]));
console.log("Insertion Sort:", insertionSort([...unsortedArray]));`;

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
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-twinkle opacity-30" />
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-400 rounded-full animate-twinkle opacity-20" 
             style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/4 left-1/6 w-2 h-2 bg-purple-400 rounded-full animate-twinkle opacity-25" 
             style={{ animationDelay: '2s' }} />
      </div>

      {/* Navigation */}
      <div className="relative z-10 p-6">
        <button
          onClick={() => navigate('/modules')}
          className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-2 group"
        >
          <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
          Back to Modules
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pb-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-6">
            <div className="p-6 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl backdrop-blur-sm border border-indigo-500/30">
              <Database className="w-16 h-16 text-indigo-400" />
            </div>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold font-display text-white mb-6">
            <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
              Sorting
            </span>
          </h1>
          <p className="text-2xl text-white/70 max-w-4xl mx-auto leading-relaxed">
            Visualize comparison-based and non-comparison sorting algorithms
          </p>
        </motion.div>

        {/* Introduction Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass-card p-10 mb-12"
        >
          <div className="flex items-center gap-4 mb-8">
            <Layers className="w-8 h-8 text-indigo-400" />
            <h2 className="text-3xl font-bold text-white">What is Sorting?</h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <p className="text-white/90 text-xl leading-relaxed">
                Sorting is the process of arranging elements in a specific order, typically 
                <span className="text-indigo-400 font-semibold"> ascending or descending</span>. 
                It's one of the most fundamental algorithms in computer science.
              </p>
              
              <p className="text-white/80 text-lg leading-relaxed">
                Different sorting algorithms have <span className="text-purple-400 font-semibold">different trade-offs</span> 
                between time complexity, space complexity, stability, and adaptiveness to input characteristics 
                like size and initial order.
              </p>
            </div>
            
            <div className="flex justify-center">
              <div className="space-y-4">
                <div className="text-center text-white/60 text-sm font-medium">Sorting Process</div>
                
                {/* Before sorting */}
                <div className="space-y-2">
                  <div className="text-white/60 text-xs">Before:</div>
                  <div className="flex gap-1">
                    {[64, 34, 25, 12, 22, 11].map((num, idx) => (
                      <div key={idx} className="w-8 h-12 bg-gradient-to-b from-red-500 to-red-700 rounded flex items-end justify-center text-white text-xs font-bold p-1">
                        <span>{num}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Arrow */}
                <div className="text-center text-indigo-400 text-xl">↓</div>
                
                {/* After sorting */}
                <div className="space-y-2">
                  <div className="text-white/60 text-xs">After:</div>
                  <div className="flex gap-1">
                    {[11, 12, 22, 25, 34, 64].map((num, idx) => (
                      <div key={idx} className="w-8 h-12 bg-gradient-to-b from-indigo-500 to-purple-700 rounded flex items-end justify-center text-white text-xs font-bold p-1">
                        <span>{num}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="text-center text-white/50 text-xs">Organized data structure</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Key Characteristics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="glass-card p-10 mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-4">
            <MemoryStick className="w-8 h-8 text-indigo-400" />
            Key Characteristics
          </h2>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl p-8 border border-indigo-500/20 hover:border-indigo-500/40 transition-all">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-indigo-400 font-bold text-xl mb-4">Time Complexity</h3>
              <p className="text-white/80 leading-relaxed">
                Algorithms range from O(n²) simple sorts to O(n log n) efficient sorts. 
                Some specialized algorithms can achieve O(n) for specific conditions.
              </p>
              <div className="mt-4 p-3 bg-black/20 rounded-lg">
                <div className="text-xs text-white/60 font-mono">Range:</div>
                <div className="text-sm text-green-400 font-mono">O(n) to O(n²)</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-purple-400 font-bold text-xl mb-4">Stability</h3>
              <p className="text-white/80 leading-relaxed">
                Stable sorting algorithms maintain the relative order of equal elements. 
                This property is important when sorting complex objects.
              </p>
              <div className="mt-4 p-3 bg-black/20 rounded-lg">
                <div className="text-xs text-white/60 font-mono">Stable:</div>
                <div className="text-sm text-green-400 font-mono">Merge, Insertion, Bubble</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-pink-500/10 to-red-500/10 rounded-2xl p-8 border border-pink-500/20 hover:border-pink-500/40 transition-all">
              <div className="text-4xl mb-4">💾</div>
              <h3 className="text-pink-400 font-bold text-xl mb-4">Space Complexity</h3>
              <p className="text-white/80 leading-relaxed">
                In-place algorithms use O(1) extra space, while others may require O(n) 
                additional memory for temporary storage during sorting.
              </p>
              <div className="mt-4 p-3 bg-black/20 rounded-lg">
                <div className="text-xs text-white/60 font-mono">In-place:</div>
                <div className="text-sm text-green-400 font-mono">Quick, Heap, Selection</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Operations Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="glass-card p-10 mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-4">
            <Clock className="w-8 h-8 text-indigo-400" />
            Sorting Algorithms & Time Complexity
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-indigo-500/30">
                  <th className="text-left text-indigo-400 font-bold py-4 px-6 text-lg">Algorithm</th>
                  <th className="text-left text-indigo-400 font-bold py-4 px-6 text-lg">Time Complexity</th>
                  <th className="text-left text-indigo-400 font-bold py-4 px-6 text-lg">Characteristics</th>
                </tr>
              </thead>
              <tbody>
                {operations.map((op, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                    className="border-b border-white/10 hover:bg-white/5 transition-all group"
                  >
                    <td className="py-5 px-6 text-white font-semibold text-lg">{op.operation}</td>
                    <td className="py-5 px-6">
                      <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold font-mono shadow-lg">
                        {op.complexity}
                      </span>
                    </td>
                    <td className="py-5 px-6 text-white/80 leading-relaxed">{op.explanation}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Code Example */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="glass-card p-10 mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-4">
            <Code className="w-8 h-8 text-indigo-400" />
            Code Example
          </h2>
          
          <div className="bg-gray-900/80 rounded-2xl p-8 border border-gray-700/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-white/60 text-sm ml-4">sorting-algorithms.js</span>
            </div>
            <pre className="text-green-400 font-mono text-sm leading-relaxed overflow-x-auto">
              <code>{codeExample}</code>
            </pre>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-3xl p-12 border border-indigo-500/20 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to See Sorting in Action?</h3>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Experience real-time sorting algorithms with synchronized code execution and visual comparisons
            </p>
            
            <button
              onClick={() => navigate('/sorting-visualizer')}
              className="group bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-bold py-6 px-12 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/25 flex items-center gap-4 mx-auto text-xl"
            >
              <span>Start Visualization</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SortingInfoPage;
