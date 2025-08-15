import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Play, 
  Pause, 
  RotateCcw, 
  Search, 
  Plus, 
  Trash2,
  X,
  Code,
  Link,
  Eye,
  Zap,
  Shuffle
} from 'lucide-react';

const LinkedListControls = ({
  isOpen,
  setIsOpen,
  listSize,
  setListSize,
  codeLanguage,
  setCodeLanguage,
  operation,
  setOperation,
  isAnimating,
  isPlaying,
  onStart,
  onPause,
  onReset,
  speed,
  setSpeed,
  searchValue,
  setSearchValue,
  insertValue,
  setInsertValue,
  insertPosition,
  setInsertPosition,
  deleteValue,
  setDeleteValue,
  deletePosition,
  setDeletePosition,
  displayList = [],
  currentNodeIndex = -1,
  nodeStates = {}
}) => {
  const operations = [
    { id: 'search', label: 'Search Node', icon: Search, color: 'from-blue-500 to-blue-600' },
    { id: 'insert', label: 'Insert Node', icon: Plus, color: 'from-green-500 to-green-600' },
    { id: 'delete', label: 'Delete Node', icon: Trash2, color: 'from-red-500 to-red-600' },
    { id: 'traverse', label: 'Traverse List', icon: Link, color: 'from-cyan-500 to-cyan-600' }
  ];

  const languages = [
    { id: 'python', label: 'Python', color: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-200' },
    { id: 'java', label: 'Java', color: 'bg-orange-500/20 border-orange-500/50 text-orange-200' },
    { id: 'c', label: 'C', color: 'bg-blue-500/20 border-blue-500/50 text-blue-200' }
  ];

  const speedOptions = [
    { value: 2000, label: 'Slow', icon: '🐌' },
    { value: 1000, label: 'Normal', icon: '🚶' },
    { value: 500, label: 'Fast', icon: '🏃' },
    { value: 200, label: 'Very Fast', icon: '⚡' }
  ];

  // Helper function to get node style for preview
  const getPreviewNodeStyle = (index) => {
    const state = nodeStates[index];
    const isCurrentNode = currentNodeIndex === index;
    
    let className = 'bg-gray-800/80 border-gray-600/80 text-white';

    switch (state) {
      case 'checking':
      case 'traversing':
        className = 'bg-blue-600/90 border-blue-400 text-white shadow-lg shadow-blue-500/30';
        break;
      case 'found':
        className = 'bg-green-600/90 border-green-400 text-white shadow-lg shadow-green-500/30';
        break;
      case 'checked':
        className = 'bg-red-600/70 border-red-400/70 text-red-100';
        break;
      case 'inserting':
        className = 'bg-yellow-600/90 border-yellow-400 text-yellow-50 shadow-lg shadow-yellow-500/30';
        break;
      case 'inserted':
        className = 'bg-green-600/90 border-green-400 text-white shadow-lg shadow-green-500/30';
        break;
      case 'deleting':
        className = 'bg-red-600/90 border-red-400 text-red-100 shadow-lg shadow-red-500/30';
        break;
      default:
        if (isCurrentNode) {
          className = 'bg-purple-600/90 border-purple-400 text-white shadow-lg shadow-purple-500/30';
        }
    }

    return className;
  };

  const handleStart = () => {
    if (onStart) {
      onStart();
    }
    setIsOpen(false);
  };

  const handlePause = () => {
    if (onPause) {
      onPause();
    }
  };

  const handleReset = () => {
    if (onReset) {
      onReset();
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-20 right-6 z-50 bg-gradient-to-r from-cyan-500/90 to-blue-600/90 backdrop-blur-xl text-white p-4 rounded-full shadow-2xl border border-white/20 hover:shadow-cyan-500/50 transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Settings className="w-6 h-6" />
      </motion.button>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
            />

            {/* Sidebar Panel */}
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-[420px] bg-gradient-to-br from-gray-900/80 via-slate-800/80 to-gray-900/80 backdrop-blur-2xl border-l border-white/10 shadow-2xl z-50 overflow-y-auto"
            >
              <div className="p-6 space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg">
                      <Code className="w-6 h-6 text-cyan-400" />
                    </div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      LinkedList Controls
                    </h2>
                  </div>
                  <motion.button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                </div>

                {/* LinkedList Preview */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
                      <Eye className="w-5 h-5 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                      LinkedList Preview
                    </h3>
                  </div>
                  
                  <div className="bg-black/30 backdrop-blur-xl p-5 rounded-xl border border-white/10 shadow-xl">
                    {displayList.length > 0 ? (
                      <div className="flex items-center gap-2 overflow-x-auto pb-2 max-h-36 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20">
                        <span className="text-xs text-cyan-400 font-mono flex-shrink-0">head→</span>
                        {displayList.map((node, index) => (
                          <motion.div 
                            key={`preview-${node.id}`} 
                            className="flex items-center gap-1 flex-shrink-0"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className={`w-10 h-10 rounded border-2 flex items-center justify-center text-xs font-bold transition-all duration-300 backdrop-blur-sm ${getPreviewNodeStyle(index)} ${
                              currentNodeIndex === index ? 'ring-2 ring-cyan-400/60 scale-110 animate-pulse' : ''
                            }`}>
                              {node.data}
                            </div>
                            {index < displayList.length - 1 && (
                              <div className="text-gray-400 text-xs">→</div>
                            )}
                          </motion.div>
                        ))}
                        <div className="text-red-400 text-xs ml-1 flex-shrink-0">NULL</div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-400 py-8">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        >
                          <Shuffle className="w-10 h-10 mx-auto mb-3 opacity-50" />
                        </motion.div>
                        <p className="text-sm">Generate a list to see preview</p>
                      </div>
                    )}
                  </div>
                  
                  {/* LinkedList Status */}
                  {currentNodeIndex >= 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-center bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-xl py-3 px-4 rounded-xl border border-cyan-500/20"
                    >
                      <span className="text-gray-200">
                        <Zap className="w-4 h-4 inline mr-2 text-cyan-400" />
                        Examining node <span className="text-cyan-400 font-mono">{currentNodeIndex}</span>
                        {nodeStates[currentNodeIndex] && (
                          <span className="ml-2 text-purple-400 font-medium">
                            ({nodeStates[currentNodeIndex]})
                          </span>
                        )}
                      </span>
                    </motion.div>
                  )}
                </div>

                {/* LinkedList Configuration */}
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg">
                      <Settings className="w-5 h-5 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                      LinkedList Configuration
                    </h3>
                  </div>
                  
                  {/* List Size */}
                  <div className="bg-black/20 backdrop-blur-xl p-4 rounded-xl border border-white/10">
                    <label className="block text-sm font-medium text-gray-200 mb-3">
                      List Size: <span className="text-cyan-400 font-mono">{listSize}</span>
                    </label>
                    <input
                      type="range"
                      min="3"
                      max="8"
                      value={listSize}
                      onChange={(e) => setListSize(parseInt(e.target.value))}
                      className="w-full h-3 bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg appearance-none cursor-pointer slider"
                      disabled={isAnimating}
                      style={{
                        background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${((listSize - 3) / 5) * 100}%, #374151 ${((listSize - 3) / 5) * 100}%, #374151 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-2">
                      <span>3</span>
                      <span>8</span>
                    </div>
                  </div>

                  {/* Generate New List */}
                  <motion.button
                    onClick={handleReset}
                    disabled={isAnimating}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-3 px-5 py-4 bg-gradient-to-r from-blue-600/80 to-cyan-600/80 backdrop-blur-xl text-white rounded-xl border border-blue-500/30 hover:from-blue-500/80 hover:to-cyan-500/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg"
                  >
                    <Shuffle className="w-5 h-5" />
                    <span className="font-medium">Generate New List</span>
                  </motion.button>
                </div>

                {/* Programming Language */}
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-lg">
                      <Code className="w-5 h-5 text-orange-400" />
                    </div>
                    <h3 className="text-lg font-semibold bg-gradient-to-r from-orange-300 to-yellow-300 bg-clip-text text-transparent">
                      Programming Language
                    </h3>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {languages.map((lang) => (
                      <motion.button
                        key={lang.id}
                        onClick={() => setCodeLanguage(lang.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 backdrop-blur-xl border ${
                          codeLanguage === lang.id
                            ? `${lang.color} shadow-lg scale-105`
                            : 'bg-gray-800/50 border-gray-600/50 text-gray-300 hover:bg-gray-700/50 hover:border-gray-500/50'
                        }`}
                        disabled={isAnimating}
                      >
                        {lang.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Operation Selection */}
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg">
                      <Zap className="w-5 h-5 text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">
                      Operation
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {operations.map((op) => {
                      const IconComponent = op.icon;
                      return (
                        <motion.button
                          key={op.id}
                          onClick={() => setOperation(op.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl text-left transition-all duration-300 backdrop-blur-xl border ${
                            operation === op.id
                            ? `bg-gradient-to-r ${op.color}/80 backdrop-blur-xl text-white border-white/20 shadow-lg`
                            : 'bg-gray-800/50 border-gray-600/50 text-gray-300 hover:bg-gray-700/50 hover:border-gray-500/50'
                          }`}
                          disabled={isAnimating}
                        >
                          <div className="p-2 bg-white/10 rounded-lg">
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <span className="font-medium">{op.label}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Operation Parameters */}
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg">
                      <Settings className="w-5 h-5 text-indigo-400" />
                    </div>
                    <h3 className="text-lg font-semibold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
                      Parameters
                    </h3>
                  </div>
                  
                  {operation === 'search' && (
                    <div className="bg-black/20 backdrop-blur-xl p-4 rounded-xl border border-white/10">
                      <label className="block text-sm font-medium text-gray-200 mb-3">
                        Search Value
                      </label>
                      <input
                        type="number"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder="Enter value to search"
                        className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-xl text-white rounded-xl border border-gray-600/50 focus:border-blue-500/70 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        disabled={isAnimating}
                      />
                    </div>
                  )}
                  
                  {operation === 'insert' && (
                    <div className="space-y-4">
                      <div className="bg-black/20 backdrop-blur-xl p-4 rounded-xl border border-white/10">
                        <label className="block text-sm font-medium text-gray-200 mb-3">
                          Value to Insert
                        </label>
                        <input
                          type="number"
                          value={insertValue}
                          onChange={(e) => setInsertValue(e.target.value)}
                          placeholder="Enter value"
                          className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-xl text-white rounded-xl border border-gray-600/50 focus:border-green-500/70 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
                          disabled={isAnimating}
                        />
                      </div>
                      <div className="bg-black/20 backdrop-blur-xl p-4 rounded-xl border border-white/10">
                        <label className="block text-sm font-medium text-gray-200 mb-3">
                          Position (0 = head, {displayList.length} = tail)
                        </label>
                        <input
                          type="number"
                          value={insertPosition}
                          onChange={(e) => setInsertPosition(e.target.value)}
                          placeholder="Enter position"
                          min="0"
                          max={displayList.length}
                          className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-xl text-white rounded-xl border border-gray-600/50 focus:border-green-500/70 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
                          disabled={isAnimating}
                        />
                      </div>
                    </div>
                  )}
                  
                  {operation === 'delete' && (
                    <div className="space-y-4">
                      <div className="bg-black/20 backdrop-blur-xl p-4 rounded-xl border border-white/10">
                        <label className="block text-sm font-medium text-gray-200 mb-3">
                          Delete by Value
                        </label>
                        <input
                          type="number"
                          value={deleteValue}
                          onChange={(e) => setDeleteValue(e.target.value)}
                          placeholder="Value to delete"
                          className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-xl text-white rounded-xl border border-gray-600/50 focus:border-red-500/70 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
                          disabled={isAnimating}
                        />
                      </div>
                      <div className="text-center text-sm text-gray-400">
                        — OR —
                      </div>
                      <div className="bg-black/20 backdrop-blur-xl p-4 rounded-xl border border-white/10">
                        <label className="block text-sm font-medium text-gray-200 mb-3">
                          Delete by Position
                        </label>
                        <input
                          type="number"
                          value={deletePosition}
                          onChange={(e) => setDeletePosition(e.target.value)}
                          placeholder="Position to delete"
                          min="0"
                          max={displayList.length - 1}
                          className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-xl text-white rounded-xl border border-gray-600/50 focus:border-red-500/70 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all duration-200"
                          disabled={isAnimating}
                        />
                      </div>
                      <div className="text-xs text-gray-400 text-center">
                        Specify either value OR position (not both)
                      </div>
                    </div>
                  )}
                </div>

                {/* Animation Controls */}
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-gradient-to-r from-pink-500/20 to-rose-500/20 rounded-lg">
                      <Play className="w-5 h-5 text-pink-400" />
                    </div>
                    <h3 className="text-lg font-semibold bg-gradient-to-r from-pink-300 to-rose-300 bg-clip-text text-transparent">
                      Animation Controls
                    </h3>
                  </div>
                  
                  {/* Start/Pause/Reset */}
                  <motion.button
                    onClick={handleStart}
                    disabled={isAnimating}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-600/80 to-emerald-600/80 backdrop-blur-xl text-white rounded-xl border border-green-500/30 hover:from-green-500/80 hover:to-emerald-500/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg"
                  >
                    {isAnimating && isPlaying ? (
                      <>
                        <Pause className="w-6 h-6" />
                        <span className="font-medium">Running...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-6 h-6" />
                        <span className="font-medium">Start Animation</span>
                      </>
                    )}
                  </motion.button>

                  {/* Speed Control */}
                  <div className="bg-black/20 backdrop-blur-xl p-4 rounded-xl border border-white/10">
                    <label className="block text-sm font-medium text-gray-200 mb-4">
                      Animation Speed
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {speedOptions.map((option) => (
                        <motion.button
                          key={option.value}
                          onClick={() => setSpeed(option.value)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 backdrop-blur-xl border flex items-center justify-center gap-2 ${
                            speed === option.value
                              ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-200 shadow-lg scale-105'
                              : 'bg-gray-800/50 border-gray-600/50 text-gray-300 hover:bg-gray-700/50 hover:border-gray-500/50'
                          }`}
                          disabled={isAnimating}
                        >
                          <span className="text-base">{option.icon}</span>
                          <span>{option.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default LinkedListControls;