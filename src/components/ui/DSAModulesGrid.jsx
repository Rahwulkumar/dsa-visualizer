import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { theme } from '../../theme';

const DSAModulesGrid = () => {
  const navigate = useNavigate();

  const handleModuleClick = (moduleId) => {
    // For now, just log the module ID
    // In the future, this will navigate to /modules/${moduleId}
    console.log(`Navigating to ${moduleId} module`);
    // navigate(`/modules/${moduleId}`);
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
    <section id="modules" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-display text-white mb-6">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Data Structure
            </span>
            <br />
            <span className="text-white">Cosmos</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            Each module is a planet in our DSA universe. Click to explore the inner workings 
            of algorithms and their impact on memory and performance.
          </p>
        </motion.div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.05,
                rotateY: 5,
                boxShadow: `0 20px 40px ${module.glowColor.replace('shadow-', 'rgba(').replace('/25', ', 0.3)')}` 
              }}
              onClick={() => handleModuleClick(module.id)}
              className="relative group cursor-pointer"
            >
              <div className="relative p-6 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl hover:border-white/20 transition-all duration-500 overflow-hidden">
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
                
                {/* Module Icon */}
                <div className="text-4xl mb-4 relative z-10">
                  {module.icon}
                </div>
                
                {/* Module Title */}
                <h3 className="text-xl font-bold text-white mb-2 relative z-10">
                  {module.title}
                </h3>
                
                {/* Description */}
                <p className="text-white/70 text-sm mb-4 relative z-10 leading-relaxed">
                  {module.description}
                </p>
                
                {/* Operations */}
                <div className="flex flex-wrap gap-2 mb-4 relative z-10">
                  {module.operations.map((op) => (
                    <span
                      key={op}
                      className="text-xs px-2 py-1 bg-white/10 rounded-full text-white/80 backdrop-blur-sm"
                    >
                      {op}
                    </span>
                  ))}
                </div>
                
                {/* Complexity */}
                <div className="flex items-center justify-between relative z-10">
                  <span className="text-xs text-white/60">Complexity:</span>
                  <span className="text-xs font-mono text-cyan-400">{module.complexity}</span>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/20 rounded-2xl transition-all duration-500" />
                
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-2xl group-hover:shadow-2xl transition-shadow duration-500" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(0, 212, 255, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:from-cyan-400 hover:to-blue-500 transition-all duration-300"
          >
            Explore All Modules
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default DSAModulesGrid;
