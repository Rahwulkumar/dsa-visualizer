import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import SpaceBackground from '../components/3d/SpaceBackground';
import AsteroidField from '../components/3d/AsteroidField';
import FloatingParticles from '../components/3d/FloatingParticles';
import DSAModulesGrid from '../components/ui/DSAModulesGrid';
import NavigationHeader from '../components/ui/NavigationHeader';
import { theme } from '../theme';

const DSAModulesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* 3D Space Background */}
      <div className="fixed inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          style={{ background: 'radial-gradient(circle at 30% 20%, #0a0a0f 0%, #000000 100%)' }}
        >
          <ambientLight intensity={0.1} />
          <pointLight position={[10, 10, 10]} intensity={0.5} />
          
          {/* Starfield background */}
          <Stars 
            radius={400} 
            depth={60} 
            count={3000} 
            factor={3} 
            saturation={0} 
            fade={true}
            speed={0.3}
          />
          
          {/* Custom space elements */}
          <SpaceBackground />
          <AsteroidField />
          <FloatingParticles />
          
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            enableRotate={true}
            autoRotate={true}
            autoRotateSpeed={0.2}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
        </Canvas>
      </div>

      {/* Content Layer */}
      <div className="relative z-10">
        {/* Navigation Header */}
        <NavigationHeader />
        
        {/* Page Content */}
        <div className="relative pt-24 pb-12">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 px-4"
          >

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

      {/* Cosmic Dust Overlay */}
      <div className="fixed inset-0 pointer-events-none z-5">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
        
        {/* Floating cosmic dust particles - reduced and more subtle */}
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-blue-400 rounded-full animate-twinkle opacity-30" />
        <div className="absolute top-1/3 right-1/3 w-0.5 h-0.5 bg-purple-400 rounded-full animate-twinkle opacity-20" 
             style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/4 left-1/6 w-1 h-1 bg-cyan-400 rounded-full animate-twinkle opacity-25" 
             style={{ animationDelay: '4s' }} />
        <div className="absolute bottom-1/3 right-1/6 w-0.5 h-0.5 bg-indigo-400 rounded-full animate-twinkle opacity-20" 
             style={{ animationDelay: '6s' }} />
      </div>
    </div>
  );
};

export default DSAModulesPage;
