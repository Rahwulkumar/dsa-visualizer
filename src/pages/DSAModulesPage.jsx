import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import DSAModulesGrid from '../components/ui/DSAModulesGrid';
import NavigationHeader from '../components/ui/NavigationHeader';
import { theme } from '../theme';

const DSAModulesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-space-deep to-space-dark">
      {/* Navigation Header */}
      <NavigationHeader />
      
      {/* Page Content */}
      <div className="relative pt-24 pb-12">
        {/* Background Particles (Subtle) */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-cyan-400 rounded-full animate-twinkle opacity-30" />
          <div className="absolute top-1/3 right-1/3 w-0.5 h-0.5 bg-blue-400 rounded-full animate-twinkle opacity-20" 
               style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-1/4 left-1/6 w-1 h-1 bg-purple-400 rounded-full animate-twinkle opacity-25" 
               style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 right-1/4 w-0.5 h-0.5 bg-pink-400 rounded-full animate-twinkle opacity-15" 
               style={{ animationDelay: '3s' }} />
        </div>

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 px-4"
        >
          <h1 className="text-4xl md:text-5xl font-bold font-display text-white mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Choose Your
            </span>
            <br />
            <span className="text-white">Learning Path</span>
          </h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            Select a data structure or algorithm to begin your visual learning journey.
            Each module provides interactive visualizations and step-by-step explanations.
          </p>
        </motion.div>

        {/* DSA Modules Grid */}
        <DSAModulesGrid />

        {/* Back to Home Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center mt-12 px-4"
        >
          <motion.button
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="border-2 border-white/30 text-white px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
          >
            ← Back to Home
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default DSAModulesPage;
