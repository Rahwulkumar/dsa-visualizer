import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Database, Clock, Code, Layers, MemoryStick } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import SpaceBackground from '../components/3d/SpaceBackground';
import AsteroidField from '../components/3d/AsteroidField';
import FloatingParticles from '../components/3d/FloatingParticles';

const GraphInfoPage = () => {
  const navigate = useNavigate();

  const operations = [
    {
      operation: "Add Vertex",
      complexity: "O(1)",
      explanation: "Adding a new vertex to the graph requires constant time - just add to vertex list."
    },
    {
      operation: "Add Edge",
      complexity: "O(1)",
      explanation: "Adding an edge between vertices is constant time in adjacency list representation."
    },
    {
      operation: "Depth-First Search (DFS)",
      complexity: "O(V + E)",
      explanation: "Visit all vertices and edges exactly once. V = vertices, E = edges."
    },
    {
      operation: "Breadth-First Search (BFS)",
      complexity: "O(V + E)",
      explanation: "Explore neighbors level by level, visiting all vertices and edges once."
    },
    {
      operation: "Shortest Path (Dijkstra)",
      complexity: "O((V + E) log V)",
      explanation: "Find shortest path using priority queue. Complexity depends on implementation."
    },
    {
      operation: "Minimum Spanning Tree",
      complexity: "O(E log V)",
      explanation: "Kruskal's or Prim's algorithm to find MST of connected weighted graph."
    }
  ];

  const codeExample = `// JavaScript Graph Example using Adjacency List
class Graph {
    constructor() {
        this.vertices = new Map();
    }

    // Add vertex - O(1)
    addVertex(vertex) {
        if (!this.vertices.has(vertex)) {
            this.vertices.set(vertex, []);
        }
    }

    // Add edge - O(1)
    addEdge(vertex1, vertex2, weight = 1) {
        // Add vertices if they don't exist
        this.addVertex(vertex1);
        this.addVertex(vertex2);
        
        // Add edge (undirected graph)
        this.vertices.get(vertex1).push({node: vertex2, weight});
        this.vertices.get(vertex2).push({node: vertex1, weight});
    }

    // Depth-First Search - O(V + E)
    dfs(startVertex) {
        const visited = new Set();
        const result = [];
        
        const dfsHelper = (vertex) => {
            visited.add(vertex);
            result.push(vertex);
            
            const neighbors = this.vertices.get(vertex) || [];
            for (let neighbor of neighbors) {
                if (!visited.has(neighbor.node)) {
                    dfsHelper(neighbor.node);
                }
            }
        };
        
        dfsHelper(startVertex);
        return result;
    }

    // Breadth-First Search - O(V + E)
    bfs(startVertex) {
        const visited = new Set();
        const queue = [startVertex];
        const result = [];
        
        visited.add(startVertex);
        
        while (queue.length > 0) {
            const vertex = queue.shift();
            result.push(vertex);
            
            const neighbors = this.vertices.get(vertex) || [];
            for (let neighbor of neighbors) {
                if (!visited.has(neighbor.node)) {
                    visited.add(neighbor.node);
                    queue.push(neighbor.node);
                }
            }
        }
        
        return result;
    }

    // Dijkstra's Shortest Path - O((V + E) log V)
    dijkstra(startVertex) {
        const distances = new Map();
        const visited = new Set();
        const previousVertices = new Map();
        
        // Initialize distances
        for (let vertex of this.vertices.keys()) {
            distances.set(vertex, vertex === startVertex ? 0 : Infinity);
        }
        
        while (visited.size < this.vertices.size) {
            // Find unvisited vertex with minimum distance
            let currentVertex = null;
            let minDistance = Infinity;
            
            for (let [vertex, distance] of distances) {
                if (!visited.has(vertex) && distance < minDistance) {
                    minDistance = distance;
                    currentVertex = vertex;
                }
            }
            
            if (currentVertex === null) break;
            
            visited.add(currentVertex);
            
            // Update distances to neighbors
            const neighbors = this.vertices.get(currentVertex) || [];
            for (let neighbor of neighbors) {
                const newDistance = distances.get(currentVertex) + neighbor.weight;
                if (newDistance < distances.get(neighbor.node)) {
                    distances.set(neighbor.node, newDistance);
                    previousVertices.set(neighbor.node, currentVertex);
                }
            }
        }
        
        return { distances, previousVertices };
    }
}

// Usage Example
const graph = new Graph();
graph.addEdge('A', 'B', 4);
graph.addEdge('A', 'C', 2);
graph.addEdge('B', 'C', 1);
graph.addEdge('B', 'D', 5);
graph.addEdge('C', 'D', 8);

console.log(graph.dfs('A')); // DFS traversal
console.log(graph.bfs('A')); // BFS traversal
console.log(graph.dijkstra('A')); // Shortest paths from A`;

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
            <div className="p-6 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-3xl backdrop-blur-sm border border-teal-500/30">
              <Database className="w-16 h-16 text-teal-400" />
            </div>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold font-display text-white mb-6">
            <span className="bg-gradient-to-r from-teal-400 to-cyan-500 bg-clip-text text-transparent">
              Graphs
            </span>
          </h1>
          <p className="text-2xl text-white/70 max-w-4xl mx-auto leading-relaxed">
            Explore network connections and master pathfinding algorithms
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
            <Layers className="w-8 h-8 text-teal-400" />
            <h2 className="text-3xl font-bold text-white">What is a Graph?</h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <p className="text-white/90 text-xl leading-relaxed">
                A graph is a non-linear data structure consisting of 
                <span className="text-teal-400 font-semibold"> vertices (nodes)</span> connected by 
                <span className="text-cyan-400 font-semibold"> edges</span>. Unlike trees, 
                graphs can have cycles and multiple paths between nodes.
              </p>
              
              <p className="text-white/80 text-lg leading-relaxed">
                Graphs model <span className="text-cyan-400 font-semibold">real-world networks</span> like 
                social media connections, road maps, computer networks, and dependency relationships, 
                making them fundamental for pathfinding and network analysis.
              </p>
            </div>
            
            <div className="flex justify-center">
              <div className="space-y-4">
                <div className="text-center text-white/60 text-sm font-medium">Graph Network</div>
                <div className="relative w-48 h-48">
                  {/* Vertices */}
                  <div className="absolute top-4 left-20 w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg">A</div>
                  <div className="absolute top-4 right-20 w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg">B</div>
                  <div className="absolute bottom-4 left-4 w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg">C</div>
                  <div className="absolute bottom-4 right-4 w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg">D</div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg">E</div>
                  
                  {/* Edges */}
                  <svg className="absolute inset-0 w-full h-full">
                    <line x1="88" y1="20" x2="136" y2="20" stroke="#14b8a6" strokeWidth="2" />
                    <line x1="88" y1="20" x2="96" y2="96" stroke="#14b8a6" strokeWidth="2" />
                    <line x1="136" y1="20" x2="152" y2="96" stroke="#14b8a6" strokeWidth="2" />
                    <line x1="96" y1="96" x2="152" y2="96" stroke="#14b8a6" strokeWidth="2" />
                    <line x1="20" y1="172" x2="96" y2="96" stroke="#14b8a6" strokeWidth="2" />
                    <line x1="152" y1="96" x2="172" y2="172" stroke="#14b8a6" strokeWidth="2" />
                  </svg>
                </div>
                <div className="text-center text-white/50 text-xs">Connected network structure</div>
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
            <MemoryStick className="w-8 h-8 text-teal-400" />
            Key Characteristics
          </h2>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-teal-500/10 to-cyan-500/10 rounded-2xl p-8 border border-teal-500/20 hover:border-teal-500/40 transition-all">
              <div className="text-4xl mb-4">🕸️</div>
              <h3 className="text-teal-400 font-bold text-xl mb-4">Flexible Connections</h3>
              <p className="text-white/80 leading-relaxed">
                Unlike trees, graphs can have cycles, multiple paths between nodes, 
                and can be directed or undirected, weighted or unweighted.
              </p>
              <div className="mt-4 p-3 bg-black/20 rounded-lg">
                <div className="text-xs text-white/60 font-mono">Types:</div>
                <div className="text-sm text-green-400 font-mono">Directed, Undirected, Weighted</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl p-8 border border-cyan-500/20 hover:border-cyan-500/40 transition-all">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-cyan-400 font-bold text-xl mb-4">Pathfinding Algorithms</h3>
              <p className="text-white/80 leading-relaxed">
                Graphs enable powerful algorithms like Dijkstra's shortest path, 
                A* search, and minimum spanning tree algorithms.
              </p>
              <div className="mt-4 p-3 bg-black/20 rounded-lg">
                <div className="text-xs text-white/60 font-mono">Algorithms:</div>
                <div className="text-sm text-green-400 font-mono">Dijkstra, A*, BFS, DFS</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-8 border border-blue-500/20 hover:border-blue-500/40 transition-all">
              <div className="text-4xl mb-4">🌐</div>
              <h3 className="text-blue-400 font-bold text-xl mb-4">Real-World Modeling</h3>
              <p className="text-white/80 leading-relaxed">
                Perfect for modeling social networks, computer networks, maps, 
                dependency graphs, and any interconnected system.
              </p>
              <div className="mt-4 p-3 bg-black/20 rounded-lg">
                <div className="text-xs text-white/60 font-mono">Applications:</div>
                <div className="text-sm text-green-400 font-mono">Maps, Social, Networks</div>
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
            <Clock className="w-8 h-8 text-teal-400" />
            Common Operations & Time Complexity
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-teal-500/30">
                  <th className="text-left text-teal-400 font-bold py-4 px-6 text-lg">Operation</th>
                  <th className="text-left text-teal-400 font-bold py-4 px-6 text-lg">Time Complexity</th>
                  <th className="text-left text-teal-400 font-bold py-4 px-6 text-lg">Explanation</th>
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
                      <span className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-bold font-mono shadow-lg">
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
            <Code className="w-8 h-8 text-teal-400" />
            Code Example
          </h2>
          
          <div className="bg-gray-900/80 rounded-2xl p-8 border border-gray-700/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-white/60 text-sm ml-4">graph-example.js</span>
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
          <div className="bg-gradient-to-r from-teal-500/10 to-cyan-500/10 rounded-3xl p-12 border border-teal-500/20 backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to See Graphs in Action?</h3>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Experience real-time graph operations with synchronized code execution and network visualization
            </p>
            
            <button
              onClick={() => navigate('/graph-visualizer')}
              className="group bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white font-bold py-6 px-12 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-teal-500/25 flex items-center gap-4 mx-auto text-xl"
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

export default GraphInfoPage;
