import React, { useState } from 'react';
import { motion } from 'framer-motion';
import HashTableControls from './HashTableControls';
import HashTableVisualization from './HashTableVisualization';
import HashTableCodeDisplay from './HashTableCodeDisplay';
import HashTableMemoryVisualization from './HashTableMemoryVisualization';
import useHashTableLogic from './HashTableLogic';

const HashTableVisualizerPage = () => {
  const [currentLanguage, setCurrentLanguage] = useState('python');
  const [showMemory, setShowMemory] = useState(false);

  const {
    // State
    hashTable,
    tableSize,
    currentIndex,
    currentKey,
    currentOperation,
    animationStep,
    currentIteration,
    currentCodeLine,
    isAnimating,
    isPlaying,
    animationSpeed,
    operationResult,
    showHashCalculation,
    totalEntries,
    loadFactor,

    // Methods
    insert,
    search,
    delete: deleteKey,
    reset,
    playPause,
    stepForward,
    setAnimationSpeed,
    changeTableSize
  } = useHashTableLogic(7);

  const handleLanguageChange = (language) => {
    setCurrentLanguage(language);
  };

  const handleToggleMemory = () => {
    setShowMemory(!showMemory);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Hash Table Visualizer
          </h1>
          <p className="text-lg text-gray-600">
            Interactive visualization of hash table operations with collision handling
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <HashTableControls
            onInsert={insert}
            onSearch={search}
            onDelete={deleteKey}
            onReset={reset}
            onStepForward={stepForward}
            onPlayPause={playPause}
            onLanguageChange={handleLanguageChange}
            onSpeedChange={setAnimationSpeed}
            onTableSizeChange={changeTableSize}
            isPlaying={isPlaying}
            currentLanguage={currentLanguage}
            animationSpeed={animationSpeed}
            tableSize={tableSize}
            isAnimating={isAnimating}
            showMemory={showMemory}
            onToggleMemory={handleToggleMemory}
            loadFactor={loadFactor}
            totalEntries={totalEntries}
          />
        </motion.div>

        {/* Operation Result Display */}
        {operationResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`mb-6 p-4 rounded-lg border-l-4 ${
              operationResult.success
                ? 'bg-green-50 border-green-500 text-green-800'
                : 'bg-red-50 border-red-500 text-red-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                operationResult.success ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className="font-medium">
                {operationResult.success ? 'Success' : 'Failed'}
              </span>
              <span>-</span>
              <span>{operationResult.message}</span>
            </div>
          </motion.div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Visualization */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <HashTableVisualization
              hashTable={hashTable}
              currentIndex={currentIndex}
              currentKey={currentKey}
              animationStep={animationStep}
              currentIteration={currentIteration}
              tableSize={tableSize}
              highlightKey={currentKey}
              showHashCalculation={showHashCalculation}
            />
          </motion.div>

          {/* Code Display */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <HashTableCodeDisplay
              codeLanguage={currentLanguage}
              operation={currentOperation}
              currentCodeLine={currentCodeLine}
              animationStep={animationStep}
              currentIteration={currentIteration}
            />
          </motion.div>

          {/* Memory Visualization */}
          {showMemory && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <HashTableMemoryVisualization
                hashTable={hashTable}
                currentIndex={currentIndex}
                currentKey={currentKey}
                animationStep={animationStep}
                tableSize={tableSize}
              />
            </motion.div>
          )}
        </div>

        {/* Hash Table Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-lg shadow-lg"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Hash Table Characteristics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Time Complexities</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li><span className="font-mono">Search:</span> O(1) average, O(n) worst</li>
                <li><span className="font-mono">Insert:</span> O(1) average, O(n) worst</li>
                <li><span className="font-mono">Delete:</span> O(1) average, O(n) worst</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Space Complexity</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li><span className="font-mono">Storage:</span> O(n)</li>
                <li><span className="font-mono">Load Factor:</span> n/m</li>
                <li><span className="font-mono">Optimal Load:</span> &lt; 0.75</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Collision Handling</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li><span className="font-mono">Method:</span> Chaining</li>
                <li><span className="font-mono">Structure:</span> Linked Lists</li>
                <li><span className="font-mono">Hash Function:</span> Sum of ASCII</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HashTableVisualizerPage;
