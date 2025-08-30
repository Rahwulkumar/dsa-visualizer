import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import DSAModulesPage from './pages/DSAModulesPage';
import ArrayInfoPage from './pages/array/ArrayInfoPage';
import ArrayVisualizerPage from './pages/array/ArrayVisualizerPage';
import LinkedListInfoPage from './pages/linkedlist/LinkedListInfoPage';
import LinkedListVisualizerPage from './pages/linkedlist/LinkedListVisualizerPage';
import StackInfoPage from './pages/stack/StackInfoPage';
import StackVisualizerPage from './pages/stack/StackVisualizerPage';
import QueueInfoPage from './pages/queue/QueueInfoPage';
import QueueVisualizerPage from './pages/queue/QueueVisualizerPage';
import TreeInfoPage from './pages/tree/TreeInfoPage';
import TreeVisualizerPage from './pages/tree/TreeVisualizerPage';
import GraphInfoPage from './pages/graph/GraphInfoPage';
import GraphVisualizerPage from './pages/graph/GraphVisualizerPage';
import HashTableInfoPage from './pages/hashtable/HashTableInfoPage';
import HashTableVisualizerPage from './pages/hashtable/HashTableVisualizerPage';
import HeapInfoPage from './pages/heap/HeapInfoPage';
import TrieInfoPage from './pages/trie/TrieInfoPage';
import SortingInfoPage from './pages/sorting/SortingInfoPage';
import SortingVisualizerPage from './pages/sorting/SortingVisualizerPage';
import SearchingInfoPage from './pages/searching/SearchingInfoPage';
import './styles/globals.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/modules" element={<DSAModulesPage />} />
        <Route path="/array-info" element={<ArrayInfoPage />} />
        <Route path="/array-visualizer" element={<ArrayVisualizerPage />} />
        <Route path="/linked-list-info" element={<LinkedListInfoPage />} />
        <Route path="/linked-list-visualizer" element={<LinkedListVisualizerPage />} />
        <Route path="/stack-info" element={<StackInfoPage />} />
        <Route path="/stack-visualizer" element={<StackVisualizerPage />} />
        <Route path="/queue-info" element={<QueueInfoPage />} />
        <Route path="/queue-visualizer" element={<QueueVisualizerPage />} />
        <Route path="/tree-info" element={<TreeInfoPage />} />
        <Route path="/tree-visualizer" element={<TreeVisualizerPage />} />
        <Route path="/graph-info" element={<GraphInfoPage />} />
        <Route path="/graph-visualizer" element={<GraphVisualizerPage />} />
        <Route path="/hash-table-info" element={<HashTableInfoPage />} />
        <Route path="/hash-table-visualizer" element={<HashTableVisualizerPage />} />
        <Route path="/heap-info" element={<HeapInfoPage />} />
        <Route path="/trie-info" element={<TrieInfoPage />} />
        <Route path="/sorting-info" element={<SortingInfoPage />} />
        <Route path="/sorting-visualizer" element={<SortingVisualizerPage />} />
        <Route path="/searching-info" element={<SearchingInfoPage />} />
      </Routes>
    </div>
  );
}

export default App;
