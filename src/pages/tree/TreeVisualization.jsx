import React, { useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, GitBranch } from 'lucide-react';
import '../../styles/globals.css';

const TreeVisualization = ({ tree = [], currentElementIndex, elementStates = {}, codeLanguage, maxSize, root = null }) => {
  const getBaseAddress = useCallback(() => {
    return codeLanguage === 'c' ? 0x7fff5fbff000 : 0x7f8b1c000000;
  }, [codeLanguage]);

  const getNodeStyle = useCallback((node, index) => {
    const state = elementStates[index];
    const isCurrentNode = currentElementIndex === index;
    const isRoot = node?.isRoot || index === 0;
    const nodeSize = 50; // fixed node size

    let baseClasses = 'flex items-center justify-center font-mono font-bold border-2 rounded-full transition-all duration-300 relative overflow-hidden';
    let bgColor = 'bg-gray-700/90 border-gray-500';
    let textColor = 'text-white';
    let shadowEffect = 'shadow-md';
    let scaleEffect = '';

    if (isRoot) {
      bgColor = 'bg-purple-600/80 border-purple-400';
      textColor = 'text-white';
      shadowEffect = 'shadow-lg shadow-purple-500/50';
    }

    switch (state) {
      case 'inserting':
        bgColor = 'bg-green-600/80 border-green-400';
        textColor = 'text-white';
        shadowEffect = 'shadow-lg shadow-green-500/50';
        scaleEffect = 'scale-110';
        break;
      case 'searching':
        bgColor = 'bg-blue-600/80 border-blue-400';
        textColor = 'text-white';
        shadowEffect = 'shadow-lg shadow-blue-500/50';
        scaleEffect = 'scale-110';
        break;
      case 'deleting':
        bgColor = 'bg-red-600/80 border-red-400';
        textColor = 'text-white';
        shadowEffect = 'shadow-lg shadow-red-500/50';
        scaleEffect = 'scale-90';
        break;
      case 'traversing':
        bgColor = 'bg-cyan-600/80 border-cyan-400';
        textColor = 'text-white';
        shadowEffect = 'shadow-lg shadow-cyan-500/50';
        scaleEffect = 'scale-110';
        break;
      default:
        if (isCurrentNode) {
          bgColor = 'bg-yellow-600/80 border-yellow-400';
          textColor = 'text-yellow-50';
          shadowEffect = 'shadow-lg shadow-yellow-500/50';
          scaleEffect = 'scale-110';
        }
    }

    const finalClasses = `${baseClasses} ${bgColor} ${textColor} ${shadowEffect} ${scaleEffect}`;

    return {
      className: finalClasses,
      style: {
        width: `${nodeSize}px`,
        height: `${nodeSize}px`,
        fontSize: `${Math.max(14, nodeSize * 0.3)}px`,
        textShadow: '0 1px 3px rgba(0, 0, 0, 0.7)'
      }
    };
  }, [elementStates, currentElementIndex]);

  // Create a simple binary tree layout
  const treeLayout = useMemo(() => {
    if (tree.length === 0) return [];
    
    const nodes = tree.map((node, index) => ({
      ...node,
      id: index,
      x: 0,
      y: 0,
      level: 0
    }));

    // Simple BST positioning - arrange nodes in levels
    const positioned = [];
    const levelWidth = 120;
    const levelHeight = 80;
    
    // Calculate positions for a binary search tree visualization
    nodes.forEach((node, index) => {
      const level = Math.floor(Math.log2(index + 1));
      const positionInLevel = index - (Math.pow(2, level) - 1);
      const maxNodesInLevel = Math.pow(2, level);
      const spacing = (maxNodesInLevel === 1) ? 0 : levelWidth * 4 / maxNodesInLevel;
      
      positioned.push({
        ...node,
        x: positionInLevel * spacing - (spacing * (maxNodesInLevel - 1) / 2),
        y: level * levelHeight,
        level
      });
    });

    return positioned;
  }, [tree]);

  const renderConnections = () => {
    if (tree.length <= 1) return null;

    return treeLayout.map((node, index) => {
      const connections = [];
      
      // Left child connection
      if (node.left !== null && node.left < treeLayout.length) {
        const leftChild = treeLayout[node.left];
        if (leftChild) {
          connections.push(
            <motion.line
              key={`left-${index}`}
              x1={node.x}
              y1={node.y + 25}
              x2={leftChild.x}
              y2={leftChild.y - 25}
              stroke="#64748b"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            />
          );
        }
      }

      // Right child connection
      if (node.right !== null && node.right < treeLayout.length) {
        const rightChild = treeLayout[node.right];
        if (rightChild) {
          connections.push(
            <motion.line
              key={`right-${index}`}
              x1={node.x}
              y1={node.y + 25}
              x2={rightChild.x}
              y2={rightChild.y - 25}
              stroke="#64748b"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            />
          );
        }
      }

      return connections;
    }).flat();
  };

  return (
    <div id="tree-visualization" className="col-span-6 flex flex-col glass-card p-6 h-full bg-gradient-to-br from-gray-900/90 to-purple-900/90 backdrop-blur-xl border border-gray-700/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Activity className="w-6 h-6 text-cyan-400" />
          Tree Visualization
        </h3>
        <span id="tree-count" className="text-sm text-gray-300 bg-gray-800/50 px-3 py-1 rounded-full">
          {tree.length} / {maxSize}
        </span>
      </div>

      <div id="tree-container" className="flex-1 flex items-center justify-center p-4 min-h-[400px] h-full overflow-auto">
        {tree.length === 0 ? (
          <div id="tree-empty" className="text-center p-8">
            <GitBranch className="w-16 h-16 text-gray-400 mx-auto mb-4 opacity-50" />
            <div className="text-gray-400 text-lg mb-2">Tree is Empty</div>
            <div className="text-gray-500 text-sm">Use Insert to add nodes</div>
          </div>
        ) : (
          <div id="tree-svg-container" className="relative w-full h-full min-h-[400px]">
            <svg
              id="tree-svg"
              className="w-full h-full"
              viewBox="-300 -50 600 400"
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Render connections first */}
              <g id="tree-connections">
                {renderConnections()}
              </g>

              {/* Render nodes */}
              <g id="tree-nodes">
                <AnimatePresence mode="popLayout">
                  {treeLayout.map((node, index) => {
                    const { className, style } = getNodeStyle(node, index);
                    return (
                      <g key={`tree-node-${index}-${node.value}`} id={`tree-node-group-${index}`}>
                        {/* Node circle */}
                        <motion.circle
                          id={`tree-node-${index}`}
                          cx={node.x}
                          cy={node.y}
                          r="25"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ 
                            opacity: elementStates[index] === 'deleting' ? 0.3 : 1, 
                            scale: currentElementIndex === index ? 1.2 : 1 
                          }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          transition={{ duration: 0.4, type: 'spring', stiffness: 300, damping: 25 }}
                          className={`fill-gray-700 stroke-gray-500 stroke-2 ${
                            elementStates[index] === 'inserting' ? 'fill-green-600 stroke-green-400' :
                            elementStates[index] === 'searching' ? 'fill-blue-600 stroke-blue-400' :
                            elementStates[index] === 'deleting' ? 'fill-red-600 stroke-red-400' :
                            elementStates[index] === 'traversing' ? 'fill-cyan-600 stroke-cyan-400' :
                            currentElementIndex === index ? 'fill-yellow-600 stroke-yellow-400' :
                            node.isRoot ? 'fill-purple-600 stroke-purple-400' : ''
                          }`}
                        />

                        {/* Node value text */}
                        <motion.text
                          id={`tree-text-${index}`}
                          x={node.x}
                          y={node.y + 5}
                          textAnchor="middle"
                          className="fill-white font-mono font-bold text-sm pointer-events-none"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                        >
                          {node.value}
                        </motion.text>

                        {/* Current node indicator */}
                        {currentElementIndex === index && (
                          <motion.circle
                            cx={node.x}
                            cy={node.y}
                            r="30"
                            fill="none"
                            stroke="rgba(34, 211, 238, 0.6)"
                            strokeWidth="2"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: [0.3, 0.7, 0.3], scale: 1 }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                        )}

                        {/* Root indicator */}
                        {node.isRoot && (
                          <motion.text
                            x={node.x}
                            y={node.y - 40}
                            textAnchor="middle"
                            className="fill-purple-400 font-mono font-bold text-xs"
                            initial={{ opacity: 0, y: node.y - 35 }}
                            animate={{ opacity: 1, y: node.y - 40 }}
                          >
                            ROOT
                          </motion.text>
                        )}

                        {/* Address label */}
                        <motion.text
                          id={`tree-address-${index}`}
                          x={node.x}
                          y={node.y + 45}
                          textAnchor="middle"
                          className="fill-gray-400 font-mono text-xs"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.2 }}
                        >
                          0x{(getBaseAddress() + index * 24).toString(16).toUpperCase()}
                        </motion.text>
                      </g>
                    );
                  })}
                </AnimatePresence>
              </g>
            </svg>
          </div>
        )}
      </div>

      {currentElementIndex >= 0 && (
        <div id="tree-status" className="mt-4 text-center text-sm text-gray-300 bg-gray-800/50 py-2 px-4 rounded-lg">
          Currently examining node {currentElementIndex}
          {elementStates[currentElementIndex] && (
            <span id="tree-status-state" className="ml-2 text-cyan-400">({elementStates[currentElementIndex]})</span>
          )}
        </div>
      )}

      <div id="tree-legend" className="border-t border-gray-700/50 pt-4 mt-4">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-600 rounded-full border"></div>
              <span className="text-gray-400">Root Node</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-600 rounded-full border"></div>
              <span className="text-gray-400">Inserting</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full border"></div>
              <span className="text-gray-400">Searching</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-600 rounded-full border"></div>
              <span className="text-gray-400">Deleting</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-cyan-600 rounded-full border"></div>
              <span className="text-gray-400">Traversing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-600 rounded-full border"></div>
              <span className="text-gray-400">Current Node</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreeVisualization;
