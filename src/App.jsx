import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import DSAModulesPage from './pages/DSAModulesPage';
import ArrayInfoPage from './pages/array/ArrayInfoPage';
import ArrayVisualizerPage from './pages/array/ArrayVisualizerPage';
import LinkedListInfoPage from './pages/linkedlist/LinkedListInfoPage';
import StackInfoPage from './pages/stack/StackInfoPage';
import QueueInfoPage from './pages/queue/QueueInfoPage';
import TreeInfoPage from './pages/tree/TreeInfoPage';
import GraphInfoPage from './pages/graph/GraphInfoPage';
import HashTableInfoPage from './pages/hashtable/HashTableInfoPage';
import HeapInfoPage from './pages/heap/HeapInfoPage';
import TrieInfoPage from './pages/trie/TrieInfoPage';
import SortingInfoPage from './pages/sorting/SortingInfoPage';
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
        <Route path="/stack-info" element={<StackInfoPage />} />
        <Route path="/queue-info" element={<QueueInfoPage />} />
        <Route path="/tree-info" element={<TreeInfoPage />} />
        <Route path="/graph-info" element={<GraphInfoPage />} />
        <Route path="/hash-table-info" element={<HashTableInfoPage />} />
        <Route path="/heap-info" element={<HeapInfoPage />} />
        <Route path="/trie-info" element={<TrieInfoPage />} />
        <Route path="/sorting-info" element={<SortingInfoPage />} />
        <Route path="/searching-info" element={<SearchingInfoPage />} />
        {/* Future routes for visualizers will go here */}
        {/* <Route path="/linked-list-visualizer" element={<LinkedListVisualizerPage />} /> */}
        {/* <Route path="/stack-visualizer" element={<StackVisualizerPage />} /> */}
      </Routes>
    </div>
  );
}

export default App;
