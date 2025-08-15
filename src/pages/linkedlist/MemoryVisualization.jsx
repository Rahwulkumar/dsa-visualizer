import React, { useCallback, useMemo } from 'react';
import { Layers, Database } from 'lucide-react';
import '../../styles/globals.css';

const MemoryVisualization = ({ 
  stackMemory, 
  heapMemory, 
  currentMemoryIndex, 
  nodeStates, 
  currentStackFrame, 
  codeLanguage,
  displayList 
}) => {
  const getNodeStyle = useCallback((nodeId, index) => {
    const isCurrentNode = currentMemoryIndex === index;
    const nodeState = nodeStates[index];
    
    if (isCurrentNode || ['checking', 'traversing', 'found', 'inserting', 'inserted', 'deleting'].includes(nodeState)) {
      switch (nodeState) {
        case 'checking':
        case 'traversing':
          return 'bg-blue-500/30 border-blue-500/60 shadow-lg shadow-blue-500/20 scale-105';
        case 'found':
        case 'inserted':
          return 'bg-green-500/30 border-green-500/60 shadow-lg shadow-green-500/20 scale-105';
        case 'inserting':
          return 'bg-yellow-500/30 border-yellow-500/60 shadow-lg shadow-yellow-500/20 scale-105';
        case 'deleting':
          return 'bg-red-500/30 border-red-500/60 shadow-lg shadow-red-500/20 scale-105 opacity-70';
        default:
          return 'bg-cyan-500/30 border-cyan-500/60 shadow-lg shadow-cyan-500/20 scale-105';
      }
    } else if (nodeState === 'checked') {
      return 'bg-gray-600/20 border-gray-500/40 opacity-70';
    }
    return 'bg-gray-800/50 border-gray-600/30 hover:border-gray-500/50';
  }, [currentMemoryIndex, nodeStates]);

  // Convert single stackFrame to array format for consistency
  const stackFramesArray = useMemo(() => {
    if (Array.isArray(stackMemory)) {
      return stackMemory;
    } else if (stackMemory || currentStackFrame) {
      const frame = stackMemory || currentStackFrame;
      return [{
        name: `${
          codeLanguage === 'python' ? 'list_operation()' : 
          codeLanguage === 'java' ? 'listOperation()' : 
          'list_operation()'
        }`,
        variables: frame || {}
      }];
    }
    return [];
  }, [stackMemory, currentStackFrame, codeLanguage]);

  // Use heap memory from animations or generate fallback layout
  const memoryLayout = useMemo(() => {
    console.log('MemoryVisualization - heapMemory:', heapMemory);
    console.log('MemoryVisualization - displayList:', displayList);
    
    // If heapMemory is provided from animations, use it
    if (heapMemory && heapMemory.nodes && Object.keys(heapMemory.nodes).length > 0) {
      return heapMemory.nodes;
    }
    
    // Fallback: generate scattered memory addresses for nodes
    if (!displayList || displayList.length === 0) return {};
    
    const fallbackLayout = {};
    displayList.forEach((node, index) => {
      const baseAddress = 0x7F8B1C000000 + (Math.random() * 0xFFFF);
      fallbackLayout[`node_${node.id}`] = {
        type: 'ListNode',
        address: Math.floor(baseAddress),
        data: node.data,
        next: index < displayList.length - 1 ? 
          Math.floor(0x7F8B1C000000 + (Math.random() * 0xFFFF)) : 
          null,
        index: index
      };
    });
    
    return fallbackLayout;
  }, [heapMemory, displayList]);

  // Format heap memory for standard memory visualization
  const formattedHeapMemory = useMemo(() => {
    console.log('formattedHeapMemory - displayList:', displayList);
    console.log('formattedHeapMemory - heapMemory:', heapMemory);
    
    if (!displayList || displayList.length === 0) return {};

    // Create a traditional heap memory object similar to array visualization
    const heapData = {
      linkedList: {
        type: 'LinkedList', 
        address: displayList.length > 0 ? displayList[0].address || '0x7F8B1C000000' : null,
        data: displayList.map(node => node.data),
        nodes: displayList.map((node, index) => ({
          address: node.address || `0x${(0x7F8B1C000000 + index * 0x1000).toString(16).toUpperCase()}`,
          data: node.data,
          next: index < displayList.length - 1 ? 
            (displayList[index + 1].address || `0x${(0x7F8B1C000000 + (index + 1) * 0x1000).toString(16).toUpperCase()}`) : 
            'NULL',
          index: index
        }))
      }
    };

    console.log('formattedHeapMemory result:', heapData);
    return heapData;
  }, [displayList, heapMemory]);

  return (
    <div className="col-span-3 flex flex-col gap-4">
      {/* Stack Memory Section */}
      <div className="glass-card p-3 flex-1">
        <h4 className="text-md font-bold text-white mb-2 flex items-center gap-2">
          <Layers className="w-4 h-4 text-green-400" />
          Stack Memory
        </h4>
        <div className="space-y-2">
          {stackFramesArray.length > 0 ? (
            stackFramesArray.map((frame, index) => (
              <div key={index} className="bg-green-500/10 border border-green-500/30 rounded-lg p-2">
                <div className="text-green-300 text-sm font-semibold mb-1">{frame.name}</div>
                <div className="text-xs text-gray-400 space-y-1">
                  {Object.entries(frame.variables || {}).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-green-200">{key}:</span>
                      <span className="text-cyan-300">
                        {typeof value === 'object' && value !== null ? 
                          (value.data !== undefined ? `Node(${value.data})` : JSON.stringify(value)) : 
                          String(value)
                        }
                      </span>
                    </div>
                  ))}
                  {currentStackFrame && currentStackFrame.position !== undefined && (
                    <div className="flex justify-between border-t border-green-500/20 pt-1 mt-2">
                      <span className="text-green-200">position:</span>
                      <span className="text-yellow-300">{currentStackFrame.position}</span>
                    </div>
                  )}
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

      {/* Heap Memory Section - Standard Format + LinkedList Nodes */}
      <div className="glass-card p-3 flex-1">
        <h4 className="text-md font-bold text-white mb-2 flex items-center gap-2">
          <Database className="w-4 h-4 text-purple-400" />
          Heap Memory
        </h4>
        <div className="space-y-3">
          
          {/* Standard Heap Memory Format */}
          {formattedHeapMemory.linkedList && (
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
              <div className="text-purple-300 text-sm font-semibold mb-2">LinkedList Object</div>
              <div className="text-xs text-gray-400 mb-2">
                0x{formattedHeapMemory.linkedList.address?.replace('0x', '') || '7F8B1C000000'}
              </div>
              <div className="grid grid-cols-6 gap-1 mb-3">
                {formattedHeapMemory.linkedList.data.map((val, idx) => (
                  <div key={idx} className={`text-xs p-2 rounded text-center border ${
                    nodeStates[idx] === 'checking' || currentMemoryIndex === idx ? 
                      'bg-cyan-500/30 border-cyan-500/60' : 
                    nodeStates[idx] === 'found' ? 
                      'bg-green-500/30 border-green-500/60' : 
                    nodeStates[idx] === 'inserting' ? 
                      'bg-yellow-500/30 border-yellow-500/60' :
                    nodeStates[idx] === 'deleting' ? 
                      'bg-red-500/30 border-red-500/60' :
                      'bg-gray-800/50 border-gray-600/30'
                  }`}>
                    {val}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Individual Node Details */}
          {displayList && displayList.length > 0 ? (
            <div className="space-y-2">
              <div className="text-purple-200 text-xs font-medium border-b border-purple-500/20 pb-1">
                Individual Nodes (Scattered in Heap):
              </div>
              {displayList.map((node, index) => {
                const memoryInfo = memoryLayout[`node_${node.id}`] || formattedHeapMemory.linkedList?.nodes[index];
                return (
                  <div 
                    key={node.id} 
                    className={`border rounded-lg p-2 transition-all duration-300 ${getNodeStyle(node.id, index)}`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-purple-300 text-xs font-semibold">
                        Node #{index}
                      </div>
                      <div className="text-xs text-purple-200 font-mono">
                        {memoryInfo?.address || `0x${(0x7F8B1C000000 + index * 0x1000).toString(16).toUpperCase()}`}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {/* Data field */}
                      <div className="bg-blue-900/30 border border-blue-500/30 rounded p-1">
                        <div className="text-blue-300 font-medium text-[10px]">data:</div>
                        <div className="text-white font-bold">{node.data}</div>
                      </div>
                      
                      {/* Next pointer field */}
                      <div className="bg-cyan-900/30 border border-cyan-500/30 rounded p-1">
                        <div className="text-cyan-300 font-medium text-[10px]">next:</div>
                        <div className="text-white font-mono text-[10px]">
                          {index < displayList.length - 1 ? (
                            <>{memoryInfo?.next || `0x${(0x7F8B1C000000 + (index + 1) * 0x1000).toString(16).toUpperCase()}`}</>
                          ) : (
                            <span className="text-red-400">NULL</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 text-center">
              <div className="text-gray-400 text-sm">No nodes allocated in heap</div>
              <div className="text-xs text-gray-500 mt-1">
                Linked list is empty
              </div>
            </div>
          )}
        </div>
        
        {/* Memory layout explanation */}
        <div className="mt-3 pt-2 border-t border-purple-500/20">
          <div className="text-xs text-gray-400 space-y-1">
            <div>• Nodes are <span className="text-purple-300">scattered</span> throughout heap memory</div>
            <div>• Each node contains <span className="text-blue-300">data</span> and <span className="text-cyan-300">next pointer</span></div>
            <div>• Unlike arrays, nodes are <span className="text-yellow-300">not contiguous</span></div>
            <div>• Memory addresses are simplified for visualization</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryVisualization;
