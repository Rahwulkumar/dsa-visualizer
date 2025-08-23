import React, { useState } from 'react';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars
import { Code } from 'lucide-react';
import '../../styles/globals.css';

const CodeDisplay = ({ codeLanguage, operation, currentCodeLine, animationStep, currentIteration }) => {
  const [tooltip, setTooltip] = useState({ show: false, content: '', x: 0, y: 0 });

  const codeTemplates = {
    python: {
      bubbleSort: [
        'def bubble_sort(arr):',
        '    n = len(arr)',
        '    for i in range(n - 1):',
        '        for j in range(n - i - 1):',
        '            if arr[j] > arr[j + 1]:',
        '                arr[j], arr[j + 1] = arr[j + 1], arr[j]',
        '    return arr'
      ],
      quickSort: [
        'def quick_sort(arr, low, high):',
        '    if low < high:',
        '        pi = partition(arr, low, high)',
        '        quick_sort(arr, low, pi - 1)',
        '        quick_sort(arr, pi + 1, high)',
        '',
        'def partition(arr, low, high):',
        '    pivot = arr[high]',
        '    i = low - 1',
        '    for j in range(low, high):',
        '        if arr[j] < pivot:',
        '            i += 1',
        '            arr[i], arr[j] = arr[j], arr[i]',
        '    arr[i + 1], arr[high] = arr[high], arr[i + 1]',
        '    return i + 1'
      ],
      mergeSort: [
        'def merge_sort(arr):',
        '    if len(arr) > 1:',
        '        mid = len(arr) // 2',
        '        left = arr[:mid]',
        '        right = arr[mid:]',
        '        merge_sort(left)',
        '        merge_sort(right)',
        '        merge(arr, left, right)',
        '',
        'def merge(arr, left, right):',
        '    i = j = k = 0',
        '    while i < len(left) and j < len(right):',
        '        if left[i] <= right[j]:',
        '            arr[k] = left[i]',
        '            i += 1',
        '        else:',
        '            arr[k] = right[j]',
        '            j += 1',
        '        k += 1'
      ],
      heapSort: [
        'def heap_sort(arr):',
        '    n = len(arr)',
        '    for i in range(n // 2 - 1, -1, -1):',
        '        heapify(arr, n, i)',
        '    for i in range(n - 1, 0, -1):',
        '        arr[0], arr[i] = arr[i], arr[0]',
        '        heapify(arr, i, 0)',
        '',
        'def heapify(arr, n, i):',
        '    largest = i',
        '    left = 2 * i + 1',
        '    right = 2 * i + 2',
        '    if left < n and arr[left] > arr[largest]:',
        '        largest = left',
        '    if right < n and arr[right] > arr[largest]:',
        '        largest = right',
        '    if largest != i:',
        '        arr[i], arr[largest] = arr[largest], arr[i]',
        '        heapify(arr, n, largest)'
      ],
      insertionSort: [
        'def insertion_sort(arr):',
        '    for i in range(1, len(arr)):',
        '        key = arr[i]',
        '        j = i - 1',
        '        while j >= 0 and arr[j] > key:',
        '            arr[j + 1] = arr[j]',
        '            j -= 1',
        '        arr[j + 1] = key',
        '    return arr'
      ],
      selectionSort: [
        'def selection_sort(arr):',
        '    n = len(arr)',
        '    for i in range(n - 1):',
        '        min_idx = i',
        '        for j in range(i + 1, n):',
        '            if arr[j] < arr[min_idx]:',
        '                min_idx = j',
        '        arr[i], arr[min_idx] = arr[min_idx], arr[i]',
        '    return arr'
      ]
    },
    java: {
      bubbleSort: [
        'public void bubbleSort(int[] arr) {',
        '    int n = arr.length;',
        '    for (int i = 0; i < n - 1; i++) {',
        '        for (int j = 0; j < n - i - 1; j++) {',
        '            if (arr[j] > arr[j + 1]) {',
        '                int temp = arr[j];',
        '                arr[j] = arr[j + 1];',
        '                arr[j + 1] = temp;',
        '            }',
        '        }',
        '    }',
        '}'
      ],
      quickSort: [
        'public void quickSort(int[] arr, int low, int high) {',
        '    if (low < high) {',
        '        int pi = partition(arr, low, high);',
        '        quickSort(arr, low, pi - 1);',
        '        quickSort(arr, pi + 1, high);',
        '    }',
        '}',
        '',
        'public int partition(int[] arr, int low, int high) {',
        '    int pivot = arr[high];',
        '    int i = low - 1;',
        '    for (int j = low; j < high; j++) {',
        '        if (arr[j] < pivot) {',
        '            i++;',
        '            int temp = arr[i];',
        '            arr[i] = arr[j];',
        '            arr[j] = temp;',
        '        }',
        '    }',
        '    int temp = arr[i + 1];',
        '    arr[i + 1] = arr[high];',
        '    arr[high] = temp;',
        '    return i + 1;',
        '}'
      ],
      mergeSort: [
        'public void mergeSort(int[] arr, int left, int right) {',
        '    if (left < right) {',
        '        int mid = (left + right) / 2;',
        '        mergeSort(arr, left, mid);',
        '        mergeSort(arr, mid + 1, right);',
        '        merge(arr, left, mid, right);',
        '    }',
        '}',
        '',
        'public void merge(int[] arr, int left, int mid, int right) {',
        '    int[] temp = new int[right - left + 1];',
        '    int i = left, j = mid + 1, k = 0;',
        '    while (i <= mid && j <= right) {',
        '        if (arr[i] <= arr[j]) {',
        '            temp[k++] = arr[i++];',
        '        } else {',
        '            temp[k++] = arr[j++];',
        '        }',
        '    }',
        '    while (i <= mid) temp[k++] = arr[i++];',
        '    while (j <= right) temp[k++] = arr[j++];',
        '    for (i = 0; i < k; i++) {',
        '        arr[left + i] = temp[i];',
        '    }',
        '}'
      ],
      heapSort: [
        'public void heapSort(int[] arr) {',
        '    int n = arr.length;',
        '    for (int i = n / 2 - 1; i >= 0; i--) {',
        '        heapify(arr, n, i);',
        '    }',
        '    for (int i = n - 1; i > 0; i--) {',
        '        int temp = arr[0];',
        '        arr[0] = arr[i];',
        '        arr[i] = temp;',
        '        heapify(arr, i, 0);',
        '    }',
        '}',
        '',
        'public void heapify(int[] arr, int n, int i) {',
        '    int largest = i;',
        '    int left = 2 * i + 1;',
        '    int right = 2 * i + 2;',
        '    if (left < n && arr[left] > arr[largest]) {',
        '        largest = left;',
        '    }',
        '    if (right < n && arr[right] > arr[largest]) {',
        '        largest = right;',
        '    }',
        '    if (largest != i) {',
        '        int temp = arr[i];',
        '        arr[i] = arr[largest];',
        '        arr[largest] = temp;',
        '        heapify(arr, n, largest);',
        '    }',
        '}'
      ],
      insertionSort: [
        'public void insertionSort(int[] arr) {',
        '    int n = arr.length;',
        '    for (int i = 1; i < n; i++) {',
        '        int key = arr[i];',
        '        int j = i - 1;',
        '        while (j >= 0 && arr[j] > key) {',
        '            arr[j + 1] = arr[j];',
        '            j = j - 1;',
        '        }',
        '        arr[j + 1] = key;',
        '    }',
        '}'
      ],
      selectionSort: [
        'public void selectionSort(int[] arr) {',
        '    int n = arr.length;',
        '    for (int i = 0; i < n - 1; i++) {',
        '        int minIdx = i;',
        '        for (int j = i + 1; j < n; j++) {',
        '            if (arr[j] < arr[minIdx]) {',
        '                minIdx = j;',
        '            }',
        '        }',
        '        int temp = arr[minIdx];',
        '        arr[minIdx] = arr[i];',
        '        arr[i] = temp;',
        '    }',
        '}'
      ]
    },
    c: {
      bubbleSort: [
        'void bubble_sort(int arr[], int n) {',
        '    for (int i = 0; i < n - 1; i++) {',
        '        for (int j = 0; j < n - i - 1; j++) {',
        '            if (arr[j] > arr[j + 1]) {',
        '                int temp = arr[j];',
        '                arr[j] = arr[j + 1];',
        '                arr[j + 1] = temp;',
        '            }',
        '        }',
        '    }',
        '}'
      ],
      quickSort: [
        'void quick_sort(int arr[], int low, int high) {',
        '    if (low < high) {',
        '        int pi = partition(arr, low, high);',
        '        quick_sort(arr, low, pi - 1);',
        '        quick_sort(arr, pi + 1, high);',
        '    }',
        '}',
        '',
        'int partition(int arr[], int low, int high) {',
        '    int pivot = arr[high];',
        '    int i = low - 1;',
        '    for (int j = low; j < high; j++) {',
        '        if (arr[j] < pivot) {',
        '            i++;',
        '            int temp = arr[i];',
        '            arr[i] = arr[j];',
        '            arr[j] = temp;',
        '        }',
        '    }',
        '    int temp = arr[i + 1];',
        '    arr[i + 1] = arr[high];',
        '    arr[high] = temp;',
        '    return i + 1;',
        '}'
      ],
      mergeSort: [
        'void merge_sort(int arr[], int left, int right) {',
        '    if (left < right) {',
        '        int mid = left + (right - left) / 2;',
        '        merge_sort(arr, left, mid);',
        '        merge_sort(arr, mid + 1, right);',
        '        merge(arr, left, mid, right);',
        '    }',
        '}',
        '',
        'void merge(int arr[], int left, int mid, int right) {',
        '    int n1 = mid - left + 1;',
        '    int n2 = right - mid;',
        '    int L[n1], R[n2];',
        '    for (int i = 0; i < n1; i++) L[i] = arr[left + i];',
        '    for (int j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];',
        '    int i = 0, j = 0, k = left;',
        '    while (i < n1 && j < n2) {',
        '        if (L[i] <= R[j]) arr[k++] = L[i++];',
        '        else arr[k++] = R[j++];',
        '    }',
        '    while (i < n1) arr[k++] = L[i++];',
        '    while (j < n2) arr[k++] = R[j++];',
        '}'
      ],
      heapSort: [
        'void heap_sort(int arr[], int n) {',
        '    for (int i = n / 2 - 1; i >= 0; i--) {',
        '        heapify(arr, n, i);',
        '    }',
        '    for (int i = n - 1; i > 0; i--) {',
        '        int temp = arr[0];',
        '        arr[0] = arr[i];',
        '        arr[i] = temp;',
        '        heapify(arr, i, 0);',
        '    }',
        '}',
        '',
        'void heapify(int arr[], int n, int i) {',
        '    int largest = i;',
        '    int left = 2 * i + 1;',
        '    int right = 2 * i + 2;',
        '    if (left < n && arr[left] > arr[largest]) {',
        '        largest = left;',
        '    }',
        '    if (right < n && arr[right] > arr[largest]) {',
        '        largest = right;',
        '    }',
        '    if (largest != i) {',
        '        int temp = arr[i];',
        '        arr[i] = arr[largest];',
        '        arr[largest] = temp;',
        '        heapify(arr, n, largest);',
        '    }',
        '}'
      ],
      insertionSort: [
        'void insertion_sort(int arr[], int n) {',
        '    for (int i = 1; i < n; i++) {',
        '        int key = arr[i];',
        '        int j = i - 1;',
        '        while (j >= 0 && arr[j] > key) {',
        '            arr[j + 1] = arr[j];',
        '            j = j - 1;',
        '        }',
        '        arr[j + 1] = key;',
        '    }',
        '}'
      ],
      selectionSort: [
        'void selection_sort(int arr[], int n) {',
        '    for (int i = 0; i < n - 1; i++) {',
        '        int min_idx = i;',
        '        for (int j = i + 1; j < n; j++) {',
        '            if (arr[j] < arr[min_idx]) {',
        '                min_idx = j;',
        '            }',
        '        }',
        '        int temp = arr[min_idx];',
        '        arr[min_idx] = arr[i];',
        '        arr[i] = temp;',
        '    }',
        '}'
      ]
    }
  };

  const codeExplanations = {
    bubbleSort: {
      0: 'Function starts with array parameter',
      1: 'Get array length for loop bounds',
      2: 'Outer loop for number of passes',
      3: 'Inner loop compares adjacent elements',
      4: 'Check if elements are in wrong order',
      5: 'Swap elements if needed',
      6: 'Continue until array is sorted'
    },
    quickSort: {
      0: 'Recursive quick sort function',
      1: 'Check if partition has more than one element',
      2: 'Partition array and get pivot index',
      3: 'Recursively sort left partition',
      4: 'Recursively sort right partition',
      7: 'Partition function starts',
      8: 'Choose rightmost element as pivot',
      9: 'Initialize smaller element index',
      10: 'Loop through partition',
      11: 'If element is smaller than pivot',
      12: 'Increment smaller index',
      13: 'Swap elements',
      14: 'Place pivot in correct position'
    },
    mergeSort: {
      0: 'Recursive merge sort function',
      1: 'Check if array has more than one element',
      2: 'Find middle point',
      3: 'Create left subarray',
      4: 'Create right subarray',
      5: 'Recursively sort left half',
      6: 'Recursively sort right half',
      7: 'Merge sorted halves',
      10: 'Merge function starts',
      11: 'Initialize pointers',
      12: 'Compare elements from both arrays',
      13: 'Take smaller element from left',
      15: 'Take smaller element from right',
      18: 'Copy remaining elements'
    },
    heapSort: {
      0: 'Heap sort function starts',
      1: 'Get array length',
      2: 'Build max heap from array',
      3: 'Call heapify for each non-leaf node',
      4: 'Extract elements from heap',
      5: 'Move root to end',
      7: 'Restore heap property',
      10: 'Heapify function starts',
      11: 'Assume root is largest',
      12: 'Calculate left child index',
      13: 'Calculate right child index',
      14: 'Check if left child is larger',
      16: 'Check if right child is larger',
      18: 'If largest is not root, swap',
      21: 'Recursively heapify affected subtree'
    },
    insertionSort: {
      0: 'Insertion sort function starts',
      1: 'Loop from second element',
      2: 'Store current element as key',
      3: 'Start from previous element',
      4: 'While previous elements are larger',
      5: 'Shift larger elements right',
      6: 'Move to next previous element',
      7: 'Insert key at correct position'
    },
    selectionSort: {
      0: 'Selection sort function starts',
      1: 'Get array length',
      2: 'Loop through unsorted portion',
      3: 'Assume current element is minimum',
      4: 'Search for actual minimum',
      5: 'Compare with current minimum',
      6: 'Update minimum index if smaller found',
      8: 'Swap minimum with current position'
    }
  };

  const showTooltip = (content, event) => {
    setTooltip({ show: true, content, x: event.clientX + 10, y: event.clientY - 10 });
  };

  const hideTooltip = () => {
    setTooltip({ show: false, content: '', x: 0, y: 0 });
  };

  const currentCode = operation && codeTemplates[codeLanguage] && codeTemplates[codeLanguage][operation] 
    ? codeTemplates[codeLanguage][operation] 
    : ['// Select a sorting algorithm to view code'];

  return (
    <div className="col-span-4 flex flex-col glass-card p-4 h-full">
      <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
        <Code className="w-5 h-5 text-cyan-400" />
        Code ({codeLanguage.toUpperCase()})
        {operation && (
          <span className="ml-2 text-sm text-gray-300 bg-gray-800/50 px-2 py-1 rounded">
            {operation.charAt(0).toUpperCase() + operation.slice(1)}
          </span>
        )}
      </h3>
      
      {/* Code Display */}
      <div className="flex-1 bg-gray-900/90 rounded-lg p-4 font-mono text-sm overflow-auto border border-gray-700/50">
        <div className="space-y-1">
          {currentCode.map((line, index) => {
            const isCurrentLine = currentCodeLine === index + 1;
            const explanation = operation && codeExplanations[operation] && codeExplanations[operation][index];
            
            return (
              <motion.div
                key={index}
                className={`flex items-center px-2 py-1 rounded transition-all duration-300 cursor-pointer ${
                  isCurrentLine
                    ? 'bg-cyan-500/20 border-l-4 border-cyan-400 text-cyan-100 shadow-lg'
                    : 'text-gray-300 hover:bg-gray-800/50'
                } ${line.trim() === '' ? 'h-4' : ''}`}
                animate={isCurrentLine ? { scale: [1, 1.02, 1] } : {}}
                transition={{ duration: 0.3 }}
                onMouseEnter={explanation ? (e) => showTooltip(explanation, e) : undefined}
                onMouseLeave={hideTooltip}
              >
                <span className="text-gray-500 w-8 text-right mr-4 select-none">
                  {line.trim() !== '' ? index + 1 : ''}
                </span>
                <span className="whitespace-pre-wrap leading-relaxed">
                  {line.split(' ').map((word, wordIndex) => {
                    // Syntax highlighting
                    const keywords = ['def', 'for', 'if', 'while', 'return', 'else', 'elif', 'in', 'range', 'len', 
                                     'public', 'private', 'static', 'void', 'int', 'float', 'double', 'char', 'class',
                                     'function', 'var', 'let', 'const', 'new', 'this', 'null', 'undefined'];
                    const operators = ['=', '==', '!=', '<', '>', '<=', '>=', '+', '-', '*', '/', '%', '&&', '||', '!'];
                    
                    let className = '';
                    if (keywords.includes(word)) {
                      className = 'text-blue-400 font-semibold';
                    } else if (operators.includes(word)) {
                      className = 'text-yellow-400';
                    } else if (word.includes('(') || word.includes(')')) {
                      className = 'text-green-400';
                    } else if (word.match(/^\d+$/)) {
                      className = 'text-orange-400';
                    } else if (word.includes('"') || word.includes("'")) {
                      className = 'text-red-400';
                    }
                    
                    return (
                      <span key={wordIndex} className={className}>
                        {word}
                        {wordIndex < line.split(' ').length - 1 ? ' ' : ''}
                      </span>
                    );
                  })}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Algorithm Info */}
      {operation && (
        <div className="mt-4 space-y-2">
          <div className="text-sm text-gray-300 bg-gray-800/50 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-cyan-400">Algorithm Status</span>
              {currentIteration !== undefined && (
                <span className="text-xs bg-cyan-500/20 px-2 py-1 rounded text-cyan-300">
                  Iteration: {currentIteration}
                </span>
              )}
            </div>
            {animationStep && (
              <div className="text-xs text-gray-400">
                Step: {animationStep}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tooltip */}
      {tooltip.show && (
        <div
          className="fixed z-50 bg-gray-900 text-white text-xs p-2 rounded shadow-lg border border-gray-600 max-w-xs"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
};

export default CodeDisplay;
