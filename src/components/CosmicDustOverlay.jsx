import React from 'react';

const CosmicDustOverlay = () => {
  return (
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
      
      {/* Additional cosmic dust particles for more visual richness */}
      <div className="absolute top-1/2 left-1/8 w-0.5 h-0.5 bg-cyan-300 rounded-full animate-twinkle opacity-15" 
           style={{ animationDelay: '1s' }} />
      <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-indigo-300 rounded-full animate-twinkle opacity-20" 
           style={{ animationDelay: '3s' }} />
      <div className="absolute top-1/6 right-1/2 w-0.5 h-0.5 bg-purple-300 rounded-full animate-twinkle opacity-25" 
           style={{ animationDelay: '5s' }} />
    </div>
  );
};

export default CosmicDustOverlay;
