import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code } from 'lucide-react';
import '../../styles/globals.css';

// Explicit IDs will be added to key elements for testing and accessibility
const CodeDisplay = ({ codeLanguage, operation, currentCodeLine, animationStep, currentIteration }) => {
  const [tooltip, setTooltip] = useState({ show: false, content: '', x: 0, y: 0 });

  const codeTemplates = {
    python: {
      addVertex: [
        'def add_vertex(graph, vertex):',
        '    if vertex not in graph:',
        '        graph[vertex] = []',
        '    return graph'
      ],
      addEdge: [
        'def add_edge(graph, vertex1, vertex2, weight=1):',
        '    if vertex1 not in graph:',
        '        graph[vertex1] = []',
        '    if vertex2 not in graph:',
        '        graph[vertex2] = []',
        '    graph[vertex1].append((vertex2, weight))',
        '    graph[vertex2].append((vertex1, weight))',
        '    return graph'
      ],
      dfs: [
        'def dfs(graph, start, visited=None):',
        '    if visited is None:',
        '        visited = set()',
        '    visited.add(start)',
        '    print(start)',
        '    for neighbor, weight in graph[start]:',
        '        if neighbor not in visited:',
        '            dfs(graph, neighbor, visited)',
        '    return visited'
      ],
      bfs: [
        'def bfs(graph, start):',
        '    visited = set()',
        '    queue = [start]',
        '    visited.add(start)',
        '    while queue:',
        '        vertex = queue.pop(0)',
        '        print(vertex)',
        '        for neighbor, weight in graph[vertex]:',
        '            if neighbor not in visited:',
        '                visited.add(neighbor)',
        '                queue.append(neighbor)',
        '    return visited'
      ],
      dijkstra: [
        'def dijkstra(graph, start):',
        '    distances = {vertex: float("infinity") for vertex in graph}',
        '    distances[start] = 0',
        '    priority_queue = [(0, start)]',
        '    while priority_queue:',
        '        current_distance, current_vertex = heappop(priority_queue)',
        '        if current_distance > distances[current_vertex]:',
        '            continue',
        '        for neighbor, weight in graph[current_vertex]:',
        '            distance = current_distance + weight',
        '            if distance < distances[neighbor]:',
        '                distances[neighbor] = distance',
        '                heappush(priority_queue, (distance, neighbor))',
        '    return distances'
      ],
      mst: [
        'def kruskal_mst(graph):',
        '    edges = []',
        '    for vertex in graph:',
        '        for neighbor, weight in graph[vertex]:',
        '            if vertex < neighbor:  # avoid duplicates',
        '                edges.append((weight, vertex, neighbor))',
        '    edges.sort()',
        '    parent = {vertex: vertex for vertex in graph}',
        '    mst = []',
        '    for weight, u, v in edges:',
        '        if find(parent, u) != find(parent, v):',
        '            mst.append((u, v, weight))',
        '            union(parent, u, v)',
        '    return mst'
      ]
    },
    java: {
      addVertex: [
        'public void addVertex(String vertex) {',
        '    if (!adjacencyList.containsKey(vertex)) {',
        '        adjacencyList.put(vertex, new ArrayList<>());',
        '    }',
        '}'
      ],
      addEdge: [
        'public void addEdge(String vertex1, String vertex2, int weight) {',
        '    addVertex(vertex1);',
        '    addVertex(vertex2);',
        '    adjacencyList.get(vertex1).add(new Edge(vertex2, weight));',
        '    adjacencyList.get(vertex2).add(new Edge(vertex1, weight));',
        '}'
      ],
      dfs: [
        'public void dfs(String start) {',
        '    Set<String> visited = new HashSet<>();',
        '    dfsHelper(start, visited);',
        '}',
        '',
        'private void dfsHelper(String vertex, Set<String> visited) {',
        '    visited.add(vertex);',
        '    System.out.println(vertex);',
        '    for (Edge edge : adjacencyList.get(vertex)) {',
        '        if (!visited.contains(edge.destination)) {',
        '            dfsHelper(edge.destination, visited);',
        '        }',
        '    }',
        '}'
      ],
      bfs: [
        'public void bfs(String start) {',
        '    Set<String> visited = new HashSet<>();',
        '    Queue<String> queue = new LinkedList<>();',
        '    visited.add(start);',
        '    queue.offer(start);',
        '    while (!queue.isEmpty()) {',
        '        String vertex = queue.poll();',
        '        System.out.println(vertex);',
        '        for (Edge edge : adjacencyList.get(vertex)) {',
        '            if (!visited.contains(edge.destination)) {',
        '                visited.add(edge.destination);',
        '                queue.offer(edge.destination);',
        '            }',
        '        }',
        '    }',
        '}'
      ],
      dijkstra: [
        'public Map<String, Integer> dijkstra(String start) {',
        '    Map<String, Integer> distances = new HashMap<>();',
        '    PriorityQueue<Node> pq = new PriorityQueue<>();',
        '    for (String vertex : adjacencyList.keySet()) {',
        '        distances.put(vertex, Integer.MAX_VALUE);',
        '    }',
        '    distances.put(start, 0);',
        '    pq.offer(new Node(start, 0));',
        '    while (!pq.isEmpty()) {',
        '        Node current = pq.poll();',
        '        for (Edge edge : adjacencyList.get(current.vertex)) {',
        '            int newDistance = distances.get(current.vertex) + edge.weight;',
        '            if (newDistance < distances.get(edge.destination)) {',
        '                distances.put(edge.destination, newDistance);',
        '                pq.offer(new Node(edge.destination, newDistance));',
        '            }',
        '        }',
        '    }',
        '    return distances;',
        '}'
      ],
      mst: [
        'public List<Edge> kruskalMST() {',
        '    List<Edge> edges = new ArrayList<>();',
        '    for (String vertex : adjacencyList.keySet()) {',
        '        for (Edge edge : adjacencyList.get(vertex)) {',
        '            if (vertex.compareTo(edge.destination) < 0) {',
        '                edges.add(new Edge(vertex, edge.destination, edge.weight));',
        '            }',
        '        }',
        '    }',
        '    Collections.sort(edges);',
        '    UnionFind uf = new UnionFind(adjacencyList.keySet());',
        '    List<Edge> mst = new ArrayList<>();',
        '    for (Edge edge : edges) {',
        '        if (uf.find(edge.source) != uf.find(edge.destination)) {',
        '            mst.add(edge);',
        '            uf.union(edge.source, edge.destination);',
        '        }',
        '    }',
        '    return mst;',
        '}'
      ]
    },
    c: {
      addVertex: [
        'void addVertex(Graph* graph, int vertex) {',
        '    if (graph->numVertices < MAX_VERTICES) {',
        '        graph->vertices[graph->numVertices] = vertex;',
        '        graph->numVertices++;',
        '    }',
        '}'
      ],
      addEdge: [
        'void addEdge(Graph* graph, int src, int dest, int weight) {',
        '    AdjListNode* newNode = createNode(dest, weight);',
        '    newNode->next = graph->array[src].head;',
        '    graph->array[src].head = newNode;',
        '    ',
        '    newNode = createNode(src, weight);',
        '    newNode->next = graph->array[dest].head;',
        '    graph->array[dest].head = newNode;',
        '}'
      ],
      dfs: [
        'void dfs(Graph* graph, int vertex, bool visited[]) {',
        '    visited[vertex] = true;',
        '    printf("%d ", vertex);',
        '    AdjListNode* temp = graph->array[vertex].head;',
        '    while (temp) {',
        '        int adjVertex = temp->dest;',
        '        if (!visited[adjVertex]) {',
        '            dfs(graph, adjVertex, visited);',
        '        }',
        '        temp = temp->next;',
        '    }',
        '}'
      ],
      bfs: [
        'void bfs(Graph* graph, int startVertex) {',
        '    bool visited[MAX_VERTICES] = {false};',
        '    Queue* queue = createQueue();',
        '    visited[startVertex] = true;',
        '    enqueue(queue, startVertex);',
        '    while (!isEmpty(queue)) {',
        '        int currentVertex = dequeue(queue);',
        '        printf("%d ", currentVertex);',
        '        AdjListNode* temp = graph->array[currentVertex].head;',
        '        while (temp) {',
        '            int adjVertex = temp->dest;',
        '            if (!visited[adjVertex]) {',
        '                visited[adjVertex] = true;',
        '                enqueue(queue, adjVertex);',
        '            }',
        '            temp = temp->next;',
        '        }',
        '    }',
        '}'
      ],
      dijkstra: [
        'void dijkstra(Graph* graph, int src) {',
        '    int dist[MAX_VERTICES];',
        '    bool sptSet[MAX_VERTICES];',
        '    for (int i = 0; i < graph->numVertices; i++) {',
        '        dist[i] = INT_MAX;',
        '        sptSet[i] = false;',
        '    }',
        '    dist[src] = 0;',
        '    for (int count = 0; count < graph->numVertices - 1; count++) {',
        '        int u = minDistance(dist, sptSet, graph->numVertices);',
        '        sptSet[u] = true;',
        '        AdjListNode* temp = graph->array[u].head;',
        '        while (temp) {',
        '            int v = temp->dest;',
        '            if (!sptSet[v] && dist[u] + temp->weight < dist[v]) {',
        '                dist[v] = dist[u] + temp->weight;',
        '            }',
        '            temp = temp->next;',
        '        }',
        '    }',
        '}'
      ],
      mst: [
        'void kruskalMST(Graph* graph) {',
        '    Edge edges[MAX_EDGES];',
        '    int edgeCount = 0;',
        '    for (int v = 0; v < graph->numVertices; v++) {',
        '        AdjListNode* temp = graph->array[v].head;',
        '        while (temp) {',
        '            if (v < temp->dest) {',
        '                edges[edgeCount].src = v;',
        '                edges[edgeCount].dest = temp->dest;',
        '                edges[edgeCount].weight = temp->weight;',
        '                edgeCount++;',
        '            }',
        '            temp = temp->next;',
        '        }',
        '    }',
        '    qsort(edges, edgeCount, sizeof(Edge), compare);',
        '    int parent[MAX_VERTICES];',
        '    for (int i = 0; i < graph->numVertices; i++) {',
        '        parent[i] = i;',
        '    }',
        '    for (int i = 0; i < edgeCount; i++) {',
        '        if (find(parent, edges[i].src) != find(parent, edges[i].dest)) {',
        '            printf("Edge: %d - %d, Weight: %d\\n", edges[i].src, edges[i].dest, edges[i].weight);',
        '            unionSets(parent, edges[i].src, edges[i].dest);',
        '        }',
        '    }',
        '}'
      ]
    }
  };

  const codeExplanations = {
    addVertex: {
      0: 'Define add vertex function',
      1: 'Check if vertex already exists',
      2: 'Initialize empty adjacency list for new vertex',
      3: 'Return updated graph'
    },
    addEdge: {
      0: 'Define add edge function with weight',
      1: 'Ensure first vertex exists in graph',
      2: 'Ensure second vertex exists in graph',
      3: 'Add edge from vertex1 to vertex2',
      4: 'Add edge from vertex2 to vertex1 (undirected)',
      5: 'Return updated graph'
    },
    dfs: {
      0: 'Define depth-first search function',
      1: 'Initialize visited set if not provided',
      2: 'Mark current vertex as visited',
      3: 'Process current vertex',
      4: 'Iterate through all neighbors',
      5: 'Recursively visit unvisited neighbors',
      6: 'Return visited set'
    },
    bfs: {
      0: 'Define breadth-first search function',
      1: 'Initialize visited set',
      2: 'Initialize queue with start vertex',
      3: 'Mark start vertex as visited',
      4: 'Continue while queue is not empty',
      5: 'Dequeue vertex from front',
      6: 'Process current vertex',
      7: 'Check all neighbors',
      8: 'Add unvisited neighbors to queue'
    },
    dijkstra: {
      0: 'Define Dijkstra shortest path function',
      1: 'Initialize distances to infinity',
      2: 'Set start vertex distance to 0',
      3: 'Initialize priority queue',
      4: 'Continue while queue is not empty',
      5: 'Extract vertex with minimum distance',
      6: 'Skip if already processed',
      7: 'Check all neighbors',
      8: 'Calculate new distance through current vertex',
      9: 'Update distance if shorter path found',
      10: 'Add neighbor to priority queue'
    },
    mst: {
      0: 'Define Kruskal MST function',
      1: 'Extract all edges from graph',
      2: 'Sort edges by weight',
      3: 'Initialize Union-Find structure',
      4: 'Initialize MST edge list',
      5: 'Process edges in order',
      6: 'Check if edge creates cycle',
      7: 'Add edge to MST if no cycle',
      8: 'Union the components'
    }
  };

  const showTooltip = (content, event) => {
    setTooltip({ show: true, content, x: event.clientX + 10, y: event.clientY - 10 });
  };

  const hideTooltip = () => setTooltip({ show: false, content: '', x: 0, y: 0 });

  const lines = (codeTemplates[codeLanguage] && codeTemplates[codeLanguage][operation]) || ['// Code not available'];

  return (
    <div id="graph-codedisplay" className="col-span-3 flex flex-col glass-card p-4 h-full" role="region" aria-labelledby="graph-code-title">
      <h3 id="graph-code-title" className="text-lg font-bold text-white flex items-center gap-2">
        <Code className="w-5 h-5 text-cyan-400" />
        <span id="graph-code-language">Code ({codeLanguage.toUpperCase()})</span>
      </h3>

      <div id="graph-code-box" className="bg-gray-900/90 rounded-lg p-4 font-mono text-sm flex-1 overflow-auto scrollbar-thin">
        {lines.map((line, index) => (
          <motion.div
            id={`graph-code-line-${index}`}
            key={index}
            className={`py-1 px-2 rounded transition-all duration-300 ${currentCodeLine === index ? 'bg-cyan-500/30 border-l-4 border-cyan-400 text-cyan-100' : 'text-gray-300'}`}
            animate={{ scale: currentCodeLine === index ? 1.02 : 1, x: currentCodeLine === index ? 8 : 0 }}
            onMouseEnter={(e) => showTooltip(codeExplanations[operation]?.[index] || 'Code explanation', e)}
            onMouseLeave={hideTooltip}
          >
            <span id={`graph-code-line-num-${index}`} className="text-gray-500 mr-3 w-6 inline-block text-right">{index + 1}</span>
            <span id={`graph-code-line-text-${index}`}>{line}</span>
          </motion.div>
        ))}
      </div>

      {tooltip.show && (
        <motion.div
          id="graph-code-tooltip"
          className="fixed bg-gray-800/90 text-white text-sm p-2 rounded shadow-lg z-50"
          style={{ top: tooltip.y, left: tooltip.x }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {tooltip.content}
        </motion.div>
      )}

      <div id="graph-code-status" className="mt-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
        <div id="graph-code-current-step" className="text-sm text-gray-300 mb-1">Current Step:</div>
        <div id="graph-code-animation-step" className="text-cyan-300 font-medium">{animationStep}</div>
        {typeof currentIteration === 'number' && currentIteration >= 0 && (
          <div id="graph-code-iteration" className="text-xs text-gray-400 mt-1">Iteration: {currentIteration + 1}</div>
        )}
      </div>
    </div>
  );
};

export default CodeDisplay;
