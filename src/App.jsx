import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import DSAModulesPage from './pages/DSAModulesPage';
import './styles/globals.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/modules" element={<DSAModulesPage />} />
        {/* Future routes for individual modules will go here */}
        {/* <Route path="/modules/:moduleId" element={<ModuleDetailPage />} /> */}
        {/* <Route path="/modules/:moduleId/:operation" element={<VisualizerPage />} /> */}
      </Routes>
    </div>
  );
}

export default App;
