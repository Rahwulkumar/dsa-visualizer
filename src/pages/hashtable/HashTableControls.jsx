import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  StepForward, 
  Plus, 
  Search, 
  Trash2,
  Hash,
  Settings,
  Gauge,
  Eye,
  EyeOff
} from 'lucide-react';

const HashTableControls = ({
  onInsert,
  onSearch,
  onDelete,
  onReset,
  onStepForward,
  onPlayPause,
  onLanguageChange,
  onSpeedChange,
  onTableSizeChange,
  isPlaying,
  currentLanguage,
  animationSpeed,
  tableSize,
  isAnimating,
  showMemory,
  onToggleMemory,
  loadFactor,
  totalEntries
}) => {
  const [insertKey, setInsertKey] = useState('');
  const [insertValue, setInsertValue] = useState('');
  const [searchKey, setSearchKey] = useState('');
  const [deleteKey, setDeleteKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const handleInsert = useCallback(() => {
    if (insertKey.trim() && insertValue.trim()) {
      onInsert(insertKey.trim(), insertValue.trim());
      setInsertKey('');
      setInsertValue('');
    }
  }, [insertKey, insertValue, onInsert]);

  const handleSearch = useCallback(() => {
    if (searchKey.trim()) {
      onSearch(searchKey.trim());
      setSearchKey('');
    }
  }, [searchKey, onSearch]);

  const handleDelete = useCallback(() => {
    if (deleteKey.trim()) {
      onDelete(deleteKey.trim());
      setDeleteKey('');
    }
  }, [deleteKey, onDelete]);

  const handleKeyPress = useCallback((e, action) => {
    if (e.key === 'Enter') {
      action();
    }
  }, []);

  const getLoadFactorColor = (factor) => {
    if (factor < 0.7) return 'text-green-600';
    if (factor < 1.0) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="hash-table-controls bg-white p-6 rounded-lg shadow-lg space-y-6">
      {/* Header with statistics */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Hash Table Controls</h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Hash className="w-4 h-4 text-blue-600" />
            <span className="text-gray-600">Size: {tableSize}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-600">Entries: {totalEntries}</span>
          </div>
          <div className="flex items-center gap-1">
            <Gauge className="w-4 h-4 text-blue-600" />
            <span className={`${getLoadFactorColor(loadFactor)} font-mono`}>
              {loadFactor.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Operation Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Insert Controls */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Insert Key-Value Pair
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={insertKey}
              onChange={(e) => setInsertKey(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, handleInsert)}
              placeholder="Key"
              disabled={isAnimating}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
            <input
              type="text"
              value={insertValue}
              onChange={(e) => setInsertValue(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, handleInsert)}
              placeholder="Value"
              disabled={isAnimating}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleInsert}
              disabled={isAnimating || !insertKey.trim() || !insertValue.trim()}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Insert
            </motion.button>
          </div>
        </div>

        {/* Search Controls */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Search by Key
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, handleSearch)}
              placeholder="Enter key to search"
              disabled={isAnimating}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSearch}
              disabled={isAnimating || !searchKey.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Search
            </motion.button>
          </div>
        </div>

        {/* Delete Controls */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Delete by Key
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={deleteKey}
              onChange={(e) => setDeleteKey(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, handleDelete)}
              placeholder="Enter key to delete"
              disabled={isAnimating}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDelete}
              disabled={isAnimating || !deleteKey.trim()}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </motion.button>
          </div>
        </div>
      </div>

      {/* Animation Controls */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPlayPause}
            disabled={!isAnimating}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-2"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Play
              </>
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStepForward}
            disabled={!isAnimating || isPlaying}
            className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:bg-gray-400 flex items-center gap-2"
          >
            <StepForward className="w-4 h-4" />
            Step
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReset}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </motion.button>
        </div>

        <div className="flex items-center gap-4">
          {/* Memory Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleMemory}
            className={`px-3 py-2 rounded-md flex items-center gap-2 ${
              showMemory 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {showMemory ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            Memory
          </motion.button>

          {/* Settings Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSettings(!showSettings)}
            className={`px-3 py-2 rounded-md flex items-center gap-2 ${
              showSettings 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Settings className="w-4 h-4" />
            Settings
          </motion.button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="p-4 bg-gray-50 rounded-lg border border-gray-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Language Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Programming Language
              </label>
              <select
                value={currentLanguage}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="c">C</option>
              </select>
            </div>

            {/* Animation Speed */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Animation Speed: {animationSpeed}ms
              </label>
              <input
                type="range"
                min="100"
                max="2000"
                step="100"
                value={animationSpeed}
                onChange={(e) => onSpeedChange(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            {/* Table Size */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Table Size: {tableSize}
              </label>
              <input
                type="range"
                min="5"
                max="15"
                step="1"
                value={tableSize}
                onChange={(e) => onTableSizeChange(parseInt(e.target.value))}
                disabled={isAnimating || totalEntries > 0}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider disabled:opacity-50"
              />
              {totalEntries > 0 && (
                <p className="text-xs text-gray-500">
                  Reset table to change size
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="text-sm font-medium text-blue-800 mb-2">Quick Actions</h4>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => {
              onInsert('apple', '5');
              onInsert('banana', '3');
              onInsert('cherry', '8');
            }}
            disabled={isAnimating}
            className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            Add Sample Data
          </button>
          <button
            onClick={() => {
              onInsert('dog', '4');
              onInsert('cat', '2');
              onInsert('bird', '7');
            }}
            disabled={isAnimating}
            className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            Add More Data
          </button>
          <button
            onClick={() => onSearch('apple')}
            disabled={isAnimating}
            className="px-3 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700 disabled:bg-gray-400"
          >
            Search Apple
          </button>
        </div>
      </div>
    </div>
  );
};

export default HashTableControls;
