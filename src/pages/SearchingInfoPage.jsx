import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Search, Clock, Code, Layers, MemoryStick } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import SpaceBackground from '../components/3d/SpaceBackground';
import AsteroidField from '../components/3d/AsteroidField';
import FloatingParticles from '../components/3d/FloatingParticles';

const SearchingInfoPage = () => {
  const navigate = useNavigate();

  const operations = [
    {
      operation: "Linear Search",
      complexity: "O(n)",
      explanation: "Check each element sequentially. Works on unsorted data but slow for large datasets."
    },
    {
      operation: "Binary Search",
      complexity: "O(log n)",
      explanation: "Divide sorted array in half repeatedly. Very efficient but requires sorted data."
    },
    {
      operation: "Jump Search",
      complexity: "O(√n)",
      explanation: "Jump ahead by fixed steps then linear search. Better than linear, worse than binary."
    },
    {
      operation: "Interpolation Search",
      complexity: "O(log log n) avg, O(n) worst",
      explanation: "Estimate position based on value distribution. Very fast for uniformly distributed data."
    },
    {
      operation: "Exponential Search",
      complexity: "O(log n)",
      explanation: "Find range then binary search. Good for unbounded arrays or when target is near beginning."
    },
    {
      operation: "Ternary Search",
      complexity: "O(log₃ n)",
      explanation: "Divide array into three parts. Similar to binary search but with more comparisons."
    }
  ];

  const codeExample = `// JavaScript Searching Algorithms Comparison

// Linear Search - O(n)
function linearSearch(arr, target) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) {
            return i; // Return index if found
        }
    }
    return -1; // Not found
}

// Binary Search - O(log n) - Requires sorted array
function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (arr[mid] === target) {
            return mid; // Found target
        } else if (arr[mid] < target) {
            left = mid + 1; // Search right half
        } else {
            right = mid - 1; // Search left half
        }
    }
    
    return -1; // Not found
}

// Recursive Binary Search
function binarySearchRecursive(arr, target, left = 0, right = arr.length - 1) {
    if (left > right) {
        return -1; // Base case: not found
    }
    
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
        return mid;
    } else if (arr[mid] < target) {
        return binarySearchRecursive(arr, target, mid + 1, right);
    } else {
        return binarySearchRecursive(arr, target, left, mid - 1);
    }
}

// Jump Search - O(√n)
function jumpSearch(arr, target) {
    const n = arr.length;
    const step = Math.floor(Math.sqrt(n));
    let prev = 0;
    
    // Find the block where target may exist
    while (arr[Math.min(step, n) - 1] < target) {
        prev = step;
        step += Math.floor(Math.sqrt(n));
        if (prev >= n) {
            return -1;
        }
    }
    
    // Linear search in the identified block
    while (arr[prev] < target) {
        prev++;
        if (prev === Math.min(step, n)) {
            return -1;
        }
    }
    
    if (arr[prev] === target) {
        return prev;
    }
    
    return -1;
}

// Interpolation Search - O(log log n) average
function interpolationSearch(arr, target) {
    let low = 0;
    let high = arr.length - 1;
    
    while (low <= high && target >= arr[low] && target <= arr[high]) {
        if (low === high) {
            if (arr[low] === target) return low;
            return -1;
        }
        
        // Calculate probable position
        const pos = low + Math.floor(
            ((target - arr[low]) / (arr[high] - arr[low])) * (high - low)
        );
        
        if (arr[pos] === target) {
            return pos;
        }
        
        if (arr[pos] < target) {
            low = pos + 1;
        } else {
            high = pos - 1;
        }
    }
    
    return -1;
}

// Exponential Search - O(log n)
function exponentialSearch(arr, target) {
    const n = arr.length;
    
    // If target is at first position
    if (arr[0] === target) {
        return 0;
    }
    
    // Find range for binary search
    let i = 1;
    while (i < n && arr[i] <= target) {
        i *= 2;
    }
    
    // Perform binary search in found range
    return binarySearchInRange(arr, target, i / 2, Math.min(i, n - 1));
}

function binarySearchInRange(arr, target, left, right) {
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        if (arr[mid] === target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return -1;
}

// Ternary Search - O(log₃ n)
function ternarySearch(arr, target, left = 0, right = arr.length - 1) {
    if (left > right) {
        return -1;
    }
    
    const mid1 = left + Math.floor((right - left) / 3);
    const mid2 = right - Math.floor((right - left) / 3);
    
    if (arr[mid1] === target) {
        return mid1;
    }
    if (arr[mid2] === target) {
        return mid2;
    }
    
    if (target < arr[mid1]) {
        return ternarySearch(arr, target, left, mid1 - 1);
    } else if (target > arr[mid2]) {
        return ternarySearch(arr, target, mid2 + 1, right);
    } else {
        return ternarySearch(arr, target, mid1 + 1, mid2 - 1);
    }
}

// Usage Examples
const sortedArray = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25];
const target = 15;

console.log("Array:", sortedArray);
console.log("Target:", target);
console.log("Linear Search:", linearSearch(sortedArray, target));
console.log("Binary Search:", binarySearch(sortedArray, target));
console.log("Jump Search:", jumpSearch(sortedArray, target));
console.log("Interpolation Search:", interpolationSearch(sortedArray, target));
console.log("Exponential Search:", exponentialSearch(sortedArray, target));
console.log("Ternary Search:", ternarySearch(sortedArray, target));

// Performance comparison for large datasets
const largeArray = Array.from({length: 1000000}, (_, i) => i * 2);
const searchTarget = 500000;

console.time("Linear Search");
linearSearch(largeArray, searchTarget);
console.timeEnd("Linear Search");

console.time("Binary Search");
binarySearch(largeArray, searchTarget);
console.timeEnd("Binary Search");`;

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
            <div className="p-6 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-3xl backdrop-blur-sm border border-emerald-500/30">
              <Search className="w-16 h-16 text-emerald-400" />
            </div>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold font-display text-white mb-6">
            <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
              Searching
            </span>
          </h1>
          <p className="text-2xl text-white/70 max-w-4xl mx-auto leading-relaxed">
            Explore efficient algorithms for finding elements in data structures
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
            <Layers className="w-8 h-8 text-emerald-400" />
            <h2 className="text-3xl font-bold text-white">What is Searching?</h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <p className="text-white/90 text-xl leading-relaxed">
                Searching is the process of finding a specific element within a data structure. 
                <span className="text-emerald-400 font-semibold"> Efficient searching algorithms</span> are 
                crucial for data retrieval in applications.
              </p>
              
              <p className="text-white/80 text-lg leading-relaxed">
                Different algorithms have <span className="text-teal-400 font-semibold">different requirements</span> 
                and performance characteristics - some work on any data, others require 
                sorted data but offer much faster performance.
              </p>
            </div>
            
            <div className="flex justify-center">
              <div className="space-y-4">
                <div className="text-center text-white/60 text-sm font-medium">Search Process</div>
                
                {/* Array visualization */}
                <div className="space-y-2">
                  <div className="text-white/60 text-xs">Array:</div>
                  <div className="flex gap-1">
                    {[2, 7, 11, 15, 23, 31, 42].map((num, idx) => (
                      <div key={idx} className={`w-10 h-10 rounded flex items-center justify-center text-white text-xs font-bold ${
                        num === 15 ? 'bg-gradient-to-b from-emerald-500 to-teal-700 ring-2 ring-emerald-400' : 
                        'bg-gradient-to-b from-gray-500 to-gray-700'
                      }`}>
                        <span>{num}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Target */}
                <div className="text-center text-emerald-400 text-sm">Target: 15</div>
                
                {/* Result */}
                <div className="space-y-2">
                  <div className="text-white/60 text-xs">Result:</div>
                  <div className="text-center">
                    <div className="inline-block bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-lg p-3 border border-emerald-500/30">
                      <div className="text-emerald-400 font-bold">Found at index 3</div>
                      <div className="text-white/60 text-xs">Binary Search: 2 comparisons</div>
                    </div>
                  </div>
                </div>
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
            <MemoryStick className="w-8 h-8 text-emerald-400" />
            Key Characteristics
          </h2>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl p-8 border border-emerald-500/20 hover:border-emerald-500/40 transition-all">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-emerald-400 font-bold text-xl mb-4">Time Complexity</h3>
              <p className="text-white/80 leading-relaxed">
                Ranges from O(1) for direct access to O(n) for worst-case linear search. 
                Binary search achieves O(log n) for sorted data.
              </p>
              <div className="mt-4 p-3 bg-black/20 rounded-lg">
                <div className="text-xs text-white/60 font-mono">Best Case:</div>
                <div className="text-sm text-green-400 font-mono">O(1) - Direct hit</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-teal-500/10 to-cyan-500/10 rounded-2xl p-8 border border-teal-500/20 hover:border-teal-500/40 transition-all">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-teal-400 font-bold text-xl mb-4">Data Requirements</h3>
              <p className="text-white/80 leading-relaxed">
                Some algorithms work on any data (linear), while others require 
                sorted data (binary, interpolation) for optimal performance.
              </p>
              <div className="mt-4 p-3 bg-black/20 rounded-lg">
                <div className="text-xs text-white/60 font-mono">Sorted Required:</div>
                <div className="text-sm text-green-400 font-mono">Binary, Interpolation</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl p-8 border border-cyan-500/20 hover:border-cyan-500/40 transition-all">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-cyan-400 font-bold text-xl mb-4">Use Cases</h3>
              <p className="text-white/80 leading-relaxed">
                Database queries, autocomplete, recommendation systems, 
                finding duplicates, and many other real-world applications.
              </p>
              <div className="mt-4 p-3 bg-black/20 rounded-lg">
                <div className="text-xs text-white/60 font-mono">Applications:</div>
                <div className="text-sm text-green-400 font-mono">DB, Web, Games</div>
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
            <Clock className="w-8 h-8 text-emerald-400" />
            Searching Algorithms & Time Complexity
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-emerald-500/30">
                  <th className="text-left text-emerald-400 font-bold py-4 px-6 text-lg">Algorithm</th>
                  <th className="text-left text-emerald-400 font-bold py-4 px-6 text-lg">Time Complexity</th>
                  <th className="text-left text-emerald-400 font-bold py-4 px-6 text-lg">Characteristics</th>
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
                      <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-bold font-mono shadow-lg">
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
            <Code className="w-8 h-8 text-emerald-400" />
            Code Example
          </h2>
          
          <div className="bg-gray-900/80 rounded-2xl p-8 border border-gray-700/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-white/60 text-sm ml-4">searching-algorithms.js</span>
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
          <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-3xl p-12 border border-emerald-500/20 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to See Searching in Action?</h3>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Experience real-time searching algorithms with step-by-step execution and performance analysis
            </p>
            
            <button
              onClick={() => navigate('/searching-visualizer')}
              className="group bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold py-6 px-12 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/25 flex items-center gap-4 mx-auto text-xl"
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

export default SearchingInfoPage;
