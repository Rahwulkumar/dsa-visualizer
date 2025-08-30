import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Code, Play, Lightbulb } from 'lucide-react';
import '../../styles/globals.css';

const CodeDisplay = ({ codeLanguage, operation, currentCodeLine, animationStep, currentIteration }) => {
  const [tooltip, setTooltip] = useState({ show: false, content: '', x: 0, y: 0 });

  const codeTemplates = {
    python: {
      linearSearch: [
        'def linear_search(arr, target):',
        '    for i in range(len(arr)):',
        '        if arr[i] == target:',
        '            return i',
        '    return -1'
      ],
      binarySearch: [
        'def binary_search(arr, target):',
        '    left, right = 0, len(arr) - 1',
        '    while left <= right:',
        '        mid = (left + right) // 2',
        '        if arr[mid] == target:',
        '            return mid',
        '        elif arr[mid] < target:',
        '            left = mid + 1',
        '        else:',
        '            right = mid - 1',
        '    return -1'
      ]
    },
    javascript: {
      linearSearch: [
        'function linearSearch(arr, target) {',
        '    for (let i = 0; i < arr.length; i++) {',
        '        if (arr[i] === target) {',
        '            return i;',
        '        }',
        '    }',
        '    return -1;',
        '}'
      ],
      binarySearch: [
        'function binarySearch(arr, target) {',
        '    let left = 0, right = arr.length - 1;',
        '    while (left <= right) {',
        '        const mid = Math.floor((left + right) / 2);',
        '        if (arr[mid] === target) {',
        '            return mid;',
        '        } else if (arr[mid] < target) {',
        '            left = mid + 1;',
        '        } else {',
        '            right = mid - 1;',
        '        }',
        '    }',
        '    return -1;',
        '}'
      ]
    },
    java: {
      linearSearch: [
        'public static int linearSearch(int[] arr, int target) {',
        '    for (int i = 0; i < arr.length; i++) {',
        '        if (arr[i] == target) {',
        '            return i;',
        '        }',
        '    }',
        '    return -1;',
        '}'
      ],
      binarySearch: [
        'public static int binarySearch(int[] arr, int target) {',
        '    int left = 0, right = arr.length - 1;',
        '    while (left <= right) {',
        '        int mid = left + (right - left) / 2;',
        '        if (arr[mid] == target) {',
        '            return mid;',
        '        } else if (arr[mid] < target) {',
        '            left = mid + 1;',
        '        } else {',
        '            right = mid - 1;',
        '        }',
        '    }',
        '    return -1;',
        '}'
      ]
    },
    cpp: {
      linearSearch: [
        'int linearSearch(vector<int>& arr, int target) {',
        '    for (int i = 0; i < arr.size(); i++) {',
        '        if (arr[i] == target) {',
        '            return i;',
        '        }',
        '    }',
        '    return -1;',
        '}'
      ],
      binarySearch: [
        'int binarySearch(vector<int>& arr, int target) {',
        '    int left = 0, right = arr.size() - 1;',
        '    while (left <= right) {',
        '        int mid = left + (right - left) / 2;',
        '        if (arr[mid] == target) {',
        '            return mid;',
        '        } else if (arr[mid] < target) {',
        '            left = mid + 1;',
        '        } else {',
        '            right = mid - 1;',
        '        }',
        '    }',
        '    return -1;',
        '}'
      ]
    }
  };

  const getLineTooltip = (lineIndex /*, line */) => {
    const tooltips = {
      python: {
        linearSearch: [
          'Function definition: takes array and target as parameters',
          'Loop through each index in the array',
          'Check if current element equals target',
          'Return the index if found',
          'Return -1 if not found (end of array reached)'
        ],
        binarySearch: [
          'Function definition: takes sorted array and target',
          'Initialize left and right pointers',
          'Continue while search space is valid',
          'Calculate middle index',
          'Check if middle element is the target',
          'Return index if target found',
          'Target is in right half, move left pointer',
          'Move left pointer to mid + 1',
          'Target is in left half, move right pointer',
          'Move right pointer to mid - 1',
          'Return -1 if target not found'
        ]
      },
      javascript: {
        linearSearch: [
          'Function declaration with array and target parameters',
          'For loop iterating through array indices',
          'Check if current element equals target',
          'Return the index if found',
          'Continue to next iteration',
          'Return -1 if target not found',
          'End of function'
        ],
        binarySearch: [
          'Function declaration with array and target parameters',
          'Initialize left and right pointers',
          'While loop for valid search space',
          'Calculate middle index using Math.floor',
          'Check if middle element equals target',
          'Return index if target found',
          'Target is greater, search right half',
          'Update left pointer',
          'Target is smaller, search left half',
          'Update right pointer',
          'Return -1 if not found',
          'End of function'
        ]
      },
      java: {
        linearSearch: [
          'Public static method declaration',
          'For loop through array indices',
          'Compare current element with target',
          'Return index if match found',
          'Continue iteration',
          'Return -1 if not found',
          'End of method'
        ],
        binarySearch: [
          'Public static method declaration',
          'Initialize left and right boundaries',
          'While loop for valid search range',
          'Calculate mid avoiding integer overflow',
          'Check if middle element equals target',
          'Return index if found',
          'Search right half if target is larger',
          'Update left boundary',
          'Search left half if target is smaller',
          'Update right boundary',
          'Return -1 if target not found',
          'End of method'
        ]
      },
      cpp: {
        linearSearch: [
          'Function with vector reference and target',
          'Loop through vector indices',
          'Compare current element with target',
          'Return index if found',
          'Continue searching',
          'Return -1 if not found',
          'End of function'
        ],
        binarySearch: [
          'Function with vector reference and target',
          'Initialize search boundaries',
          'While search space is valid',
          'Calculate middle index safely',
          'Check if middle element equals target',
          'Return index if target found',
          'Search right half',
          'Update left boundary',
          'Search left half',
          'Update right boundary',
          'Return -1 if not found',
          'End of function'
        ]
      }
    };

    return tooltips[codeLanguage]?.[operation]?.[lineIndex] || 'Code explanation';
  };

  const handleMouseEnter = (e, lineIndex /*, line */) => {
    const rect = e.target.getBoundingClientRect();
    setTooltip({
      show: true,
      content: getLineTooltip(lineIndex),
      x: rect.right + 10,
      y: rect.top
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ show: false, content: '', x: 0, y: 0 });
  };

  const currentCode = codeTemplates[codeLanguage]?.[operation] || [];

  const getLanguageColor = () => {
    const colors = {
      python: 'text-yellow-400',
      javascript: 'text-orange-400',
      java: 'text-red-400',
      cpp: 'text-blue-400'
    };
    return colors[codeLanguage] || 'text-gray-400';
  };

  const getOperationName = () => {
    return operation === 'linearSearch' ? 'Linear Search' : 'Binary Search';
  };

  return (
    <div className="col-span-4 glass-card p-4 overflow-hidden max-h-[800px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Code className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Code Execution</h2>
            <p className="text-sm text-gray-400">
              <span className={getLanguageColor()}>{codeLanguage.charAt(0).toUpperCase() + codeLanguage.slice(1)}</span>
              <span className="mx-2">•</span>
              <span>{getOperationName()}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Code Display */}
      <div className="space-y-1 mb-4">
        {currentCode.map((line, index) => (
          <div
            key={index}
            className={`p-2 rounded border transition-all duration-300 cursor-pointer ${
              currentCodeLine === index
                ? 'bg-blue-500/20 border-blue-500/50 shadow-lg shadow-blue-500/20'
                : 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-700/50'
            }`}
            onMouseEnter={(e) => handleMouseEnter(e, index, line)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="flex items-start gap-2">
              <span className="text-xs text-gray-500 font-mono mt-0.5 min-w-[18px]">
                {(index + 1).toString().padStart(2, '0')}
              </span>
              <span className={`font-mono text-xs flex-1 leading-relaxed ${
                currentCodeLine === index ? 'text-blue-200' : 'text-gray-300'
              }`}>
                {line}
              </span>
              {currentCodeLine === index && (
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse mt-1"></div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Execution Status */}
      <div className="space-y-3">
        <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-semibold text-cyan-300">Current Step</span>
          </div>
          <p className="text-sm text-gray-300">{animationStep}</p>
        </div>

        {currentIteration > 0 && (
          <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400">Iteration:</span>
              <span className="text-lg font-bold text-purple-400">{currentIteration}</span>
            </div>
          </div>
        )}

        {/* Algorithm Complexity */}
        <div className="p-3 bg-gray-500/10 border border-gray-500/20 rounded-lg">
          <div className="text-sm font-semibold text-gray-300 mb-2">Complexity Analysis</div>
          <div className="space-y-1 text-xs">
            {operation === 'linearSearch' && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-400">Time Complexity:</span>
                  <span className="text-red-400 font-mono">O(n)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Space Complexity:</span>
                  <span className="text-green-400 font-mono">O(1)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Best Case:</span>
                  <span className="text-green-400 font-mono">O(1)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Worst Case:</span>
                  <span className="text-red-400 font-mono">O(n)</span>
                </div>
              </>
            )}
            {operation === 'binarySearch' && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-400">Time Complexity:</span>
                  <span className="text-green-400 font-mono">O(log n)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Space Complexity:</span>
                  <span className="text-green-400 font-mono">O(1)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Best Case:</span>
                  <span className="text-green-400 font-mono">O(1)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Worst Case:</span>
                  <span className="text-yellow-400 font-mono">O(log n)</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip.show && (
        <div
          className="fixed z-50 p-2 bg-gray-900 border border-gray-700 rounded-lg shadow-lg max-w-xs"
          style={{
            left: tooltip.x,
            top: tooltip.y
          }}
        >
          <p className="text-xs text-gray-300">{tooltip.content}</p>
        </div>
      )}
    </div>
  );
};

export default CodeDisplay;