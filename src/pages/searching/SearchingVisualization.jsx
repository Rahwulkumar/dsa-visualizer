import React, { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { Search, Target } from 'lucide-react';
import '../../styles/globals.css';
import './SearchingStyles.css';

const SearchingVisualization = ({ 
  displayArray, 
  currentElementIndex, 
  elementStates, 
  codeLanguage,
  comparisons,
  foundIndex,
  searchTarget,
  searchRange,
  operation
}) => {
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

    // Apply state-specific styles for search operations
    switch (state) {
      case 'comparing':
        // Current element being compared (blue - active examination)
        bgColor = 'bg-blue-600/90 border-blue-400';
        textColor = 'text-white';
        shadowEffect = 'shadow-lg shadow-blue-500/60';
        scaleEffect = 'scale-110';
        break;
      case 'visited':
        // For linear search - elements already checked (purple - examined)
        bgColor = 'bg-purple-600/80 border-purple-400';
        textColor = 'text-white';
        shadowEffect = 'shadow-lg shadow-purple-500/50';
        scaleEffect = 'scale-100';
        break;
      case 'found':
        // Target found (green - success)
        bgColor = 'bg-green-600/90 border-green-400';
        textColor = 'text-white';
        shadowEffect = 'shadow-lg shadow-green-500/60';
        scaleEffect = 'scale-115';
        break;
      case 'inRange':
        // For binary search - elements in current search range (cyan - candidates)
        bgColor = 'bg-cyan-600/70 border-cyan-400/80';
        textColor = 'text-white';
        shadowEffect = 'shadow-md shadow-cyan-500/40';
        scaleEffect = 'scale-102';
        break;
      case 'excluded':
        // For binary search - elements outside search range (dark gray - eliminated)
        bgColor = 'bg-gray-700/50 border-gray-500/50';
        textColor = 'text-gray-400';
        shadowEffect = 'shadow-sm shadow-gray-600/20';
        scaleEffect = 'scale-95';
        break;
      default:
        if (isCurrentElement) {
          // Fallback highlighting (amber - current focus)
          bgColor = 'bg-amber-600/90 border-amber-400';
          textColor = 'text-white';
          shadowEffect = 'shadow-lg shadow-amber-500/60';
          scaleEffect = 'scale-110';
        }
    }

    const finalClasses = `${baseClasses} ${bgColor} ${textColor} ${shadowEffect} ${scaleEffect}`;
    
    return { 
      className: finalClasses, 
      style: { 
        width: `${baseSize}px`, 
        height: `${baseSize}px`,
        fontSize: `${Math.max(10, baseSize / 6)}px`,
        minWidth: '50px',
        minHeight: '50px'
      }
    };
  }, [currentElementIndex, elementStates, displayArray.length]);

  const getMemoryAddress = useCallback((index) => {
    const baseAddr = getBaseAddress();
    return `0x${(baseAddr + index * 4).toString(16)}`;
  }, [getBaseAddress]);

  return (
    <div className="col-span-4 glass-card p-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/20 rounded-lg">
            <Search className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Search Visualization</h2>
            <p className="text-sm text-gray-400">
              {operation === 'linearSearch' ? 'Linear Search Algorithm' : 'Binary Search Algorithm'}
            </p>
          </div>
        </div>
        
        {/* Search Target Display */}
        {searchTarget !== null && (
          <div className="flex items-center gap-2 px-3 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg">
            <Target className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-medium text-gray-300">Target:</span>
            <span className="text-lg font-bold text-cyan-400">{searchTarget}</span>
          </div>
        )}
      </div>

      {/* Array Visualization */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="flex flex-wrap gap-3 justify-center items-end max-w-full">
          <AnimatePresence mode="wait">
            {displayArray.map((value, index) => {
              const style = getElementStyle(index);
              const state = elementStates[index];
              const isCurrentElement = currentElementIndex === index;
              
              return (
                <motion.div
                  key={`${index}-${value}`}
                  className={style.className}
                  style={style.style}
                  initial={{ 
                    scale: 0, 
                    opacity: 0,
                    y: -20
                  }}
                  animate={{ 
                    scale: isCurrentElement ? 1.15 : (state === 'found' ? 1.2 : 1),
                    opacity: state === 'excluded' ? 0.3 : 1,
                    y: isCurrentElement ? -10 : 0,
                    rotateY: state === 'found' ? [0, 360] : 0,
                    x: state === 'excluded' ? (Math.random() - 0.5) * 10 : 0,
                    // Linear search scanning effect
                    ...(operation === 'linearSearch' && isCurrentElement && {
                      boxShadow: [
                        '0 0 0 0 rgba(59, 130, 246, 0.7)',
                        '0 0 0 20px rgba(59, 130, 246, 0)',
                        '0 0 0 0 rgba(59, 130, 246, 0.7)'
                      ]
                    })
                  }}
                  transition={{ 
                    duration: 0.5,
                    type: "spring",
                    stiffness: 300,
                    damping: 20,
                    rotateY: { duration: 1, ease: "easeInOut" }
                  }}
                  whileHover={{ 
                    scale: state === 'excluded' ? 0.95 : 1.05,
                    transition: { duration: 0.2 }
                  }}
                  layout
                >
                  <motion.div 
                    className="flex flex-col items-center justify-center h-full relative"
                    animate={{
                      backgroundColor: state === 'comparing' ? ['rgba(59, 130, 246, 0.9)', 'rgba(96, 165, 250, 0.9)', 'rgba(59, 130, 246, 0.9)'] : undefined
                    }}
                    transition={{
                      backgroundColor: { duration: 1, repeat: state === 'comparing' ? Infinity : 0 }
                    }}
                  >
                    <motion.div 
                      className="text-lg font-bold mb-1"
                      animate={{
                        color: state === 'found' ? ['#ffffff', '#10b981', '#ffffff'] : undefined
                      }}
                      transition={{
                        color: { duration: 0.5, repeat: state === 'found' ? 3 : 0 }
                      }}
                    >
                      {value}
                    </motion.div>
                    
                    <div className="text-xs opacity-75">[{index}]</div>
                    <div className="text-xs opacity-50 font-mono mt-1">
                      {getMemoryAddress(index).slice(-4)}
                    </div>
                    
                    {/* Animated particles for found element */}
                    {state === 'found' && (
                      <motion.div
                        className="absolute inset-0 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {[...Array(6)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-1 h-1 bg-green-400 rounded-full"
                            style={{
                              left: '50%',
                              top: '50%',
                            }}
                            animate={{
                              x: [0, (Math.cos(i * 60 * Math.PI / 180) * 30)],
                              y: [0, (Math.sin(i * 60 * Math.PI / 180) * 30)],
                              opacity: [1, 0],
                              scale: [0, 1, 0]
                            }}
                            transition={{
                              duration: 1,
                              delay: i * 0.1,
                              repeat: Infinity,
                              repeatDelay: 2
                            }}
                          />
                        ))}
                      </motion.div>
                    )}
                    
                    {/* Linear Search Scanning Beam */}
                    {operation === 'linearSearch' && isCurrentElement && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent pointer-events-none"
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          repeatType: "reverse",
                          ease: "easeInOut"
                        }}
                      />
                    )}
                    
                    {/* Binary Search Pointers with animations */}
                    {operation === 'binarySearch' && searchRange && (
                      <>
                        {/* Left Pointer */}
                        {index === searchRange.left && searchRange.left !== -1 && (
                          <motion.div
                            className="absolute -top-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 400, damping: 20 }}
                          >
                            <motion.div 
                              className="text-xs font-bold text-blue-400 bg-blue-500/20 px-2 py-1 rounded border border-blue-500/50"
                              animate={{ 
                                boxShadow: ['0 0 0 0 rgba(59, 130, 246, 0.7)', '0 0 0 10px rgba(59, 130, 246, 0)', '0 0 0 0 rgba(59, 130, 246, 0)']
                              }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              LEFT
                            </motion.div>
                            <motion.div 
                              className="w-0 h-0 border-l-2 border-r-2 border-t-4 border-l-transparent border-r-transparent border-t-blue-400 mt-1"
                              animate={{ y: [0, 5, 0] }}
                              transition={{ duration: 1, repeat: Infinity }}
                            />
                          </motion.div>
                        )}
                        
                        {/* Right Pointer */}
                        {index === searchRange.right && searchRange.right !== -1 && (
                          <motion.div
                            className="absolute -top-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 400, damping: 20 }}
                          >
                            <motion.div 
                              className="text-xs font-bold text-red-400 bg-red-500/20 px-2 py-1 rounded border border-red-500/50"
                              animate={{ 
                                boxShadow: ['0 0 0 0 rgba(239, 68, 68, 0.7)', '0 0 0 10px rgba(239, 68, 68, 0)', '0 0 0 0 rgba(239, 68, 68, 0)']
                              }}
                              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                            >
                              RIGHT
                            </motion.div>
                            <motion.div 
                              className="w-0 h-0 border-l-2 border-r-2 border-t-4 border-l-transparent border-r-transparent border-t-red-400 mt-1"
                              animate={{ y: [0, 5, 0] }}
                              transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                            />
                          </motion.div>
                        )}
                        
                        {/* Mid Pointer */}
                        {index === searchRange.mid && searchRange.mid !== -1 && (
                          <motion.div
                            className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
                            initial={{ y: 20, opacity: 0, scale: 0 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 20, opacity: 0, scale: 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 15 }}
                          >
                            <motion.div 
                              className="w-0 h-0 border-l-2 border-r-2 border-b-4 border-l-transparent border-r-transparent border-b-yellow-400"
                              animate={{ y: [0, -5, 0] }}
                              transition={{ duration: 0.8, repeat: Infinity }}
                            />
                            <motion.div 
                              className="text-xs font-bold text-yellow-400 bg-yellow-500/20 px-2 py-1 rounded border border-yellow-500/50 mt-1"
                              animate={{ 
                                boxShadow: ['0 0 0 0 rgba(250, 204, 21, 0.7)', '0 0 0 8px rgba(250, 204, 21, 0)', '0 0 0 0 rgba(250, 204, 21, 0)'],
                                scale: [1, 1.1, 1]
                              }}
                              transition={{ duration: 1, repeat: Infinity }}
                            >
                              MID
                            </motion.div>
                          </motion.div>
                        )}
                      </>
                    )}
                  </motion.div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Linear Search Wave Effect */}
        {operation === 'linearSearch' && currentElementIndex >= 0 && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent"
              style={{
                position: 'absolute',
                top: '50%',
                left: 0,
                width: '100%',
                transformOrigin: 'left center'
              }}
              animate={{
                scaleX: [(currentElementIndex + 1) / displayArray.length, (currentElementIndex + 2) / displayArray.length],
                opacity: [0.8, 0.3]
              }}
              transition={{
                duration: 0.5,
                ease: "easeOut"
              }}
            />
          </motion.div>
        )}

        {/* Search Range Visual Bar with enhanced animations */}
        {operation === 'binarySearch' && searchRange && searchRange.left !== -1 && searchRange.right !== -1 && (
          <motion.div 
            className="mt-8 w-full max-w-4xl px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="relative h-6 bg-gray-800/30 rounded-lg border border-gray-700/50 overflow-hidden">
              {/* Eliminated sections animation */}
              <motion.div
                className="absolute top-0 left-0 h-full bg-gray-900/60"
                animate={{
                  width: `${(searchRange.left / displayArray.length) * 100}%`
                }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute top-0 right-0 h-full bg-gray-900/60"
                animate={{
                  width: `${((displayArray.length - searchRange.right - 1) / displayArray.length) * 100}%`
                }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
              
              {/* Active Search Range Bar */}
              <motion.div 
                className="absolute top-0 h-full bg-gradient-to-r from-cyan-500/40 to-blue-500/40 border border-cyan-500/60 rounded-lg"
                initial={{ width: "100%", left: "0%" }}
                animate={{
                  left: `${(searchRange.left / displayArray.length) * 100}%`,
                  width: `${((searchRange.right - searchRange.left + 1) / displayArray.length) * 100}%`
                }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                {/* Animated gradient overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{
                    x: ['-100%', '100%']
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
              </motion.div>
              
              {/* Mid Point Indicator with pulse */}
              {searchRange.mid !== -1 && (
                <motion.div 
                  className="absolute top-0 h-full w-1 bg-yellow-400 rounded shadow-lg shadow-yellow-400/50"
                  animate={{
                    left: `${((searchRange.mid + 0.5) / displayArray.length) * 100}%`,
                    boxShadow: [
                      '0 0 5px rgba(250, 204, 21, 0.5)', 
                      '0 0 20px rgba(250, 204, 21, 0.8)', 
                      '0 0 5px rgba(250, 204, 21, 0.5)'
                    ]
                  }}
                  transition={{ 
                    left: { duration: 0.5 },
                    boxShadow: { duration: 1, repeat: Infinity }
                  }}
                />
              )}
            </div>
            
            {/* Range Labels with slide animations */}
            <motion.div 
              className="flex justify-between mt-2 text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <motion.span 
                className="text-blue-400 font-mono"
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                Left: {searchRange.left}
              </motion.span>
              {searchRange.mid !== -1 && (
                <motion.span 
                  className="text-yellow-400 font-mono"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    y: [0, -2, 0]
                  }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  Mid: {searchRange.mid}
                </motion.span>
              )}
              <motion.span 
                className="text-red-400 font-mono"
                animate={{ x: [0, -3, 0] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
              >
                Right: {searchRange.right}
              </motion.span>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Binary Search Range Indicator */}
      {operation === 'binarySearch' && searchRange.left !== -1 && searchRange.right !== -1 && (
        <div className="mt-4 flex justify-center">
          <div className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg">
            <div className="text-sm text-gray-300">
              <span className="font-medium">Search Range:</span>
              <span className="ml-2 text-purple-400">
                Left: {searchRange.left}, Right: {searchRange.right}
                {searchRange.mid !== -1 && `, Mid: ${searchRange.mid}`}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        <div className="text-center p-2 bg-gray-800/30 rounded border border-gray-700/50">
          <div className="text-xl font-bold text-white">{comparisons}</div>
          <div className="text-xs text-gray-400">Comparisons</div>
        </div>
        <div className="text-center p-2 bg-gray-800/30 rounded border border-gray-700/50">
          <div className="text-xl font-bold text-white">{displayArray.length}</div>
          <div className="text-xs text-gray-400">Array Size</div>
        </div>
        <div className="text-center p-2 bg-gray-800/30 rounded border border-gray-700/50">
          {foundIndex !== -1 ? (
            <>
              <div className="text-xl font-bold text-green-400">{foundIndex}</div>
              <div className="text-xs text-gray-400">Found Index</div>
            </>
          ) : (
            <>
              <div className="text-xl font-bold text-red-400">-1</div>
              <div className="text-xs text-gray-400">Not Found</div>
            </>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 p-3 bg-gray-800/30 rounded-lg border border-gray-700/50">
        <h4 className="text-sm font-semibold text-gray-300 mb-2">Color Legend</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-600 rounded border border-blue-400"></div>
            <span className="text-gray-300">Comparing</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-600 rounded border border-green-400"></div>
            <span className="text-gray-300">Found</span>
          </div>
          {operation === 'linearSearch' && (
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-purple-600 rounded border border-purple-400"></div>
              <span className="text-gray-300">Already Checked</span>
            </div>
          )}
          {operation === 'binarySearch' && (
            <>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-cyan-600 rounded border border-cyan-400"></div>
                <span className="text-gray-300">Search Range</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-gray-700 rounded border border-gray-500"></div>
                <span className="text-gray-300">Eliminated</span>
              </div>
            </>
          )}
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-700 rounded border border-gray-500"></div>
            <span className="text-gray-300">Unprocessed</span>
          </div>
        </div>
        
        {/* Binary Search Pointer Legend */}
        {operation === 'binarySearch' && (
          <div className="mt-4 pt-3 border-t border-gray-700/50">
            <h5 className="text-xs font-semibold text-gray-400 mb-2">Binary Search Pointers</h5>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-2 bg-blue-500 rounded border border-blue-400"></div>
                <span className="text-gray-300">LEFT</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-2 bg-yellow-400 rounded"></div>
                <span className="text-gray-300">MID</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-2 bg-red-500 rounded border border-red-400"></div>
                <span className="text-gray-300">RIGHT</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchingVisualization;