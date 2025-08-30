import React from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { 
  Settings, 
  Play, 
  Pause, 
  RotateCcw, 
  Search,
  Shuffle,
  X,
  Code,
  Activity,
  Target
} from 'lucide-react';

const SearchingControls = ({
  isOpen,
  setIsOpen,
  arraySize,
  setArraySize,
  codeLanguage,
  setCodeLanguage,
  operation,
  setOperation,
  isAnimating,
  // eslint-disable-next-line no-unused-vars
  isPlaying,
  onStart,
  onPause,
  onReset,
  speed,
  setSpeed,
  displayArray = [],
  currentElementIndex = -1,
  elementStates = {},
  comparisons = 0,
  searchTarget = null,
  setSearchTarget,
  foundIndex = -1
}) => {
  const operations = [
    { id: 'linearSearch', label: 'Linear Search', icon: Search, color: 'from-blue-500 to-blue-600' },
    { id: 'binarySearch', label: 'Binary Search', icon: Target, color: 'from-green-500 to-green-600' }
  ];

  const languages = [
    { id: 'python', label: 'Python', color: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-200' },
    { id: 'javascript', label: 'JavaScript', color: 'bg-orange-500/20 border-orange-500/50 text-orange-200' },
    { id: 'java', label: 'Java', color: 'bg-red-500/20 border-red-500/50 text-red-200' },
    { id: 'cpp', label: 'C++', color: 'bg-blue-500/20 border-blue-500/50 text-blue-200' }
  ];

  const speedOptions = [
    { value: 2000, label: 'Slow', icon: '🐌' },
    { value: 1000, label: 'Normal', icon: '🚶' },
    { value: 500, label: 'Fast', icon: '🏃' },
    { value: 200, label: 'Very Fast', icon: '⚡' }
  ];

  // Helper function to get element style for preview
  const getPreviewElementStyle = (index) => {
    const state = elementStates[index];
    const isCurrentElement = currentElementIndex === index;
    
    let className = 'bg-gray-800/80 border-gray-600/80 text-white';

    switch (state) {
      case 'comparing':
        className = 'bg-blue-600/90 border-blue-400 text-white shadow-lg shadow-blue-500/30';
        break;
      case 'visited':
        className = 'bg-purple-600/90 border-purple-400 text-white shadow-lg shadow-purple-500/30';
        break;
      case 'found':
        className = 'bg-green-600/90 border-green-400 text-white shadow-lg shadow-green-500/30';
        break;
      case 'inRange':
        className = 'bg-cyan-600/90 border-cyan-400 text-white shadow-lg shadow-cyan-500/30';
        break;
      case 'excluded':
        className = 'bg-gray-700/90 border-gray-500 text-gray-400 shadow-lg shadow-gray-500/20';
        break;
      default:
        if (isCurrentElement) {
          className = 'bg-amber-600/90 border-amber-400 text-white shadow-lg shadow-amber-500/30';
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
        className="fixed top-20 right-6 z-50 bg-gradient-to-r from-cyan-500/90 to-blue-600/90 backdrop-blur-xl text-white px-6 py-3 rounded-full shadow-2xl border border-white/20 hover:shadow-cyan-500/50 transition-all duration-300 font-semibold"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Controls
        </span>
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
                      Search Controls
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

                {/* Array Preview */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
                      <Activity className="w-5 h-5 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                      Array Preview
                    </h3>
                  </div>
                  
                  <div className="bg-black/30 backdrop-blur-xl p-5 rounded-xl border border-white/10 shadow-xl">
                    {displayArray.length > 0 ? (
                      <div className="flex flex-wrap gap-3 justify-center max-h-36 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20">
                        {displayArray.map((value, index) => (
                          <motion.div 
                            key={index} 
                            className="flex flex-col items-center gap-2"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="text-xs text-gray-400 font-mono px-2 py-1 bg-gray-800/50 rounded-md">
                              [{index}]
                            </div>
                            <div 
                              className={`w-14 h-14 flex items-center justify-center text-sm font-bold font-mono rounded-xl border-2 transition-all duration-300 backdrop-blur-sm ${getPreviewElementStyle(index)} ${
                                currentElementIndex === index ? 'ring-2 ring-cyan-400/60 scale-110 animate-pulse' : ''
                              }`}
                            >
                              {value}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-gray-400 py-8">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        >
                          <Shuffle className="w-10 h-10 mx-auto mb-3 opacity-50" />
                        </motion.div>
                        <p className="text-sm">Generate an array to see preview</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Search Statistics */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gradient-to-r from-blue-500/10 to-blue-500/5 backdrop-blur-xl p-3 rounded-xl border border-blue-500/20">
                      <div className="text-xs text-blue-300 mb-1">Comparisons</div>
                      <div className="text-lg font-bold text-blue-200">{comparisons}</div>
                    </div>
                    <div className="bg-gradient-to-r from-green-500/10 to-green-500/5 backdrop-blur-xl p-3 rounded-xl border border-green-500/20">
                      <div className="text-xs text-green-300 mb-1">Found At</div>
                      <div className="text-lg font-bold text-green-200">{foundIndex !== -1 ? `Index ${foundIndex}` : 'Not Found'}</div>
                    </div>
                  </div>
                  
                  {/* Target Info */}
                  {searchTarget !== null && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-center bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-xl py-3 px-4 rounded-xl border border-cyan-500/20"
                    >
                      <span className="text-gray-200">
                        <Target className="w-4 h-4 inline mr-2 text-cyan-400" />
                        Searching for <span className="text-cyan-400 font-mono">{searchTarget}</span>
                        {currentElementIndex >= 0 && (
                          <span className="ml-2 text-purple-400 font-medium">
                            (at index {currentElementIndex})
                          </span>
                        )}
                      </span>
                    </motion.div>
                  )}
                </div>

                {/* Array Configuration */}
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg">
                      <Settings className="w-5 h-5 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                      Array Configuration
                    </h3>
                  </div>
                  
                  {/* Array Size */}
                  <div className="bg-black/20 backdrop-blur-xl p-4 rounded-xl border border-white/10">
                    <label className="block text-sm font-medium text-gray-200 mb-3">
                      Array Size: <span className="text-cyan-400 font-mono">{arraySize}</span>
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="10"
                      value={arraySize}
                      onChange={(e) => setArraySize(parseInt(e.target.value))}
                      className="w-full h-3 bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg appearance-none cursor-pointer slider"
                      disabled={isAnimating}
                      style={{
                        background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${((arraySize - 5) / 5) * 100}%, #374151 ${((arraySize - 5) / 5) * 100}%, #374151 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-2">
                      <span>5</span>
                      <span>10</span>
                    </div>
                  </div>

                  {/* Generate New Array */}
                  <motion.button
                    onClick={handleReset}
                    disabled={isAnimating}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-3 px-5 py-4 bg-gradient-to-r from-blue-600/80 to-cyan-600/80 backdrop-blur-xl text-white rounded-xl border border-blue-500/30 hover:from-blue-500/80 hover:to-cyan-500/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg"
                  >
                    <Shuffle className="w-5 h-5" />
                    <span className="font-medium">Generate New Array</span>
                  </motion.button>
                </div>

                {/* Search Target Input */}
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
                      <Target className="w-5 h-5 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                      Search Target
                    </h3>
                  </div>
                  
                  <div className="bg-black/20 backdrop-blur-xl p-4 rounded-xl border border-white/10">
                    <label className="block text-sm font-medium text-gray-200 mb-3">
                      Enter value to search for:
                    </label>
                    <input
                      type="number"
                      value={searchTarget || ''}
                      onChange={(e) => setSearchTarget(e.target.value ? parseInt(e.target.value) : null)}
                      placeholder="Enter a number..."
                      disabled={isAnimating}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      min="1"
                      max="100"
                    />
                    <div className="mt-2 text-xs text-gray-400">
                      {displayArray.length > 0 && (
                        <span>Array contains: {displayArray.join(', ')}</span>
                      )}
                    </div>
                    {searchTarget !== null && (
                      <div className="mt-2 text-sm">
                        {displayArray.includes(searchTarget) ? (
                          <span className="text-green-400">✓ Target exists in array</span>
                        ) : (
                          <span className="text-yellow-400">⚠ Target not in array</span>
                        )}
                      </div>
                    )}
                  </div>
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
                  <div className="grid grid-cols-2 gap-3">
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

                {/* Search Algorithm Selection */}
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg">
                      <Search className="w-5 h-5 text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">
                      Search Algorithm
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

                {/* Animation Controls */}
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg">
                      <Play className="w-5 h-5 text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">
                      Animation Controls
                    </h3>
                  </div>
                  
                  {/* Start Search Button */}
                  <motion.button
                    onClick={handleStart}
                    disabled={isAnimating || searchTarget === null}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-600/80 to-emerald-600/80 backdrop-blur-xl text-white rounded-xl border border-green-500/30 hover:from-green-500/80 hover:to-emerald-500/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg"
                  >
                    <Play className="w-6 h-6" />
                    <span className="font-medium">
                      {searchTarget === null ? 'Enter Search Target' : 'Start Search'}
                    </span>
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
                              ? 'bg-gradient-to-r from-yellow-500/80 to-orange-500/80 text-white border-yellow-500/30 shadow-lg'
                              : 'bg-gray-800/50 border-gray-600/50 text-gray-300 hover:bg-gray-700/50 hover:border-gray-500/50'
                          }`}
                          disabled={isAnimating}
                        >
                          <span>{option.icon}</span>
                          <span>{option.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Secondary Controls */}
                  <div className="grid grid-cols-2 gap-3">
                    <motion.button
                      onClick={handlePause}
                      disabled={!isAnimating}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-yellow-600/80 to-orange-600/80 backdrop-blur-xl text-white rounded-xl border border-yellow-500/30 hover:from-yellow-500/80 hover:to-orange-500/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg text-sm font-medium"
                    >
                      <Pause className="w-4 h-4" />
                      <span>Pause</span>
                    </motion.button>

                    <motion.button
                      onClick={handleReset}
                      disabled={isAnimating}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-600/80 to-pink-600/80 backdrop-blur-xl text-white rounded-xl border border-red-500/30 hover:from-red-500/80 hover:to-pink-500/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg text-sm font-medium"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Reset</span>
                    </motion.button>
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

export default SearchingControls;