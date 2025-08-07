import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Database, Clock, Code, Layers, MemoryStick } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import SpaceBackground from '../../components/3d/SpaceBackground';
import AsteroidField from '../../components/3d/AsteroidField';
import FloatingParticles from '../../components/3d/FloatingParticles';

const TrieInfoPage = () => {
  const navigate = useNavigate();

  const operations = [
    {
      operation: "Insert",
      complexity: "O(m)",
      explanation: "Insert a word of length m by traversing/creating nodes for each character."
    },
    {
      operation: "Search",
      complexity: "O(m)",
      explanation: "Search for a word of length m by following the path from root to end."
    },
    {
      operation: "Delete",
      complexity: "O(m)",
      explanation: "Mark word as deleted and optionally remove unused nodes from bottom up."
    },
    {
      operation: "Prefix Search",
      complexity: "O(p)",
      explanation: "Find all words with a prefix of length p by traversing to prefix node."
    },
    {
      operation: "Auto-complete",
      complexity: "O(p + n)",
      explanation: "Find prefix (O(p)) then traverse subtree to collect all n words with that prefix."
    },
    {
      operation: "Longest Prefix",
      complexity: "O(m)",
      explanation: "Find the longest prefix of a word that exists in the trie."
    }
  ];

  const codeExample = `// JavaScript Trie (Prefix Tree) Example
class TrieNode {
    constructor() {
        this.children = new Map(); // Character -> TrieNode
        this.isEndOfWord = false;
        this.count = 0; // Number of words passing through this node
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    // Insert operation - O(m) where m is word length
    insert(word) {
        let current = this.root;
        current.count++;
        
        for (let char of word) {
            if (!current.children.has(char)) {
                current.children.set(char, new TrieNode());
            }
            current = current.children.get(char);
            current.count++;
        }
        
        current.isEndOfWord = true;
    }

    // Search operation - O(m)
    search(word) {
        let current = this.root;
        
        for (let char of word) {
            if (!current.children.has(char)) {
                return false;
            }
            current = current.children.get(char);
        }
        
        return current.isEndOfWord;
    }

    // Check if any word starts with prefix - O(p)
    startsWith(prefix) {
        let current = this.root;
        
        for (let char of prefix) {
            if (!current.children.has(char)) {
                return false;
            }
            current = current.children.get(char);
        }
        
        return true;
    }

    // Delete operation - O(m)
    delete(word) {
        this._deleteHelper(this.root, word, 0);
    }

    _deleteHelper(node, word, index) {
        if (index === word.length) {
            if (!node.isEndOfWord) return false;
            node.isEndOfWord = false;
            return node.children.size === 0;
        }
        
        const char = word[index];
        const childNode = node.children.get(char);
        
        if (!childNode) return false;
        
        const shouldDeleteChild = this._deleteHelper(childNode, word, index + 1);
        
        if (shouldDeleteChild) {
            node.children.delete(char);
            return !node.isEndOfWord && node.children.size === 0;
        }
        
        return false;
    }

    // Get all words with given prefix - O(p + n)
    getWordsWithPrefix(prefix) {
        let current = this.root;
        const result = [];
        
        // Navigate to prefix
        for (let char of prefix) {
            if (!current.children.has(char)) {
                return result;
            }
            current = current.children.get(char);
        }
        
        // Collect all words from this point
        this._collectWords(current, prefix, result);
        return result;
    }

    _collectWords(node, currentWord, result) {
        if (node.isEndOfWord) {
            result.push(currentWord);
        }
        
        for (let [char, childNode] of node.children) {
            this._collectWords(childNode, currentWord + char, result);
        }
    }

    // Auto-complete suggestions - O(p + n)
    autoComplete(prefix, maxSuggestions = 10) {
        const words = this.getWordsWithPrefix(prefix);
        return words.slice(0, maxSuggestions);
    }

    // Count words with prefix - O(p)
    countWordsWithPrefix(prefix) {
        let current = this.root;
        
        for (let char of prefix) {
            if (!current.children.has(char)) {
                return 0;
            }
            current = current.children.get(char);
        }
        
        return current.count;
    }

    // Get all words in trie - O(n)
    getAllWords() {
        const result = [];
        this._collectWords(this.root, '', result);
        return result;
    }
}

// Usage Example
const trie = new Trie();

// Insert words
const words = ['apple', 'app', 'apricot', 'application', 'apply', 'banana'];
words.forEach(word => trie.insert(word));

console.log(trie.search('app')); // true
console.log(trie.search('ap')); // false
console.log(trie.startsWith('app')); // true

console.log(trie.getWordsWithPrefix('app')); 
// ['app', 'apple', 'application', 'apply']

console.log(trie.autoComplete('ap', 3)); 
// ['app', 'apple', 'apricot']

console.log(trie.countWordsWithPrefix('app')); // 4`;

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
            <div className="p-6 bg-gradient-to-r from-lime-500/20 to-green-500/20 rounded-3xl backdrop-blur-sm border border-lime-500/30">
              <Database className="w-16 h-16 text-lime-400" />
            </div>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold font-display text-white mb-6">
            <span className="bg-gradient-to-r from-lime-400 to-green-500 bg-clip-text text-transparent">
              Tries
            </span>
          </h1>
          <p className="text-2xl text-white/70 max-w-4xl mx-auto leading-relaxed">
            Navigate prefix trees and master efficient string operations
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
            <Layers className="w-8 h-8 text-lime-400" />
            <h2 className="text-3xl font-bold text-white">What is a Trie?</h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <p className="text-white/90 text-xl leading-relaxed">
                A trie (prefix tree) is a tree data structure used for storing and searching 
                <span className="text-lime-400 font-semibold"> strings efficiently</span>. 
                Each node represents a character, and paths from root to leaves form words.
              </p>
              
              <p className="text-white/80 text-lg leading-relaxed">
                Tries excel at <span className="text-green-400 font-semibold">prefix operations</span>, 
                auto-complete functionality, spell checkers, and IP routing tables. Time complexity 
                depends only on string length, not the number of stored strings.
              </p>
            </div>
            
            <div className="flex justify-center">
              <div className="space-y-4">
                <div className="text-center text-white/60 text-sm font-medium">Trie Structure ("CAT", "CAR", "CARD")</div>
                <div className="flex flex-col items-center gap-2">
                  {/* Root */}
                  <div className="text-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-lime-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      *
                    </div>
                    <div className="text-lime-400 text-xs mt-1 font-mono">Root</div>
                  </div>
                  
                  {/* Level 1 - C */}
                  <div className="text-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-lime-600 to-green-700 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      C
                    </div>
                  </div>
                  
                  {/* Level 2 - A */}
                  <div className="text-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-lime-600 to-green-700 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg">
                      A
                    </div>
                  </div>
                  
                  {/* Level 3 - T, R */}
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-lime-700 to-green-800 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg border-2 border-lime-300">
                        T
                      </div>
                      <div className="text-lime-400 text-xs mt-1 font-mono">END</div>
                    </div>
                    <div className="text-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-lime-700 to-green-800 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg border-2 border-lime-300">
                        R
                      </div>
                      <div className="text-lime-400 text-xs mt-1 font-mono">END</div>
                    </div>
                  </div>
                  
                  {/* Level 4 - D */}
                  <div className="text-center ml-12">
                    <div className="w-6 h-6 bg-gradient-to-br from-lime-800 to-green-900 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg border-2 border-lime-300">
                      D
                    </div>
                    <div className="text-lime-400 text-xs mt-1 font-mono">END</div>
                  </div>
                </div>
                <div className="text-center text-white/50 text-xs">Shared prefix optimization</div>
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
            <MemoryStick className="w-8 h-8 text-lime-400" />
            Key Characteristics
          </h2>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-lime-500/10 to-green-500/10 rounded-2xl p-8 border border-lime-500/20 hover:border-lime-500/40 transition-all">
              <div className="text-4xl mb-4">🌿</div>
              <h3 className="text-lime-400 font-bold text-xl mb-4">Prefix Sharing</h3>
              <p className="text-white/80 leading-relaxed">
                Common prefixes are shared among different words, making storage 
                very efficient for large dictionaries with similar words.
              </p>
              <div className="mt-4 p-3 bg-black/20 rounded-lg">
                <div className="text-xs text-white/60 font-mono">Example:</div>
                <div className="text-sm text-green-400 font-mono">"car", "card", "care" share "car"</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-500/10 to-teal-500/10 rounded-2xl p-8 border border-green-500/20 hover:border-green-500/40 transition-all">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-green-400 font-bold text-xl mb-4">Efficient Search</h3>
              <p className="text-white/80 leading-relaxed">
                Search time depends only on the length of the string being searched, 
                not on the number of strings stored in the trie.
              </p>
              <div className="mt-4 p-3 bg-black/20 rounded-lg">
                <div className="text-xs text-white/60 font-mono">Complexity:</div>
                <div className="text-sm text-green-400 font-mono">O(m) where m = string length</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-teal-500/10 to-cyan-500/10 rounded-2xl p-8 border border-teal-500/20 hover:border-teal-500/40 transition-all">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-teal-400 font-bold text-xl mb-4">Auto-complete</h3>
              <p className="text-white/80 leading-relaxed">
                Perfect for implementing auto-complete features, spell checkers, 
                and finding all words with a given prefix efficiently.
              </p>
              <div className="mt-4 p-3 bg-black/20 rounded-lg">
                <div className="text-xs text-white/60 font-mono">Applications:</div>
                <div className="text-sm text-green-400 font-mono">Search engines, IDEs, Keyboards</div>
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
            <Clock className="w-8 h-8 text-lime-400" />
            Common Operations & Time Complexity
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-lime-500/30">
                  <th className="text-left text-lime-400 font-bold py-4 px-6 text-lg">Operation</th>
                  <th className="text-left text-lime-400 font-bold py-4 px-6 text-lg">Time Complexity</th>
                  <th className="text-left text-lime-400 font-bold py-4 px-6 text-lg">Explanation</th>
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
                      <span className="bg-gradient-to-r from-lime-500 to-green-500 text-white px-4 py-2 rounded-full text-sm font-bold font-mono shadow-lg">
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
            <Code className="w-8 h-8 text-lime-400" />
            Code Example
          </h2>
          
          <div className="bg-gray-900/80 rounded-2xl p-8 border border-gray-700/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-white/60 text-sm ml-4">trie-example.js</span>
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
          <div className="bg-gradient-to-r from-lime-500/10 to-green-500/10 rounded-3xl p-12 border border-lime-500/20 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to See Tries in Action?</h3>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Experience real-time trie operations with synchronized code execution and prefix tree visualization
            </p>
            
            <button
              onClick={() => navigate('/trie-visualizer')}
              className="group bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-400 hover:to-green-400 text-white font-bold py-6 px-12 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-lime-500/25 flex items-center gap-4 mx-auto text-xl"
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

export default TrieInfoPage;
