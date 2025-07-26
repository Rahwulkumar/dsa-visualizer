import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Database, Clock, Code, Layers, MemoryStick } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import SpaceBackground from '../components/3d/SpaceBackground';
import AsteroidField from '../components/3d/AsteroidField';
import FloatingParticles from '../components/3d/FloatingParticles';

const HeapInfoPage = () => {
  const navigate = useNavigate();

  const operations = [
    {
      operation: "Insert",
      complexity: "O(log n)",
      explanation: "Insert at the end and bubble up to maintain heap property. Height is log n."
    },
    {
      operation: "Extract Min/Max",
      complexity: "O(log n)",
      explanation: "Remove root, replace with last element, then bubble down to restore heap property."
    },
    {
      operation: "Peek Min/Max",
      complexity: "O(1)",
      explanation: "The root element is always the minimum (min-heap) or maximum (max-heap)."
    },
    {
      operation: "Build Heap",
      complexity: "O(n)",
      explanation: "Build heap from unsorted array using bottom-up heapify approach."
    },
    {
      operation: "Heapify",
      complexity: "O(log n)",
      explanation: "Restore heap property for a subtree. May need to traverse down the height."
    },
    {
      operation: "Heap Sort",
      complexity: "O(n log n)",
      explanation: "Build heap (O(n)) then extract elements one by one (n * O(log n))."
    }
  ];

  const codeExample = `// JavaScript Min Heap Example
class MinHeap {
    constructor() {
        this.heap = [];
    }

    // Get parent index
    getParentIndex(index) {
        return Math.floor((index - 1) / 2);
    }

    // Get left child index
    getLeftChildIndex(index) {
        return 2 * index + 1;
    }

    // Get right child index
    getRightChildIndex(index) {
        return 2 * index + 2;
    }

    // Swap elements at two indices
    swap(index1, index2) {
        [this.heap[index1], this.heap[index2]] = [this.heap[index2], this.heap[index1]];
    }

    // Insert operation - O(log n)
    insert(value) {
        this.heap.push(value);
        this.heapifyUp(this.heap.length - 1);
    }

    // Bubble up to maintain min heap property
    heapifyUp(index) {
        if (index === 0) return;
        
        const parentIndex = this.getParentIndex(index);
        if (this.heap[parentIndex] > this.heap[index]) {
            this.swap(parentIndex, index);
            this.heapifyUp(parentIndex);
        }
    }

    // Extract minimum - O(log n)
    extractMin() {
        if (this.heap.length === 0) return null;
        if (this.heap.length === 1) return this.heap.pop();
        
        const min = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.heapifyDown(0);
        return min;
    }

    // Bubble down to maintain min heap property
    heapifyDown(index) {
        const leftChildIndex = this.getLeftChildIndex(index);
        const rightChildIndex = this.getRightChildIndex(index);
        let smallest = index;
        
        if (leftChildIndex < this.heap.length && 
            this.heap[leftChildIndex] < this.heap[smallest]) {
            smallest = leftChildIndex;
        }
        
        if (rightChildIndex < this.heap.length && 
            this.heap[rightChildIndex] < this.heap[smallest]) {
            smallest = rightChildIndex;
        }
        
        if (smallest !== index) {
            this.swap(index, smallest);
            this.heapifyDown(smallest);
        }
    }

    // Peek minimum - O(1)
    peek() {
        return this.heap.length > 0 ? this.heap[0] : null;
    }

    // Get size - O(1)
    size() {
        return this.heap.length;
    }

    // Build heap from array - O(n)
    buildHeap(array) {
        this.heap = [...array];
        for (let i = Math.floor(this.heap.length / 2) - 1; i >= 0; i--) {
            this.heapifyDown(i);
        }
    }

    // Heap sort - O(n log n)
    heapSort() {
        const sorted = [];
        const originalHeap = [...this.heap];
        
        while (this.heap.length > 0) {
            sorted.push(this.extractMin());
        }
        
        this.heap = originalHeap; // Restore original heap
        return sorted;
    }
}

// Usage Example
const minHeap = new MinHeap();
minHeap.insert(10);
minHeap.insert(5);
minHeap.insert(15);
minHeap.insert(3);

console.log(minHeap.peek()); // 3 (minimum)
console.log(minHeap.extractMin()); // 3
console.log(minHeap.extractMin()); // 5

// Build heap from array
minHeap.buildHeap([20, 10, 30, 5, 15]);
console.log(minHeap.heapSort()); // [5, 10, 15, 20, 30]`;

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
            <div className="p-6 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-3xl backdrop-blur-sm border border-yellow-500/30">
              <Database className="w-16 h-16 text-yellow-400" />
            </div>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold font-display text-white mb-6">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Heaps
            </span>
          </h1>
          <p className="text-2xl text-white/70 max-w-4xl mx-auto leading-relaxed">
            Master priority queues and understand heap property maintenance
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
            <Layers className="w-8 h-8 text-yellow-400" />
            <h2 className="text-3xl font-bold text-white">What is a Heap?</h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <p className="text-white/90 text-xl leading-relaxed">
                A heap is a complete binary tree that satisfies the 
                <span className="text-yellow-400 font-semibold"> heap property</span>: in a 
                <span className="text-orange-400 font-semibold"> min-heap</span>, parent nodes 
                are smaller than children; in a max-heap, parents are larger.
              </p>
              
              <p className="text-white/80 text-lg leading-relaxed">
                Heaps excel at <span className="text-orange-400 font-semibold">priority queue operations</span>, 
                heap sort algorithm, and finding the kth smallest/largest element efficiently. 
                They're implemented using arrays for space efficiency.
              </p>
            </div>
            
            <div className="flex justify-center">
              <div className="space-y-4">
                <div className="text-center text-white/60 text-sm font-medium">Min Heap Structure</div>
                <div className="flex flex-col items-center gap-3">
                  {/* Root */}
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      1
                    </div>
                    <div className="text-yellow-400 text-xs mt-1 font-mono">Root (Min)</div>
                  </div>
                  
                  {/* Level 1 */}
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-600 to-orange-700 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                        3
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-600 to-orange-700 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                        5
                      </div>
                    </div>
                  </div>
                  
                  {/* Level 2 */}
                  <div className="flex items-center gap-1">
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-700 to-orange-800 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg">
                      7
                    </div>
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-700 to-orange-800 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg">
                      9
                    </div>
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-700 to-orange-800 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg">
                      6
                    </div>
                    <div className="w-8 h-8 bg-gradient-to-br from-yellow-700 to-orange-800 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg">
                      8
                    </div>
                  </div>
                </div>
                <div className="text-center text-white/50 text-xs">Parent ≤ Children</div>
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
            <MemoryStick className="w-8 h-8 text-yellow-400" />
            Key Characteristics
          </h2>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-2xl p-8 border border-yellow-500/20 hover:border-yellow-500/40 transition-all">
              <div className="text-4xl mb-4">⛰️</div>
              <h3 className="text-yellow-400 font-bold text-xl mb-4">Heap Property</h3>
              <p className="text-white/80 leading-relaxed">
                The key invariant that parent nodes maintain a specific ordering relationship 
                with their children throughout all operations.
              </p>
              <div className="mt-4 p-3 bg-black/20 rounded-lg">
                <div className="text-xs text-white/60 font-mono">Min-Heap:</div>
                <div className="text-sm text-green-400 font-mono">parent ≤ children</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl p-8 border border-orange-500/20 hover:border-orange-500/40 transition-all">
              <div className="text-4xl mb-4">🔢</div>
              <h3 className="text-orange-400 font-bold text-xl mb-4">Array Implementation</h3>
              <p className="text-white/80 leading-relaxed">
                Heaps are typically implemented using arrays for space efficiency. 
                Parent-child relationships are computed using index arithmetic.
              </p>
              <div className="mt-4 p-3 bg-black/20 rounded-lg">
                <div className="text-xs text-white/60 font-mono">Indices:</div>
                <div className="text-sm text-green-400 font-mono">parent: (i-1)/2, children: 2i+1, 2i+2</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-2xl p-8 border border-red-500/20 hover:border-red-500/40 transition-all">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-red-400 font-bold text-xl mb-4">Priority Queues</h3>
              <p className="text-white/80 leading-relaxed">
                Heaps are the standard implementation for priority queues, allowing 
                efficient insertion and extraction of highest/lowest priority elements.
              </p>
              <div className="mt-4 p-3 bg-black/20 rounded-lg">
                <div className="text-xs text-white/60 font-mono">Applications:</div>
                <div className="text-sm text-green-400 font-mono">Dijkstra, Huffman, Task Scheduling</div>
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
            <Clock className="w-8 h-8 text-yellow-400" />
            Common Operations & Time Complexity
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-yellow-500/30">
                  <th className="text-left text-yellow-400 font-bold py-4 px-6 text-lg">Operation</th>
                  <th className="text-left text-yellow-400 font-bold py-4 px-6 text-lg">Time Complexity</th>
                  <th className="text-left text-yellow-400 font-bold py-4 px-6 text-lg">Explanation</th>
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
                      <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold font-mono shadow-lg">
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
            <Code className="w-8 h-8 text-yellow-400" />
            Code Example
          </h2>
          
          <div className="bg-gray-900/80 rounded-2xl p-8 border border-gray-700/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-white/60 text-sm ml-4">min-heap-example.js</span>
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
          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-3xl p-12 border border-yellow-500/20 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to See Heaps in Action?</h3>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Experience real-time heap operations with synchronized code execution and priority queue visualization
            </p>
            
            <button
              onClick={() => navigate('/heap-visualizer')}
              className="group bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-bold py-6 px-12 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/25 flex items-center gap-4 mx-auto text-xl"
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

export default HeapInfoPage;
