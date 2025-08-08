import React, { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity } from 'lucide-react';
import '../../styles/globals.css';
import './ArrayStyles.css';

const ArrayVisualization = ({ displayArray, currentElementIndex, elementStates, codeLanguage }) => {
  const getBaseAddress = useCallback(() => {
    return codeLanguage === 'c' ? 0x7fff5fbff000 : 0x7f8b1c000000;
  }, [codeLanguage]);

  const getElementStyle = useCallback((index) => {
    const state = elementStates[index];
    const baseSize = Math.min(60, 100 / Math.max(1, displayArray.length));
    let className = `array-element`;
    switch (state) {
      case 'checking':
        className += ' checking';
        break;
      case 'found':
        className += ' found';
        break;
      case 'checked':
        className += ' checked';
        break;
      case 'accessed':
        className += ' accessed';
        break;
      case 'shifting':
        className += ' shifting';
        break;
      case 'inserted':
        className += ' inserted';
        break;
      case 'deleting':
        className += ' deleting';
        break;
      default:
        className += currentElementIndex === index ? ' checking' : '';
    }
    return { className, style: { width: `${baseSize}px`, height: `${baseSize}px` } };
  }, [elementStates, currentElementIndex, displayArray.length]);

  return (
    <div className="col-span-5 flex flex-col glass-card p-4 h-full">
      <h3 className="text-lg font-bold text-white flex items-center gap-2">
        <Activity className="w-5 h-5 text-cyan-400" />
        Array Visualization
        <span className="text-sm text-gray-400">({displayArray.length} elements)</span>
      </h3>
      <div className="flex-1 flex items-center justify-center">
        <div className="array-container">
          <AnimatePresence mode="popLayout">
            {displayArray.map((value, index) => (
              <motion.div
                key={`array-${index}-${value}`}
                layout
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{
                  opacity: elementStates[index] === 'deleting' ? 0.3 : 1,
                  scale: currentElementIndex === index ? 1.15 : 1,
                  y: 0
                }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ duration: 0.5, type: 'spring', stiffness: 300, damping: 20 }}
                className="flex flex-col items-center"
              >
                <div className="text-white/60 font-mono text-xs mb-1 font-semibold">[{index}]</div>
                <div {...getElementStyle(index)}>
                  <span className="relative z-10 text-lg font-bold">{value}</span>
                  {currentElementIndex === index && (
                    <motion.div
                      className="absolute -inset-1 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-xl"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}
                </div>
                <div className="text-white/40 font-mono text-xs mt-1">
                  0x{(getBaseAddress() + index * 4).toString(16).toUpperCase()}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ArrayVisualization;