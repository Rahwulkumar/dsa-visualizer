import { AnimationController } from '../../utils/AnimationController';

export class GraphLogic {
  constructor() {
    this.graph = {
      vertices: [],
      edges: []
    };
    this.animationController = new AnimationController();
    this.isAnimating = false;
    this.currentOperation = null;
    this.elementStates = {};
    this.currentOperationState = {};
  }

  // Initialize with a sample graph
  initializeGraph(maxVertices = 6) {
    const vertices = [];
    const edges = [];
    
    // Create vertices (A, B, C, D, E, F)
    const vertexNames = ['A', 'B', 'C', 'D', 'E', 'F'];
    const numVertices = Math.min(maxVertices, 6);
    
    for (let i = 0; i < numVertices; i++) {
      vertices.push(vertexNames[i]);
    }
    
    // Create some random edges with weights
    if (vertices.length >= 2) {
      edges.push({ from: 'A', to: 'B', weight: 4 });
      edges.push({ from: 'A', to: 'C', weight: 2 });
      
      if (vertices.length >= 4) {
        edges.push({ from: 'B', to: 'D', weight: 5 });
        edges.push({ from: 'C', to: 'D', weight: 8 });
        edges.push({ from: 'C', to: 'B', weight: 1 });
      }
      
      if (vertices.length >= 5) {
        edges.push({ from: 'D', to: 'E', weight: 6 });
        edges.push({ from: 'A', to: 'E', weight: 9 });
      }
      
      if (vertices.length >= 6) {
        edges.push({ from: 'E', to: 'F', weight: 3 });
        edges.push({ from: 'B', to: 'F', weight: 7 });
      }
    }
    
    this.graph = { vertices, edges };
    this.resetStates();
    return this.graph;
  }

  // Reset all states
  resetStates() {
    this.elementStates = {};
    this.currentOperationState = {};
    this.isAnimating = false;
    this.animationController.reset();
  }

  // Add vertex operation
  async addVertex(vertexName, onUpdate) {
    if (this.graph.vertices.includes(vertexName)) {
      throw new Error('Vertex already exists');
    }

    this.isAnimating = true;
    this.currentOperation = 'addVertex';
    this.currentOperationState = {
      message: `Adding vertex "${vertexName}"`,
      details: 'Checking if vertex exists and adding to graph'
    };

    const steps = [
      {
        action: () => {
          this.elementStates[vertexName] = 'adding';
          this.currentOperationState.message = `Adding vertex "${vertexName}" to graph`;
        },
        duration: 1000
      },
      {
        action: () => {
          this.graph.vertices.push(vertexName);
          this.elementStates[vertexName] = 'added';
          this.currentOperationState.message = `Vertex "${vertexName}" added successfully`;
        },
        duration: 1000
      },
      {
        action: () => {
          delete this.elementStates[vertexName];
          this.currentOperationState = {};
          this.isAnimating = false;
        },
        duration: 500
      }
    ];

    await this.animationController.executeSteps(steps, onUpdate);
  }

  // Add edge operation
  async addEdge(from, to, weight, onUpdate) {
    if (!this.graph.vertices.includes(from) || !this.graph.vertices.includes(to)) {
      throw new Error('Both vertices must exist');
    }

    // Check if edge already exists
    const existingEdge = this.graph.edges.find(edge => 
      edge.from === from && edge.to === to
    );
    if (existingEdge) {
      throw new Error('Edge already exists');
    }

    this.isAnimating = true;
    this.currentOperation = 'addEdge';
    this.currentOperationState = {
      message: `Adding edge from "${from}" to "${to}"`,
      details: `Weight: ${weight}`
    };

    const steps = [
      {
        action: () => {
          this.elementStates[from] = 'connecting';
          this.elementStates[to] = 'connecting';
          this.currentOperationState.message = `Highlighting vertices "${from}" and "${to}"`;
        },
        duration: 1000
      },
      {
        action: () => {
          this.graph.edges.push({ from, to, weight: parseInt(weight) });
          this.currentOperationState.currentEdge = { from, to };
          this.currentOperationState.message = `Edge added with weight ${weight}`;
        },
        duration: 1500
      },
      {
        action: () => {
          delete this.elementStates[from];
          delete this.elementStates[to];
          delete this.currentOperationState.currentEdge;
          this.currentOperationState = {};
          this.isAnimating = false;
        },
        duration: 500
      }
    ];

    await this.animationController.executeSteps(steps, onUpdate);
  }

