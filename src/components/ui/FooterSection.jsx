import React from 'react';
import { motion } from 'framer-motion';
import { theme } from '../../theme';

const FooterSection = () => {
  const footerLinks = {
    'Learn': [
      { label: 'Documentation', href: '#' },
      { label: 'Tutorials', href: '#' },
      { label: 'Examples', href: '#' },
      { label: 'FAQ', href: '#' }
    ],
    'Connect': [
      { label: 'GitHub', href: '#' },
      { label: 'Discord', href: '#' },
      { label: 'Twitter', href: '#' },
      { label: 'LinkedIn', href: '#' }
    ],
    'Support': [
      { label: 'Contact', href: '#' },
      { label: 'Bug Reports', href: '#' },
      { label: 'Feature Requests', href: '#' },
      { label: 'Feedback', href: '#' }
    ]
  };

  const socialIcons = {
    'GitHub': '🐙',
    'Discord': '💬',
    'Twitter': '🐦',
    'LinkedIn': '💼'
  };

  return (
    <footer id="contact" className="relative py-20 px-4 sm:px-6 lg:px-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto">
        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-display text-white mb-4">
            Stay in the <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Loop</span>
          </h2>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">
            Get notified about new modules, features, and updates to the DSA Visualizer universe.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 backdrop-blur-sm"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 whitespace-nowrap"
            >
              Subscribe
            </motion.button>
          </div>
        </motion.div>

        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">DSA</span>
              </div>
              <span className="text-white font-bold text-xl font-display">Visualizer</span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-4">
              Making complex algorithms and data structures accessible through immersive 
              visualizations and interactive learning experiences.
            </p>
            
            {/* Social Icons */}
            <div className="flex space-x-4">
              {Object.entries(socialIcons).map(([platform, icon]) => (
                <motion.a
                  key={platform}
                  href="#"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
                  title={platform}
                >
                  {icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links], index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <h3 className="text-white font-semibold mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <motion.a
                      href={link.href}
                      whileHover={{ x: 5, color: '#00d4ff' }}
                      className="text-white/60 hover:text-cyan-400 transition-colors duration-300 text-sm"
                    >
                      {link.label}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center"
        >
          <p className="text-white/60 text-sm">
            © 2025 DSA Visualizer. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="#" className="text-white/60 hover:text-cyan-400 transition-colors duration-300 text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-white/60 hover:text-cyan-400 transition-colors duration-300 text-sm">
              Terms of Service
            </a>
            <a href="#" className="text-white/60 hover:text-cyan-400 transition-colors duration-300 text-sm">
              Cookie Policy
            </a>
          </div>
        </motion.div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-t from-cyan-500/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-t from-blue-500/5 to-transparent rounded-full blur-3xl" />
      </div>
    </footer>
  );
};

export default FooterSection;
