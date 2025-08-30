import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hash, ArrowRight, ArrowDown } from 'lucide-react';

const HashTableVisualization = ({ 
  hashTable, 
  currentIndex, 
  currentKey, 
  animationStep, 
  currentIteration,
  tableSize = 7,
  highlightKey,
  showHashCalculation 
}) => {
  // Calculate hash value for visualization
  const calculateHash = (key) => {
    if (!key) return 0;
    return key.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  };

  // Get colors based on state
  const getSlotColor = (index, bucket) => {
    if (currentIndex === index) {
      return 'border-yellow-500 bg-yellow-100 shadow-lg';
    }
    if (bucket && bucket.length > 0) {
      return 'border-blue-400 bg-blue-50';
    }
    return 'border-gray-300 bg-gray-50';
  };

  const getEntryColor = (key) => {
    if (highlightKey === key || currentKey === key) {
      return 'border-green-500 bg-green-100 shadow-lg';
    }
    return 'border-gray-300 bg-white';
  };

  // Animation variants
  const slotVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3 }
    },
    highlight: {
      scale: 1.05,
      boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
      transition: { duration: 0.2 }
    }
  };

  const entryVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    },
    highlight: {
      scale: 1.1,
      boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
      transition: { duration: 0.2 }
    }
  };

  const chainVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="hash-table-visualization bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-6 text-gray-800 flex items-center gap-2">
        <Hash className="w-5 h-5 text-blue-600" />
        Hash Table Visualization
      </h3>

      {/* Hash Calculation Display */}
      {showHashCalculation && currentKey && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200"
        >
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium text-blue-800">Key:</span>
              <span className="font-mono bg-white px-2 py-1 rounded border">
                "{currentKey}"
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-blue-600" />
            <div className="flex items-center gap-2">
              <span className="font-medium text-blue-800">Hash:</span>
              <span className="font-mono bg-white px-2 py-1 rounded border">
                {calculateHash(currentKey)}
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-blue-600" />
            <div className="flex items-center gap-2">
              <span className="font-medium text-blue-800">Index:</span>
              <span className="font-mono bg-white px-2 py-1 rounded border">
                {calculateHash(currentKey) % tableSize}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Hash Table Grid */}
      <div className="space-y-3">
        {Array.from({ length: tableSize }, (_, index) => {
          const bucket = hashTable[index];
          const isCurrentSlot = currentIndex === index;
          
          return (
            <motion.div
              key={index}
              variants={slotVariants}
              initial="hidden"
              animate={isCurrentSlot ? "highlight" : "visible"}
              className={`border-2 rounded-lg p-4 transition-all duration-300 ${getSlotColor(index, bucket)}`}
            >
              <div className="flex items-center gap-4">
                {/* Index Label */}
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-lg border-2 border-gray-400 bg-white flex items-center justify-center font-mono font-bold text-lg">
                    {index}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Index</div>
                </div>

                {/* Arrow */}
                <ArrowRight className="w-6 h-6 text-gray-400" />

                {/* Bucket Content */}
                <div className="flex-1">
                  {!bucket || bucket.length === 0 ? (
                    <div className="h-12 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
                      Empty
                    </div>
                  ) : (
                    <motion.div
                      variants={chainVariants}
                      initial="hidden"
                      animate="visible"
                      className="flex items-center gap-3 overflow-x-auto pb-2"
                    >
                      {bucket.map((entry, entryIndex) => (
                        <React.Fragment key={entryIndex}>
                          <motion.div
                            variants={entryVariants}
                            className={`border-2 rounded-lg p-3 min-w-fit ${getEntryColor(entry.key)}`}
                          >
                            <div className="flex flex-col items-center">
                              <div className="font-mono font-bold text-sm text-gray-800">
                                Key: {entry.key}
                              </div>
                              <div className="text-xs text-gray-600 mt-1">
                                Value: {entry.value}
                              </div>
                            </div>
                          </motion.div>
                          
                          {entryIndex < bucket.length - 1 && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: entryIndex * 0.1 + 0.3 }}
                              className="flex items-center"
                            >
                              <ArrowRight className="w-4 h-4 text-gray-500" />
                            </motion.div>
                          )}
                        </React.Fragment>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Operation Status */}
      <AnimatePresence>
        {animationStep && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-gray-700">
                  Current Step: 
                </span>
                <span className="ml-2 text-sm text-gray-600">
                  {animationStep}
                </span>
              </div>
              {currentIteration !== undefined && (
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Iteration: 
                  </span>
                  <span className="ml-2 text-sm text-gray-600 font-mono">
                    {currentIteration}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Statistics Panel */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {tableSize}
          </div>
          <div className="text-xs text-blue-800">Table Size</div>
        </div>
        
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {hashTable.filter(bucket => bucket && bucket.length > 0).length}
          </div>
          <div className="text-xs text-green-800">Used Slots</div>
        </div>
        
        <div className="text-center p-3 bg-yellow-50 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">
            {hashTable.reduce((total, bucket) => total + (bucket ? bucket.length : 0), 0)}
          </div>
          <div className="text-xs text-yellow-800">Total Entries</div>
        </div>
        
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {(hashTable.reduce((total, bucket) => total + (bucket ? bucket.length : 0), 0) / tableSize).toFixed(2)}
          </div>
          <div className="text-xs text-purple-800">Load Factor</div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-3">Legend</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-yellow-500 bg-yellow-100 rounded"></div>
            <span>Current Index</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-green-500 bg-green-100 rounded"></div>
            <span>Target Key</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-400 bg-blue-50 rounded"></div>
            <span>Occupied Slot</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-gray-300 bg-gray-50 rounded"></div>
            <span>Empty Slot</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HashTableVisualization;
