import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Database, Clock, Code, Layers, MemoryStick } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import SpaceBackground from '../components/3d/SpaceBackground';
import AsteroidField from '../components/3d/AsteroidField';
import FloatingParticles from '../components/3d/FloatingParticles';

const StackInfoPage = () => {
  const navigate = useNavigate();

  const operations = [
    {
      operation: "Push",
      complexity: "O(1)",
      explanation: "Add an element to the top of the stack. Simply place the new element on top."
    },
    {
      operation: "Pop",
      complexity: "O(1)",
      explanation: "Remove and return the top element from the stack. Access is always from the top."
    },
    {
      operation: "Peek/Top",
      complexity: "O(1)",
      explanation: "View the top element without removing it. Direct access to the most recent element."
    },
    {
      operation: "IsEmpty",
      complexity: "O(1)",
      explanation: "Check if the stack has any elements. Simple size or pointer check."
    },
    {
      operation: "Size",
      complexity: "O(1)",
      explanation: "Get the number of elements in the stack. Maintained as a counter variable."
    }
  ];

  const codeExample = `// JavaScript Stack Example
class Stack {
    constructor() {
        this.items = [];
        this.count = 0;
    }

    // Push operation - O(1)
    push(element) {
        this.items[this.count] = element;
        this.count++;
        return this.count;
    }

    // Pop operation - O(1)
    pop() {
        if (this.isEmpty()) {
            return undefined;
        }
        this.count--;
        const element = this.items[this.count];
        delete this.items[this.count];
        return element;
    }

    // Peek operation - O(1)
    peek() {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.items[this.count - 1];
    }

    // Check if empty - O(1)
    isEmpty() {
        return this.count === 0;
    }

    // Get size - O(1)
    size() {
        return this.count;
    }

    // Clear stack - O(1)
    clear() {
        this.items = [];
        this.count = 0;
    }
}

// Usage example
const stack = new Stack();
stack.push(10);    // Stack: [10]
stack.push(20);    // Stack: [10, 20]
stack.push(30);    // Stack: [10, 20, 30]

console.log(stack.peek()); // Output: 30
console.log(stack.pop());  // Output: 30, Stack: [10, 20]
console.log(stack.size()); // Output: 2`;

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
            <div className="p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl backdrop-blur-sm border border-purple-500/30">
              <Database className="w-16 h-16 text-purple-400" />
            </div>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold font-display text-white mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Stacks
            </span>
          </h1>
          <p className="text-2xl text-white/70 max-w-4xl mx-auto leading-relaxed">
            Master the LIFO principle and understand memory management fundamentals
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
            <Layers className="w-8 h-8 text-purple-400" />
            <h2 className="text-3xl font-bold text-white">What is a Stack?</h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <p className="text-white/90 text-xl leading-relaxed">
                A stack is a linear data structure that follows the 
                <span className="text-purple-400 font-semibold"> Last In, First Out (LIFO)</span> principle. 
                Think of it like a stack of plates - you can only add or remove plates from the top.
              </p>
              
              <p className="text-white/80 text-lg leading-relaxed">
                Stacks are fundamental to <span className="text-pink-400 font-semibold">function calls</span>, 
                expression evaluation, undo operations, and memory management in programming languages.
              </p>
            </div>
            
            <div className="flex justify-center">
              <div className="space-y-4">
                <div className="text-center text-white/60 text-sm font-medium">Stack Visualization (LIFO)</div>
                <div className="flex flex-col-reverse items-center gap-1">
                  {['Third (Top)', 'Second', 'First (Bottom)'].map((item, index) => (
                    <div key={index} className="text-center">
                      <div className={`w-20 h-12 ${
                        index === 2 ? 'bg-gradient-to-br from-purple-500 to-pink-600' : 
                        index === 1 ? 'bg-gradient-to-br from-purple-600 to-pink-700' : 
                        'bg-gradient-to-br from-purple-700 to-pink-800'
                      } rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg border-2 ${
                        index === 2 ? 'border-purple-300' : 'border-purple-500'
                      }`}>
                        {index + 1}
                      </div>
                      {index === 2 && (
                        <div className="text-purple-400 text-xs mt-1 font-mono">← Top (Push/Pop)</div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="text-center text-white/50 text-xs">LIFO Operation</div>
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
            <MemoryStick className="w-8 h-8 text-purple-400" />
            Key Characteristics
          </h2>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-purple-400 font-bold text-xl mb-4">LIFO Principle</h3>
              <p className="text-white/80 leading-relaxed">
                Last In, First Out - the most recently added element is the first one to be removed. 
                All operations happen at the top of the stack.
              </p>
              <div className="mt-4 p-3 bg-black/20 rounded-lg">
                <div className="text-xs text-white/60 font-mono">Order:</div>
                <div className="text-sm text-green-400 font-mono">Push(A) → Push(B) → Pop() = B</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-pink-500/10 to-red-500/10 rounded-2xl p-8 border border-pink-500/20 hover:border-pink-500/40 transition-all">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-pink-400 font-bold text-xl mb-4">Constant Time</h3>
              <p className="text-white/80 leading-relaxed">
                All basic operations (push, pop, peek) are O(1) - constant time complexity. 
                No need to traverse or search through elements.
              </p>
              <div className="mt-4 p-3 bg-black/20 rounded-lg">
                <div className="text-xs text-white/60 font-mono">Complexity:</div>
                <div className="text-sm text-green-400 font-mono">Push O(1), Pop O(1), Peek O(1)</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-500/10 to-teal-500/10 rounded-2xl p-8 border border-green-500/20 hover:border-green-500/40 transition-all">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-green-400 font-bold text-xl mb-4">Function Calls</h3>
              <p className="text-white/80 leading-relaxed">
                Programming languages use stacks for function call management, storing local variables, 
                return addresses, and maintaining execution context.
              </p>
              <div className="mt-4 p-3 bg-black/20 rounded-lg">
                <div className="text-xs text-white/60 font-mono">Call Stack:</div>
                <div className="text-sm text-green-400 font-mono">main() → func1() → func2()</div>
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
            <Clock className="w-8 h-8 text-purple-400" />
            Common Operations & Time Complexity
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-purple-500/30">
                  <th className="text-left text-purple-400 font-bold py-4 px-6 text-lg">Operation</th>
                  <th className="text-left text-purple-400 font-bold py-4 px-6 text-lg">Time Complexity</th>
                  <th className="text-left text-purple-400 font-bold py-4 px-6 text-lg">Explanation</th>
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
            <Code className="w-8 h-8 text-purple-400" />
            Code Example
          </h2>
          
          <div className="bg-gray-900/80 rounded-2xl p-8 border border-gray-700/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-white/60 text-sm ml-4">stack-example.js</span>
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
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl p-12 border border-purple-500/20 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to See Stacks in Action?</h3>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Experience real-time stack operations with synchronized code execution and LIFO visualization
            </p>
            
            <button
              onClick={() => navigate('/stack-visualizer')}
              className="group bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-bold py-6 px-12 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 flex items-center gap-4 mx-auto text-xl"
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

export default StackInfoPage;
