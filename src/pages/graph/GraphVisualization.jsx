import React, { useEffect, useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { Network, GitBranch, Search } from 'lucide-react';

const GraphVisualization = ({
  graph = { vertices: [], edges: [] },
  isAnimating = false,
  currentOperationState = {},
  elementStates = {},
  operation = 'none',
  currentElementIndex = -1
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Constants for graph layout
  const VERTEX_RADIUS = 25;
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;
  const CENTER_X = CANVAS_WIDTH / 2;
  const CENTER_Y = CANVAS_HEIGHT / 2;

  // Color scheme
  const colors = {
    vertex: {
      default: '#374151',
      adding: '#16a34a',
      traversing: '#2563eb',
      searching: '#0891b2',
      connecting: '#eab308',
      current: '#9333ea',
      visited: '#059669',
      unvisited: '#6b7280'
    },
    edge: {
      default: '#6b7280',
      active: '#3b82f6',
      mst: '#10b981',
      path: '#f59e0b'
    },
    text: {
      vertex: '#ffffff',
      edge: '#d1d5db',
      weight: '#9ca3af'
    }
  };

  // Calculate vertex positions in a circle
  const calculateVertexPositions = () => {
    const positions = {};
    const vertexCount = graph.vertices.length;
    
    if (vertexCount === 0) return positions;
    
    if (vertexCount === 1) {
      positions[graph.vertices[0]] = { x: CENTER_X, y: CENTER_Y };
      return positions;
    }

    const radius = Math.min(CENTER_X - 50, CENTER_Y - 50) * 0.7;
    const angleStep = (2 * Math.PI) / vertexCount;
    
    graph.vertices.forEach((vertex, index) => {
      const angle = index * angleStep - Math.PI / 2; // Start from top
      positions[vertex] = {
        x: CENTER_X + radius * Math.cos(angle),
        y: CENTER_Y + radius * Math.sin(angle)
      };
    });
    
    return positions;
  };

  // Get vertex color based on state
  const getVertexColor = (vertex) => {
    const state = elementStates[vertex];
    
    if (currentOperationState.currentVertex === vertex) {
      return colors.vertex.current;
    }
    
    if (currentOperationState.visitedVertices && currentOperationState.visitedVertices.includes(vertex)) {
      return colors.vertex.visited;
    }
    
    switch (state) {
      case 'adding':
        return colors.vertex.adding;
      case 'traversing':
        return colors.vertex.traversing;
      case 'searching':
        return colors.vertex.searching;
      case 'connecting':
        return colors.vertex.connecting;
      default:
        return colors.vertex.default;
    }
  };

  // Get edge color based on state
  const getEdgeColor = (edge) => {
    if (currentOperationState.currentEdge && 
        currentOperationState.currentEdge.from === edge.from && 
        currentOperationState.currentEdge.to === edge.to) {
      return colors.edge.active;
    }
    
    if (currentOperationState.mstEdges && 
        currentOperationState.mstEdges.some(mstEdge => 
          (mstEdge.from === edge.from && mstEdge.to === edge.to) ||
          (mstEdge.from === edge.to && mstEdge.to === edge.from))) {
      return colors.edge.mst;
    }
    
    if (currentOperationState.pathEdges && 
        currentOperationState.pathEdges.some(pathEdge => 
          (pathEdge.from === edge.from && pathEdge.to === edge.to) ||
          (pathEdge.from === edge.to && pathEdge.to === edge.from))) {
      return colors.edge.path;
    }
    
    return colors.edge.default;
  };

  // Draw the graph
  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    if (graph.vertices.length === 0) return;
    
    const positions = calculateVertexPositions();
    
    // Draw edges first (so they appear behind vertices)
    graph.edges.forEach((edge) => {
      const fromPos = positions[edge.from];
      const toPos = positions[edge.to];
      
      if (!fromPos || !toPos) return;
      
      const edgeColor = getEdgeColor(edge);
      
      // Draw edge line
      ctx.beginPath();
      ctx.moveTo(fromPos.x, fromPos.y);
      ctx.lineTo(toPos.x, toPos.y);
      ctx.strokeStyle = edgeColor;
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Draw arrowhead for directed edges
      const angle = Math.atan2(toPos.y - fromPos.y, toPos.x - fromPos.x);
      const arrowLength = 15;
      const arrowWidth = 8;
      
      // Calculate arrow position (at edge of destination vertex)
      const arrowX = toPos.x - VERTEX_RADIUS * Math.cos(angle);
      const arrowY = toPos.y - VERTEX_RADIUS * Math.sin(angle);
      
      ctx.beginPath();
      ctx.moveTo(arrowX, arrowY);
      ctx.lineTo(
        arrowX - arrowLength * Math.cos(angle - arrowWidth),
        arrowY - arrowLength * Math.sin(angle - arrowWidth)
      );
      ctx.lineTo(
        arrowX - arrowLength * Math.cos(angle + arrowWidth),
        arrowY - arrowLength * Math.sin(angle + arrowWidth)
      );
      ctx.closePath();
      ctx.fillStyle = edgeColor;
      ctx.fill();
      
      // Draw weight
      const midX = (fromPos.x + toPos.x) / 2;
      const midY = (fromPos.y + toPos.y) / 2;
      
      // Background for weight text
      const text = edge.weight.toString();
      const textMetrics = ctx.measureText(text);
      const textWidth = textMetrics.width;
      const textHeight = 16;
      
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(
        midX - textWidth / 2 - 4,
        midY - textHeight / 2 - 2,
        textWidth + 8,
        textHeight + 4
      );
      
      // Weight text
      ctx.fillStyle = colors.text.weight;
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, midX, midY);
    });
    
    // Draw vertices
    graph.vertices.forEach((vertex) => {
      const pos = positions[vertex];
      if (!pos) return;
      
      const vertexColor = getVertexColor(vertex);
      
      // Draw vertex circle with glow effect if current
      if (currentOperationState.currentVertex === vertex) {
        ctx.shadowColor = colors.vertex.current;
        ctx.shadowBlur = 20;
      } else {
        ctx.shadowBlur = 0;
      }
      
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, VERTEX_RADIUS, 0, 2 * Math.PI);
      ctx.fillStyle = vertexColor;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      ctx.shadowBlur = 0; // Reset shadow
      
      // Draw vertex label
      ctx.fillStyle = colors.text.vertex;
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(vertex, pos.x, pos.y);
    });
  };

  // Update canvas when props change
  useEffect(() => {
    drawGraph();
  }, [graph, elementStates, currentOperationState, operation, currentElementIndex]);

  // Handle canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const container = containerRef.current;
    if (!container) return;
    
    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;
      drawGraph();
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const getOperationTitle = () => {
    switch (operation) {
      case 'addVertex': return 'Adding Vertex';
      case 'addEdge': return 'Adding Edge';
      case 'dfs': return 'Depth-First Search';
      case 'bfs': return 'Breadth-First Search';
      case 'dijkstra': return 'Dijkstra\'s Algorithm';
      case 'mst': return 'Minimum Spanning Tree';
      default: return 'Graph Visualization';
    }
  };

  const getOperationIcon = () => {
    switch (operation) {
      case 'addVertex':
      case 'addEdge':
        return GitBranch;
      case 'dfs':
      case 'bfs':
      case 'dijkstra':
        return Search;
      default:
        return Network;
    }
  };

  const OperationIcon = getOperationIcon();

  return (
    <div id="graph-visualization" className="relative w-full h-full" ref={containerRef}>
      {/* Header */}
      <motion.div 
        id="graph-visualization-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-6 left-6 z-10 bg-black/40 backdrop-blur-xl rounded-xl p-4 border border-white/10"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg">
            <OperationIcon className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 id="graph-visualization-title" className="text-lg font-semibold text-white">
              {getOperationTitle()}
            </h3>
            <p id="graph-visualization-subtitle" className="text-sm text-gray-300">
              Vertices: {graph.vertices.length} | Edges: {graph.edges.length}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Operation Status */}
      <AnimatePresence>
        {isAnimating && currentOperationState.message && (
          <motion.div
            id="graph-operation-status"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute top-6 right-6 z-10 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-xl rounded-xl p-4 border border-cyan-500/30 max-w-xs"
          >
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-cyan-500/20 rounded-lg flex-shrink-0">
                <Network className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <p id="graph-operation-message" className="text-sm text-white font-medium">
                  {currentOperationState.message}
                </p>
                {currentOperationState.details && (
                  <p id="graph-operation-details" className="text-xs text-gray-300 mt-1">
                    {currentOperationState.details}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Canvas */}
      <div id="graph-canvas-container" className="flex items-center justify-center w-full h-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-6"
        >
          <canvas
            id="graph-canvas"
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="rounded-xl bg-gradient-to-br from-gray-900/50 to-gray-800/50"
            style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
          />
        </motion.div>
      </div>

      {/* Legend */}
      <motion.div
        id="graph-legend"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute bottom-6 left-6 z-10 bg-black/40 backdrop-blur-xl rounded-xl p-4 border border-white/10"
      >
        <h4 className="text-sm font-semibold text-white mb-3">Legend</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gray-600 border border-white"></div>
            <span className="text-gray-300">Default Vertex</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-purple-600 border border-white shadow-lg shadow-purple-500/30"></div>
            <span className="text-gray-300">Current Vertex</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-600 border border-white"></div>
            <span className="text-gray-300">Visited Vertex</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-1 bg-gray-500"></div>
            <span className="text-gray-300">Default Edge</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-1 bg-blue-500"></div>
            <span className="text-gray-300">Active Edge</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-1 bg-orange-500"></div>
            <span className="text-gray-300">Path Edge</span>
          </div>
        </div>
      </motion.div>

      {/* Empty State */}
      {graph.vertices.length === 0 && (
        <motion.div
          id="graph-empty-state"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              className="mx-auto mb-4"
            >
              <Network className="w-16 h-16 text-gray-500" />
            </motion.div>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">Empty Graph</h3>
            <p className="text-gray-500 text-sm max-w-md">
              Generate a graph or add vertices to get started with the visualization
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default GraphVisualization;
