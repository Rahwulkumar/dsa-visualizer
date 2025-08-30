import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Eye, Info } from 'lucide-react';
import PropTypes from 'prop-types';

// Reusable CodeDisplay component for all data structure visualizers
const CodeDisplay = ({ 
  codeLanguage = 'python', 
  operation = 'display', 
  currentCodeLine = -1, 
  animationStep = 'Ready', 
  currentIteration = -1,
  codeTemplates = {},
  codeExplanations = {},
  className = '',
  showLineNumbers = true,
  showTooltips = true,
  title = 'Code Implementation'
}) => {
  const [tooltip, setTooltip] = useState({ show: false, content: '', x: 0, y: 0 });

  // Default fallback templates for common operations
  const defaultTemplates = {
    python: {
      display: [
        'def display(data_structure):',
        '    if not data_structure:',
        '        print("Empty structure")',
        '        return',
        '    # Traverse and display',
        '    for element in data_structure:',
        '        print(element)',
        '    # Display complete'
      ]
    },
    java: {
      display: [
        'public void display() {',
        '    if (isEmpty()) {',
        '        System.out.println("Empty structure");',
        '        return;',
        '    }',
        '    // Traverse and display',
        '    for (Element element : structure) {',
        '        System.out.println(element);',
        '    }',
        '    // Display complete',
        '}'
      ]
    },
    c: {
      display: [
        'void display(Structure* s) {',
        '    if (s->size == 0) {',
        '        printf("Empty structure\\n");',
        '        return;',
        '    }',
        '    // Traverse and display',
        '    for (int i = 0; i < s->size; i++) {',
        '        printf("%d ", s->data[i]);',
        '    }',
        '    // Display complete',
        '}'
      ]
    }
  };

  // Default explanations for common patterns
  const defaultExplanations = {
    display: {
      0: 'Function definition for display operation',
      1: 'Check if data structure is empty',
      2: 'Handle empty case',
      3: 'Return early if empty',
      4: 'Prepare to traverse structure',
      5: 'Iterate through all elements',
      6: 'Output current element',
      7: 'Operation completed successfully'
    }
  };

  // Merge provided templates with defaults
  const mergedTemplates = {
    python: { ...defaultTemplates.python, ...codeTemplates.python },
    java: { ...defaultTemplates.java, ...codeTemplates.java },
    c: { ...defaultTemplates.c, ...codeTemplates.c }
  };

  const mergedExplanations = { ...defaultExplanations, ...codeExplanations };

  const currentCode = mergedTemplates[codeLanguage]?.[operation] || mergedTemplates.python.display;
  const explanations = mergedExplanations[operation] || mergedExplanations.display;

  const handleMouseEnter = (lineIndex, event) => {
    if (!showTooltips) return;
    const explanation = explanations[lineIndex];
    if (explanation) {
      const rect = event.currentTarget.getBoundingClientRect();
      setTooltip({
        show: true,
        content: explanation,
        x: rect.right + 10,
        y: rect.top
      });
    }
  };

  const handleMouseLeave = () => {
    setTooltip({ show: false, content: '', x: 0, y: 0 });
  };

  const getLanguageColor = () => {
    switch (codeLanguage) {
      case 'python': return 'from-yellow-500 to-orange-500';
      case 'java': return 'from-blue-500 to-cyan-500';
      case 'c': return 'from-green-500 to-emerald-500';
      default: return 'from-purple-500 to-pink-500';
    }
  };

  const getLanguageIcon = () => {
    switch (codeLanguage) {
      case 'python': return '🐍';
      case 'java': return '☕';
      case 'c': return '⚡';
      default: return '💻';
    }
  };

  return (
    <div id="code-display" className={`bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div id="code-display-header" className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-gray-800/50 to-gray-700/50">
        <div className="flex items-center gap-3">
          <div className={`p-2 bg-gradient-to-r ${getLanguageColor()}/20 rounded-lg`}>
            <Code className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 id="code-display-title" className="text-lg font-semibold text-white">{title}</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-300">
                {getLanguageIcon()} {codeLanguage.charAt(0).toUpperCase() + codeLanguage.slice(1)}
              </span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-sm text-purple-300 font-medium capitalize">{operation.replace(/([A-Z])/g, ' $1').trim()}</span>
            </div>
          </div>
        </div>
        
        {showTooltips && (
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Eye className="w-4 h-4" />
            <span>Hover for explanations</span>
          </div>
        )}
      </div>

      {/* Animation Status */}
      <motion.div
        id="code-animation-status"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 py-3 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-b border-cyan-500/20"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <span id="code-animation-step" className="text-sm text-cyan-200">{animationStep}</span>
          </div>
          {currentIteration >= 0 && (
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-400" />
              <span id="code-iteration" className="text-sm text-blue-200">
                Iteration: <span className="font-mono">{currentIteration}</span>
              </span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Code Content */}
      <div id="code-content" className="p-4 max-h-96 overflow-y-auto">
        <div className="space-y-1">
          {currentCode.map((line, index) => (
            <motion.div
              key={index}
              id={`code-line-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onMouseEnter={(e) => handleMouseEnter(index, e)}
              onMouseLeave={handleMouseLeave}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 cursor-pointer group ${
                currentCodeLine === index
                  ? 'bg-gradient-to-r from-cyan-500/30 to-blue-500/30 border border-cyan-500/50 shadow-lg shadow-cyan-500/20'
                  : 'hover:bg-white/5 border border-transparent'
              }`}
            >
              {showLineNumbers && (
                <span
                  id={`code-line-number-${index}`}
                  className={`text-xs font-mono w-6 text-right transition-colors duration-300 ${
                    currentCodeLine === index ? 'text-cyan-300' : 'text-gray-500 group-hover:text-gray-400'
                  }`}
                >
                  {index + 1}
                </span>
              )}
              
              <code
                id={`code-line-content-${index}`}
                className={`text-sm font-mono transition-colors duration-300 ${
                  currentCodeLine === index 
                    ? 'text-white font-medium' 
                    : 'text-gray-300 group-hover:text-gray-200'
                }`}
              >
                {line}
              </code>
              
              {currentCodeLine === index && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto"
                >
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      {tooltip.show && showTooltips && (
        <motion.div
          id="code-tooltip"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed z-50 bg-gray-900/95 backdrop-blur-xl border border-gray-600/50 rounded-lg px-3 py-2 max-w-xs shadow-xl"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <p className="text-sm text-gray-200">{tooltip.content}</p>
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-r-8 border-r-gray-900/95 border-y-4 border-y-transparent"></div>
        </motion.div>
      )}
    </div>
  );
};

CodeDisplay.propTypes = {
  codeLanguage: PropTypes.oneOf(['python', 'java', 'c']),
  operation: PropTypes.string,
  currentCodeLine: PropTypes.number,
  animationStep: PropTypes.string,
  currentIteration: PropTypes.number,
  codeTemplates: PropTypes.object,
  codeExplanations: PropTypes.object,
  className: PropTypes.string,
  showLineNumbers: PropTypes.bool,
  showTooltips: PropTypes.bool,
  title: PropTypes.string
};

export default CodeDisplay;
