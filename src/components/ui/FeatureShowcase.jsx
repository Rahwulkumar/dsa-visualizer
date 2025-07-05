import React from 'react';
import { motion } from 'framer-motion';
import { theme } from '../../theme';

const FeatureShowcase = () => {
  const features = [
    {
      id: 'memory-visualization',
      title: 'Memory Visualization',
      description: 'See exactly how data structures interact with RAM, stack, and heap memory in real-time.',
      icon: '🧠',
      image: '/api/placeholder/400/300',
      highlights: ['Stack vs Heap', 'Pointer Visualization', 'Memory Allocation', 'Garbage Collection']
    },
    {
      id: 'step-by-step',
      title: 'Step-by-Step Execution',
      description: 'Watch algorithms execute line by line with synchronized code highlighting and visual updates.',
      icon: '⚡',
      image: '/api/placeholder/400/300',
      highlights: ['Code Highlighting', 'Execution Timeline', 'Interactive Controls', 'Pause & Resume']
    },
    {
      id: 'interactive-learning',
      title: 'Interactive Learning',
      description: 'Manipulate data structures directly and observe the immediate effects on performance and memory.',
      icon: '🎮',
      image: '/api/placeholder/400/300',
      highlights: ['Direct Manipulation', 'Real-time Feedback', 'Performance Metrics', 'Custom Input']
    }
  ];

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-display text-white mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Advanced
            </span>
            <br />
            <span className="text-white">Features</span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            Experience learning like never before with our cutting-edge visualization technology 
            that makes complex algorithms intuitive and engaging.
          </p>
        </motion.div>

        {/* Features */}
        <div className="space-y-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}
            >
              {/* Feature Content */}
              <div className="flex-1 space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">{feature.icon}</div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white">
                    {feature.title}
                  </h3>
                </div>
                
                <p className="text-lg text-white/70 leading-relaxed">
                  {feature.description}
                </p>
                
                {/* Highlights */}
                <div className="grid grid-cols-2 gap-3">
                  {feature.highlights.map((highlight, i) => (
                    <motion.div
                      key={highlight}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.2 + i * 0.1 }}
                      className="flex items-center space-x-2"
                    >
                      <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                      <span className="text-white/80 text-sm">{highlight}</span>
                    </motion.div>
                  ))}
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-cyan-400 text-cyan-400 px-6 py-3 rounded-lg font-medium hover:bg-cyan-400 hover:text-black transition-all duration-300"
                >
                  Learn More
                </motion.button>
              </div>
              
              {/* Feature Visual */}
              <div className="flex-1">
                <motion.div
                  whileHover={{ scale: 1.02, rotateY: 5 }}
                  className="relative group"
                >
                  <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-8 h-80 flex items-center justify-center">
                    {/* Placeholder for actual visualizations */}
                    <div className="text-center space-y-4">
                      <div className="text-6xl opacity-50">{feature.icon}</div>
                      <div className="text-white/60">
                        Interactive {feature.title} Demo
                      </div>
                      <div className="flex justify-center space-x-2">
                        <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce"></div>
                        <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                    
                    {/* Glow effect */}
                    <div className="absolute inset-0 rounded-2xl group-hover:shadow-2xl group-hover:shadow-cyan-500/20 transition-shadow duration-500"></div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Technology Stack */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-20 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-8">
            Powered by Modern Technology
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {['React', 'Three.js', 'D3.js', 'WebGL', 'Canvas API', 'Monaco Editor'].map((tech) => (
              <span key={tech} className="text-white/80 font-medium">{tech}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureShowcase;
