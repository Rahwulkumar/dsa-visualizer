import React, { useCallback, useMemo } from 'react';
import { Layers, Database } from 'lucide-react';
import '../../styles/globals.css';

const MemoryVisualization = ({ stackMemory, heapMemory, currentMemoryIndex, elementStates, currentStackFrame, codeLanguage }) => {
  const getMemoryStyle = useCallback((index) => {
    const isCurrentMemory = currentMemoryIndex === index;
    const elementState = elementStates[index];
    if (isCurrentMemory || ['pushing', 'popping', 'peeking', 'displaying'].includes(elementState)) {
      switch (elementState) {
        case 'pushing':
          return 'bg-green-500/30 border-green-500/60 shadow-lg shadow-green-500/20 scale-105';
        case 'popping':
          return 'bg-red-500/30 border-red-500/60 shadow-lg shadow-red-500/20 scale-105';
        case 'peeking':
          return 'bg-cyan-500/30 border-cyan-500/60 shadow-lg shadow-cyan-500/20 scale-105';
        case 'displaying':
          return 'bg-purple-500/30 border-purple-500/60 shadow-lg shadow-purple-500/20 scale-105';
        default:
          return 'bg-yellow-500/30 border-yellow-500/60 shadow-lg shadow-yellow-500/20 scale-105';
      }
    }
    return 'bg-gray-800/50 border-gray-600/30 hover:border-gray-500/50';
  }, [currentMemoryIndex, elementStates]);

  // Normalize to array of frames for rendering consistency
  const stackFramesArray = useMemo(() => {
    if (Array.isArray(stackMemory)) {
      return stackMemory;
    } else if (stackMemory || currentStackFrame) {
      const frame = stackMemory || currentStackFrame;
      return [{
        name: `${codeLanguage === 'python' ? 'stack_operation()' : codeLanguage === 'java' ? 'stackOperation()' : 'stack_operation()'}`,
        variables: frame || {}
      }];
    }
    return [];
  }, [stackMemory, currentStackFrame, codeLanguage]);

  return (
  <div id="stack-memory-visualization" className="col-span-3 flex flex-col gap-4 h-full">
  <div id="stack-memory-card" className="glass-card p-3 flex-1 overflow-auto scrollbar-thin">
        <h4 id="stack-memory-header" className="text-md font-bold text-white mb-2 flex items-center gap-2">
          <Layers className="w-4 h-4 text-green-400" />
          Stack Memory
        </h4>
        <div id="stack-frames-container" className="space-y-2">
          {stackFramesArray.length > 0 ? (
            stackFramesArray.map((frame, index) => (
              <div id={`stack-frame-${index}`} key={index} className="bg-green-500/10 border border-green-500/30 rounded-lg p-2">
                <div id={`stack-frame-${index}-name`} className="text-green-300 text-sm font-semibold">{frame.name}</div>
                <div id={`stack-frame-${index}-vars`} className="text-xs text-gray-400">
                  {Object.entries(frame.variables || {}).map(([key, value]) => (
                    <div id={`stack-frame-${index}-var-${key}`} key={key} className="flex justify-between items-center">
                      <span className="text-green-200">{key}:</span>
                      <span className="text-cyan-300">
                        {typeof value === 'object' && value !== null ?
                          JSON.stringify(value) :
                          String(value)
                        }
                      </span>
                    </div>
                  ))}

                  {currentStackFrame && currentStackFrame.operation && (
                    <div id="stack-current-operation" className="border-t border-green-500/20 pt-1 mt-1">
                      <div className="flex justify-between items-center">
                        <span className="text-green-200">operation:</span>
                        <span className="text-yellow-300">{currentStackFrame.operation}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div id="stack-no-frames" className="bg-green-500/10 border border-green-500/30 rounded-lg p-2 text-center">
              <div className="text-gray-400 text-sm">No active stack frames</div>
            </div>
          )}
        </div>
      </div>

  <div id="stack-heap-memory-card" className="glass-card p-3 flex-1 overflow-auto scrollbar-thin">
        <h4 id="stack-heap-header" className="text-md font-bold text-white mb-2 flex items-center gap-2">
          <Database className="w-4 h-4 text-purple-400" />
          Heap Memory
        </h4>
        <div id="stack-heap-objects" className="space-y-2">
          {Object.keys(heapMemory || {}).length > 0 ? (
            Object.entries(heapMemory || {}).map(([key, obj]) => (
              <div id={`stack-heap-${key}`} key={key} className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-2">
                <div id={`stack-heap-${key}-title`} className="text-purple-300 text-sm font-semibold mb-1">
                  {obj?.type || 'Stack'} {key === 'stackObject' ? 'Object' : ''}
                </div>
                <div id={`stack-heap-${key}-addr`} className="text-xs text-gray-400 mb-1">
                  {obj?.address ? `${obj.address}` : '0x7F8B1C000000'}
                </div>

                {/* Stack-specific information */}
                {obj?.top !== undefined && (
                  <div id={`stack-heap-${key}-meta`} className="text-xs text-gray-400 mb-2 space-y-1">
                    <div className="flex justify-between">
                      <span>Top:</span>
                      <span className="text-green-400">{obj.top}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Size:</span>
                      <span className="text-cyan-400">{obj.size || 0}</span>
                    </div>
                  </div>
                )}

                {/* Stack elements display */}
                {obj?.data && obj.data.length > 0 && (
                  <div id={`stack-heap-${key}-data`} className="grid grid-cols-4 gap-1">
                    {obj.data.map((val, idx) => (
                      <div id={`stack-heap-${key}-cell-${idx}`} key={idx} className={`text-xs p-1 rounded text-center ${getMemoryStyle(idx)}`}>
                        {val}
                      </div>
                    ))}
                  </div>
                )}

                {/* Individual elements array */}
                {key === 'elements' && Array.isArray(obj) && (
                  <div id="stack-elements-list" className="space-y-1">
                    {obj.map((element, idx) => (
                      <div id={`stack-element-${idx}`} key={idx} className="bg-gray-800/30 rounded p-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-400">[{idx}]:</span>
                          <span className="text-white">{element.value}</span>
                        </div>
                        <div className="text-gray-500 font-mono">{element.address}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div id="stack-no-heap" className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-2 text-center">
              <div className="text-gray-400 text-sm">No heap memory allocated</div>
            </div>
          )}
        </div>
        <div id="stack-memory-note" className="text-xs text-gray-400 mt-2">* Memory addresses are simplified</div>
      </div>
    </div>
  );
};

export default MemoryVisualization;
