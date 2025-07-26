import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import DSAModulesPage from './pages/DSAModulesPage';
import ArrayInfoPage from './pages/ArrayInfoPage';
import ArrayVisualizerPage from './pages/ArrayVisualizerPage';
import LinkedListInfoPage from './pages/LinkedListInfoPage';
import StackInfoPage from './pages/StackInfoPage';
import QueueInfoPage from './pages/QueueInfoPage';
import TreeInfoPage from './pages/TreeInfoPage';
import GraphInfoPage from './pages/GraphInfoPage';
import HashTableInfoPage from './pages/HashTableInfoPage';
import HeapInfoPage from './pages/HeapInfoPage';
import TrieInfoPage from './pages/TrieInfoPage';
import SortingInfoPage from './pages/SortingInfoPage';
import SearchingInfoPage from './pages/SearchingInfoPage';
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
