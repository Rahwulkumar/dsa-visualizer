import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Search,
  List,
  Shuffle,
  X,
  Code,
  Zap,
  Network,
  Route,
  GitBranch
} from 'lucide-react';

const GraphControls = ({
  isOpen,
  setIsOpen,
  maxVertices,
  setMaxVertices,
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
  addVertexValue,
  setAddVertexValue,
  addEdgeFrom,
  setAddEdgeFrom,
  addEdgeTo,
  setAddEdgeTo,
  addEdgeWeight,
  setAddEdgeWeight,
  searchVertex,
  setSearchVertex,
  startVertex,
  setStartVertex,
  graph = { vertices: [], edges: [] },
  currentElementIndex = -1,
  elementStates = {}
}) => {
  const operations = [
    { id: 'addVertex', label: 'Add Vertex', icon: Plus, color: 'from-green-500 to-green-600' },
    { id: 'addEdge', label: 'Add Edge', icon: GitBranch, color: 'from-blue-500 to-blue-600' },
    { id: 'dfs', label: 'DFS Traversal', icon: Route, color: 'from-purple-500 to-purple-600' },
    { id: 'bfs', label: 'BFS Traversal', icon: Network, color: 'from-cyan-500 to-cyan-600' },
    { id: 'dijkstra', label: 'Shortest Path', icon: Search, color: 'from-orange-500 to-orange-600' },
    { id: 'mst', label: 'Min Spanning Tree', icon: List, color: 'from-red-500 to-red-600' }
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

  const getPreviewVertexStyle = (vertex, isHighlighted = false) => {
    const state = elementStates[vertex];
    let className = 'bg-gray-800/80 border-gray-600/80 text-white';

    switch (state) {
      case 'adding':
        className = 'bg-green-600/90 border-green-400 text-white shadow-lg shadow-green-500/30';
        break;
      case 'traversing':
        className = 'bg-blue-600/90 border-blue-400 text-white shadow-lg shadow-blue-500/30';
        break;
      case 'searching':
        className = 'bg-cyan-600/90 border-cyan-400 text-white shadow-lg shadow-cyan-500/30';
        break;
      case 'connecting':
        className = 'bg-yellow-600/90 border-yellow-400 text-white shadow-lg shadow-yellow-500/30';
        break;
      default:
        if (isHighlighted) {
          className = 'bg-purple-600/90 border-purple-400 text-purple-50 shadow-lg shadow-purple-500/30';
        }
    }

    return className;
  };

  const handleStart = () => {
    if (operation === 'addVertex') {
      if (!addVertexValue || addVertexValue.trim() === '') {
        alert('Please enter a vertex name');
        return;
      }
      if (graph.vertices.length >= maxVertices) {
        alert('Graph has reached maximum vertices! Cannot add more.');
        return;
      }
      if (graph.vertices.includes(addVertexValue)) {
        alert('Vertex already exists!');
        return;
      }
    }

    if (operation === 'addEdge') {
      if (!addEdgeFrom || !addEdgeTo || addEdgeFrom.trim() === '' || addEdgeTo.trim() === '') {
        alert('Please enter both vertices for the edge');
        return;
      }
      if (!graph.vertices.includes(addEdgeFrom) || !graph.vertices.includes(addEdgeTo)) {
        alert('Both vertices must exist in the graph');
        return;
      }
      const weight = parseInt(addEdgeWeight);
      if (isNaN(weight) || weight <= 0) {
        alert('Please enter a valid positive weight');
        return;
      }
    }

    if (['dfs', 'bfs', 'dijkstra'].includes(operation)) {
      if (!startVertex || startVertex.trim() === '') {
        alert('Please enter a start vertex');
        return;
      }
      if (!graph.vertices.includes(startVertex)) {
        alert('Start vertex must exist in the graph');
        return;
      }
      if (graph.vertices.length === 0) {
        alert('Graph is empty! Cannot traverse.');
        return;
      }
    }

    if (operation === 'mst') {
      if (graph.vertices.length < 2) {
        alert('Need at least 2 vertices for MST');
        return;
      }
      if (graph.edges.length === 0) {
        alert('Need edges for MST');
        return;
      }
    }

    if (onStart) onStart();
    setIsOpen(false);
  };

  const handlePause = () => { if (onPause) onPause(); };
  const handleReset = () => { if (onReset) onReset(); };

  return (
    <>
      <motion.button
        id="graph-controls-toggle"
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

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            id="graph-controls-sidebar"
            className="fixed right-0 top-0 h-full w-[420px] bg-gradient-to-br from-gray-900/80 via-slate-800/80 to-gray-900/80 backdrop-blur-2xl border-l border-white/10 shadow-2xl z-50 overflow-y-auto"
          >
            <div id="graph-controls-content" className="p-6 space-y-8">
              <div id="graph-controls-header" className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg">
                    <Code className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Graph Controls</h2>
                </div>
                <motion.button
                  id="graph-controls-close"
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>

              <div id="graph-preview-section" className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
                    <Network className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">Graph Preview</h3>
                </div>

                <div id="graph-preview" className="bg-black/30 backdrop-blur-xl p-5 rounded-xl border border-white/10 shadow-xl">
                  {graph.vertices.length > 0 ? (
                    <div id="graph-preview-content" className="space-y-4">
                      {/* Vertices */}
                      <div id="graph-preview-vertices" className="space-y-2">
                        <div className="text-purple-300 text-sm font-semibold">Vertices ({graph.vertices.length}):</div>
                        <div className="flex flex-wrap gap-2">
                          {graph.vertices.map((vertex, index) => (
                            <motion.div 
                              id={`graph-preview-vertex-${index}`}
                              key={vertex} 
                              className="flex items-center gap-2"
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.15 }}
                            >
                              <div 
                                id={`graph-preview-vertex-cell-${index}`}
                                className={`w-8 h-8 flex items-center justify-center text-xs font-bold font-mono rounded-full border-2 transition-all duration-300 backdrop-blur-sm ${getPreviewVertexStyle(vertex, currentElementIndex === index)} ${currentElementIndex === index ? 'ring-2 ring-cyan-400/60 scale-110 animate-pulse' : ''}`}>
                                {vertex}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Edges */}
                      <div id="graph-preview-edges" className="space-y-2">
                        <div className="text-cyan-300 text-sm font-semibold">Edges ({graph.edges.length}):</div>
                        <div className="max-h-32 overflow-y-auto space-y-1">
                          {graph.edges.map((edge, index) => (
                            <div id={`graph-preview-edge-${index}`} key={index} className="text-xs bg-gray-800/50 rounded p-2">
                              <span className="text-white">{edge.from} → {edge.to}</span>
                              <span className="text-gray-400 ml-2">(weight: {edge.weight})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div id="graph-preview-empty" className="text-center text-gray-400 py-8">
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
                        <Network className="w-10 h-10 mx-auto mb-3 opacity-50" />
                      </motion.div>
                      <p className="text-sm">Generate a graph to see preview</p>
                    </div>
                  )}
                </div>

                {currentElementIndex >= 0 && (
                  <motion.div id="graph-status" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-center bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-xl py-3 px-4 rounded-xl border border-cyan-500/20">
                    <span className="text-gray-200">
                      <Zap className="w-4 h-4 inline mr-2 text-cyan-400" />
                      Examining vertex <span id="graph-status-index" className="text-cyan-400 font-mono">{currentElementIndex}</span>
                      {elementStates[currentElementIndex] && (
                        <span id="graph-status-state" className="ml-2 text-purple-400 font-medium">({elementStates[currentElementIndex]})</span>
                      )}
                    </span>
                  </motion.div>
                )}
              </div>

              <div id="graph-config-section" className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg">
                    <Settings className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">Graph Configuration</h3>
                </div>

                <div id="graph-size-control" className="bg-black/20 backdrop-blur-xl p-4 rounded-xl border border-white/10">
                  <label className="block text-sm font-medium text-gray-200 mb-3">Max Vertices: <span id="graph-size-value" className="text-cyan-400 font-mono">{maxVertices}</span></label>
                  <input
                    id="graph-size-range"
                    type="range"
                    min="5"
                    max="20"
                    value={maxVertices}
                    onChange={(e) => setMaxVertices(parseInt(e.target.value))}
                    className="w-full h-3 bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg appearance-none cursor-pointer slider"
                    disabled={isAnimating}
                    style={{
                      background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${((maxVertices - 5) / 15) * 100}%, #374151 ${((maxVertices - 5) / 15) * 100}%, #374151 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-2"><span>5</span><span>20</span></div>
                </div>

                <motion.button id="graph-generate" onClick={handleReset} disabled={isAnimating} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full flex items-center justify-center gap-3 px-5 py-4 bg-gradient-to-r from-blue-600/80 to-cyan-600/80 backdrop-blur-xl text-white rounded-xl border border-blue-500/30 hover:from-blue-500/80 hover:to-cyan-500/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg">
                  <Shuffle className="w-5 h-5" />
                  <span className="font-medium">Generate New Graph</span>
                </motion.button>
              </div>

              <div id="graph-language-section" className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-gradient-to-r from-orange-500/20 to-yellow-500/20 rounded-lg">
                    <Code className="w-5 h-5 text-orange-400" />
                  </div>
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-orange-300 to-yellow-300 bg-clip-text text-transparent">Programming Language</h3>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {languages.map((lang) => (
                    <motion.button
                      id={`graph-lang-${lang.id}`}
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

              <div id="graph-operation-section" className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg">
                    <Zap className="w-5 h-5 text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">Operation</h3>
                </div>
                <div className="space-y-3">
                  {operations.map((op) => {
                    const IconComponent = op.icon;
                    return (
                      <motion.button
                        id={`graph-op-${op.id}`}
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

              <div id="graph-params-section" className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg">
                    <Settings className="w-5 h-5 text-indigo-400" />
                  </div>
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">Parameters</h3>
                </div>

                {operation === 'addVertex' && (
                  <div id="graph-param-addVertex" className="bg-black/20 backdrop-blur-xl p-4 rounded-xl border border-white/10">
                    <label className="block text-sm font-medium text-gray-200 mb-3">Vertex Name</label>
                    <input
                      id="graph-addVertex-input"
                      type="text"
                      value={addVertexValue}
                      onChange={(e) => setAddVertexValue(e.target.value)}
                      placeholder="Enter vertex name (e.g., A, 1, Node1)"
                      className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-xl text-white rounded-xl border border-gray-600/50 focus:border-green-500/70 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
                      disabled={isAnimating}
                    />
                  </div>
                )}

                {operation === 'addEdge' && (
                  <div id="graph-param-addEdge" className="bg-black/20 backdrop-blur-xl p-4 rounded-xl border border-white/10 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">From Vertex</label>
                      <input
                        id="graph-addEdge-from-input"
                        type="text"
                        value={addEdgeFrom}
                        onChange={(e) => setAddEdgeFrom(e.target.value)}
                        placeholder="Source vertex"
                        className="w-full px-4 py-2 bg-gray-800/50 backdrop-blur-xl text-white rounded-xl border border-gray-600/50 focus:border-blue-500/70 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        disabled={isAnimating}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">To Vertex</label>
                      <input
                        id="graph-addEdge-to-input"
                        type="text"
                        value={addEdgeTo}
                        onChange={(e) => setAddEdgeTo(e.target.value)}
                        placeholder="Destination vertex"
                        className="w-full px-4 py-2 bg-gray-800/50 backdrop-blur-xl text-white rounded-xl border border-gray-600/50 focus:border-blue-500/70 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        disabled={isAnimating}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">Weight</label>
                      <input
                        id="graph-addEdge-weight-input"
                        type="number"
                        value={addEdgeWeight}
                        onChange={(e) => setAddEdgeWeight(e.target.value)}
                        placeholder="Edge weight"
                        min="1"
                        className="w-full px-4 py-2 bg-gray-800/50 backdrop-blur-xl text-white rounded-xl border border-gray-600/50 focus:border-blue-500/70 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                        disabled={isAnimating}
                      />
                    </div>
                  </div>
                )}

                {['dfs', 'bfs', 'dijkstra'].includes(operation) && (
                  <div id="graph-param-start" className="bg-black/20 backdrop-blur-xl p-4 rounded-xl border border-white/10">
                    <label className="block text-sm font-medium text-gray-200 mb-3">Start Vertex</label>
                    <input
                      id="graph-start-input"
                      type="text"
                      value={startVertex}
                      onChange={(e) => setStartVertex(e.target.value)}
                      placeholder="Enter start vertex"
                      className="w-full px-4 py-3 bg-gray-800/50 backdrop-blur-xl text-white rounded-xl border border-gray-600/50 focus:border-purple-500/70 focus:outline-none focus:ring-2 focus:ring-purple-500/20 transition-all duration-200"
                      disabled={isAnimating}
                    />
                  </div>
                )}
              </div>

              <div id="graph-animation-section" className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg">
                    <Play className="w-5 h-5 text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent">Animation Controls</h3>
                </div>

                <motion.button id="graph-playpause" onClick={isPlaying ? handlePause : handleStart} disabled={isAnimating && !isPlaying} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-600/80 to-emerald-600/80 backdrop-blur-xl text-white rounded-xl border border-green-500/30 hover:from-green-500/80 hover:to-emerald-500/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg">
                  {isPlaying ? (
                    <>
                      <Pause className="w-6 h-6" />
                      <span className="font-medium">Pause Animation</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-6 h-6" />
                      <span className="font-medium">Start Animation</span>
                    </>
                  )}
                </motion.button>

                <div id="graph-speed-control" className="bg-black/20 backdrop-blur-xl p-4 rounded-xl border border-white/10">
                  <label className="block text-sm font-medium text-gray-200 mb-4">Animation Speed</label>
                  <div className="grid grid-cols-2 gap-3">
                    {speedOptions.map((option) => (
                      <motion.button id={`graph-speed-${option.value}`} key={option.value} onClick={() => setSpeed(option.value)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 backdrop-blur-xl border flex items-center justify-center gap-2 ${speed === option.value ? 'bg-gradient-to-r from-yellow-500/80 to-orange-500/80 text-white border-yellow-500/30 shadow-lg' : 'bg-gray-800/50 border-gray-600/50 text-gray-300 hover:bg-gray-700/50 hover:border-gray-500/50'}`} disabled={isAnimating}>
                        <span>{option.icon}</span>
                        <span>{option.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <motion.button id="graph-reset" onClick={handleReset} disabled={isAnimating} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-red-600/80 to-pink-600/80 backdrop-blur-xl text-white rounded-xl border border-red-500/30 hover:from-red-500/80 hover:to-pink-500/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg">
                  <RotateCcw className="w-5 h-5" />
                  <span className="font-medium">Reset & Generate New</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GraphControls;
