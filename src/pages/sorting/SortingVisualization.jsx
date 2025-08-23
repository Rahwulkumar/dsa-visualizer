import React, { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { TrendingUp } from 'lucide-react';
import '../../styles/globals.css';
import './SortingStyles.css';

const SortingVisualization = ({ displayArray, currentElementIndex, elementStates, codeLanguage }) => {
  const getBaseAddress = useCallback(() => {
    return codeLanguage === 'c' ? 0x7fff5fbff000 : 0x7f8b1c000000;
  }, [codeLanguage]);

  const getElementStyle = useCallback((index) => {
    const state = elementStates[index];
    const isCurrentElement = currentElementIndex === index;
    const baseSize = Math.min(80, Math.max(60, 400 / Math.max(1, displayArray.length)));
    
    let baseClasses = 'flex items-center justify-center font-mono font-bold border-2 rounded-lg transition-all duration-300 relative overflow-hidden';
    let bgColor = 'bg-gray-700/90 border-gray-500';
    let textColor = 'text-white';
    let shadowEffect = 'shadow-md';
    let scaleEffect = '';

    // Apply state-specific styles for sorting operations
    switch (state) {
      case 'comparing':
        bgColor = 'bg-blue-600/80 border-blue-400';
        textColor = 'text-white';
        shadowEffect = 'shadow-lg shadow-blue-500/50';
        scaleEffect = 'scale-110';
        break;
      case 'swapping':
        bgColor = 'bg-yellow-600/80 border-yellow-400';
        textColor = 'text-yellow-50';
        shadowEffect = 'shadow-lg shadow-yellow-500/50';
        scaleEffect = 'scale-115';
        break;
      case 'sorted':
        bgColor = 'bg-green-600/80 border-green-400';
        textColor = 'text-white';
        shadowEffect = 'shadow-lg shadow-green-500/50';
        scaleEffect = 'scale-105';
        break;
      case 'pivot':
        bgColor = 'bg-purple-600/80 border-purple-400';
        textColor = 'text-white';
        shadowEffect = 'shadow-lg shadow-purple-500/50';
        scaleEffect = 'scale-120';
        break;
      case 'partitioning':
        bgColor = 'bg-orange-600/80 border-orange-400';
        textColor = 'text-white';
        shadowEffect = 'shadow-lg shadow-orange-500/50';
        scaleEffect = 'scale-105';
        break;
      case 'merging':
        bgColor = 'bg-cyan-600/80 border-cyan-400';
        textColor = 'text-white';
        shadowEffect = 'shadow-lg shadow-cyan-500/50';
        scaleEffect = 'scale-105';
        break;
      case 'current':
        bgColor = 'bg-indigo-600/80 border-indigo-400';
        textColor = 'text-white';
        shadowEffect = 'shadow-lg shadow-indigo-500/50';
        scaleEffect = 'scale-110';
        break;
      case 'min':
        bgColor = 'bg-pink-600/80 border-pink-400';
        textColor = 'text-white';
        shadowEffect = 'shadow-lg shadow-pink-500/50';
        scaleEffect = 'scale-110';
        break;
      case 'max':
        bgColor = 'bg-red-600/80 border-red-400';
        textColor = 'text-white';
        shadowEffect = 'shadow-lg shadow-red-500/50';
        scaleEffect = 'scale-110';
        break;
      case 'key':
        bgColor = 'bg-emerald-600/80 border-emerald-400';
        textColor = 'text-white';
        shadowEffect = 'shadow-lg shadow-emerald-500/50';
        scaleEffect = 'scale-110';
        break;
      default:
        if (isCurrentElement) {
          bgColor = 'bg-red-600/80 border-red-400';
          textColor = 'text-white';
          shadowEffect = 'shadow-lg shadow-red-500/50';
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
  }, [elementStates, currentElementIndex, displayArray.length]);

  // Calculate bar height for visual representation
  const getBarHeight = useCallback((value) => {
    if (!displayArray.length) return 0;
    const maxValue = Math.max(...displayArray);
    const minValue = Math.min(...displayArray);
    const normalizedValue = (value - minValue) / (maxValue - minValue);
    return Math.max(30, normalizedValue * 200 + 30);
  }, [displayArray]);

  const getBarStyle = useCallback((index) => {
    const state = elementStates[index];
    const height = getBarHeight(displayArray[index]);
    
    let barColor = 'bg-gradient-to-t from-gray-600 to-gray-500';
    let borderColor = 'border-gray-400';
    
    switch (state) {
      case 'comparing':
        barColor = 'bg-gradient-to-t from-blue-600 to-blue-400';
        borderColor = 'border-blue-300';
        break;
      case 'swapping':
        barColor = 'bg-gradient-to-t from-yellow-600 to-yellow-400';
        borderColor = 'border-yellow-300';
        break;
      case 'sorted':
        barColor = 'bg-gradient-to-t from-green-600 to-green-400';
        borderColor = 'border-green-300';
        break;
      case 'pivot':
        barColor = 'bg-gradient-to-t from-purple-600 to-purple-400';
        borderColor = 'border-purple-300';
        break;
      case 'partitioning':
        barColor = 'bg-gradient-to-t from-orange-600 to-orange-400';
        borderColor = 'border-orange-300';
        break;
      case 'merging':
        barColor = 'bg-gradient-to-t from-cyan-600 to-cyan-400';
        borderColor = 'border-cyan-300';
        break;
      case 'current':
        barColor = 'bg-gradient-to-t from-indigo-600 to-indigo-400';
        borderColor = 'border-indigo-300';
        break;
      case 'min':
        barColor = 'bg-gradient-to-t from-pink-600 to-pink-400';
        borderColor = 'border-pink-300';
        break;
      case 'max':
        barColor = 'bg-gradient-to-t from-red-600 to-red-400';
        borderColor = 'border-red-300';
        break;
      case 'key':
        barColor = 'bg-gradient-to-t from-emerald-600 to-emerald-400';
        borderColor = 'border-emerald-300';
        break;
      default:
        if (currentElementIndex === index) {
          barColor = 'bg-gradient-to-t from-red-600 to-red-400';
          borderColor = 'border-red-300';
        }
    }
    
    return {
      height: `${height}px`,
      className: `${barColor} ${borderColor} border-2 rounded-t-lg transition-all duration-300 shadow-lg`
    };
  }, [elementStates, currentElementIndex, displayArray, getBarHeight]);

  return (
    <div className="col-span-5 flex flex-col glass-card p-6 h-full bg-gradient-to-br from-gray-900/90 to-purple-900/90 backdrop-blur-xl border border-gray-700/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-cyan-400" />
          Sorting Visualization
        </h3>
        <span className="text-sm text-gray-300 bg-gray-800/50 px-3 py-1 rounded-full">
          {displayArray.length} elements
        </span>
      </div>
      
      {/* Dual visualization: Array view and Bar chart view */}
      <div className="flex-1 space-y-6">
        {/* Array View */}
        <div className="bg-black/20 rounded-xl p-4 border border-gray-600/30">
          <h4 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
            <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
            Array View
          </h4>
          <div className="flex items-center justify-center min-h-[120px]">
            <div className="flex items-center justify-center gap-3 flex-wrap max-w-full">
              <AnimatePresence mode="popLayout">
                {displayArray.map((value, index) => {
                  const { className, style } = getElementStyle(index);
                  return (
                    <motion.div
                      key={`sort-array-${index}-${value}`}
                      layout
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{
                        opacity: 1,
                        scale: currentElementIndex === index ? 1.05 : 1,
                        y: 0
                      }}
                      exit={{ opacity: 0, scale: 0.8, y: -20 }}
                      transition={{ duration: 0.4, type: 'spring', stiffness: 300, damping: 25 }}
                      className="flex flex-col items-center gap-2 min-w-[70px]"
                    >
                      {/* Index label */}
                      <div className="text-gray-300 font-mono text-sm font-semibold px-2 py-1 bg-gray-800/70 rounded-md border border-gray-600/50">
                        [{index}]
                      </div>
                      
                      {/* Array element */}
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
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Bar Chart View */}
        <div className="bg-black/20 rounded-xl p-4 border border-gray-600/30">
          <h4 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            Bar Chart View
          </h4>
          <div className="flex items-end justify-center gap-2 min-h-[250px] px-4">
            <AnimatePresence mode="popLayout">
              {displayArray.map((value, index) => {
                const { height, className } = getBarStyle(index);
                return (
                  <motion.div
                    key={`sort-bar-${index}-${value}`}
                    layout
                    initial={{ opacity: 0, scaleY: 0 }}
                    animate={{ 
                      opacity: 1, 
                      scaleY: 1,
                      scale: currentElementIndex === index ? 1.1 : 1
                    }}
                    exit={{ opacity: 0, scaleY: 0 }}
                    transition={{ duration: 0.4, type: 'spring', stiffness: 300, damping: 25 }}
                    className="flex flex-col items-center gap-2 min-w-[40px] max-w-[60px] flex-1"
                  >
                    {/* Value label on top */}
                    <div className="text-white font-mono text-sm font-bold mb-1">
                      {value}
                    </div>
                    
                    {/* Bar */}
                    <div 
                      className={className}
                      style={{ height }}
                    >
                      {currentElementIndex === index && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-t from-white/20 to-white/10 rounded-t-lg"
                          animate={{ opacity: [0.3, 0.7, 0.3] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      )}
                    </div>
                    
                    {/* Index label at bottom */}
                    <div className="text-gray-400 font-mono text-xs mt-1">
                      {index}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
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
    </div>
  );
};

export default SortingVisualization;
