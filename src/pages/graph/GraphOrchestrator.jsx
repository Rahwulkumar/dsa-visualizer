import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import AnimationController from '../../utils/AnimationController';

const GraphOrchestrator = ({
  operation,
  isPlaying,
  speed,
  addVertexValue,
  addEdgeFrom,
  addEdgeTo,
  addEdgeWeight,
  searchVertex,
  startVertex,
  graph,
  maxVertices,
  setIsAnimating,
  setIsPlaying,
  setGraph,
  setCurrentElementIndex,
  setCurrentMemoryIndex,
  setCurrentCodeLine,
  setElementStates,
  setAnimationStep,
  setCurrentIteration,
  setOperationState,
  onAnimationComplete
}) => {
  // runtime flags
  const isInitialized = useRef(false);
  const runRef = useRef(false);

  // Create one animation controller instance aligned with our API (like StackLogic)
  const animationController = useMemo(() => {
    return new AnimationController({
      setCurrentCodeLine,
      setCurrentElementIndex,
      setCurrentMemoryIndex: setCurrentMemoryIndex || setCurrentElementIndex,
      setElementStates,
      setAnimationStep,
      setCurrentIteration: setCurrentIteration || (() => {})
    }, speed);
  }, [setCurrentCodeLine, setCurrentElementIndex, setCurrentMemoryIndex, setElementStates, setAnimationStep, setCurrentIteration, speed]);

  const generateRandomGraph = useCallback(() => {
    const vertices = [];
    const edges = [];
    const vertexCount = Math.min(Math.max(3, Math.floor(Math.random() * (maxVertices - 2)) + 3), maxVertices);
    for (let i = 0; i < vertexCount; i++) vertices.push(String.fromCharCode(65 + i));
    const edgeCount = Math.min(Math.floor(Math.random() * vertexCount * 2) + vertexCount - 1, (vertexCount * (vertexCount - 1)) / 2);
    const usedEdges = new Set();
    for (let i = 1; i < vertexCount; i++) {
      const from = vertices[Math.floor(Math.random() * i)];
      const to = vertices[i];
      const weight = Math.floor(Math.random() * 20) + 1;
      const key = `${from}-${to}`;
      if (!usedEdges.has(key) && !usedEdges.has(`${to}-${from}`)) {
        edges.push({ from, to, weight });
        usedEdges.add(key);
      }
    }
    while (edges.length < edgeCount) {
      const from = vertices[Math.floor(Math.random() * vertexCount)];
      const to = vertices[Math.floor(Math.random() * vertexCount)];
      if (from !== to) {
        const key = `${from}-${to}`;
        if (!usedEdges.has(key) && !usedEdges.has(`${to}-${from}`)) {
          edges.push({ from, to, weight: Math.floor(Math.random() * 20) + 1 });
          usedEdges.add(key);
        }
      }
    }
    return { vertices, edges };
  }, [maxVertices]);

  useEffect(() => {
    if (!isInitialized.current) {
      setGraph(generateRandomGraph());
      isInitialized.current = true;
    }
  }, [generateRandomGraph, setGraph]);

  const resetGraph = useCallback(() => {
    setGraph(generateRandomGraph());
    setIsAnimating(false);
    setIsPlaying(false);
    setCurrentElementIndex(-1);
    setCurrentMemoryIndex(-1);
    setCurrentCodeLine(-1);
    setElementStates({});
    setAnimationStep('');
    setCurrentIteration(0);
    setOperationState({});
    runRef.current = false;
  }, [generateRandomGraph, setGraph, setIsAnimating, setIsPlaying, setCurrentElementIndex, setCurrentMemoryIndex, setCurrentCodeLine, setElementStates, setAnimationStep, setCurrentIteration, setOperationState]);
  // keep speed synced
  useEffect(() => {
    animationController.setSpeed(speed);
  }, [speed, animationController]);

  // Simple dispatcher examples (for brevity, not all steps shown)
  const finish = useCallback(() => {
    animationController.reset();
    setIsAnimating(false);
    setIsPlaying(false);
    runRef.current = false;
    if (onAnimationComplete) onAnimationComplete();
  }, [animationController, setIsAnimating, setIsPlaying, onAnimationComplete]);

  const executeAddVertex = useCallback(async () => {
    const v = (addVertexValue || '').trim();
    if (!v || graph.vertices.includes(v) || graph.vertices.length >= maxVertices) return;
    setIsAnimating(true);
    animationController.start();
    setOperationState({ message: `Adding vertex ${v}`, currentVertex: v });
    const ok = await animationController.syncStep(0, async () => {}, null, `Prepare to add ${v}`, 0.5);
    if (!ok) return finish();
    const newGraph = { ...graph, vertices: [...graph.vertices, v] };
    await animationController.syncStep(1, async () => setGraph(newGraph), null, `Commit vertex ${v}`, 1);
    finish();
  }, [addVertexValue, graph, maxVertices, setGraph, setIsAnimating, setOperationState, animationController, finish]);

  const executeAddEdge = useCallback(async () => {
    const from = (addEdgeFrom || '').trim();
    const to = (addEdgeTo || '').trim();
    const w = parseInt(addEdgeWeight) || 1;
    if (!from || !to || from === to) return;
    if (!graph.vertices.includes(from) || !graph.vertices.includes(to)) return;
    setIsAnimating(true);
    animationController.start();
    setOperationState({ message: `Connecting ${from} → ${to}`, currentEdge: { from, to } });
    const ok = await animationController.syncStep(0, async () => {}, null, `Prepare edge ${from}→${to}`, 0.5);
    if (!ok) return finish();
    const newGraph = { ...graph, edges: [...graph.edges, { from, to, weight: w }] };
    await animationController.syncStep(1, async () => setGraph(newGraph), null, 'Commit edge', 1);
    finish();
  }, [addEdgeFrom, addEdgeTo, addEdgeWeight, graph, setGraph, setIsAnimating, setOperationState, animationController, finish]);

  const executeDFS = useCallback(async () => {
    const start = (startVertex || '').trim();
    if (!start || !graph.vertices.includes(start)) return;
    setIsAnimating(true);
    animationController.start();
    const visited = new Set();
    const adj = {};
    graph.vertices.forEach(v => (adj[v] = []));
    graph.edges.forEach(e => { adj[e.from].push({ to: e.to, weight: e.weight }); adj[e.to].push({ to: e.from, weight: e.weight }); });
    const order = [];
    const dfs = (v) => { visited.add(v); order.push(v); adj[v].forEach(n => { if (!visited.has(n.to)) dfs(n.to); }); };
    dfs(start);
    for (let i = 0; i < order.length; i++) {
      const v = order[i];
      const ok = await animationController.syncStep(i, async () => setOperationState({ message: `Visit ${v}`, currentVertex: v, visitedVertices: order.slice(0, i + 1) }), null, `Visit ${v}`, 0.6);
      if (!ok) return finish();
    }
    finish();
  }, [graph, setOperationState, setIsAnimating, startVertex, animationController, finish]);

  const executeBFS = useCallback(async () => {
    const start = (startVertex || '').trim();
    if (!start || !graph.vertices.includes(start)) return;
    setIsAnimating(true);
    animationController.start();
    const adj = {};
    graph.vertices.forEach(v => (adj[v] = []));
    graph.edges.forEach(e => { adj[e.from].push({ to: e.to, weight: e.weight }); adj[e.to].push({ to: e.from, weight: e.weight }); });
    const visited = new Set([start]);
    const queue = [start];
    const order = [];
    while (queue.length) {
      const v = queue.shift();
      order.push(v);
      adj[v].forEach(n => { if (!visited.has(n.to)) { visited.add(n.to); queue.push(n.to); } });
    }
    for (let i = 0; i < order.length; i++) {
      const v = order[i];
      const ok = await animationController.syncStep(i, async () => setOperationState({ message: `Visit ${v}`, currentVertex: v, visitedVertices: order.slice(0, i + 1) }), null, `Visit ${v}`, 0.6);
      if (!ok) return finish();
    }
    finish();
  }, [graph, setOperationState, setIsAnimating, startVertex, animationController, finish]);

  // Dispatch based on props (start only once per play)
  useEffect(() => {
    if (!isPlaying || runRef.current) return;
    runRef.current = true;
    (async () => {
      switch (operation) {
        case 'addVertex':
          await executeAddVertex();
          break;
        case 'addEdge':
          await executeAddEdge();
          break;
        case 'dfs':
          await executeDFS();
          break;
        case 'bfs':
          await executeBFS();
          break;
        default:
          setIsAnimating(false);
          setIsPlaying(false);
          runRef.current = false;
      }
    })();
  }, [isPlaying, operation, executeAddVertex, executeAddEdge, executeDFS, executeBFS, setIsAnimating, setIsPlaying]);

  // Handle pause by resetting controller
  useEffect(() => {
    if (!isPlaying) {
      animationController.reset();
      setIsAnimating(false);
      runRef.current = false;
    }
  }, [isPlaying, animationController, setIsAnimating]);

  // Expose reset
  useEffect(() => {
    window.resetGraph = resetGraph;
    return () => { delete window.resetGraph; };
  }, [resetGraph]);

  return null;
};

GraphOrchestrator.propTypes = {
  operation: PropTypes.string.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  speed: PropTypes.number.isRequired,
  addVertexValue: PropTypes.string,
  addEdgeFrom: PropTypes.string,
  addEdgeTo: PropTypes.string,
  addEdgeWeight: PropTypes.string,
  searchVertex: PropTypes.string,
  startVertex: PropTypes.string,
  graph: PropTypes.object.isRequired,
  maxVertices: PropTypes.number.isRequired,
  setIsAnimating: PropTypes.func.isRequired,
  setIsPlaying: PropTypes.func.isRequired,
  setGraph: PropTypes.func.isRequired,
  setCurrentElementIndex: PropTypes.func.isRequired,
  setCurrentMemoryIndex: PropTypes.func.isRequired,
  setCurrentCodeLine: PropTypes.func.isRequired,
  setElementStates: PropTypes.func.isRequired,
  setAnimationStep: PropTypes.func.isRequired,
  setCurrentIteration: PropTypes.func.isRequired,
  setOperationState: PropTypes.func.isRequired,
  onAnimationComplete: PropTypes.func
};

export default GraphOrchestrator;
