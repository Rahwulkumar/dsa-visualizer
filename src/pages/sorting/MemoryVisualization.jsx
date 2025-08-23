import React, { useCallback, useMemo } from 'react';
import { Layers, Database } from 'lucide-react';
import '../../styles/globals.css';

const MemoryVisualization = ({ stackMemory, heapMemory, currentMemoryIndex, elementStates, currentStackFrame, codeLanguage, comparisons, swaps }) => {
  const getMemoryStyle = useCallback((index) => {
    const isCurrentMemory = currentMemoryIndex === index;
    const elementState = elementStates[index];
    if (isCurrentMemory || ['comparing', 'swapping', 'sorted', 'pivot', 'merging'].includes(elementState)) {
      return 'bg-cyan-500/30 border-cyan-500/60 shadow-lg shadow-cyan-500/20 scale-105';
    } else if (elementState === 'current') {
      return 'bg-purple-500/30 border-purple-500/60 shadow-lg shadow-purple-500/20 scale-105';
    } else if (elementState === 'min' || elementState === 'max') {
      return 'bg-pink-500/30 border-pink-500/60 shadow-lg shadow-pink-500/20 scale-105';
    }
    return 'bg-gray-800/50 border-gray-600/30 hover:border-gray-500/50';
  }, [currentMemoryIndex, elementStates]);

  // Convert single stackFrame to array format for consistency
  const stackFramesArray = useMemo(() => {
    if (Array.isArray(stackMemory)) {
      return stackMemory;
    } else if (stackMemory || currentStackFrame) {
      const frame = stackMemory || currentStackFrame;
      const functionName = codeLanguage === 'python' ? 'sort()' : 
                          codeLanguage === 'java' ? 'sortArray()' : 'sort_array()';
      return [{
        name: functionName,
        variables: frame || {}
      }];
    }
    return [];
  }, [stackMemory, currentStackFrame, codeLanguage]);

  return (
    <div className="col-span-3 flex flex-col gap-4">
      {/* Stack Memory */}
      <div className="glass-card p-3 flex-1">
        <h4 className="text-md font-bold text-white mb-2 flex items-center gap-2">
          <Layers className="w-4 h-4 text-green-400" />
          Stack Memory
        </h4>
        <div className="space-y-2">
          {stackFramesArray.length > 0 ? (
            stackFramesArray.map((frame, index) => (
              <div key={index} className="bg-green-500/10 border border-green-500/30 rounded-lg p-2">
                <div className="text-green-300 text-sm font-semibold">{frame.name}</div>
                <div className="text-xs text-gray-400">
                  {Object.entries(frame.variables || {}).map(([key, value]) => (
                    <div key={key}>
                      {key}: {value}
                      {currentStackFrame && key === 'i' && (
                        <span className="ml-2 text-cyan-400">= {currentStackFrame.i}</span>
                      )}
                      {currentStackFrame && key === 'j' && (
                        <span className="ml-2 text-cyan-400">= {currentStackFrame.j}</span>
                      )}
                      {currentStackFrame && key === 'pivot' && currentStackFrame.pivot !== undefined && (
                        <span className="ml-2 text-purple-400">= {currentStackFrame.pivot}</span>
                      )}
                      {currentStackFrame && key === 'key' && currentStackFrame.key !== undefined && (
                        <span className="ml-2 text-emerald-400">= {currentStackFrame.key}</span>
                      )}
                      {currentStackFrame && key === 'minIdx' && currentStackFrame.minIdx !== undefined && (
                        <span className="ml-2 text-pink-400">= {currentStackFrame.minIdx}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-2 text-center">
              <div className="text-gray-400 text-sm">No active stack frames</div>
            </div>
          )}
        </div>
      </div>

      {/* Sorting Statistics */}
      <div className="glass-card p-3">
        <h4 className="text-md font-bold text-white mb-2 flex items-center gap-2">
          <Database className="w-4 h-4 text-cyan-400" />
          Sorting Statistics
        </h4>
        <div className="space-y-3">
          {/* Comparisons */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-2">
            <div className="flex justify-between items-center">
              <span className="text-blue-300 text-sm font-semibold">Comparisons</span>
              <span className="text-blue-200 font-mono text-lg">{comparisons || 0}</span>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Number of element comparisons performed
            </div>
          </div>

          {/* Swaps */}
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-2">
            <div className="flex justify-between items-center">
              <span className="text-green-300 text-sm font-semibold">Swaps</span>
              <span className="text-green-200 font-mono text-lg">{swaps || 0}</span>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Number of element swaps performed
            </div>
          </div>

          {/* Time Complexity */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-2">
            <div className="text-yellow-300 text-sm font-semibold mb-1">Time Complexity</div>
            <div className="text-xs text-gray-300">
              Current: <span className="text-yellow-200 font-mono">O(n²)</span>
            </div>
            <div className="text-xs text-gray-400">
              Best case varies by algorithm
            </div>
          </div>

          {/* Space Complexity */}
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-2">
            <div className="text-purple-300 text-sm font-semibold mb-1">Space Complexity</div>
            <div className="text-xs text-gray-300">
              Current: <span className="text-purple-200 font-mono">O(1)</span>
            </div>
            <div className="text-xs text-gray-400">
              In-place sorting algorithm
            </div>
          </div>
        </div>
      </div>

      {/* Heap Memory */}
      <div className="glass-card p-3 flex-1">
        <h4 className="text-md font-bold text-white mb-2 flex items-center gap-2">
          <Database className="w-4 h-4 text-blue-400" />
          Heap Memory
        </h4>
        <div className="space-y-2">
          {heapMemory && heapMemory.length > 0 ? (
            <div className="space-y-2">
              {heapMemory.map((item, index) => (
                <div
                  key={index}
                  className={`p-2 rounded border text-sm transition-all duration-300 ${getMemoryStyle(index)}`}
                >
                  <div className="flex justify-between">
                    <span className="text-gray-300 font-mono">
                      Address: 0x{(0x7f8b1c000000 + index * 4).toString(16).toUpperCase()}
                    </span>
                    <span className="text-white font-bold">{item.value}</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    Type: {item.type || 'int'} | Size: {item.size || 4} bytes
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-2 text-center">
              <div className="text-gray-400 text-sm">Array stored on stack</div>
              <div className="text-xs text-gray-500 mt-1">
                For small arrays, memory is allocated on the stack rather than heap
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Algorithm State */}
      <div className="glass-card p-3">
        <h4 className="text-md font-bold text-white mb-2 flex items-center gap-2">
          <Layers className="w-4 h-4 text-orange-400" />
          Algorithm State
        </h4>
        <div className="space-y-2">
          {/* Current Element States */}
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-2">
            <div className="text-orange-300 text-sm font-semibold mb-1">Element States</div>
            <div className="flex flex-wrap gap-1">
              {Object.entries(elementStates || {}).map(([index, state]) => (
                <div key={index} className="text-xs">
                  <span className="text-gray-300">[{index}]:</span>
                  <span className={`ml-1 px-2 py-1 rounded ${
                    state === 'comparing' ? 'bg-blue-500/20 text-blue-300' :
                    state === 'swapping' ? 'bg-yellow-500/20 text-yellow-300' :
                    state === 'sorted' ? 'bg-green-500/20 text-green-300' :
                    state === 'pivot' ? 'bg-purple-500/20 text-purple-300' :
                    state === 'merging' ? 'bg-cyan-500/20 text-cyan-300' :
                    state === 'current' ? 'bg-indigo-500/20 text-indigo-300' :
                    state === 'min' ? 'bg-pink-500/20 text-pink-300' :
                    state === 'max' ? 'bg-red-500/20 text-red-300' :
                    state === 'key' ? 'bg-emerald-500/20 text-emerald-300' :
                    'bg-gray-500/20 text-gray-300'
                  }`}>
                    {state}
                  </span>
                </div>
              ))}
              {Object.keys(elementStates || {}).length === 0 && (
                <div className="text-xs text-gray-400">No active element states</div>
              )}
            </div>
          </div>

          {/* Memory Efficiency */}
          <div className="bg-gray-500/10 border border-gray-500/30 rounded-lg p-2">
            <div className="text-gray-300 text-sm font-semibold mb-1">Memory Usage</div>
            <div className="text-xs text-gray-400">
              Stack: ~{stackFramesArray.length * 64} bytes
            </div>
            <div className="text-xs text-gray-400">
              Heap: {heapMemory && heapMemory.length > 0 ? `${heapMemory.length * 4} bytes` : '0 bytes'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryVisualization;
