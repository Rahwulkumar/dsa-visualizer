import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Database, Clock, Code, Layers, MemoryStick } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import SpaceBackground from '../components/3d/SpaceBackground';
import AsteroidField from '../components/3d/AsteroidField';
import FloatingParticles from '../components/3d/FloatingParticles';

const TreeInfoPage = () => {
  const navigate = useNavigate();

  const operations = [
    {
      operation: "Search",
      complexity: "O(log n)*",
      explanation: "In balanced trees, searching follows a logarithmic path from root to target node."
    },
    {
      operation: "Insertion",
      complexity: "O(log n)*",
      explanation: "Insert at the correct position while maintaining tree properties and balance."
    },
    {
      operation: "Deletion",
      complexity: "O(log n)*",
      explanation: "Remove node and restructure tree to maintain ordering and balance properties."
    },
    {
      operation: "Traversal (In/Pre/Post)",
      complexity: "O(n)",
      explanation: "Visit every node exactly once in specific order - requires touching all n nodes."
    },
    {
      operation: "Find Min/Max",
      complexity: "O(log n)*",
      explanation: "In BST, minimum is leftmost node, maximum is rightmost node."
    },
    {
      operation: "Height Calculation",
      complexity: "O(n)",
      explanation: "Must traverse all paths to find the longest one from root to leaf."
    }
  ];

  const codeExample = `// JavaScript Binary Search Tree Example
class TreeNode {
    constructor(val, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

class BinarySearchTree {
    constructor() {
        this.root = null;
    }

    // Insert operation - O(log n) average
    insert(val) {
        if (!this.root) {
            this.root = new TreeNode(val);
            return;
        }
        
        this._insertHelper(this.root, val);
    }

    _insertHelper(node, val) {
        if (val < node.val) {
            if (!node.left) {
                node.left = new TreeNode(val);
            } else {
                this._insertHelper(node.left, val);
            }
        } else {
            if (!node.right) {
                node.right = new TreeNode(val);
            } else {
                this._insertHelper(node.right, val);
            }
        }
    }

    // Search operation - O(log n) average
    search(val) {
        return this._searchHelper(this.root, val);
    }

    _searchHelper(node, val) {
        if (!node || node.val === val) {
            return node;
        }
        
        if (val < node.val) {
            return this._searchHelper(node.left, val);
        } else {
            return this._searchHelper(node.right, val);
        }
    }

    // In-order traversal - O(n)
    inOrderTraversal() {
        const result = [];
        this._inOrderHelper(this.root, result);
        return result;
    }

    _inOrderHelper(node, result) {
        if (node) {
            this._inOrderHelper(node.left, result);
            result.push(node.val);
            this._inOrderHelper(node.right, result);
        }
    }

    // Find minimum value - O(log n)
    findMin() {
        if (!this.root) return null;
        let current = this.root;
        while (current.left) {
            current = current.left;
        }
        return current.val;
    }

    // Find maximum value - O(log n)
    findMax() {
        if (!this.root) return null;
        let current = this.root;
        while (current.right) {
            current = current.right;
        }
        return current.val;
    }
}

// Usage Example
const bst = new BinarySearchTree();
bst.insert(50);
bst.insert(30);
bst.insert(70);
bst.insert(20);
bst.insert(40);

console.log(bst.search(30)); // Found
console.log(bst.inOrderTraversal()); // [20, 30, 40, 50, 70]`;

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
            <div className="p-6 bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-3xl backdrop-blur-sm border border-green-500/30">
              <Database className="w-16 h-16 text-green-400" />
            </div>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold font-display text-white mb-6">
            <span className="bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-transparent">
              Trees
            </span>
          </h1>
          <p className="text-2xl text-white/70 max-w-4xl mx-auto leading-relaxed">
            Traverse hierarchical structures and master tree-based algorithms
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
            <Layers className="w-8 h-8 text-green-400" />
            <h2 className="text-3xl font-bold text-white">What is a Tree?</h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <p className="text-white/90 text-xl leading-relaxed">
                A tree is a hierarchical data structure consisting of 
                <span className="text-green-400 font-semibold"> nodes</span> connected by 
                <span className="text-teal-400 font-semibold"> edges</span>. It represents 
                parent-child relationships with one root node and no cycles.
              </p>
              
              <p className="text-white/80 text-lg leading-relaxed">
                Trees excel at <span className="text-teal-400 font-semibold">hierarchical organization</span>, 
                efficient searching (O(log n) in balanced trees), and representing nested structures 
                like file systems, organization charts, and decision trees.
              </p>
            </div>
            
            <div className="flex justify-center">
              <div className="space-y-4">
                <div className="text-center text-white/60 text-sm font-medium">Binary Tree Structure</div>
                <div className="flex flex-col items-center gap-3">
                  {/* Root */}
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      50
                    </div>
                    <div className="text-green-400 text-xs mt-1 font-mono">Root</div>
                  </div>
                  
                  {/* Level 1 */}
                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-teal-700 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                        30
                      </div>
                      <div className="text-white/60 text-xs mt-1 font-mono">Left</div>
                    </div>
                    <div className="text-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-teal-700 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                        70
                      </div>
                      <div className="text-white/60 text-xs mt-1 font-mono">Right</div>
                    </div>
                  </div>
                  
                  {/* Level 2 */}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-700 to-teal-800 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg">
                      20
                    </div>
                    <div className="w-8 h-8 bg-gradient-to-br from-green-700 to-teal-800 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg">
                      40
                    </div>
                    <div className="w-8 h-8 bg-gradient-to-br from-green-700 to-teal-800 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg">
                      60
                    </div>
                    <div className="w-8 h-8 bg-gradient-to-br from-green-700 to-teal-800 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg">
                      80
                    </div>
                  </div>
                </div>
                <div className="text-center text-white/50 text-xs">Hierarchical structure</div>
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
            <MemoryStick className="w-8 h-8 text-green-400" />
            Key Characteristics
          </h2>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-green-500/10 to-teal-500/10 rounded-2xl p-8 border border-green-500/20 hover:border-green-500/40 transition-all">
              <div className="text-4xl mb-4">🌳</div>
              <h3 className="text-green-400 font-bold text-xl mb-4">Hierarchical Structure</h3>
              <p className="text-white/80 leading-relaxed">
                Nodes are organized in parent-child relationships with one root node. 
                Each node can have multiple children but only one parent.
              </p>
              <div className="mt-4 p-3 bg-black/20 rounded-lg">
                <div className="text-xs text-white/60 font-mono">Structure:</div>
                <div className="text-sm text-green-400 font-mono">Root → Children → Leaves</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-teal-500/10 to-cyan-500/10 rounded-2xl p-8 border border-teal-500/20 hover:border-teal-500/40 transition-all">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-teal-400 font-bold text-xl mb-4">Efficient Search</h3>
              <p className="text-white/80 leading-relaxed">
                Binary Search Trees provide O(log n) search time by eliminating half 
                of the remaining nodes with each comparison.
              </p>
              <div className="mt-4 p-3 bg-black/20 rounded-lg">
                <div className="text-xs text-white/60 font-mono">BST Property:</div>
                <div className="text-sm text-green-400 font-mono">left &lt; root &lt; right</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl p-8 border border-cyan-500/20 hover:border-cyan-500/40 transition-all">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-cyan-400 font-bold text-xl mb-4">Multiple Traversals</h3>
              <p className="text-white/80 leading-relaxed">
                Trees support different traversal methods: in-order, pre-order, post-order, 
                and level-order, each serving different purposes.
              </p>
              <div className="mt-4 p-3 bg-black/20 rounded-lg">
                <div className="text-xs text-white/60 font-mono">Traversals:</div>
                <div className="text-sm text-green-400 font-mono">DFS, BFS, In/Pre/Post-order</div>
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
            <Clock className="w-8 h-8 text-green-400" />
            Common Operations & Time Complexity
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-green-500/30">
                  <th className="text-left text-green-400 font-bold py-4 px-6 text-lg">Operation</th>
                  <th className="text-left text-green-400 font-bold py-4 px-6 text-lg">Time Complexity</th>
                  <th className="text-left text-green-400 font-bold py-4 px-6 text-lg">Explanation</th>
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
                      <span className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-bold font-mono shadow-lg">
                        {op.complexity}
                      </span>
                    </td>
                    <td className="py-5 px-6 text-white/80 leading-relaxed">{op.explanation}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-yellow-400 text-sm">
              <strong>*Note:</strong> Time complexities assume balanced trees. Unbalanced trees can degrade to O(n) in worst case.
            </p>
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
            <Code className="w-8 h-8 text-green-400" />
            Code Example
          </h2>
          
          <div className="bg-gray-900/80 rounded-2xl p-8 border border-gray-700/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-white/60 text-sm ml-4">binary-search-tree.js</span>
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
          <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 rounded-3xl p-12 border border-green-500/20 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to See Trees in Action?</h3>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Experience real-time tree operations with synchronized code execution and hierarchical visualization
            </p>
            
            <button
              onClick={() => navigate('/tree-visualizer')}
              className="group bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-400 hover:to-teal-400 text-white font-bold py-6 px-12 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-green-500/25 flex items-center gap-4 mx-auto text-xl"
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

export default TreeInfoPage;
