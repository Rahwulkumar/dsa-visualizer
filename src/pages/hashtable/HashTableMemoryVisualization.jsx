import React from 'react';
import { motion } from 'framer-motion';

const HashTableMemoryVisualization = ({ 
  hashTable, 
  currentIndex, 
  currentKey, 
  animationStep, 
  tableSize = 7 
}) => {
  // Calculate memory addresses (simulated)
  const baseAddress = 0x1000;
  
  // Color schemes for different states
  const getSlotColor = (index, bucket) => {
    if (currentIndex === index) {
      return 'bg-yellow-400 border-yellow-600';
    }
    if (bucket && bucket.length > 0) {
      return 'bg-blue-100 border-blue-400';
    }
    return 'bg-gray-100 border-gray-300';
  };

  const getEntryColor = (key) => {
    if (currentKey === key) {
      return 'bg-green-200 border-green-500';
    }
    return 'bg-white border-gray-300';
  };

  return (
    <div className="memory-visualization bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Hash Table Memory Layout
      </h3>
      
      <div className="space-y-4">
        {/* Memory Header */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Index</span>
          <span>Address</span>
          <span>Bucket Chain</span>
        </div>

        {/* Hash Table Slots */}
        <div className="space-y-2">
          {Array.from({ length: tableSize }, (_, index) => {
            const bucket = hashTable[index];
            const address = baseAddress + (index * 8);
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`border-2 rounded-lg p-3 ${getSlotColor(index, bucket)}`}
              >
                <div className="flex items-center gap-4">
                  {/* Index */}
                  <div className="w-12 text-center font-mono text-sm">
                    [{index}]
                  </div>
                  
                  {/* Memory Address */}
                  <div className="w-20 text-center font-mono text-xs text-gray-600">
                    0x{address.toString(16).toUpperCase()}
                  </div>
                  
                  {/* Bucket Chain */}
                  <div className="flex-1 flex items-center gap-2">
                    {!bucket || bucket.length === 0 ? (
                      <div className="text-gray-400 text-sm">NULL</div>
                    ) : (
                      <div className="flex items-center gap-2 overflow-x-auto">
                        {bucket.map((entry, entryIndex) => (
                          <React.Fragment key={entryIndex}>
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.2 + entryIndex * 0.1 }}
                              className={`border-2 rounded px-3 py-1 text-xs ${getEntryColor(entry.key)}`}
                            >
                              <div className="flex flex-col items-center">
                                <div className="font-mono font-bold">
                                  {entry.key}
                                </div>
                                <div className="text-gray-600">
                                  {entry.value}
                                </div>
                              </div>
                            </motion.div>
                            {entryIndex < bucket.length - 1 && (
                              <div className="text-gray-400">→</div>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Memory Statistics */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">Memory Statistics</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Table Size:</span>
              <span className="ml-2 font-mono">{tableSize} slots</span>
            </div>
            <div>
              <span className="text-gray-600">Used Slots:</span>
              <span className="ml-2 font-mono">
                {hashTable.filter(bucket => bucket && bucket.length > 0).length}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Total Entries:</span>
              <span className="ml-2 font-mono">
                {hashTable.reduce((total, bucket) => 
                  total + (bucket ? bucket.length : 0), 0
                )}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Load Factor:</span>
              <span className="ml-2 font-mono">
                {(hashTable.reduce((total, bucket) => 
                  total + (bucket ? bucket.length : 0), 0
                ) / tableSize).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Hash Function Visualization */}
        {currentKey && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200"
          >
            <h4 className="font-semibold text-blue-800 mb-2">Hash Calculation</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-blue-700">Key:</span>
                <span className="font-mono bg-white px-2 py-1 rounded">
                  "{currentKey}"
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-700">Hash Value:</span>
                <span className="font-mono bg-white px-2 py-1 rounded">
                  {currentKey.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-blue-700">Index:</span>
                <span className="font-mono bg-white px-2 py-1 rounded">
                  {currentKey.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % tableSize}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Legend */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">Legend</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-400 border border-yellow-600 rounded"></div>
              <span>Current Index</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-200 border border-green-500 rounded"></div>
              <span>Current Key</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-100 border border-blue-400 rounded"></div>
              <span>Occupied Slot</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
              <span>Empty Slot</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HashTableMemoryVisualization;
