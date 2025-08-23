import React from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity } from 'lucide-react';

const StackVisualization = ({ stack, elementStates, currentElementIndex, maxSize }) => {
  // Generate stable unique IDs for stack elements
  const [elementIds, setElementIds] = React.useState(new Map());
  
  React.useEffect(() => {
    const newIds = new Map();
    stack.forEach((value, index) => {
      const key = `${index}-${value}`;
      if (elementIds.has(key)) {
        newIds.set(key, elementIds.get(key));
      } else {
        newIds.set(key, `stack-element-${Date.now()}-${Math.random().toString(36).slice(2)}`);
      }
    });
    setElementIds(newIds);
  }, [stack]);

  const getElementStyle = (index) => {
    const state = elementStates[index];
    let className = 'bg-gray-700/80 border-gray-500/80 text-white';

    switch (state) {
      case 'pushing':
        className = 'bg-green-600/90 border-green-400 text-white shadow-lg shadow-green-500/30 animate-twinkle';
        break;
      case 'popping':
        className = 'bg-red-600/90 border-red-400 text-white shadow-lg shadow-red-500/30 animate-pulse-glow';
        break;
      case 'peeking':
        className = 'bg-cyan-600/90 border-cyan-400 text-white shadow-lg shadow-cyan-500/30 animate-pulse-glow';
        break;
      default:
        if (currentElementIndex === index) {
          className = 'bg-purple-600/90 border-purple-400 text-white shadow-lg shadow-purple-500/30';
        }
    }
    return className;
  };

  return (
    <div 
      className="col-span-5 flex flex-col glass-card p-6 h-full bg-gradient-to-br from-gray-900/90 to-purple-900/90 backdrop-blur-xl border border-gray-700/50"
      role="region"
      aria-label="Stack Data Structure Visualization"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 
          className="text-xl font-bold text-white flex items-center gap-2"
          id="stack-visualization-title"
        >
          <Activity className="w-6 h-6 text-cyan-400" aria-hidden="true" />
          Stack Visualization
        </h3>
        <span 
          className="text-sm text-gray-300 bg-gray-800/50 px-3 py-1 rounded-full"
          aria-live="polite"
          aria-label={`Stack contains ${stack.length} elements`}
        >
          {stack.length} elements
        </span>
      </div>
      
      <div 
        className="flex-1 flex items-center justify-center p-4 min-h-[300px]"
        role="application"
        aria-labelledby="stack-visualization-title"
        aria-describedby="stack-status"
      >
        <div 
          className="w-48 border-l-4 border-r-4 border-b-4 border-cyan-700/50 rounded-b-lg h-full flex flex-col-reverse relative bg-black/20 pt-10 overflow-hidden max-h-[500px]"
          role="list"
          aria-label="Stack elements in LIFO order"
        >
          {/* Overflow indicator for large stacks */}
          {stack.length > 8 && (
            <div className="absolute top-2 right-2 bg-yellow-500/80 text-yellow-900 text-xs px-2 py-1 rounded">
              {stack.length} items
            </div>
          )}
          
          <AnimatePresence mode="popLayout">
            {stack.map((value, index) => {
              const elementKey = elementIds.get(`${index}-${value}`) || `fallback-${index}-${value}`;
              return (
                <motion.div
                  key={elementKey}
                  layout
                  role="listitem"
                  tabIndex={0}
                  aria-label={`Stack element at index ${index}: value ${value}${currentElementIndex === index ? ', currently highlighted' : ''}${elementStates[index] ? `, status: ${elementStates[index]}` : ''}`}
                  initial={{ opacity: 0, y: -60, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0, 
                    scale: 1,
                    transition: { 
                      type: 'spring', 
                      stiffness: 400, 
                      damping: 25,
                      duration: 0.6
                    }
                  }}
                  exit={{ 
                    opacity: 0, 
                    y: 60, 
                    scale: 0.8, 
                    transition: { duration: 0.4 } 
                  }}
                  className={`w-full h-16 flex items-center justify-center text-xl font-bold m-[-2px] border-2 rounded-lg transition-all duration-300 will-change-transform focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900 ${getElementStyle(index)}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      // Could add voice announcement or zoom here for accessibility
                    }
                  }}
                >
                  <span className="relative z-10 font-bold drop-shadow-lg">{value}</span>
                  {currentElementIndex === index && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-500/20 rounded-lg"
                      animate={{ opacity: [0.3, 0.7, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
          
          <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
            Stack
          </div>
        </div>
      </div>
      
      {/* Status indicator */}
      {currentElementIndex >= 0 && (
        <div 
          className="mt-4 text-center text-sm text-gray-300 bg-gray-800/50 py-2 px-4 rounded-lg"
          id="stack-status"
          role="status"
          aria-live="polite"
        >
          Currently examining index {currentElementIndex} 
          {elementStates[currentElementIndex] && (
            <span className="ml-2 text-cyan-400">
              ({elementStates[currentElementIndex]})
            </span>
          )}
        </div>
      )}
      
      <AnimatePresence>
        {stack.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-gray-800/80 backdrop-blur-md px-4 py-2 rounded-lg border border-purple-500/50"
          >
            <span className="text-purple-400 font-bold">TOP</span>
            <div className="w-px h-6 bg-purple-500/50"></div>
            <span className="text-2xl font-mono text-white">{currentElementIndex >= 0 ? currentElementIndex : stack.length - 1}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

StackVisualization.propTypes = {
  stack: PropTypes.array.isRequired,
  elementStates: PropTypes.object.isRequired,
  currentElementIndex: PropTypes.number.isRequired,
  maxSize: PropTypes.number.isRequired
};

StackVisualization.defaultProps = {
  stack: [],
  elementStates: {},
  currentElementIndex: -1,
  maxSize: 8
};

export default StackVisualization;