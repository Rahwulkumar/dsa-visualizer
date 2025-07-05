import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import SpaceBackground from './3d/SpaceBackground';
import AsteroidField from './3d/AsteroidField';
import FloatingParticles from './3d/FloatingParticles';
import NavigationHeader from './ui/NavigationHeader';
import HeroSection from './ui/HeroSection';
import FeatureShowcase from './ui/FeatureShowcase';
import FooterSection from './ui/FooterSection';
import { theme } from '../theme';

const LandingPage = () => {
  const canvasRef = useRef();
  const controls = useAnimation();

  useEffect(() => {
    // Initialize any startup animations
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: "easeOut" }
    });
  }, [controls]);

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* 3D Space Background */}
      <div className="fixed inset-0 z-0">
        <Canvas
          ref={canvasRef}
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
        
        {/* Hero Section */}
        <HeroSection />
        
        {/* Feature Showcase */}
        <FeatureShowcase />
        
        {/* Footer */}
        <FooterSection />
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

export default LandingPage;
