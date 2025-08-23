import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import AnimationController from '../../utils/AnimationController';

const SortingLogic = ({
  operation,
  isPlaying,
  speed,
  displayArray,
  memoryArray,
  codeLanguage, // eslint-disable-line no-unused-vars
  arraySize, // eslint-disable-line no-unused-vars
  setIsAnimating,
  setIsPlaying,
  setDisplayArray,
  setMemoryArray,
  setOriginalArray, // eslint-disable-line no-unused-vars
  setCurrentElementIndex,
  setCurrentCodeLine,
  setCurrentMemoryIndex,
  setElementStates,
  setAnimationStep,
  setComparisons,
  setSwaps,
  setFoundIndex,
  setHeapMemory, // eslint-disable-line no-unused-vars
  setCurrentStackFrame,
  setCurrentIteration,
  initializeMemoryModel,
  isAnimating
}) => {
  const animationRef = useRef(null);
  
  // Create animation controller with all necessary callbacks
  const animationController = useMemo(() => {
    return new AnimationController({
      setCurrentCodeLine,
      setCurrentElementIndex,
      setCurrentMemoryIndex,
      setElementStates,
      setAnimationStep,
      setCurrentIteration,
      setCurrentStackFrame,
      setComparisons,
      setSwaps,
      setFoundIndex
    }, speed);
  }, [
    setCurrentCodeLine,
    setCurrentElementIndex,
    setCurrentMemoryIndex,
    setElementStates,
    setAnimationStep,
    setCurrentIteration,
    setCurrentStackFrame,
    setComparisons,
    setSwaps,
    setFoundIndex,
    speed
  ]);

  // Update animation controller speed when speed changes
  useEffect(() => {
    animationController.setSpeed(speed);
  }, [speed, animationController]);

  // Debug: Warn if isAnimating is undefined
  useEffect(() => {
    if (isAnimating === undefined) {
      console.warn('isAnimating prop is undefined in SortingLogic. Check props passed from SortingVisualizerPage.');
    }
  }, [isAnimating]);

  const resetAnimation = useCallback(() => { // eslint-disable-line no-unused-vars
    animationController.reset();
    setIsPlaying(false);
    setIsAnimating(false);
    setDisplayArray([...displayArray]);
    setMemoryArray([...memoryArray]);
    setComparisons(0);
    setSwaps(0);
    initializeMemoryModel();
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
  }, [animationController, setIsPlaying, setIsAnimating, setDisplayArray, setMemoryArray, setComparisons, setSwaps, displayArray, memoryArray, initializeMemoryModel]);

  // Bubble Sort Animation
  const bubbleSort = useCallback(async () => {
    const arr = [...displayArray];
    const n = arr.length;
    let comparisonCount = 0;
    let swapCount = 0;

    setCurrentCodeLine(1);
    await animationController.wait();

    for (let i = 0; i < n - 1; i++) {
      setCurrentIteration(i + 1);
      setCurrentCodeLine(2);
      await animationController.wait();

      for (let j = 0; j < n - i - 1; j++) {
        setCurrentCodeLine(3);
        setCurrentElementIndex(j);
        setElementStates({ [j]: 'comparing', [j + 1]: 'comparing' });
        comparisonCount++;
        setComparisons(comparisonCount);
        await animationController.wait();

        if (arr[j] > arr[j + 1]) {
          setCurrentCodeLine(4);
          setElementStates({ [j]: 'swapping', [j + 1]: 'swapping' });
          await animationController.wait();

          // Perform swap
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          swapCount++;
          setSwaps(swapCount);
          setDisplayArray([...arr]);
          await animationController.wait();
        }

        setElementStates({});
      }

      // Mark the last element as sorted
      setElementStates({ [n - 1 - i]: 'sorted' });
      await animationController.wait();
    }

    // Mark all elements as sorted
    const sortedStates = {};
    for (let i = 0; i < n; i++) {
      sortedStates[i] = 'sorted';
    }
    setElementStates(sortedStates);
    setCurrentElementIndex(-1);
    setCurrentCodeLine(-1);
  }, [displayArray, animationController, setCurrentCodeLine, setCurrentElementIndex, setElementStates, setCurrentIteration, setComparisons, setSwaps, setDisplayArray]);

  // Quick Sort Animation
  const quickSort = useCallback(async () => {
    const arr = [...displayArray];
    let comparisonCount = 0;
    let swapCount = 0;
    let recursionDepth = 0;

    const partition = async (low, high, depth = 0) => {
      // Show the current subarray being partitioned
      const subarrayStates = {};
      for (let k = low; k <= high; k++) {
        subarrayStates[k] = 'partitioning';
      }
      setElementStates(subarrayStates);
      setCurrentCodeLine(7); // partition function line
      await animationController.wait();

      // Select and highlight the pivot (last element of the subarray)
      const pivot = arr[high];
      setElementStates({ ...subarrayStates, [high]: 'pivot' });
      setCurrentElementIndex(high);
      setCurrentIteration(depth + 1);
      setAnimationStep(`Partitioning subarray [${low}..${high}], Pivot: ${pivot}`);
      await animationController.wait();

      let i = low - 1; // Index of smaller element

      // Show the partitioning process
      setAnimationStep(`Partitioning around pivot ${pivot} at index ${high}`);
      await animationController.wait();

      for (let j = low; j < high; j++) {
        // Highlight current element being compared with pivot
        setCurrentElementIndex(j);
        setElementStates({ 
          ...subarrayStates, 
          [high]: 'pivot', 
          [j]: 'comparing',
          ...(i >= low ? { [i]: 'current' } : {}) // Show the boundary
        });
        setCurrentCodeLine(10); // comparison line
        comparisonCount++;
        setComparisons(comparisonCount);
        setAnimationStep(`Comparing arr[${j}] = ${arr[j]} with pivot ${pivot}`);
        await animationController.wait();

        if (arr[j] < pivot) {
          i++; // Increment index of smaller element
          
          // Show that this element should be in the "smaller" partition
          setAnimationStep(`${arr[j]} < ${pivot}, moving to smaller partition`);
          
          if (i !== j) {
            // Highlight elements being swapped
            setElementStates({ 
              ...subarrayStates, 
              [high]: 'pivot', 
              [i]: 'swapping', 
              [j]: 'swapping' 
            });
            setCurrentCodeLine(12); // swap line
            await animationController.wait();

            // Perform the swap
            [arr[i], arr[j]] = [arr[j], arr[i]];
            swapCount++;
            setSwaps(swapCount);
            setDisplayArray([...arr]);
            setAnimationStep(`Swapped arr[${i}] and arr[${j}]`);
            await animationController.wait();
          } else {
            setAnimationStep(`Element already in correct position`);
            await animationController.wait();
          }
        } else {
          setAnimationStep(`${arr[j]} >= ${pivot}, staying in larger partition`);
          await animationController.wait();
        }
      }

      // Place pivot in its correct final position
      const pivotFinalPos = i + 1;
      if (pivotFinalPos !== high) {
        setElementStates({ 
          ...subarrayStates, 
          [pivotFinalPos]: 'swapping', 
          [high]: 'swapping' 
        });
        setCurrentCodeLine(14); // final pivot swap line
        setAnimationStep(`Placing pivot ${pivot} in its final position at index ${pivotFinalPos}`);
        await animationController.wait();

        [arr[pivotFinalPos], arr[high]] = [arr[high], arr[pivotFinalPos]];
        swapCount++;
        setSwaps(swapCount);
        setDisplayArray([...arr]);
        await animationController.wait();
      }

      // Mark pivot as sorted and show the partitioned subarrays
      const finalStates = {};
      for (let k = low; k < pivotFinalPos; k++) {
        finalStates[k] = 'partitioning'; // Left partition (smaller elements)
      }
      finalStates[pivotFinalPos] = 'sorted'; // Pivot in correct position
      for (let k = pivotFinalPos + 1; k <= high; k++) {
        finalStates[k] = 'partitioning'; // Right partition (larger elements)
      }
      
      setElementStates(finalStates);
      setAnimationStep(`Pivot ${pivot} placed correctly. Left: smaller elements, Right: larger elements`);
      await animationController.wait();

      return pivotFinalPos;
    };

    const quickSortHelper = async (low, high, depth = 0) => {
      if (low < high) {
        recursionDepth = Math.max(recursionDepth, depth);
        
        // Show current recursive call
        setCurrentCodeLine(2); // recursive call line
        setAnimationStep(`Sorting subarray [${low}..${high}] at depth ${depth}`);
        await animationController.wait();

        // Partition the array and get pivot position
        const pivotIndex = await partition(low, high, depth);
        
        // Show the two subarrays that will be sorted recursively
        const leftSize = pivotIndex - low;
        const rightSize = high - pivotIndex;
        
        if (leftSize > 0) {
          setAnimationStep(`Recursively sorting left subarray [${low}..${pivotIndex - 1}] (${leftSize} elements)`);
          await animationController.wait();
          await quickSortHelper(low, pivotIndex - 1, depth + 1);
        }
        
        if (rightSize > 0) {
          setAnimationStep(`Recursively sorting right subarray [${pivotIndex + 1}..${high}] (${rightSize} elements)`);
          await animationController.wait();
          await quickSortHelper(pivotIndex + 1, high, depth + 1);
        }
      } else if (low === high) {
        // Single element is already sorted
        setElementStates(prev => ({ ...prev, [low]: 'sorted' }));
        setAnimationStep(`Single element at index ${low} is already sorted`);
        await animationController.wait();
      }
    };

    // Start Quick Sort
    setCurrentCodeLine(1);
    setAnimationStep('Starting Quick Sort algorithm');
    await animationController.wait();
    
    await quickSortHelper(0, arr.length - 1, 0);

    // Mark all elements as sorted
    const sortedStates = {};
    for (let i = 0; i < arr.length; i++) {
      sortedStates[i] = 'sorted';
    }
    setElementStates(sortedStates);
    setCurrentElementIndex(-1);
    setCurrentCodeLine(-1);
    setAnimationStep(`Quick Sort completed! Maximum recursion depth: ${recursionDepth + 1}`);
    await animationController.wait();
  }, [displayArray, animationController, setCurrentCodeLine, setCurrentElementIndex, setElementStates, setComparisons, setSwaps, setDisplayArray, setCurrentIteration, setAnimationStep]);

  // Merge Sort Animation
  const mergeSort = useCallback(async () => {
    const arr = [...displayArray];
    let comparisonCount = 0;
    let swapCount = 0; // eslint-disable-line no-unused-vars

    const merge = async (left, mid, right) => {
      const leftArr = arr.slice(left, mid + 1);
      const rightArr = arr.slice(mid + 1, right + 1);
      
      let i = 0, j = 0, k = left;

      while (i < leftArr.length && j < rightArr.length) {
        setElementStates({ [left + i]: 'comparing', [mid + 1 + j]: 'comparing' });
        comparisonCount++;
        setComparisons(comparisonCount);
        await animationController.wait();

        if (leftArr[i] <= rightArr[j]) {
          arr[k] = leftArr[i];
          setElementStates({ [k]: 'merging' });
          i++;
        } else {
          arr[k] = rightArr[j];
          setElementStates({ [k]: 'merging' });
          j++;
        }
        
        setDisplayArray([...arr]);
        await animationController.wait();
        k++;
      }

      while (i < leftArr.length) {
        arr[k] = leftArr[i];
        setElementStates({ [k]: 'merging' });
        setDisplayArray([...arr]);
        await animationController.wait();
        i++;
        k++;
      }

      while (j < rightArr.length) {
        arr[k] = rightArr[j];
        setElementStates({ [k]: 'merging' });
        setDisplayArray([...arr]);
        await animationController.wait();
        j++;
        k++;
      }

      // Mark merged section as sorted
      const sortedStates = {};
      for (let idx = left; idx <= right; idx++) {
        sortedStates[idx] = 'sorted';
      }
      setElementStates(sortedStates);
      await animationController.wait();
    };

    const mergeSortHelper = async (left, right) => {
      if (left < right) {
        const mid = Math.floor((left + right) / 2);
        await mergeSortHelper(left, mid);
        await mergeSortHelper(mid + 1, right);
        await merge(left, mid, right);
      }
    };

    setCurrentCodeLine(1);
    await mergeSortHelper(0, arr.length - 1);

    setCurrentElementIndex(-1);
    setCurrentCodeLine(-1);
  }, [displayArray, animationController, setCurrentCodeLine, setCurrentElementIndex, setElementStates, setComparisons, setDisplayArray]);

  // Heap Sort Animation
  const heapSort = useCallback(async () => {
    const arr = [...displayArray];
    const n = arr.length;
    let comparisonCount = 0;
    let swapCount = 0;

    const heapify = async (size, i) => {
      let largest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;

      setCurrentCodeLine(9); // heapify function line
      setCurrentElementIndex(i);
      setElementStates({ [i]: 'current' });
      await animationController.wait();

      if (left < size) {
        setCurrentCodeLine(12); // left comparison line
        setElementStates({ [i]: 'current', [left]: 'comparing' });
        comparisonCount++;
        setComparisons(comparisonCount);
        await animationController.wait();

        if (arr[left] > arr[largest]) {
          setCurrentCodeLine(13); // update largest line
          largest = left;
          await animationController.wait();
        }
      }

      if (right < size) {
        setCurrentCodeLine(14); // right comparison line
        setElementStates({ [i]: 'current', [right]: 'comparing' });
        comparisonCount++;
        setComparisons(comparisonCount);
        await animationController.wait();

        if (arr[right] > arr[largest]) {
          setCurrentCodeLine(15); // update largest line
          largest = right;
          await animationController.wait();
        }
      }

      if (largest !== i) {
        setCurrentCodeLine(16); // swap condition line
        setElementStates({ [i]: 'swapping', [largest]: 'swapping' });
        await animationController.wait();

        setCurrentCodeLine(17); // swap execution line
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        swapCount++;
        setSwaps(swapCount);
        setDisplayArray([...arr]);
        await animationController.wait();

        setCurrentCodeLine(18); // recursive heapify call
        await heapify(size, largest);
      }
    };

    setCurrentCodeLine(1); // heap_sort function start
    await animationController.wait();

    setCurrentCodeLine(2); // n = len(arr)
    await animationController.wait();

    // Build max heap
    setCurrentCodeLine(3); // for loop to build heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      setCurrentCodeLine(4); // heapify call in build phase
      await heapify(n, i);
    }

    // Extract elements from heap one by one
    setCurrentCodeLine(5); // for loop for extraction
    for (let i = n - 1; i > 0; i--) {
      setCurrentCodeLine(6); // swap root with last element
      setElementStates({ [0]: 'swapping', [i]: 'swapping' });
      await animationController.wait();

      [arr[0], arr[i]] = [arr[i], arr[0]];
      swapCount++;
      setSwaps(swapCount);
      setDisplayArray([...arr]);
      
      setElementStates({ [i]: 'sorted' });
      await animationController.wait();

      setCurrentCodeLine(7); // heapify call in extraction phase
      await heapify(i, 0);
    }

    // Mark all elements as sorted
    const sortedStates = {};
    for (let i = 0; i < n; i++) {
      sortedStates[i] = 'sorted';
    }
    setElementStates(sortedStates);
    setCurrentElementIndex(-1);
    setCurrentCodeLine(-1);
  }, [displayArray, animationController, setCurrentCodeLine, setCurrentElementIndex, setElementStates, setComparisons, setSwaps, setDisplayArray]);

  // Insertion Sort Animation
  const insertionSort = useCallback(async () => {
    const arr = [...displayArray];
    const n = arr.length;
    let comparisonCount = 0;
    let swapCount = 0;

    setCurrentCodeLine(1);
    await animationController.wait();

    for (let i = 1; i < n; i++) {
      const key = arr[i];
      setCurrentElementIndex(i);
      setElementStates({ [i]: 'key' });
      setCurrentIteration(i);
      await animationController.wait();

      let j = i - 1;

      while (j >= 0) {
        setElementStates({ [i]: 'key', [j]: 'comparing' });
        comparisonCount++;
        setComparisons(comparisonCount);
        await animationController.wait();

        if (arr[j] > key) {
          setElementStates({ [j]: 'swapping', [j + 1]: 'swapping' });
          arr[j + 1] = arr[j];
          swapCount++;
          setSwaps(swapCount);
          setDisplayArray([...arr]);
          await animationController.wait();
          j--;
        } else {
          break;
        }
      }

      arr[j + 1] = key;
      setElementStates({ [j + 1]: 'sorted' });
      setDisplayArray([...arr]);
      await animationController.wait();
    }

    // Mark all elements as sorted
    const sortedStates = {};
    for (let i = 0; i < n; i++) {
      sortedStates[i] = 'sorted';
    }
    setElementStates(sortedStates);
    setCurrentElementIndex(-1);
    setCurrentCodeLine(-1);
  }, [displayArray, animationController, setCurrentCodeLine, setCurrentElementIndex, setElementStates, setCurrentIteration, setComparisons, setSwaps, setDisplayArray]);

  // Selection Sort Animation
  const selectionSort = useCallback(async () => {
    const arr = [...displayArray];
    const n = arr.length;
    let comparisonCount = 0;
    let swapCount = 0;

    setCurrentCodeLine(1);
    await animationController.wait();

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      setCurrentElementIndex(i);
      setElementStates({ [i]: 'current', [minIdx]: 'min' });
      setCurrentIteration(i + 1);
      await animationController.wait();

      for (let j = i + 1; j < n; j++) {
        setElementStates({ [i]: 'current', [minIdx]: 'min', [j]: 'comparing' });
        comparisonCount++;
        setComparisons(comparisonCount);
        await animationController.wait();

        if (arr[j] < arr[minIdx]) {
          minIdx = j;
          setElementStates({ [i]: 'current', [minIdx]: 'min' });
          await animationController.wait();
        }
      }

      if (minIdx !== i) {
        setElementStates({ [i]: 'swapping', [minIdx]: 'swapping' });
        await animationController.wait();

        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        swapCount++;
        setSwaps(swapCount);
        setDisplayArray([...arr]);
        await animationController.wait();
      }

      setElementStates({ [i]: 'sorted' });
      await animationController.wait();
    }

    // Mark all elements as sorted
    const sortedStates = {};
    for (let i = 0; i < n; i++) {
      sortedStates[i] = 'sorted';
    }
    setElementStates(sortedStates);
    setCurrentElementIndex(-1);
    setCurrentCodeLine(-1);
  }, [displayArray, animationController, setCurrentCodeLine, setCurrentElementIndex, setElementStates, setCurrentIteration, setComparisons, setSwaps, setDisplayArray]);

  // Execute sorting based on selected operation
  const executeOperation = useCallback(async () => {
    if (!isPlaying || !operation || displayArray.length === 0) return;

    setIsAnimating(true);
    
    // Start the animation controller
    animationController.start();
    
    try {
      switch (operation) {
        case 'bubbleSort':
          await bubbleSort();
          break;
        case 'quickSort':
          await quickSort();
          break;
        case 'mergeSort':
          await mergeSort();
          break;
        case 'heapSort':
          await heapSort();
          break;
        case 'insertionSort':
          await insertionSort();
          break;
        case 'selectionSort':
          await selectionSort();
          break;
        default:
          console.warn(`Unknown sorting operation: ${operation}`);
      }
    } catch (error) {
      console.error('Error during sorting animation:', error);
    } finally {
      // Stop the animation controller
      animationController.stop();
      setIsAnimating(false);
      setIsPlaying(false);
    }
  }, [isPlaying, operation, displayArray, setIsAnimating, setIsPlaying, animationController, bubbleSort, quickSort, mergeSort, heapSort, insertionSort, selectionSort]);

  // Effect to start animation when conditions are met
  useEffect(() => {
    if (isPlaying && !isAnimating && displayArray.length > 0) {
      executeOperation();
    }
  }, [isPlaying, isAnimating, displayArray, executeOperation]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
      // Safe cleanup - only call reset if animationController exists and has the method
      if (animationController && typeof animationController.reset === 'function') {
        try {
          animationController.reset();
        } catch (error) {
          console.warn('Error during AnimationController cleanup:', error);
        }
      }
    };
  }, [animationController]);

  return null; // This component doesn't render anything
};

