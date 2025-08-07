import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Database, Clock, Code, Layers, MemoryStick } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import SpaceBackground from '../../components/3d/SpaceBackground';
import AsteroidField from '../../components/3d/AsteroidField';
import FloatingParticles from '../../components/3d/FloatingParticles';

const ArrayInfoPage = () => {
  const navigate = useNavigate();

  const operations = [
    {
      operation: "Access",
      complexity: "O(1)",
      explanation: "Direct memory address calculation allows instant access to any element using its index."
    },
    {
      operation: "Search (Linear)",
      complexity: "O(n)",
      explanation: "In worst case, every element must be checked sequentially until the target is found."
    },
    {
      operation: "Insertion (at end)",
      complexity: "O(1)*",
      explanation: "Simply place the new element at the next available position (amortized constant time)."
    },
    {
      operation: "Insertion (at beginning/middle)",
      complexity: "O(n)",
      explanation: "All subsequent elements must be shifted right to make space for the new element."
    },
    {
      operation: "Deletion (at end)",
      complexity: "O(1)",
      explanation: "Remove the last element without affecting any other elements in the array."
    },
    {
      operation: "Deletion (at beginning/middle)",
      complexity: "O(n)",
      explanation: "All subsequent elements must be shifted left to fill the gap left by the deleted element."
    }
  ];

  const codeExample = `// JavaScript Array Example
let numbers = [10, 20, 30, 40, 50];  // Declaration and initialization

// Access operation - O(1)
let element = numbers[2];  // Gets 30 (third element)
console.log(element);      // Output: 30

// Search operation - O(n)
let index = numbers.indexOf(40);  // Returns 3

// Insert operation - O(n) for middle insertion
numbers.splice(2, 0, 25);  // Insert 25 at index 2
// Array becomes [10, 20, 25, 30, 40, 50]

// Delete operation - O(n) for middle deletion
numbers.splice(1, 1);      // Remove element at index 1
// Array becomes [10, 25, 30, 40, 50]`;

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
            <div className="p-6 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl backdrop-blur-sm border border-cyan-500/30">
              <Database className="w-16 h-16 text-cyan-400" />
            </div>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold font-display text-white mb-6">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Arrays
            </span>
          </h1>
          <p className="text-2xl text-white/70 max-w-4xl mx-auto leading-relaxed">
            Master the fundamentals of programming's most essential data structure
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
            <Layers className="w-8 h-8 text-cyan-400" />
            <h2 className="text-3xl font-bold text-white">What is an Array?</h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <p className="text-white/90 text-xl leading-relaxed">
                An array is a fundamental data structure that stores elements of the same type in 
                <span className="text-cyan-400 font-semibold"> contiguous memory locations</span>. 
                Think of it like a row of numbered mailboxes, where each box can hold one item and 
                has a specific address (index).
              </p>
              
              <p className="text-white/80 text-lg leading-relaxed">
                Arrays provide <span className="text-purple-400 font-semibold">efficient random access</span> to 
                elements using their index, making them perfect for scenarios where you need to frequently 
                access data at known positions.
              </p>
            </div>
            
            <div className="flex justify-center">
              <div className="space-y-4">
                <div className="text-center text-white/60 text-sm font-medium">Array Visualization</div>
                <div className="flex gap-2">
                  {['10', '20', '30', '40', '50'].map((value, index) => (
                    <div key={index} className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg mb-2 shadow-lg">
                        {value}
                      </div>
                      <div className="text-white/60 text-sm font-mono">[{index}]</div>
                    </div>
                  ))}
                </div>
                <div className="text-center text-white/50 text-xs">Index-based access</div>
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
            <MemoryStick className="w-8 h-8 text-cyan-400" />
            Key Characteristics
          </h2>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl p-8 border border-cyan-500/20 hover:border-cyan-500/40 transition-all">
              <div className="text-4xl mb-4">🔗</div>
              <h3 className="text-cyan-400 font-bold text-xl mb-4">Contiguous Memory</h3>
              <p className="text-white/80 leading-relaxed">
                Elements are stored in adjacent memory locations, enabling efficient cache utilization 
                and predictable memory access patterns.
              </p>
              <div className="mt-4 p-3 bg-black/20 rounded-lg">
                <div className="text-xs text-white/60 font-mono">Memory Layout:</div>
                <div className="text-sm text-green-400 font-mono">0x100: [10] → 0x104: [20] → 0x108: [30]</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all">
              <div className="text-4xl mb-4">📍</div>
              <h3 className="text-purple-400 font-bold text-xl mb-4">Index-Based Access</h3>
              <p className="text-white/80 leading-relaxed">
                Elements are accessed using zero-based indexing (0, 1, 2, ...), allowing for 
                constant-time O(1) retrieval of any element.
              </p>
              <div className="mt-4 p-3 bg-black/20 rounded-lg">
                <div className="text-xs text-white/60 font-mono">Example:</div>
                <div className="text-sm text-green-400 font-mono">array[2] // Accesses 3rd element</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-500/10 to-teal-500/10 rounded-2xl p-8 border border-green-500/20 hover:border-green-500/40 transition-all">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-green-400 font-bold text-xl mb-4">Homogeneous Data</h3>
              <p className="text-white/80 leading-relaxed">
                Arrays store elements of the same data type, ensuring consistent memory usage 
                and enabling efficient processing operations.
              </p>
              <div className="mt-4 p-3 bg-black/20 rounded-lg">
                <div className="text-xs text-white/60 font-mono">Types:</div>
                <div className="text-sm text-green-400 font-mono">int[], string[], double[]</div>
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
            <Clock className="w-8 h-8 text-cyan-400" />
            Common Operations & Time Complexity
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-cyan-500/30">
                  <th className="text-left text-cyan-400 font-bold py-4 px-6 text-lg">Operation</th>
                  <th className="text-left text-cyan-400 font-bold py-4 px-6 text-lg">Time Complexity</th>
                  <th className="text-left text-cyan-400 font-bold py-4 px-6 text-lg">Explanation</th>
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
                      <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold font-mono shadow-lg">
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
            <Code className="w-8 h-8 text-cyan-400" />
            Code Example
          </h2>
          
          <div className="bg-gray-900/80 rounded-2xl p-8 border border-gray-700/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-white/60 text-sm ml-4">array-example.js</span>
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
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-3xl p-12 border border-cyan-500/20 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to See Arrays in Action?</h3>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Experience real-time array operations with synchronized code execution and memory visualization
            </p>
            
            <button
              onClick={() => navigate('/array-visualizer')}
              className="group bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-6 px-12 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/25 flex items-center gap-4 mx-auto text-xl"
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

export default ArrayInfoPage;