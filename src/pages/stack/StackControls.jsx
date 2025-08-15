import React from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Play, 
  Pause, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Eye,
  X,
  Code,
  Zap
} from 'lucide-react';

const StackControls = ({
  isOpen,
  setIsOpen,
  maxSize,
  setMaxSize,
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
  pushValue,
  setPushValue,
  stack = [],
  elementStates = {},
  currentElementIndex = -1
}) => {
  const operations = [
    { id: 'push', label: 'Push Element', icon: Plus, color: 'from-green-500 to-green-600', description: 'Add element to top of stack' },
    { id: 'pop', label: 'Pop Element', icon: Trash2, color: 'from-red-500 to-red-600', description: 'Remove top element from stack' },
    { id: 'peek', label: 'Peek/Top', icon: Eye, color: 'from-cyan-500 to-cyan-600', description: 'View top element without removing' }
  ];

  const languages = [
    { id: 'python', label: 'Python', color: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-200' },
    { id: 'java', label: 'Java', color: 'bg-orange-500/20 border-orange-500/50 text-orange-200' },
    { id: 'c', label: 'C', color: 'bg-blue-500/20 border-blue-500/50 text-blue-200' }
  ];

  const speedOptions = [
    { value: 2000, label: 'Slow', icon: '🐌', description: 'Educational pace' },
    { value: 1000, label: 'Normal', icon: '🚶', description: 'Standard speed' },
    { value: 500, label: 'Fast', icon: '🏃', description: 'Quick overview' },
    { value: 200, label: 'Very Fast', icon: '⚡', description: 'Lightning fast' }
  ];

  const handleStart = () => {
    try {
      // Validate push operation
      if (operation === 'push') {
        const value = parseInt(pushValue);
        if (isNaN(value)) {
          alert('Please enter a valid number for push operation');
          return;
        }
        if (stack.length >= maxSize) {
          alert('Stack is full! Cannot push more elements');
          return;
        }
      }
      
      // Validate pop/peek operations
      if ((operation === 'pop' || operation === 'peek') && stack.length === 0) {
        alert(`Cannot ${operation} from an empty stack`);
        return;
      }
      
      if (onStart) onStart();
      setIsOpen(false);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  // Keyboard navigation handler
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'Enter' && e.target.tagName !== 'INPUT') {
      e.preventDefault();
      handleStart();
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, operation, pushValue, stack.length, maxSize]);

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 left-6 z-50 bg-gradient-to-r from-cyan-500/90 to-blue-600/90 backdrop-blur-xl text-white px-6 py-3 rounded-full shadow-2xl border border-white/20 hover:shadow-cyan-500/50 transition-all duration-300 font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open stack controls panel"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Controls
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-40"
            />
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-[420px] bg-gradient-to-br from-gray-900/80 via-slate-800/80 to-gray-900/80 backdrop-blur-2xl border-l border-white/10 shadow-2xl z-50 overflow-y-auto"
              role="dialog"
              aria-labelledby="controls-title"
              aria-modal="true"
            >
              <div className="p-6 space-y-8">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg">
                      <Code className="w-6 h-6 text-cyan-400" />
                    </div>
                    <h2 
                      className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                      id="controls-title"
                    >
                      Stack Controls
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

                {/* Stack Preview */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
                      <Eye className="w-5 h-5 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                      Stack Preview
                    </h3>
                  </div>
                  
                  <div className="bg-black/30 backdrop-blur-xl p-5 rounded-xl border border-white/10 shadow-xl h-60 flex flex-col-reverse items-center gap-2">
                    {stack.length > 0 ? (
                      stack.map((value, index) => (
                        <motion.div 
                          key={index}
                          layout
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`w-28 h-12 flex items-center justify-center text-sm font-bold rounded-lg border-2 ${
                            currentElementIndex === index 
                              ? 'bg-purple-500 border-purple-300 scale-105' 
                              : elementStates[index] === 'peeking' 
                                ? 'bg-cyan-500 border-cyan-300' 
                                : elementStates[index] === 'pushing'
                                  ? 'bg-green-500 border-green-300'
                                  : elementStates[index] === 'popping'
                                    ? 'bg-red-500 border-red-300'
                                    : 'bg-gray-700 border-gray-500'
                          }`}
                        >
                          {value}
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center text-gray-400">
                        <p>Stack is empty</p>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-center text-gray-400 font-mono">
                    Top: {stack.length > 0 ? stack[stack.length - 1] : 'null'} | Size: {stack.length}/{maxSize}
                  </p>
                </div>

                {/* Configuration */}
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg">
                      <Settings className="w-5 h-5 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                      Configuration
                    </h3>
                  </div>
                  
                  <div className="bg-black/20 backdrop-blur-xl p-4 rounded-xl border border-white/10">
                    <label className="block text-sm font-medium text-gray-200 mb-3">
                      Max Size: <span className="text-cyan-400 font-mono">{maxSize}</span>
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="10"
                      value={maxSize}
                      onChange={(e) => setMaxSize(parseInt(e.target.value))}
                      className="w-full h-3 bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg appearance-none cursor-pointer slider"
                      disabled={isAnimating}
                      style={{
                        background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${((maxSize - 5) / 5) * 100}%, #374151 ${((maxSize - 5) / 5) * 100}%, #374151 100%)`
                      }}
                    />
                     <div className="flex justify-between text-xs text-gray-400 mt-2">
                      <span>5</span>
                      <span>10</span>
                    </div>
                  </div>
                  <motion.button
                    onClick={onReset}
                    disabled={isAnimating}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-3 px-5 py-4 bg-gradient-to-r from-blue-600/80 to-cyan-600/80 backdrop-blur-xl text-white rounded-xl border border-blue-500/30 hover:from-blue-500/80 hover:to-cyan-500/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg"
                  >
                    <RotateCcw className="w-5 h-5" />
                    <span className="font-medium">Reset Stack</span>
                  </motion.button>
                </div>

                {/* Operations */}
                <div className="space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-gradient-to-r from-green-500/20 to-red-500/20 rounded-lg">
                      <Zap className="w-5 h-5 text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold bg-gradient-to-r from-green-300 to-red-300 bg-clip-text text-transparent">
                      Operations
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {operations.map(op => (
                      <motion.button
                        key={op.id}
                        onClick={() => setOperation(op.id)}
                        className={`px-4 py-4 rounded-lg text-sm font-medium border-2 transition-all duration-200 ${
                          operation === op.id 
                            ? 'bg-cyan-500 border-cyan-400 text-white shadow-lg shadow-cyan-500/30' 
                            : 'bg-gray-800/60 border-gray-700 text-gray-300 hover:bg-gray-700/80'
                        }`}
                        disabled={isAnimating}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-3">
                          <op.icon className="w-5 h-5" />
                          <div className="text-left">
                            <div className="font-semibold">{op.label}</div>
                            <div className="text-xs opacity-75">{op.description}</div>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                  {operation === 'push' && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                        Value to Push
                      </label>
                      <input
                        type="number"
                        value={pushValue}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '' || (!isNaN(value) && parseInt(value) >= -999 && parseInt(value) <= 999)) {
                            setPushValue(value);
                          }
                        }}
                        placeholder="Enter value (1-999)..."
                        className="w-full bg-gray-800/70 text-white p-3 rounded-lg border-2 border-gray-700 focus:border-cyan-500 focus:ring-cyan-500 transition-all duration-200"
                        disabled={isAnimating}
                        min="-999"
                        max="999"
                      />
                      {pushValue && isNaN(parseInt(pushValue)) && (
                        <p className="text-red-400 text-sm mt-1">⚠ Please enter a valid number</p>
                      )}
                      {stack.length >= maxSize && (
                        <p className="text-orange-400 text-sm mt-1">⚠ Stack is full! Pop elements first</p>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* Animation Controls */}
                <div className="space-y-5 pt-4 border-t border-white/10">
                   <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg">
                      <Play className="w-5 h-5 text-yellow-400" />
                    </div>
                    <h3 className="text-lg font-semibold bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                      Animation
                    </h3>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <motion.button onClick={handleStart} disabled={isAnimating || isPlaying} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="p-3 bg-green-600/80 rounded-lg flex items-center justify-center gap-2 border border-green-500/50 disabled:opacity-50"><Play /> Start</motion.button>
                    <motion.button onClick={onPause} disabled={!isPlaying} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="p-3 bg-yellow-600/80 rounded-lg flex items-center justify-center gap-2 border border-yellow-500/50 disabled:opacity-50"><Pause /> Pause</motion.button>
                    <motion.button onClick={onReset} disabled={isAnimating} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="p-3 bg-red-600/80 rounded-lg flex items-center justify-center gap-2 border border-red-500/50 disabled:opacity-50"><RotateCcw /> Reset</motion.button>
                  </div>
                  <div className="bg-black/20 backdrop-blur-xl p-4 rounded-xl border border-white/10">
                    <label className="block text-sm font-medium text-gray-200 mb-3">
                      Animation Speed
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {speedOptions.map(opt => (
                        <motion.button 
                          key={opt.value} 
                          onClick={() => setSpeed(opt.value)}
                          className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                            speed === opt.value 
                              ? 'bg-cyan-500/30 border-cyan-400 text-cyan-100' 
                              : 'bg-gray-800/60 border-gray-700 text-gray-300 hover:bg-gray-700/80'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          title={opt.description}
                        >
                          <div className="text-center">
                            <div className="text-2xl mb-1">{opt.icon}</div>
                            <div className="text-xs font-medium">{opt.label}</div>
                          </div>
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

StackControls.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  maxSize: PropTypes.number.isRequired,
  setMaxSize: PropTypes.func.isRequired,
  codeLanguage: PropTypes.oneOf(['python', 'java', 'c']).isRequired,
  setCodeLanguage: PropTypes.func.isRequired,
  operation: PropTypes.oneOf(['push', 'pop', 'peek']).isRequired,
  setOperation: PropTypes.func.isRequired,
  isAnimating: PropTypes.bool.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  onStart: PropTypes.func.isRequired,
  onPause: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  speed: PropTypes.number.isRequired,
  setSpeed: PropTypes.func.isRequired,
  pushValue: PropTypes.string.isRequired,
  setPushValue: PropTypes.func.isRequired,
  stack: PropTypes.array,
  elementStates: PropTypes.object,
  currentElementIndex: PropTypes.number
};

StackControls.defaultProps = {
  stack: [],
  elementStates: {},
  currentElementIndex: -1
};

export default StackControls;
