import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { theme } from '../../theme';

const DSAModulesGrid = () => {
  const navigate = useNavigate();

  const handleModuleClick = (moduleId) => {
    // Navigate to specific module info pages
    const routeMap = {
      'arrays': '/array-info',
      'linked-lists': '/linked-list-info',
      'stacks': '/stack-info',
      'queues': '/queue-info',
      'trees': '/tree-info',
      'graphs': '/graph-info',
      'hash-tables': '/hash-table-info',
      'heaps': '/heap-info',
      'tries': '/trie-info',
      'sorting': '/sorting-info',
      'searching': '/searching-info'
    };

    const route = routeMap[moduleId];
    if (route) {
      navigate(route);
    } else {
      console.log(`No route defined for ${moduleId} module`);
    }
  };
  const modules = [
    {
      id: 'arrays',
      title: 'Arrays',
      description: 'Explore contiguous memory allocation and index-based access patterns',
      icon: '🗂️',
      color: 'from-cyan-500 to-blue-600',
      glowColor: 'shadow-cyan-500/25',
      operations: ['Insert', 'Delete', 'Search', 'Update'],
      complexity: 'O(1) - O(n)'
    },
    {
      id: 'linked-lists',
      title: 'Linked Lists',
      description: 'Journey through pointer-based dynamic memory structures',
      icon: '🔗',
      color: 'from-blue-500 to-purple-600',
      glowColor: 'shadow-blue-500/25',
      operations: ['Insert', 'Delete', 'Traverse', 'Search'],
      complexity: 'O(1) - O(n)'
    },
    {
      id: 'stacks',
      title: 'Stacks',
      description: 'Master the LIFO principle in memory management',
      icon: '📚',
      color: 'from-purple-500 to-pink-600',
      glowColor: 'shadow-purple-500/25',
      operations: ['Push', 'Pop', 'Peek', 'IsEmpty'],
      complexity: 'O(1)'
    },
    {
      id: 'queues',
      title: 'Queues',
      description: 'Navigate FIFO data flow and circular buffer mechanics',
      icon: '🚶‍♂️',
      color: 'from-pink-500 to-red-600',
      glowColor: 'shadow-pink-500/25',
      operations: ['Enqueue', 'Dequeue', 'Front', 'Rear'],
      complexity: 'O(1)'
    },
    {
      id: 'trees',
      title: 'Trees',
      description: 'Traverse hierarchical structures and tree traversal algorithms',
      icon: '🌳',
      color: 'from-green-500 to-teal-600',
      glowColor: 'shadow-green-500/25',
      operations: ['Insert', 'Delete', 'Traverse', 'Search'],
      complexity: 'O(log n) - O(n)'
    },
    {
      id: 'graphs',
      title: 'Graphs',
      description: 'Explore network connections and pathfinding algorithms',
      icon: '🕸️',
      color: 'from-teal-500 to-cyan-600',
      glowColor: 'shadow-teal-500/25',
      operations: ['DFS', 'BFS', 'Shortest Path', 'MST'],
      complexity: 'O(V + E)'
    },
    {
      id: 'hash-tables',
      title: 'Hash Tables',
      description: 'Decode hash functions and collision resolution strategies',
      icon: '🔐',
      color: 'from-orange-500 to-red-600',
      glowColor: 'shadow-orange-500/25',
      operations: ['Insert', 'Delete', 'Search', 'Hash'],
      complexity: 'O(1) avg'
    },
    {
      id: 'heaps',
      title: 'Heaps',
      description: 'Master priority queues and heap property maintenance',
      icon: '⛰️',
      color: 'from-yellow-500 to-orange-600',
      glowColor: 'shadow-yellow-500/25',
      operations: ['Insert', 'Extract', 'Heapify', 'Build'],
      complexity: 'O(log n)'
    },
    {
      id: 'tries',
      title: 'Tries',
      description: 'Navigate prefix trees and efficient string operations',
      icon: '🌿',
      color: 'from-lime-500 to-green-600',
      glowColor: 'shadow-lime-500/25',
      operations: ['Insert', 'Search', 'Delete', 'Prefix'],
      complexity: 'O(m)'
    },
    {
      id: 'sorting',
      title: 'Sorting',
      description: 'Visualize comparison-based and non-comparison sorting algorithms',
      icon: '📊',
      color: 'from-indigo-500 to-purple-600',
      glowColor: 'shadow-indigo-500/25',
      operations: ['Bubble', 'Quick', 'Merge', 'Heap'],
      complexity: 'O(n log n)'
    },
    {
      id: 'searching',
      title: 'Searching',
      description: 'Discover linear and binary search optimization techniques',
      icon: '🔍',
      color: 'from-violet-500 to-pink-600',
      glowColor: 'shadow-violet-500/25',
      operations: ['Linear', 'Binary', 'Hash', 'Tree'],
      complexity: 'O(1) - O(n)'
    }
  ];

  return (
    <section id="modules" className="pt-8 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Main Title - Now at the top */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center mb-4"
        >
          <h2 className="text-5xl md:text-6xl font-bold font-display text-white mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Data Structure
            </span>
            <br />
            <span className="text-white">Cosmos</span>
          </h2>
        </motion.div>

        {/* Subtitle - Appears after title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center mb-16"
        >
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            Each module is a planet in our DSA universe. Click to explore the inner workings 
            of algorithms and their impact on memory and performance.
          </p>
        </motion.div>

        {/* Modules Grid - Staggered animation */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {modules.map((module, index) => {
            // Calculate row and column for more complex animations
            const row = Math.floor(index / 3);
            const col = index % 3;
            
            return (
              <motion.div
                key={module.id}
                initial={{ 
                  opacity: 0, 
                  y: 60 + (row * 20), 
                  x: (col - 1) * 30,
                  scale: 0.9,
                  rotateY: -15
                }}
                whileInView={{ 
                  opacity: 1, 
                  y: 0, 
                  x: 0,
                  scale: 1,
                  rotateY: 0
                }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.8, 
                  delay: 0.8 + (index * 0.15),
                  ease: "easeOut"
                }}
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5,
                  rotateX: 5,
                  boxShadow: `0 25px 50px ${module.glowColor.replace('shadow-', 'rgba(').replace('/25', ', 0.4)')}`,
                  transition: { duration: 0.3 }
                }}
                onClick={() => handleModuleClick(module.id)}
                className="relative group cursor-pointer"
              >
                <div className="relative p-6 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl hover:border-white/20 transition-all duration-500 overflow-hidden">
                  {/* Background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  {/* Module Icon */}
                  <motion.div 
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 1 + (index * 0.15) }}
                    className="text-4xl mb-4 relative z-10"
                  >
                    {module.icon}
                  </motion.div>
                  
                  {/* Module Title */}
                  <motion.h3 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 1.2 + (index * 0.15) }}
                    className="text-xl font-bold text-white mb-2 relative z-10"
                  >
                    {module.title}
                  </motion.h3>
                  
                  {/* Description */}
                  <motion.p 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 1.4 + (index * 0.15) }}
                    className="text-white/70 text-sm mb-4 relative z-10 leading-relaxed"
                  >
                    {module.description}
                  </motion.p>
                  
                  {/* Operations */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 1.6 + (index * 0.15) }}
                    className="flex flex-wrap gap-2 mb-4 relative z-10"
                  >
                    {module.operations.map((op, opIndex) => (
                      <motion.span
                        key={op}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: 1.8 + (index * 0.15) + (opIndex * 0.1) }}
                        className="text-xs px-2 py-1 bg-white/10 rounded-full text-white/80 backdrop-blur-sm"
                      >
                        {op}
                      </motion.span>
                    ))}
                  </motion.div>
                  
                  {/* Complexity */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 2 + (index * 0.15) }}
                    className="flex items-center justify-between relative z-10"
                  >
                    <span className="text-xs text-white/60">Complexity:</span>
                    <span className="text-xs font-mono text-cyan-400">{module.complexity}</span>
                  </motion.div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/20 rounded-2xl transition-all duration-500" />
                  
                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-2xl group-hover:shadow-2xl transition-shadow duration-500" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Call to Action - Final element with delayed animation */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 2.5, ease: "easeOut" }}
          className="text-center mt-20"
        >
          <motion.button
            initial={{ boxShadow: "0 0 0px rgba(0, 212, 255, 0)" }}
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 0 30px rgba(0, 212, 255, 0.5)",
              transition: { duration: 0.3 }
            }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:from-cyan-400 hover:to-blue-500 transition-all duration-300"
          >
            🚀 Explore All Modules
          </motion.button>
          
          {/* Additional animated text */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 3 }}
            className="text-white/60 text-sm mt-4"
          >
            Begin your journey through the algorithmic universe
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default DSAModulesGrid;
