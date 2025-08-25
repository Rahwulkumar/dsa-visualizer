import React, { useCallback, useMemo } from 'react';
import { Layers, Database } from 'lucide-react';
import '../../styles/globals.css';

const MemoryVisualization = ({ stackMemory, heapMemory, currentMemoryIndex, elementStates, currentStackFrame, codeLanguage }) => {
  const getMemoryStyle = useCallback((index) => {
    const isCurrentMemory = currentMemoryIndex === index;
    const elementState = elementStates[index];
    if (isCurrentMemory || ['adding', 'traversing', 'searching', 'connecting', 'displaying'].includes(elementState)) {
      switch (elementState) {
        case 'adding':
          return 'bg-green-500/30 border-green-500/60 shadow-lg shadow-green-500/20 scale-105';
        case 'traversing':
          return 'bg-blue-500/30 border-blue-500/60 shadow-lg shadow-blue-500/20 scale-105';
        case 'searching':
          return 'bg-cyan-500/30 border-cyan-500/60 shadow-lg shadow-cyan-500/20 scale-105';
        case 'connecting':
          return 'bg-yellow-500/30 border-yellow-500/60 shadow-lg shadow-yellow-500/20 scale-105';
        case 'displaying':
          return 'bg-purple-500/30 border-purple-500/60 shadow-lg shadow-purple-500/20 scale-105';
        default:
          return 'bg-orange-500/30 border-orange-500/60 shadow-lg shadow-orange-500/20 scale-105';
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
        name: `${codeLanguage === 'python' ? 'graph_operation()' : codeLanguage === 'java' ? 'graphOperation()' : 'graph_operation()'}`,
        variables: frame || {}
      }];
    }
    return [];
  }, [stackMemory, currentStackFrame, codeLanguage]);

  return (
    <div id="graph-memory-visualization" className="col-span-3 flex flex-col gap-4 h-full">
      <div id="graph-memory-card" className="glass-card p-3 flex-1 overflow-auto scrollbar-thin">
        <h4 id="graph-memory-header" className="text-md font-bold text-white mb-2 flex items-center gap-2">
          <Layers className="w-4 h-4 text-green-400" />
          Stack Memory
        </h4>
        <div id="graph-frames-container" className="space-y-2">
          {stackFramesArray.length > 0 ? (
            stackFramesArray.map((frame, index) => (
              <div id={`graph-frame-${index}`} key={index} className="bg-green-500/10 border border-green-500/30 rounded-lg p-2">
                <div id={`graph-frame-${index}-name`} className="text-green-300 text-sm font-semibold">{frame.name}</div>
                <div id={`graph-frame-${index}-vars`} className="text-xs text-gray-400">
                  {Object.entries(frame.variables || {}).map(([key, value]) => (
                    <div id={`graph-frame-${index}-var-${key}`} key={key} className="flex justify-between items-center">
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
                    <div id="graph-current-operation" className="border-t border-green-500/20 pt-1 mt-1">
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
            <div id="graph-no-frames" className="bg-green-500/10 border border-green-500/30 rounded-lg p-2 text-center">
              <div className="text-gray-400 text-sm">No active stack frames</div>
            </div>
          )}
        </div>
      </div>

      <div id="graph-heap-memory-card" className="glass-card p-3 flex-1 overflow-auto scrollbar-thin">
        <h4 id="graph-heap-header" className="text-md font-bold text-white mb-2 flex items-center gap-2">
          <Database className="w-4 h-4 text-purple-400" />
          Heap Memory
        </h4>
        <div id="graph-heap-objects" className="space-y-2">
          {Object.keys(heapMemory || {}).length > 0 ? (
            Object.entries(heapMemory || {}).map(([key, obj]) => (
              <div id={`graph-heap-${key}`} key={key} className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-2">
                <div id={`graph-heap-${key}-title`} className="text-purple-300 text-sm font-semibold mb-1">
                  {obj?.type || 'Graph'} {key === 'graphObject' ? 'Object' : ''}
                </div>
                <div id={`graph-heap-${key}-addr`} className="text-xs text-gray-400 mb-1">
                  {obj?.address ? `${obj.address}` : '0x7F8B1C000000'}
                </div>

                {/* Graph-specific information */}
                {obj?.vertices !== undefined && (
                  <div id={`graph-heap-${key}-meta`} className="text-xs text-gray-400 mb-2 space-y-1">
                    <div className="flex justify-between">
                      <span>Vertices:</span>
                      <span className="text-green-400">{obj.vertices || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Edges:</span>
                      <span className="text-cyan-400">{obj.edges || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span className="text-purple-400">{obj.graphType || 'Undirected'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Weighted:</span>
                      <span className="text-orange-400">{obj.weighted ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                )}

                {/* Adjacency list display */}
                {obj?.adjacencyList && Object.keys(obj.adjacencyList).length > 0 && (
                  <div id={`graph-heap-${key}-adjacency`} className="space-y-1">
                    <div className="text-purple-300 text-xs font-semibold">Adjacency List:</div>
                    {Object.entries(obj.adjacencyList).map(([vertex, neighbors], idx) => (
                      <div id={`graph-heap-${key}-vertex-${idx}`} key={vertex} className={`text-xs p-1 rounded ${getMemoryStyle(idx)}`}>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">{vertex}:</span>
                          <span className="text-white">
                            {Array.isArray(neighbors) 
                              ? neighbors.map(n => typeof n === 'object' ? `${n.vertex}(${n.weight})` : n).join(', ')
                              : neighbors.toString()
                            }
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Vertices array display */}
                {obj?.verticesList && obj.verticesList.length > 0 && (
                  <div id={`graph-heap-${key}-vertices`} className="space-y-1">
                    <div className="text-purple-300 text-xs font-semibold">Vertices:</div>
                    <div className="grid grid-cols-4 gap-1">
                      {obj.verticesList.map((vertex, idx) => (
                        <div id={`graph-heap-${key}-vertex-${idx}`} key={idx} className={`text-xs p-1 rounded text-center ${getMemoryStyle(idx)}`}>
                          {vertex}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Edges array display */}
                {obj?.edgesList && obj.edgesList.length > 0 && (
                  <div id={`graph-heap-${key}-edges`} className="space-y-1">
                    <div className="text-purple-300 text-xs font-semibold">Edges:</div>
                    {obj.edgesList.map((edge, idx) => (
                      <div id={`graph-heap-${key}-edge-${idx}`} key={idx} className="bg-gray-800/30 rounded p-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-400">{edge.from} → {edge.to}:</span>
                          <span className="text-white">{edge.weight || 1}</span>
                        </div>
                        <div className="text-gray-500 font-mono">{edge.address || `0x${(parseInt('7F8B1C000000', 16) + idx * 16).toString(16).toUpperCase()}`}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Individual elements array */}
                {key === 'elements' && Array.isArray(obj) && (
                  <div id="graph-elements-list" className="space-y-1">
                    {obj.map((element, idx) => (
                      <div id={`graph-element-${idx}`} key={idx} className="bg-gray-800/30 rounded p-1 text-xs">
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
            <div id="graph-no-heap" className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-2 text-center">
              <div className="text-gray-400 text-sm">No heap memory allocated</div>
            </div>
          )}
        </div>
        <div id="graph-memory-note" className="text-xs text-gray-400 mt-2">* Memory addresses are simplified</div>
      </div>
    </div>
  );
};

export default MemoryVisualization;