  // Depth-First Search
  async dfs(startVertex, onUpdate) {
    if (!this.graph.vertices.includes(startVertex)) {
      throw new Error('Start vertex does not exist');
    }

    this.isAnimating = true;
    this.currentOperation = 'dfs';
    
    const visited = new Set();
    const stack = [startVertex];
    const visitOrder = [];

    this.currentOperationState = {
      message: 'Starting Depth-First Search',
      details: `Starting from vertex "${startVertex}"`,
      visitedVertices: [],
      currentVertex: null
    };

    const steps = [];

    while (stack.length > 0) {
      const current = stack.pop();
      
      if (!visited.has(current)) {
        visited.add(current);
        visitOrder.push(current);

        // Step to visit current vertex
        steps.push({
          action: () => {
            this.currentOperationState.currentVertex = current;
            this.currentOperationState.visitedVertices = [...visitOrder];
            this.elementStates[current] = 'traversing';
            this.currentOperationState.message = `Visiting vertex "${current}"`;
            this.currentOperationState.details = `Visited order: ${visitOrder.join(' → ')}`;
          },
          duration: 1500
        });

        // Find neighbors and add to stack
        const neighbors = this.graph.edges
          .filter(edge => edge.from === current)
          .map(edge => edge.to)
          .filter(neighbor => !visited.has(neighbor));

        if (neighbors.length > 0) {
          steps.push({
            action: () => {
              neighbors.forEach(neighbor => {
                if (!stack.includes(neighbor)) {
                  stack.push(neighbor);
                }
              });
              this.currentOperationState.message = `Adding neighbors to stack: ${neighbors.join(', ')}`;
              this.currentOperationState.details = `Stack: [${stack.join(', ')}]`;
            },
            duration: 1000
          });
        }
      }
    }

    // Final step
    steps.push({
      action: () => {
        this.currentOperationState.message = 'DFS traversal completed';
        this.currentOperationState.details = `Final order: ${visitOrder.join(' → ')}`;
        this.currentOperationState.currentVertex = null;
      },
      duration: 2000
    });

    steps.push({
      action: () => {
        this.resetStates();
      },
      duration: 500
    });

    await this.animationController.executeSteps(steps, onUpdate);
  }

  // Breadth-First Search
  async bfs(startVertex, onUpdate) {
    if (!this.graph.vertices.includes(startVertex)) {
      throw new Error('Start vertex does not exist');
    }

    this.isAnimating = true;
    this.currentOperation = 'bfs';
    
    const visited = new Set();
    const queue = [startVertex];
    const visitOrder = [];

    this.currentOperationState = {
      message: 'Starting Breadth-First Search',
      details: `Starting from vertex "${startVertex}"`,
      visitedVertices: [],
      currentVertex: null
    };

    const steps = [];

    while (queue.length > 0) {
      const current = queue.shift();
      
      if (!visited.has(current)) {
        visited.add(current);
        visitOrder.push(current);

        // Step to visit current vertex
        steps.push({
          action: () => {
            this.currentOperationState.currentVertex = current;
            this.currentOperationState.visitedVertices = [...visitOrder];
            this.elementStates[current] = 'traversing';
            this.currentOperationState.message = `Visiting vertex "${current}"`;
            this.currentOperationState.details = `Visited order: ${visitOrder.join(' → ')}`;
          },
          duration: 1500
        });

        // Find neighbors and add to queue
        const neighbors = this.graph.edges
          .filter(edge => edge.from === current)
          .map(edge => edge.to)
          .filter(neighbor => !visited.has(neighbor) && !queue.includes(neighbor));

        if (neighbors.length > 0) {
          steps.push({
            action: () => {
              neighbors.forEach(neighbor => queue.push(neighbor));
              this.currentOperationState.message = `Adding neighbors to queue: ${neighbors.join(', ')}`;
              this.currentOperationState.details = `Queue: [${queue.join(', ')}]`;
            },
            duration: 1000
          });
        }
      }
    }

    // Final step
    steps.push({
      action: () => {
        this.currentOperationState.message = 'BFS traversal completed';
        this.currentOperationState.details = `Final order: ${visitOrder.join(' → ')}`;
        this.currentOperationState.currentVertex = null;
      },
      duration: 2000
    });

    steps.push({
      action: () => {
        this.resetStates();
      },
      duration: 500
    });

    await this.animationController.executeSteps(steps, onUpdate);
  }

