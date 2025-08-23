import React, { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity } from 'lucide-react';
import '../../styles/globals.css';
import './QueueStyles.css';

const QueueVisualization = ({ displayQueue, currentElementIndex, elementStates, codeLanguage, front, rear }) => {
  const getBaseAddress = useCallback(() => {
    return codeLanguage === 'c' ? 0x7fff5fbff000 : 0x7f8b1c000000;
  }, [codeLanguage]);

  const getElementStyle = useCallback((index) => {
    const state = elementStates[index];
    const isCurrentElement = currentElementIndex === index;
    const isFront = index === front;
    const isRear = index === rear;
    const baseSize = Math.min(80, Math.max(60, 400 / Math.max(1, displayQueue.length)));
    
    let baseClasses = 'flex items-center justify-center font-mono font-bold border-2 rounded-lg transition-all duration-300 relative overflow-hidden';
    let bgColor = 'bg-gray-700/90 border-gray-500';
    let textColor = 'text-white';
    let shadowEffect = 'shadow-md';
    let scaleEffect = '';

    // Queue position highlighting
    if (isFront && isRear && displayQueue.length === 1) {
      bgColor = 'bg-purple-600/80 border-purple-400';
      textColor = 'text-white';
      shadowEffect = 'shadow-lg shadow-purple-500/50';
    } else if (isFront) {
      bgColor = 'bg-green-600/80 border-green-400';
      textColor = 'text-white';
      shadowEffect = 'shadow-lg shadow-green-500/50';
    } else if (isRear) {
      bgColor = 'bg-blue-600/80 border-blue-400';
      textColor = 'text-white';
      shadowEffect = 'shadow-lg shadow-blue-500/50';
    }

    // Apply state-specific styles (override position styles)
    switch (state) {
      case 'enqueuing':
        bgColor = 'bg-green-600/80 border-green-400';
        textColor = 'text-white';
        shadowEffect = 'shadow-lg shadow-green-500/50';
        scaleEffect = 'scale-110';
        break;
      case 'dequeuing':
        bgColor = 'bg-red-600/80 border-red-400';
        textColor = 'text-white';
        shadowEffect = 'shadow-lg shadow-red-500/50';
        scaleEffect = 'scale-90';
        break;
      case 'peeking':
        bgColor = 'bg-cyan-600/80 border-cyan-400';
        textColor = 'text-white';
        shadowEffect = 'shadow-lg shadow-cyan-500/50';
        scaleEffect = 'scale-110';
        break;
      case 'displaying':
        bgColor = 'bg-purple-600/80 border-purple-400';
        textColor = 'text-white';
        shadowEffect = 'shadow-lg shadow-purple-500/50';
        scaleEffect = 'scale-105';
        break;
      default:
        if (isCurrentElement) {
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
        width: `${baseSize}px`, 
        height: `${baseSize}px`,
        fontSize: `${Math.max(16, baseSize * 0.3)}px`,
        textShadow: '0 1px 3px rgba(0, 0, 0, 0.7)'
      } 
    };
  }, [elementStates, currentElementIndex, displayQueue.length, front, rear]);

  return (
    <div className="col-span-5 flex flex-col glass-card p-6 h-full bg-gradient-to-br from-gray-900/90 to-purple-900/90 backdrop-blur-xl border border-gray-700/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Activity className="w-6 h-6 text-cyan-400" />
          Queue Visualization
        </h3>
        <span className="text-sm text-gray-300 bg-gray-800/50 px-3 py-1 rounded-full">
          {displayQueue.length} elements
        </span>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-4 min-h-[300px]">
        <div className="w-full max-w-4xl">
          {displayQueue.length === 0 ? (
            <div className="text-center p-8">
              <div className="text-gray-400 text-lg mb-2">Queue is Empty</div>
              <div className="text-gray-500 text-sm">Add elements using Enqueue operation</div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Queue Direction Indicator */}
              <div className="flex items-center justify-between text-sm text-gray-400 px-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Front (Dequeue)</span>
                </div>
                <div className="flex-1 border-t border-dashed border-gray-600 mx-4"></div>
                <div className="flex items-center gap-2">
                  <span>Rear (Enqueue)</span>
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                </div>
              </div>

              {/* Queue Elements */}
              <div className="flex justify-center items-center gap-3 px-4 overflow-x-auto">
                <AnimatePresence mode="popLayout">
                  {displayQueue.map((value, index) => {
                    const { className, style } = getElementStyle(index);
                    return (
                      <motion.div
                        key={`queue-${index}-${value}`}
                        layout
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{
                          opacity: elementStates[index] === 'dequeuing' ? 0.3 : 1,
                          scale: currentElementIndex === index ? 1.05 : 1,
                          y: 0
                        }}
                        exit={{ opacity: 0, scale: 0.8, y: -20 }}
                        transition={{ duration: 0.4, type: 'spring', stiffness: 300, damping: 25 }}
                        className="flex flex-col items-center gap-2 min-w-[80px]"
                      >
                        {/* Index label */}
                        <div className="text-gray-300 font-mono text-sm font-semibold px-3 py-1 bg-gray-800/70 rounded-md border border-gray-600/50">
                          [{index}]
                        </div>
                        
                        {/* Queue element */}
                        <div className={className} style={style}>
                          <span className="relative z-10 font-bold drop-shadow-lg">{value}</span>
                          {currentElementIndex === index && (
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-500/20 rounded-lg"
                              animate={{ opacity: [0.3, 0.7, 0.3] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            />
                          )}
                        </div>
                        
                        {/* Memory address */}
                        <div className="text-gray-400 font-mono text-xs px-2 py-1 bg-gray-900/60 rounded border border-gray-700/50">
                          0x{(getBaseAddress() + index * 4).toString(16).toUpperCase()}
                        </div>

                        {/* Queue position indicators */}
                        <div className="flex flex-col items-center gap-1">
                          {index === front && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-xs font-bold text-green-400 bg-green-900/30 px-2 py-1 rounded border border-green-500/30"
                            >
                              FRONT
                            </motion.div>
                          )}
                          {index === rear && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-xs font-bold text-blue-400 bg-blue-900/30 px-2 py-1 rounded border border-blue-500/30"
                            >
                              REAR
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Queue Status Info */}
              <div className="flex justify-center items-center gap-6 text-sm text-gray-400 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Front: Index {front >= 0 ? front : 'None'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Rear: Index {rear >= 0 ? rear : 'None'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span>Size: {displayQueue.length}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Status indicator */}
      {currentElementIndex >= 0 && (
        <div className="mt-4 text-center text-sm text-gray-300 bg-gray-800/50 py-2 px-4 rounded-lg">
          Currently examining index {currentElementIndex}
          {elementStates[currentElementIndex] && (
            <span className="ml-2 text-cyan-400">
              ({elementStates[currentElementIndex]})
            </span>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="border-t border-gray-700/50 pt-4 mt-4">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-600 rounded border"></div>
              <span className="text-gray-400">Front Element</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded border"></div>
              <span className="text-gray-400">Rear Element</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-600 rounded border"></div>
              <span className="text-gray-400">Single Element</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-cyan-600 rounded border"></div>
              <span className="text-gray-400">Peek Operation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-600 rounded border"></div>
              <span className="text-gray-400">Current Element</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-600 rounded border"></div>
              <span className="text-gray-400">Dequeue Operation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueueVisualization;
