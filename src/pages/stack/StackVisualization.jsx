import React, { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity } from 'lucide-react';
import '../../styles/globals.css';
import './StackStyles.css';

const StackVisualization = ({ stack = [], currentElementIndex, elementStates = {}, codeLanguage, maxSize }) => {
  const getBaseAddress = useCallback(() => {
    return codeLanguage === 'c' ? 0x7fff5fbff000 : 0x7f8b1c000000;
  }, [codeLanguage]);

  const getElementStyle = useCallback((index) => {
    const state = elementStates[index];
    const isCurrentElement = currentElementIndex === index;
    const isTop = index === stack.length - 1;
    const baseSize = 80; // fixed cell size for vertical stack

    let baseClasses = 'flex items-center justify-center font-mono font-bold border-2 rounded-lg transition-all duration-300 relative overflow-hidden';
    let bgColor = 'bg-gray-700/90 border-gray-500';
    let textColor = 'text-white';
    let shadowEffect = 'shadow-md';
    let scaleEffect = '';

    if (isTop && stack.length === 1) {
      bgColor = 'bg-purple-600/80 border-purple-400';
      textColor = 'text-white';
      shadowEffect = 'shadow-lg shadow-purple-500/50';
    } else if (isTop) {
      bgColor = 'bg-purple-600/80 border-purple-400';
      textColor = 'text-white';
      shadowEffect = 'shadow-lg shadow-purple-500/50';
    }

    switch (state) {
      case 'pushing':
        bgColor = 'bg-green-600/80 border-green-400';
        textColor = 'text-white';
        shadowEffect = 'shadow-lg shadow-green-500/50';
        scaleEffect = 'scale-105';
        break;
      case 'popping':
        bgColor = 'bg-red-600/80 border-red-400';
        textColor = 'text-white';
        shadowEffect = 'shadow-lg shadow-red-500/50';
        scaleEffect = 'scale-90';
        break;
      case 'peeking':
        bgColor = 'bg-cyan-600/80 border-cyan-400';
        textColor = 'text-white';
        shadowEffect = 'shadow-lg shadow-cyan-500/50';
        scaleEffect = 'scale-105';
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
          scaleEffect = 'scale-105';
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
  }, [elementStates, currentElementIndex, stack.length]);

  return (
  <div id="stack-visualization" className="col-span-6 flex flex-col glass-card p-6 h-full bg-gradient-to-br from-gray-900/90 to-purple-900/90 backdrop-blur-xl border border-gray-700/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Activity className="w-6 h-6 text-cyan-400" />
          Stack Visualization
        </h3>
        <span id="stack-count" className="text-sm text-gray-300 bg-gray-800/50 px-3 py-1 rounded-full">
          {stack.length} / {maxSize}
        </span>
      </div>

      <div id="stack-container" className="flex-1 flex items-center justify-center p-4 min-h-[300px] h-full">
        <div id="stack-box" className="w-full stack-box-centered">
          {stack.length === 0 ? (
            <div id="stack-empty" className="text-center p-8">
              <div className="text-gray-400 text-lg mb-2">Stack is Empty</div>
              <div className="text-gray-500 text-sm">Use Push to add elements</div>
            </div>
          ) : (
            <div id="stack-elements" className="space-y-4 flex flex-col-reverse items-center justify-center">
              <AnimatePresence mode="popLayout">
                {stack.map((value, index) => {
                  const { className, style } = getElementStyle(index);
                  return (
                    <motion.div
                      id={`stack-element-${index}`}
                      key={`stack-${index}-${value}`}
                      layout
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: elementStates[index] === 'popping' ? 0.3 : 1, scale: currentElementIndex === index ? 1.05 : 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: -20 }}
                      transition={{ duration: 0.4, type: 'spring', stiffness: 300, damping: 25 }}
                      className="flex flex-col items-center gap-2 min-w-[80px]"
                    >
                      <div id={`stack-index-${index}`} className="text-gray-300 font-mono text-sm font-semibold px-3 py-1 bg-gray-800/70 rounded-md border border-gray-600/50">
                        [{index}]
                      </div>

                      <div id={`stack-cell-${index}`} className={className} style={style}>
                        <span className="relative z-10 font-bold drop-shadow-lg">{value}</span>
                        {currentElementIndex === index && (
                          <motion.div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-500/20 rounded-lg" animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }} />
                        )}
                      </div>

                      <div id={`stack-address-${index}`} className="text-gray-400 font-mono text-xs px-2 py-1 bg-gray-900/60 rounded border border-gray-700/50">
                        0x{(getBaseAddress() + index * 4).toString(16).toUpperCase()}
                      </div>

                      {index === stack.length - 1 && (
                        <motion.div id={`stack-top-indicator`} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="text-xs font-bold text-purple-400 bg-purple-900/30 px-2 py-1 rounded border border-purple-500/30">
                          TOP
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {currentElementIndex >= 0 && (
        <div id="stack-status" className="mt-4 text-center text-sm text-gray-300 bg-gray-800/50 py-2 px-4 rounded-lg">
          Currently examining index {currentElementIndex}
          {elementStates[currentElementIndex] && (
            <span id="stack-status-state" className="ml-2 text-cyan-400">({elementStates[currentElementIndex]})</span>
          )}
        </div>
      )}

      <div id="stack-legend" className="border-t border-gray-700/50 pt-4 mt-4">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-600 rounded border"></div>
              <span className="text-gray-400">Top Element</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-600 rounded border"></div>
              <span className="text-gray-400">Pushing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-600 rounded border"></div>
              <span className="text-gray-400">Popping</span>
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
              <div className="w-3 h-3 bg-gray-500 rounded border"></div>
              <span className="text-gray-400">Empty Slot</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

  export default StackVisualization;