SortingLogic.propTypes = {
  operation: PropTypes.string,
  isPlaying: PropTypes.bool.isRequired,
  speed: PropTypes.number.isRequired,
  displayArray: PropTypes.array.isRequired,
  memoryArray: PropTypes.array.isRequired,
  codeLanguage: PropTypes.string.isRequired,
  arraySize: PropTypes.number.isRequired,
  setIsAnimating: PropTypes.func.isRequired,
  setIsPlaying: PropTypes.func.isRequired,
  setDisplayArray: PropTypes.func.isRequired,
  setMemoryArray: PropTypes.func.isRequired,
  setOriginalArray: PropTypes.func.isRequired,
  setCurrentElementIndex: PropTypes.func.isRequired,
  setCurrentCodeLine: PropTypes.func.isRequired,
  setCurrentMemoryIndex: PropTypes.func.isRequired,
  setElementStates: PropTypes.func.isRequired,
  setAnimationStep: PropTypes.func.isRequired,
  setComparisons: PropTypes.func.isRequired,
  setSwaps: PropTypes.func.isRequired,
  setHeapMemory: PropTypes.func.isRequired,
  setCurrentStackFrame: PropTypes.func.isRequired,
  setCurrentIteration: PropTypes.func.isRequired,
  initializeMemoryModel: PropTypes.func.isRequired,
  isAnimating: PropTypes.bool
};

export default SortingLogic;
