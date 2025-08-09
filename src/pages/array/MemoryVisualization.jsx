import React, { useCallback, useMemo } from 'react';
import { Layers, Database } from 'lucide-react';
import '../../styles/globals.css';

const MemoryVisualization = ({ stackMemory, heapMemory, currentMemoryIndex, elementStates, currentStackFrame, codeLanguage }) => {
  const getMemoryStyle = useCallback((index) => {
    const isCurrentMemory = currentMemoryIndex === index;
    const elementState = elementStates[index];
    if (isCurrentMemory || ['checking', 'found', 'shifting', 'inserted', 'accessed'].includes(elementState)) {
      return 'bg-cyan-500/30 border-cyan-500/60 shadow-lg shadow-cyan-500/20 scale-105';
    } else if (elementState === 'deleting') {
      return 'bg-red-500/20 border-red-500/40 opacity-50';
    }
    return 'bg-gray-800/50 border-gray-600/30 hover:border-gray-500/50';
  }, [currentMemoryIndex, elementStates]);

  // Convert single stackFrame to array format for consistency
  const stackFramesArray = useMemo(() => {
    if (Array.isArray(stackMemory)) {
      return stackMemory;
    } else if (stackMemory || currentStackFrame) {
      const frame = stackMemory || currentStackFrame;
      return [{
        name: `${codeLanguage === 'python' ? 'search()' : codeLanguage === 'java' ? 'linearSearch()' : 'linear_search()'}`,
        variables: frame || {}
      }];
    }
    return [];
  }, [stackMemory, currentStackFrame, codeLanguage]);

  return (
    <div className="col-span-3 flex flex-col gap-4">
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
                      {currentStackFrame && key === 'temp' && currentStackFrame.currentValue !== undefined && (
                        <span className="ml-2 text-cyan-400">= {currentStackFrame.currentValue}</span>
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
      <div className="glass-card p-3 flex-1">
        <h4 className="text-md font-bold text-white mb-2 flex items-center gap-2">
          <Database className="w-4 h-4 text-purple-400" />
          Heap Memory
        </h4>
        <div className="space-y-2">
          {Object.keys(heapMemory || {}).length > 0 ? (
            Object.entries(heapMemory || {}).map(([key, obj]) => (
              <div key={key} className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-2">
                <div className="text-purple-300 text-sm font-semibold mb-1">{obj?.type || 'Array'}</div>
                <div className="text-xs text-gray-400 mb-1">
                  {obj?.address ? `0x${obj.address.toString().replace('0x', '').toUpperCase()}` : '0x7F8B1C000000'}
                </div>
                <div className="grid grid-cols-4 gap-1 max-h-40 overflow-y-auto">
                  {(obj?.data || []).map((val, idx) => (
                    <div key={idx} className={`text-xs p-1 rounded text-center ${getMemoryStyle(idx)}`}>
                      {val}
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-2 text-center">
              <div className="text-gray-400 text-sm">No heap memory allocated</div>
            </div>
          )}
        </div>
        <div className="text-xs text-gray-400 mt-2">* Memory addresses are simplified</div>
      </div>
    </div>
  );
};

export default MemoryVisualization;