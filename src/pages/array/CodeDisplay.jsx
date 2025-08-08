import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code } from 'lucide-react';
import '../../styles/globals.css';

const CodeDisplay = ({ codeLanguage, operation, currentCodeLine, animationStep, currentIteration }) => {
  const [tooltip, setTooltip] = useState({ show: false, content: '', x: 0, y: 0 });

  const codeTemplates = {
    python: {
      search: ['def linear_search(arr, target):', '    for i in range(len(arr)):', '        if arr[i] == target:', '            return i', '        # Element not found yet', '    return -1', '    # End of search'],
      access: ['def access(arr, index):', '    if index < 0 or index >= len(arr):', '        raise IndexError("Index out of range")', '    # Bounds check passed', '    return arr[index]', '    # Access complete'],
      insert: ['def insert(arr, index, value):', '    if index < 0 or index > len(arr):', '        raise IndexError("Invalid index")', '    # Inserting value', '    arr.insert(index, value)', '    # Insertion complete'],
      delete: ['def delete(arr, index):', '    if index < 0 or index >= len(arr):', '        raise IndexError("Invalid index")', '    # Removing element', '    arr.pop(index)', '    # Deletion complete']
    },
    java: {
      search: ['public int linearSearch(int[] arr, int target) {', '    for (int i = 0; i < arr.length; i++) {', '        if (arr[i] == target) {', '            return i;', '        }', '    }', '    return -1;', '}'],
      access: ['public int access(int[] arr, int index) {', '    if (index < 0 || index >= arr.length) {', '        throw new ArrayIndexOutOfBoundsException();', '    }', '    return arr[index];', '}'],
      insert: ['public int[] insert(int[] arr, int index, int value) {', '    if (index < 0 || index > arr.length) {', '        throw new ArrayIndexOutOfBoundsException();', '    }', '    int[] newArr = new int[arr.length + 1];', '    for (int i = 0; i < index; i++) {', '        newArr[i] = arr[i];', '    }', '    newArr[index] = value;', '    for (int i = index; i < arr.length; i++) {', '        newArr[i + 1] = arr[i];', '    }', '    return newArr;', '}'],
      delete: ['public int[] delete(int[] arr, int index) {', '    if (index < 0 || index >= arr.length) {', '        throw new ArrayIndexOutOfBoundsException();', '    }', '    int[] newArr = new int[arr.length - 1];', '    for (int i = 0; i < index; i++) {', '        newArr[i] = arr[i];', '    }', '    for (int i = index + 1; i < arr.length; i++) {', '        newArr[i - 1] = arr[i];', '    }', '    return newArr;', '}']
    },
    c: {
      search: ['int linear_search(int arr[], int size, int target) {', '    for (int i = 0; i < size; i++) {', '        if (arr[i] == target) {', '            return i;', '        }', '    }', '    return -1;', '}'],
      access: ['int access(int arr[], int index, int size) {', '    if (index < 0 || index >= size) {', '        return -1; /* Error */', '    }', '    return arr[index];', '}'],
      insert: ['/* Note: C arrays have fixed size */', 'int insert(int arr[], int size, int capacity, int index, int value) {', '    if (size >= capacity || index < 0 || index > size) {', '        return -1; /* Error */', '    }', '    for (int i = size - 1; i >= index; i--) {', '        arr[i + 1] = arr[i];', '    }', '    arr[index] = value;', '    return size + 1;', '}'],
      delete: ['int delete(int arr[], int size, int index) {', '    if (index < 0 || index >= size) {', '        return -1; /* Error */', '    }', '    for (int i = index; i < size - 1; i++) {', '        arr[i] = arr[i + 1];', '    }', '    return size - 1;', '}']
    }
  };

  const codeExplanations = {
    search: {
      0: 'Function starts, taking array and target value as input',
      1: 'Loop through each element in the array',
      2: 'Check if current element matches target',
      3: 'If match found, return the index',
      4: 'No match yet, continue loop',
      5: 'End of loop, target not found',
      6: 'Return -1 to indicate target not found'
    },
    access: {
      0: 'Function to access element at given index',
      1: 'Validate index is within bounds',
      2: 'Throw error if index is invalid',
      3: 'Index is valid, proceed to access',
      4: 'Return element at index (O(1))',
      5: 'Access operation complete'
    },
    insert: {
      0: 'Function to insert value at specified index',
      1: 'Validate index is within bounds',
      2: 'Throw error if index is invalid',
      3: 'Shift elements right to make space',
      4: 'Insert new value at index',
      5: 'Update array size or create new array',
      6: 'Insertion complete'
    },
    delete: {
      0: 'Function to delete element at index',
      1: 'Validate index is within bounds',
      2: 'Throw error if index is invalid',
      3: 'Shift elements left to fill gap',
      4: 'Update array size',
      5: 'Deletion complete'
    }
  };

  const showTooltip = (content, event) => {
    setTooltip({ show: true, content, x: event.clientX + 10, y: event.clientY - 10 });
  };

  const hideTooltip = () => {
    setTooltip({ show: false, content: '', x: 0, y: 0 });
  };

  return (
    <div className="col-span-4 flex flex-col glass-card p-4 h-full">
      <h3 className="text-lg font-bold text-white flex items-center gap-2">
        <Code className="w-5 h-5 text-cyan-400" />
        Code ({codeLanguage.toUpperCase()})
      </h3>
      <div className="bg-gray-900/90 rounded-lg p-4 font-mono text-sm flex-1 overflow-auto">
        {(codeTemplates[codeLanguage]?.[operation] || []).map((line, index) => (
          <motion.div
            key={index}
            className={`py-1 px-2 rounded transition-all duration-300 ${
              currentCodeLine === index ? 'bg-cyan-500/30 border-l-4 border-cyan-400 text-cyan-100' : 'text-gray-300'
            }`}
            animate={{ scale: currentCodeLine === index ? 1.02 : 1, x: currentCodeLine === index ? 8 : 0 }}
            onMouseEnter={(e) => showTooltip(codeExplanations[operation][index], e)}
            onMouseLeave={hideTooltip}
          >
            <span className="text-gray-500 mr-3 w-6 inline-block text-right">{index + 1}</span>
            {line}
          </motion.div>
        ))}
      </div>
      {tooltip.show && (
        <motion.div
          className="fixed bg-gray-800/90 text-white text-sm p-2 rounded shadow-lg z-50"
          style={{ top: tooltip.y, left: tooltip.x }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {tooltip.content}
        </motion.div>
      )}
      <div className="mt-3 p-3 bg-black/40 rounded-lg border border-cyan-500/30">
        <div className="text-cyan-400 text-sm font-medium">Live Status:</div>
        <div className="text-white text-sm">{animationStep}</div>
        {currentIteration >= 0 && operation === 'search' && (
          <div className="text-yellow-400 text-xs mt-1">Iteration: {currentIteration + 1}</div>
        )}
      </div>
    </div>
  );
};

export default CodeDisplay;