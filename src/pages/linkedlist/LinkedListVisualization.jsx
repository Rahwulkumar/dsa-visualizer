import React, { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ArrowRight } from 'lucide-react';
import '../../styles/globals.css';
import './LinkedListStyles.css';

// eslint-disable-next-line no-unused-vars
const LinkedListVisualization = ({ displayList, currentNodeIndex, nodeStates, codeLanguage }) => {
  const getNodeStyle = useCallback((index) => {
    const state = nodeStates[index];
    const isCurrentNode = currentNodeIndex === index;
    // Dynamic sizing based on number of nodes (matching ArrayVisualization pattern)
    const baseSize = Math.min(80, Math.max(50, 350 / Math.max(1, displayList.length)));
    
    let baseClasses = 'flex items-center justify-center font-mono font-bold border-2 rounded-lg transition-all duration-300 relative overflow-hidden';
    let bgColor = 'bg-gray-700/90 border-gray-500';
    let textColor = 'text-white';
    let shadowEffect = 'shadow-md';
    let scaleEffect = '';

    // Apply state-specific styles (matching ArrayVisualization pattern)
    switch (state) {
      case 'checking':
        bgColor = 'bg-blue-600/80 border-blue-400';
        textColor = 'text-white';
        shadowEffect = 'shadow-lg shadow-blue-500/50';
        scaleEffect = 'scale-110';
        break;
      case 'found':
        bgColor = 'bg-green-600/80 border-green-400';
        textColor = 'text-white';
        shadowEffect = 'shadow-lg shadow-green-500/50';
        scaleEffect = 'scale-110';
        break;
      case 'checked':
        bgColor = 'bg-red-600/60 border-red-400/70';
        textColor = 'text-red-100';
        shadowEffect = 'shadow-md';
        break;
      case 'traversing':
        bgColor = 'bg-cyan-600/80 border-cyan-400';
        textColor = 'text-white';
        shadowEffect = 'shadow-lg shadow-cyan-500/50';
        scaleEffect = 'scale-110';
        break;
      case 'inserting':
        bgColor = 'bg-yellow-600/80 border-yellow-400';
        textColor = 'text-yellow-50';
        shadowEffect = 'shadow-lg shadow-yellow-500/50';
        scaleEffect = 'scale-105';
        break;
      case 'inserted':
        bgColor = 'bg-green-600/80 border-green-400';
        textColor = 'text-white';
        shadowEffect = 'shadow-lg shadow-green-500/50';
        scaleEffect = 'scale-110';
        break;
      case 'deleting':
        bgColor = 'bg-red-600/80 border-red-400';
        textColor = 'text-red-100';
        shadowEffect = 'shadow-lg shadow-red-500/50';
        scaleEffect = 'scale-90';
        break;
      default:
        if (isCurrentNode) {
          bgColor = 'bg-purple-600/80 border-purple-400';
          textColor = 'text-white';
          shadowEffect = 'shadow-lg shadow-purple-500/50';
          scaleEffect = 'scale-110';
        }
    }

    const finalClasses = `${baseClasses} ${bgColor} ${textColor} ${shadowEffect} ${scaleEffect}`;
    
    return { 
      className: finalClasses, 
      style: { 
        width: `${baseSize}px`, 
        height: `${baseSize}px`,
        fontSize: `${Math.max(12, baseSize * 0.25)}px`,
        textShadow: '0 1px 3px rgba(0, 0, 0, 0.7)'
      } 
    };
  }, [nodeStates, currentNodeIndex, displayList.length]);

  const getPointerStyle = useCallback((index) => {
    const state = nodeStates[index];
    let arrowColor = 'text-gray-400';
    let animate = false;
    
    switch (state) {
      case 'checking':
      case 'traversing':
        arrowColor = 'text-cyan-400';
        animate = true;
        break;
      case 'found':
        arrowColor = 'text-green-400';
        break;
      case 'inserting':
        arrowColor = 'text-yellow-400';
        break;
      default:
        if (currentNodeIndex === index) {
          arrowColor = 'text-purple-400';
        }
    }
    
    return { color: arrowColor, animate };
  }, [nodeStates, currentNodeIndex]);

  return (
    <div className="col-span-5 flex flex-col glass-card p-6 h-full bg-gradient-to-br from-gray-900/90 to-purple-900/90 backdrop-blur-xl border border-gray-700/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Activity className="w-6 h-6 text-cyan-400" />
          Linked List Visualization
        </h3>
        <span className="text-sm text-gray-300 bg-gray-800/50 px-3 py-1 rounded-full">
          {displayList.length} nodes
        </span>
      </div>
      
      {/* Head pointer indicator */}
      {displayList.length > 0 && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-cyan-400 font-mono text-sm font-semibold">head →</span>
          <span className="text-gray-300 font-mono text-xs bg-gray-800/70 px-2 py-1 rounded border border-gray-600/50">
            {displayList[0].address}
          </span>
        </div>
      )}
      
      <div className="flex-1 flex items-center justify-center p-4 min-h-[300px]">
        <div className="flex items-center justify-center gap-2 flex-wrap max-w-full">
          <AnimatePresence mode="popLayout">
            {displayList.map((node, index) => {
              const { className, style } = getNodeStyle(index);
              const pointerStyle = getPointerStyle(index);
              const isLast = index === displayList.length - 1;
              // Dynamic container width based on node size
              const containerWidth = Math.max(120, parseInt(style.width) + 40);
              
              return (
                <React.Fragment key={`node-${node.id}-${node.data}`}>
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{
                      opacity: nodeStates[index] === 'deleting' ? 0.3 : 1,
                      scale: currentNodeIndex === index ? 1.05 : 1,
                      y: 0
                    }}
                    exit={{ opacity: 0, scale: 0.8, y: -20 }}
                    transition={{ duration: 0.4, type: 'spring', stiffness: 300, damping: 25 }}
                    className="flex flex-col items-center gap-2"
                    style={{ minWidth: `${containerWidth}px` }}
                  >
                    {/* Node position label */}
                    <div 
                      className="text-gray-300 font-mono font-semibold px-2 py-1 bg-gray-800/70 rounded-md border border-gray-600/50"
                      style={{ fontSize: `${Math.max(10, parseInt(style.fontSize) * 0.7)}px` }}
                    >
                      Node {index}
                    </div>
                    
                    {/* Node structure container */}
                    <div 
                      className="bg-gray-800/60 rounded-lg border border-gray-600/50 p-2"
                      style={{ minWidth: `${containerWidth}px` }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        {/* Data section */}
                        <div className="flex flex-col items-center gap-1">
                          <span 
                            className="text-gray-400 font-mono"
                            style={{ fontSize: `${Math.max(8, parseInt(style.fontSize) * 0.5)}px` }}
                          >
                            data
                          </span>
                          <div className={className} style={style}>
                            <span className="relative z-10 font-bold drop-shadow-lg">{node.data}</span>
                            {currentNodeIndex === index && (
                              <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-500/20 rounded-lg"
                                animate={{ opacity: [0.3, 0.7, 0.3] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              />
                            )}
                          </div>
                        </div>
                        
                        {/* Next pointer section */}
                        <div className="flex flex-col items-center gap-1">
                          <span 
                            className="text-gray-400 font-mono"
                            style={{ fontSize: `${Math.max(8, parseInt(style.fontSize) * 0.5)}px` }}
                          >
                            next
                          </span>
                          <div 
                            className="bg-gray-700/80 border border-gray-500 rounded flex items-center justify-center"
                            style={{ 
                              width: `${Math.max(45, parseInt(style.width) * 0.6)}px`, 
                              height: `${Math.max(25, parseInt(style.height) * 0.35)}px` 
                            }}
                          >
                            <span 
                              className="text-gray-300 font-mono"
                              style={{ fontSize: `${Math.max(8, parseInt(style.fontSize) * 0.6)}px` }}
                            >
                              {node.next ? '•→' : 'NULL'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Memory address */}
                    <div 
                      className="text-gray-400 font-mono px-2 py-1 bg-gray-900/60 rounded border border-gray-700/50"
                      style={{ fontSize: `${Math.max(8, parseInt(style.fontSize) * 0.6)}px` }}
                    >
                      {node.address}
                    </div>
                  </motion.div>
                  
                  {/* Arrow pointing to next node */}
                  {!isLast && (
                    <motion.div
                      className={`flex items-center mx-1 ${pointerStyle.color}`}
                      animate={pointerStyle.animate ? {
                        scale: [1, 1.2, 1],
                        x: [0, 5, 0]
                      } : {}}
                      transition={{ duration: 0.8, repeat: pointerStyle.animate ? Infinity : 0 }}
                    >
                      <ArrowRight 
                        className="w-6 h-6"
                        style={{ 
                          width: `${Math.max(20, parseInt(style.width) * 0.3)}px`, 
                          height: `${Math.max(20, parseInt(style.height) * 0.3)}px` 
                        }} 
                      />
                    </motion.div>
                  )}
                  
                  {/* NULL indicator for last node */}
                  {isLast && (
                    <motion.div
                      className="flex items-center mx-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div 
                        className="bg-red-900/40 border-2 border-red-600/50 rounded-lg border-dashed flex items-center justify-center"
                        style={{ 
                          padding: `${Math.max(8, parseInt(style.width) * 0.1)}px ${Math.max(12, parseInt(style.width) * 0.15)}px`,
                          minWidth: `${Math.max(50, parseInt(style.width) * 0.8)}px`,
                          minHeight: `${Math.max(30, parseInt(style.height) * 0.4)}px`
                        }}
                      >
                        <span 
                          className="font-mono text-red-300 font-bold"
                          style={{ fontSize: `${Math.max(10, parseInt(style.fontSize) * 0.8)}px` }}
                        >
                          NULL
                        </span>
                      </div>
                    </motion.div>
                  )}
                </React.Fragment>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Status indicator */}
      {currentNodeIndex >= 0 && (
        <div className="mt-4 text-center text-sm text-gray-300 bg-gray-800/50 py-2 px-4 rounded-lg">
          Currently examining Node {currentNodeIndex}
          {nodeStates[currentNodeIndex] && (
            <span className="ml-2 text-cyan-400">
              ({nodeStates[currentNodeIndex]})
            </span>
          )}
        </div>
      )}
      
      {/* Empty list indicator */}
      {displayList.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <div className="text-lg mb-2">Empty List</div>
            <div className="text-sm">head → NULL</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LinkedListVisualization;