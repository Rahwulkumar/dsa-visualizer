import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { MemoryStick, Search } from 'lucide-react';

const MemoryVisualization = ({ 
  currentMemoryIndex, 
  displayArray,
  searchTarget,
  elementStates = {}
}) => {
  return (
    <div className="col-span-4 glass-card p-4 overflow-hidden max-h-[800px]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-purple-500/20 rounded-lg">
          <MemoryStick className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Memory Model</h2>
          <p className="text-sm text-gray-400">Runtime Memory Analysis</p>
        </div>
      </div>

      {/* Search Context */}
      <div className="mb-4 p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Search className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-cyan-300">Search Context</h3>
        </div>
        
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-400">Target Value:</span>
            <span className="text-cyan-400 font-mono">
              {searchTarget !== null ? searchTarget : 'Not set'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Array Size:</span>
            <span className="text-white font-mono">{displayArray.length}</span>
          </div>
        </div>
      </div>

      {/* Heap Memory */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <MemoryStick className="w-4 h-4 text-green-400" />
          <h3 className="text-sm font-semibold text-white">Heap Memory</h3>
        </div>

        {/* Array Elements */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-gray-300">Array Elements:</div>
          <div className="space-y-1 max-h-48 overflow-hidden">
            {displayArray.map((value, index) => {
              const isHighlighted = currentMemoryIndex === index;
              const elementState = elementStates[index];
              
              let bgColor = 'bg-gray-700/50';
              let borderColor = 'border-gray-600/50';
              let textColor = 'text-white';
              
              if (isHighlighted) {
                bgColor = 'bg-yellow-500/20';
                borderColor = 'border-yellow-500/50';
                textColor = 'text-yellow-200';
              } else if (elementState === 'comparing') {
                bgColor = 'bg-blue-500/20';
                borderColor = 'border-blue-500/50';
                textColor = 'text-blue-200';
              } else if (elementState === 'found') {
                bgColor = 'bg-green-500/20';
                borderColor = 'border-green-500/50';
                textColor = 'text-green-200';
              } else if (elementState === 'visited') {
                bgColor = 'bg-red-500/20';
                borderColor = 'border-red-500/50';
                textColor = 'text-red-200';
              }

              return (
                <div
                  key={index}
                  className={`p-2 border rounded text-xs font-mono ${bgColor} ${borderColor} ${textColor} transition-all duration-300`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">arr[{index}]</span>
                    <span className="font-bold">{value}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Memory Legend */}
      <div>
        <div className="text-xs font-semibold text-gray-300 mb-2">Memory States:</div>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500/20 border border-yellow-500/50 rounded"></div>
            <span className="text-gray-400">Currently Accessing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500/20 border border-blue-500/50 rounded"></div>
            <span className="text-gray-400">Comparing</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500/20 border border-green-500/50 rounded"></div>
            <span className="text-gray-400">Found</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500/20 border border-red-500/50 rounded"></div>
            <span className="text-gray-400">Visited</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-700/50 border border-gray-600/50 rounded"></div>
            <span className="text-gray-400">Normal</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryVisualization;