import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Database, Clock, Code, Layers, MemoryStick } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import SpaceBackground from '../components/3d/SpaceBackground';
import AsteroidField from '../components/3d/AsteroidField';
import FloatingParticles from '../components/3d/FloatingParticles';

const HashTableInfoPage = () => {
  const navigate = useNavigate();

  const operations = [
    {
      operation: "Insert",
      complexity: "O(1) avg, O(n) worst",
      explanation: "Average case is constant time. Worst case occurs when all keys hash to same bucket."
    },
    {
      operation: "Search/Get",
      complexity: "O(1) avg, O(n) worst",
      explanation: "Direct access via hash function. Worst case when dealing with many collisions."
    },
    {
      operation: "Delete",
      complexity: "O(1) avg, O(n) worst",
      explanation: "Find the key (O(1) avg) and remove it. May need to handle collision chain."
    },
    {
      operation: "Hash Function",
      complexity: "O(1)",
      explanation: "Computing hash value from key is constant time for good hash functions."
    },
    {
      operation: "Resize/Rehash",
      complexity: "O(n)",
      explanation: "When load factor exceeds threshold, all elements must be rehashed to new table."
    }
  ];

  const codeExample = `// JavaScript Hash Table Example
class HashTable {
    constructor(size = 53) {
        this.keyMap = new Array(size);
        this.size = size;
        this.count = 0;
    }

    // Hash function - O(1)
    _hash(key) {
        let total = 0;
        let WEIRD_PRIME = 31;
        for (let i = 0; i < Math.min(key.length, 100); i++) {
            let char = key[i];
            let value = char.charCodeAt(0) - 96;
            total = (total * WEIRD_PRIME + value) % this.keyMap.length;
        }
        return total;
    }

    // Insert operation - O(1) average
    set(key, value) {
        let index = this._hash(key);
        
        if (!this.keyMap[index]) {
            this.keyMap[index] = [];
        }
        
        // Check if key already exists
        for (let i = 0; i < this.keyMap[index].length; i++) {
            if (this.keyMap[index][i][0] === key) {
                this.keyMap[index][i][1] = value;
                return;
            }
        }
        
        // Add new key-value pair
        this.keyMap[index].push([key, value]);
        this.count++;
        
        // Resize if load factor > 0.75
        if (this.count / this.size > 0.75) {
            this._resize();
        }
    }

    // Search operation - O(1) average
    get(key) {
        let index = this._hash(key);
        if (this.keyMap[index]) {
            for (let i = 0; i < this.keyMap[index].length; i++) {
                if (this.keyMap[index][i][0] === key) {
                    return this.keyMap[index][i][1];
                }
            }
        }
        return undefined;
    }

    // Delete operation - O(1) average
    delete(key) {
        let index = this._hash(key);
        if (this.keyMap[index]) {
            for (let i = 0; i < this.keyMap[index].length; i++) {
                if (this.keyMap[index][i][0] === key) {
                    this.keyMap[index].splice(i, 1);
                    this.count--;
                    return true;
                }
            }
        }
        return false;
    }

    // Get all keys - O(n)
    keys() {
        let keysArr = [];
        for (let i = 0; i < this.keyMap.length; i++) {
            if (this.keyMap[i]) {
                for (let j = 0; j < this.keyMap[i].length; j++) {
                    keysArr.push(this.keyMap[i][j][0]);
                }
            }
        }
        return keysArr;
    }

    // Get all values - O(n)
    values() {
        let valuesArr = [];
        for (let i = 0; i < this.keyMap.length; i++) {
            if (this.keyMap[i]) {
                for (let j = 0; j < this.keyMap[i].length; j++) {
                    if (!valuesArr.includes(this.keyMap[i][j][1])) {
                        valuesArr.push(this.keyMap[i][j][1]);
                    }
                }
            }
        }
        return valuesArr;
    }

    // Resize hash table - O(n)
    _resize() {
        let oldKeyMap = this.keyMap;
        this.size = this.size * 2;
        this.count = 0;
        this.keyMap = new Array(this.size);
        
        for (let i = 0; i < oldKeyMap.length; i++) {
            if (oldKeyMap[i]) {
                for (let j = 0; j < oldKeyMap[i].length; j++) {
                    this.set(oldKeyMap[i][j][0], oldKeyMap[i][j][1]);
                }
            }
        }
    }

    // Get load factor
    getLoadFactor() {
        return this.count / this.size;
    }
}

// Usage Example
const hashTable = new HashTable();
hashTable.set("name", "John");
hashTable.set("age", 25);
hashTable.set("city", "New York");

console.log(hashTable.get("name")); // "John"
console.log(hashTable.keys()); // ["name", "age", "city"]
console.log(hashTable.getLoadFactor()); // Load factor`;

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
            <div className="p-6 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-3xl backdrop-blur-sm border border-orange-500/30">
              <Database className="w-16 h-16 text-orange-400" />
            </div>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold font-display text-white mb-6">
            <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              Hash Tables
            </span>
          </h1>
          <p className="text-2xl text-white/70 max-w-4xl mx-auto leading-relaxed">
            Decode hash functions and master collision resolution strategies
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
            <Layers className="w-8 h-8 text-orange-400" />
            <h2 className="text-3xl font-bold text-white">What is a Hash Table?</h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <p className="text-white/90 text-xl leading-relaxed">
                A hash table is a data structure that implements a 
                <span className="text-orange-400 font-semibold"> key-value mapping</span> using a 
                <span className="text-red-400 font-semibold"> hash function</span> to compute 
                an index into an array of buckets or slots.
              </p>
              
              <p className="text-white/80 text-lg leading-relaxed">
                Hash tables provide <span className="text-red-400 font-semibold">average O(1) access time</span> 
                for insert, search, and delete operations, making them ideal for caches, databases, 
                and implementing dictionaries and sets.
              </p>
            </div>
            
            <div className="flex justify-center">
              <div className="space-y-4">
                <div className="text-center text-white/60 text-sm font-medium">Hash Table Structure</div>
                <div className="space-y-2">
                  {/* Hash Table Array */}
                  {[
                    {index: 0, key: '', value: '', empty: true},
                    {index: 1, key: 'name', value: 'John', hash: true},
                    {index: 2, key: '', value: '', empty: true},
                    {index: 3, key: 'age', value: '25', hash: true},
                    {index: 4, key: 'city', value: 'NYC', hash: true},
                    {index: 5, key: '', value: '', empty: true},
                  ].map((slot, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-700 rounded flex items-center justify-center text-white/60 text-xs font-mono">
                        {slot.index}
                      </div>
                      <div className={`w-32 h-8 rounded-lg flex items-center justify-center text-xs font-mono ${
                        slot.empty 
                          ? 'bg-gray-800 text-white/40' 
                          : 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                      }`}>
                        {slot.empty ? 'null' : `${slot.key}: ${slot.value}`}
                      </div>
                      {slot.hash && (
                        <div className="text-orange-400 text-xs">← hash("{slot.key}")</div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="text-center text-white/50 text-xs">Key → Hash → Index</div>
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
            <MemoryStick className="w-8 h-8 text-orange-400" />
            Key Characteristics
          </h2>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl p-8 border border-orange-500/20 hover:border-orange-500/40 transition-all">
              <div className="text-4xl mb-4">🔐</div>
              <h3 className="text-orange-400 font-bold text-xl mb-4">Hash Function</h3>
              <p className="text-white/80 leading-relaxed">
                A good hash function distributes keys uniformly across the table, 
                minimizing collisions and ensuring fast access times.
              </p>
              <div className="mt-4 p-3 bg-black/20 rounded-lg">
                <div className="text-xs text-white/60 font-mono">Function:</div>
                <div className="text-sm text-green-400 font-mono">key → hash → index</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-red-500/10 to-pink-500/10 rounded-2xl p-8 border border-red-500/20 hover:border-red-500/40 transition-all">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-red-400 font-bold text-xl mb-4">Collision Handling</h3>
              <p className="text-white/80 leading-relaxed">
                When two keys hash to the same index, collision resolution strategies 
                like chaining or open addressing handle the conflict.
              </p>
              <div className="mt-4 p-3 bg-black/20 rounded-lg">
                <div className="text-xs text-white/60 font-mono">Methods:</div>
                <div className="text-sm text-green-400 font-mono">Chaining, Linear Probing</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-2xl p-8 border border-pink-500/20 hover:border-pink-500/40 transition-all">
              <div className="text-4xl mb-4">📏</div>
              <h3 className="text-pink-400 font-bold text-xl mb-4">Load Factor</h3>
              <p className="text-white/80 leading-relaxed">
                The ratio of stored elements to table size. When load factor gets too high, 
                the table is resized to maintain performance.
              </p>
              <div className="mt-4 p-3 bg-black/20 rounded-lg">
                <div className="text-xs text-white/60 font-mono">Formula:</div>
                <div className="text-sm text-green-400 font-mono">load = elements / buckets</div>
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
            <Clock className="w-8 h-8 text-orange-400" />
            Common Operations & Time Complexity
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-orange-500/30">
                  <th className="text-left text-orange-400 font-bold py-4 px-6 text-lg">Operation</th>
                  <th className="text-left text-orange-400 font-bold py-4 px-6 text-lg">Time Complexity</th>
                  <th className="text-left text-orange-400 font-bold py-4 px-6 text-lg">Explanation</th>
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
                      <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-bold font-mono shadow-lg">
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
            <Code className="w-8 h-8 text-orange-400" />
            Code Example
          </h2>
          
          <div className="bg-gray-900/80 rounded-2xl p-8 border border-gray-700/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-white/60 text-sm ml-4">hash-table-example.js</span>
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
          <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-3xl p-12 border border-orange-500/20 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to See Hash Tables in Action?</h3>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Experience real-time hash table operations with synchronized code execution and collision visualization
            </p>
            
            <button
              onClick={() => navigate('/hash-table-visualizer')}
              className="group bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white font-bold py-6 px-12 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/25 flex items-center gap-4 mx-auto text-xl"
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

export default HashTableInfoPage;