  // Dijkstra's Algorithm (simplified)
  async dijkstra(startVertex, onUpdate) {
    if (!this.graph.vertices.includes(startVertex)) {
      throw new Error('Start vertex does not exist');
    }

    this.isAnimating = true;
    this.currentOperation = 'dijkstra';
    
    const distances = {};
    const visited = new Set();
    const previous = {};
    
    // Initialize distances
    this.graph.vertices.forEach(vertex => {
      distances[vertex] = vertex === startVertex ? 0 : Infinity;
      previous[vertex] = null;
    });

    this.currentOperationState = {
      message: 'Starting Dijkstra\'s Algorithm',
      details: `Finding shortest paths from "${startVertex}"`,
      visitedVertices: [],
      currentVertex: null
    };

    const steps = [];

    while (visited.size < this.graph.vertices.length) {
      // Find unvisited vertex with minimum distance
      let minVertex = null;
      let minDistance = Infinity;
      
      for (const vertex of this.graph.vertices) {
        if (!visited.has(vertex) && distances[vertex] < minDistance) {
          minDistance = distances[vertex];
          minVertex = vertex;
        }
      }

      if (minVertex === null) break;

      visited.add(minVertex);

      steps.push({
        action: () => {
          this.currentOperationState.currentVertex = minVertex;
          this.currentOperationState.visitedVertices = Array.from(visited);
          this.elementStates[minVertex] = 'searching';
          this.currentOperationState.message = `Processing vertex "${minVertex}"`;
          this.currentOperationState.details = `Distance from ${startVertex}: ${distances[minVertex]}`;
        },
        duration: 1500
      });

      // Update distances to neighbors
      const neighbors = this.graph.edges.filter(edge => edge.from === minVertex);
      
      for (const edge of neighbors) {
        const neighbor = edge.to;
        const newDistance = distances[minVertex] + edge.weight;
        
        if (newDistance < distances[neighbor]) {
          distances[neighbor] = newDistance;
          previous[neighbor] = minVertex;
          
          steps.push({
            action: () => {
              this.currentOperationState.message = `Updating distance to "${neighbor}"`;
              this.currentOperationState.details = `New distance: ${newDistance} (via ${minVertex})`;
              this.currentOperationState.currentEdge = edge;
            },
            duration: 1000
          });
        }
      }
    }

    // Final step
    steps.push({
      action: () => {
        this.currentOperationState.message = 'Dijkstra\'s algorithm completed';
        this.currentOperationState.details = 'Shortest paths calculated';
        this.currentOperationState.currentVertex = null;
        delete this.currentOperationState.currentEdge;
      },
      duration: 2000
    });

    steps.push({
      action: () => {
        this.resetStates();
      },
      duration: 500
    });

    await this.animationController.executeSteps(steps, onUpdate);
  }

  // Minimum Spanning Tree (Kruskal's Algorithm - simplified)
  async mst(onUpdate) {
    if (this.graph.edges.length === 0) {
      throw new Error('Graph has no edges');
    }

    this.isAnimating = true;
    this.currentOperation = 'mst';
    
    // Sort edges by weight
    const sortedEdges = [...this.graph.edges].sort((a, b) => a.weight - b.weight);
    const mstEdges = [];
    const components = new Map();
    
    // Initialize components (Union-Find)
    this.graph.vertices.forEach((vertex, index) => {
      components.set(vertex, index);
    });

    this.currentOperationState = {
      message: 'Starting Minimum Spanning Tree (Kruskal\'s)',
      details: 'Sorting edges by weight',
      mstEdges: [],
      currentEdge: null
    };

    const steps = [];

    for (const edge of sortedEdges) {
      steps.push({
        action: () => {
          this.currentOperationState.currentEdge = edge;
          this.currentOperationState.message = `Examining edge ${edge.from} → ${edge.to}`;
          this.currentOperationState.details = `Weight: ${edge.weight}`;
        },
        duration: 1000
      });

      // Check if edge creates cycle (simplified)
      const fromComponent = components.get(edge.from);
      const toComponent = components.get(edge.to);
      
      if (fromComponent !== toComponent) {
        mstEdges.push(edge);
        
        // Union components
        this.graph.vertices.forEach(vertex => {
          if (components.get(vertex) === toComponent) {
            components.set(vertex, fromComponent);
          }
        });

        steps.push({
          action: () => {
            this.currentOperationState.mstEdges = [...mstEdges];
            this.currentOperationState.message = `Added edge ${edge.from} → ${edge.to} to MST`;
            this.currentOperationState.details = `MST edges: ${mstEdges.length}/${this.graph.vertices.length - 1}`;
          },
          duration: 1500
        });

        if (mstEdges.length === this.graph.vertices.length - 1) {
          break;
        }
      } else {
        steps.push({
          action: () => {
            this.currentOperationState.message = `Rejected edge ${edge.from} → ${edge.to}`;
            this.currentOperationState.details = 'Would create a cycle';
          },
          duration: 1000
        });
      }
    }

    // Final step
    steps.push({
      action: () => {
        this.currentOperationState.message = 'Minimum Spanning Tree completed';
        this.currentOperationState.details = `Total MST weight: ${mstEdges.reduce((sum, edge) => sum + edge.weight, 0)}`;
        delete this.currentOperationState.currentEdge;
      },
      duration: 2000
    });

    steps.push({
      action: () => {
        this.resetStates();
      },
      duration: 500
    });

    await this.animationController.executeSteps(steps, onUpdate);
  }

  // Stop animation
  stopAnimation() {
    this.animationController.stop();
    this.isAnimating = false;
    this.resetStates();
  }

  // Pause animation
  pauseAnimation() {
    this.animationController.pause();
  }

  // Resume animation
  resumeAnimation() {
    this.animationController.resume();
  }

  // Get current state
  getState() {
    return {
      graph: this.graph,
      isAnimating: this.isAnimating,
      elementStates: this.elementStates,
      currentOperationState: this.currentOperationState,
      currentOperation: this.currentOperation
    };
  }
}
