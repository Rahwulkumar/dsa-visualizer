import React from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Layers, ArrowDown } from 'lucide-react';

const MemoryVisualization = ({ stack = [], top = -1, maxSize = 8, codeLanguage }) => {
  const baseAddress = 0x7fff5fbff000; // More realistic stack base address
  const stackMemory = Array.from({ length: maxSize }, (_, i) => {
    // Stack grows downward in memory, so higher indices get lower addresses
    const address = baseAddress - i * 8; // 8 bytes per stack slot (64-bit)
    const value = stack[i];
    return {
      address: `0x${address.toString(16).toUpperCase()}`,
      value: value !== undefined ? value : null,
      isTop: i === top,
      isEmpty: value === undefined,
      index: i
    };
  }); // Don't reverse - stack should grow upward visually

  const stackPointer = top !== -1 ? `0x${(baseAddress - top * 8).toString(16).toUpperCase()}` : 'NULL';

  return (
    <div 
      className="col-span-4 flex flex-col glass-card p-6 h-full bg-gradient-to-br from-gray-900/90 to-purple-900/90 backdrop-blur-xl border border-gray-700/50"
      role="region"
      aria-labelledby="memory-title"
      aria-describedby="memory-description"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
          <Database className="w-6 h-6 text-purple-400" aria-hidden="true" />
        </div>
        <h2 
          id="memory-title"
          className="text-xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent"
        >
          Memory Model
        </h2>
      </div>
      
      <div 
        id="memory-description" 
        className="sr-only"
      >
        Stack memory visualization showing addresses, values, and pointers. Current stack size: {stack.length}, Maximum capacity: {maxSize}.
      </div>

      <div className="grid grid-cols-2 gap-6 flex-grow">
        {/* Stack Memory */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-lg font-semibold text-gray-300 mb-3">
            <Layers className="w-5 h-5 text-cyan-400" aria-hidden="true" />
            <span>Call Stack</span>
          </div>
          <div 
            className="flex-grow bg-black/30 p-3 rounded-lg border border-white/10 relative"
            role="table"
            aria-label="Stack memory addresses and values"
          >
            <div className="flex flex-col gap-1" role="rowgroup">
              {/* Show addresses in descending order (stack grows down) */}
              <AnimatePresence>
                {stackMemory.slice().reverse().map((mem, displayIndex) => {
                  const actualIndex = maxSize - 1 - displayIndex;
                  return (
                    <motion.div
                      key={`memory-${mem.address}`}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={`flex items-center justify-between p-2 rounded-md transition-all duration-300 ${
                        mem.isTop ? 'bg-cyan-500/30 border-2 border-cyan-400' : 
                        mem.isEmpty ? 'bg-gray-900/50 border border-gray-700' : 
                        'bg-gray-800/70 border border-gray-600'
                      }`}
                      role="row"
                      aria-label={`Stack index ${actualIndex}, address ${mem.address}, value ${mem.value !== null ? mem.value : 'empty'}${mem.isTop ? ', current top of stack' : ''}`}
                    >
                      <div className="flex items-center gap-3" role="cell">
                        <span className="text-xs font-mono text-gray-500 w-12 text-center" aria-label={`Index ${actualIndex}`}>
                          [{actualIndex}]
                        </span>
                        <span className="text-sm font-mono text-gray-400" aria-label={`Memory address ${mem.address}`}>
                          {mem.address}
                        </span>
                      </div>
                      <span 
                        className={`font-bold text-lg ${
                          mem.value !== null ? 'text-white' : 'text-gray-600'
                        }`}
                        role="cell"
                        aria-label={`Value: ${mem.value !== null ? mem.value : 'empty'}`}
                      >
                        {mem.value !== null ? mem.value : '---'}
                      </span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            {top !== -1 && (
              <motion.div 
                layout
                initial={{ y: 40 * (maxSize - top - 1) }}
                animate={{ y: 40 * (maxSize - top - 1) }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="absolute -right-16 flex items-center gap-2"
                style={{ top: `${12 + 40 * (maxSize - top - 1)}px` }}
                aria-label={`Stack pointer indicating top element at index ${top}`}
              >
                <span className="text-purple-400 font-bold text-sm">TOP</span>
                <ArrowDown className="w-4 h-4 text-purple-400" aria-hidden="true" />
              </motion.div>
            )}
          </div>
        </div>

        {/* Pointers and Variables */}
        <div className="flex flex-col">
          <h3 className="text-lg font-semibold text-gray-300 mb-3">Stack Pointers</h3>
          <div 
            className="bg-black/30 p-4 rounded-lg border border-white/10 space-y-4"
            role="table"
            aria-label="Stack pointer information and statistics"
          >
            <div className="flex justify-between items-center" role="row">
              <span className="font-semibold text-gray-300" role="cell">Stack Pointer (SP)</span>
              <span 
                className="font-mono text-cyan-400 bg-cyan-900/50 px-3 py-1 rounded-md" 
                role="cell"
                aria-label={`Stack pointer address: ${stackPointer}`}
              >
                {stackPointer}
              </span>
            </div>
            <div className="flex justify-between items-center" role="row">
              <span className="font-semibold text-gray-300" role="cell">Current Size</span>
              <span 
                className="font-mono text-green-400 bg-green-900/50 px-3 py-1 rounded-md" 
                role="cell"
                aria-label={`Current stack size: ${stack.length} elements`}
              >
                {stack.length}
              </span>
            </div>
            <div className="flex justify-between items-center" role="row">
              <span className="font-semibold text-gray-300" role="cell">Max Capacity</span>
              <span 
                className="font-mono text-red-400 bg-red-900/50 px-3 py-1 rounded-md" 
                role="cell"
                aria-label={`Maximum capacity: ${maxSize} elements`}
              >
                {maxSize}
              </span>
            </div>
            <div className="flex justify-between items-center" role="row">
              <span className="font-semibold text-gray-300" role="cell">Available Space</span>
              <span 
                className="font-mono text-blue-400 bg-blue-900/50 px-3 py-1 rounded-md" 
                role="cell"
                aria-label={`Available space: ${maxSize - stack.length} elements`}
              >
                {maxSize - stack.length}
              </span>
            </div>
            {stack.length > 0 && (
              <div className="flex justify-between items-center border-t border-white/10 pt-3" role="row">
                <span className="font-semibold text-purple-300" role="cell">Top Element</span>
                <span 
                  className="font-mono text-purple-400 bg-purple-900/50 px-3 py-1 rounded-md" 
                  role="cell"
                  aria-label={`Top element value: ${stack[stack.length - 1]}`}
                >
                  {stack[stack.length - 1]}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

MemoryVisualization.propTypes = {
  stack: PropTypes.array,
  top: PropTypes.number,
  maxSize: PropTypes.number,
  codeLanguage: PropTypes.oneOf(['python', 'java', 'c'])
};

MemoryVisualization.defaultProps = {
  stack: [],
  top: -1,
  maxSize: 8,
  codeLanguage: 'python'
};

export default MemoryVisualization;
