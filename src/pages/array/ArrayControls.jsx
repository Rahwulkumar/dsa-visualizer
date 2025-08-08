import React, { useEffect, useRef, useCallback } from 'react';

const ArrayOperations = ({
  operation, isPlaying, speed, searchValue, accessIndex, insertValue, insertIndex, deleteIndex,
  displayArray, memoryArray, codeLanguage, arraySize, setIsAnimating, setIsPlaying,
  setDisplayArray, setMemoryArray, setOriginalArray, setCurrentElementIndex,
  setCurrentCodeLine, setCurrentMemoryIndex, setElementStates, setAnimationStep,
  setFoundIndex, setHeapMemory, setCurrentStackFrame, setCurrentIteration,
  initializeMemoryModel, isAnimating // Ensure isAnimating is destructured
}) => {
  const animationRef = useRef(null);

  // Debug: Warn if isAnimating is undefined
  useEffect(() => {
    if (isAnimating === undefined) {
      console.warn('isAnimating prop is undefined in ArrayOperations. Check props passed from ArrayVisualizerPage.');
    }
  }, [isAnimating]);

  const sleep = useCallback((multiplier = 1) => new Promise(resolve => {
    animationRef.current = setTimeout(resolve, speed * multiplier);
  }), [speed]);

  const resetAnimation = useCallback(() => {
    setIsPlaying(false);
    setIsAnimating(false);
    setCurrentElementIndex(-1);
    setCurrentCodeLine(-1);
    setCurrentMemoryIndex(-1);
    setElementStates({});
    setCurrentIteration(-1);
    setAnimationStep('Ready for operation');
    setFoundIndex(-1);
    setCurrentStackFrame(null);
    setDisplayArray([...displayArray]);
    setMemoryArray([...memoryArray]);
    initializeMemoryModel();
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
  }, [displayArray, memoryArray, setIsPlaying, setIsAnimating, setCurrentElementIndex,
      setCurrentCodeLine, setCurrentMemoryIndex, setElementStates, setCurrentIteration,
      setAnimationStep, setFoundIndex, setCurrentStackFrame, setDisplayArray,
      setMemoryArray, initializeMemoryModel]);

  const animateSearch = useCallback(async () => {
    const target = parseInt(searchValue);
    if (isNaN(target) || !Number.isInteger(target)) {
      setAnimationStep('Invalid search value');
      resetAnimation();
      return;
    }
    if (displayArray.length === 0) {
      setAnimationStep('Array is empty');
      resetAnimation();
      return;
    }

    setAnimationStep('Starting linear search...');
    setCurrentCodeLine(0);
    await sleep(0.5);

    for (let i = 0; i < displayArray.length; i++) {
      if (!isPlaying) break;
      setCurrentIteration(i);
      setCurrentCodeLine(1);
      setCurrentElementIndex(i);
      setCurrentMemoryIndex(i);
      setCurrentStackFrame({ i, currentValue: displayArray[i] });
      setElementStates(prev => ({ ...prev, [i]: 'checking' }));
      setAnimationStep(`Checking element at index ${i}`);
      await sleep(0.8);

      setCurrentCodeLine(2);
      setAnimationStep(`Comparing ${displayArray[i]} with target ${target}`);
      await sleep(0.6);

      if (displayArray[i] === target) {
        setCurrentCodeLine(3);
        setElementStates(prev => ({ ...prev, [i]: 'found' }));
        setFoundIndex(i);
        setAnimationStep(`Target found at index ${i}!`);
        await sleep(1.5);
        resetAnimation();
        return;
      } else {
        setElementStates(prev => ({ ...prev, [i]: 'checked' }));
        await sleep(0.4);
      }
    }

    setCurrentCodeLine(6);
    setAnimationStep('Target not found in array');
    await sleep(1);
    resetAnimation();
  }, [displayArray, searchValue, isPlaying, sleep, resetAnimation, setCurrentIteration,
      setCurrentCodeLine, setCurrentElementIndex, setCurrentMemoryIndex,
      setCurrentStackFrame, setElementStates, setAnimationStep, setFoundIndex]);

  const animateAccess = useCallback(async () => {
    const index = parseInt(accessIndex);
    if (isNaN(index) || !Number.isInteger(index) || index < 0 || index >= displayArray.length) {
      setAnimationStep(`Invalid index (0 to ${displayArray.length - 1})`);
      resetAnimation();
      return;
    }

    setAnimationStep('Starting access operation...');
    setCurrentCodeLine(0);
    await sleep(0.5);

    setCurrentCodeLine(1);
    setAnimationStep('Checking if index is within bounds...');
    await sleep(0.7);

    setCurrentCodeLine(4);
    setCurrentElementIndex(index);
    setCurrentMemoryIndex(index);
    setElementStates(prev => ({ ...prev, [index]: 'accessed' }));
    setCurrentStackFrame({ i: index, currentValue: displayArray[index] });
    setAnimationStep(`Accessing value ${displayArray[index]} at index ${index} - O(1)`);
    await sleep(1.2);
    resetAnimation();
  }, [accessIndex, displayArray, sleep, resetAnimation, setCurrentCodeLine,
      setCurrentElementIndex, setCurrentMemoryIndex, setElementStates,
      setCurrentStackFrame, setAnimationStep]);

  const animateInsert = useCallback(async () => {
    const index = parseInt(insertIndex);
    const value = parseInt(insertValue);
    if (isNaN(index) || !Number.isInteger(index) || isNaN(value) || !Number.isInteger(value) || index < 0 || index > displayArray.length) {
      setAnimationStep(`Invalid index (0 to ${displayArray.length}) or value`);
      resetAnimation();
      return;
    }
    if (codeLanguage === 'c' && displayArray.length >= arraySize) {
      setAnimationStep('Array is full (fixed size in C)');
      resetAnimation();
      return;
    }

    setAnimationStep('Starting insertion operation...');
    setCurrentCodeLine(0);
    await sleep(0.5);

    let newDisplayArray = [...displayArray];
    let newMemoryArray = [...memoryArray];

    if (index < displayArray.length) {
      setCurrentCodeLine(1);
      setAnimationStep('Shifting elements right...');
      await sleep(0.7);

      for (let i = displayArray.length - 1; i >= index; i--) {
        if (!isPlaying) break;
        setCurrentCodeLine(3);
        setCurrentElementIndex(i);
        setCurrentMemoryIndex(i);
        setCurrentStackFrame({ i, currentValue: displayArray[i] });
        setElementStates(prev => ({ ...prev, [i]: 'shifting' }));
        setAnimationStep(`Shifting element ${displayArray[i]} to index ${i + 1}`);
        await sleep(0.4);

        newDisplayArray[i + 1] = displayArray[i];
        newMemoryArray[i + 1] = memoryArray[i];
        setDisplayArray([...newDisplayArray]);
        setMemoryArray([...newMemoryArray]);
        setElementStates(prev => ({ ...prev, [i]: 'shifted', [i + 1]: 'shifted' }));
        await sleep(0.6);
      }
    }

    setCurrentCodeLine(4);
    setAnimationStep('Inserting new element...');
    await sleep(0.5);

    newDisplayArray[index] = value;
    newMemoryArray[index] = value;
    setDisplayArray([...newDisplayArray]);
    setMemoryArray([...newMemoryArray]);
    setOriginalArray([...newDisplayArray]);
    setElementStates(prev => ({ ...prev, [index]: 'inserted' }));
    setAnimationStep(`Successfully inserted ${value} at index ${index}`);
    setHeapMemory(prev => ({
      ...prev,
      arrayObject: { ...prev.arrayObject, data: [...newDisplayArray] }
    }));
    await sleep(1);
    resetAnimation();
  }, [insertIndex, insertValue, displayArray, memoryArray, codeLanguage, arraySize,
      sleep, resetAnimation, setCurrentCodeLine, setCurrentElementIndex,
      setCurrentMemoryIndex, setCurrentStackFrame, setElementStates,
      setAnimationStep, setDisplayArray, setMemoryArray, setOriginalArray,
      setHeapMemory]);

  const animateDelete = useCallback(async () => {
    const index = parseInt(deleteIndex);
    if (isNaN(index) || !Number.isInteger(index) || index < 0 || index >= displayArray.length) {
      setAnimationStep(`Invalid index (0 to ${displayArray.length - 1})`);
      resetAnimation();
      return;
    }

    const deletedValue = displayArray[index];
    setAnimationStep('Starting deletion operation...');
    setCurrentCodeLine(0);
    await sleep(0.5);

    setCurrentElementIndex(index);
    setCurrentMemoryIndex(index);
    setElementStates(prev => ({ ...prev, [index]: 'deleting' }));
    setAnimationStep(`Marking element ${deletedValue} at index ${index} for deletion`);
    await sleep(0.8);

    let newDisplayArray = [...displayArray];
    let newMemoryArray = [...memoryArray];

    if (index < displayArray.length - 1) {
      setCurrentCodeLine(1);
      setAnimationStep('Shifting elements left...');
      await sleep(0.7);

      for (let i = index; i < displayArray.length - 1; i++) {
        if (!isPlaying) break;
        setCurrentCodeLine(3);
        setCurrentElementIndex(i + 1);
        setCurrentMemoryIndex(i + 1);
        setCurrentStackFrame({ i: i + 1, currentValue: displayArray[i + 1] });
        setElementStates(prev => ({ ...prev, [i + 1]: 'shifting', [i]: 'shifted' }));
        setAnimationStep(`Moving element ${displayArray[i + 1]} to index ${i}`);
        await sleep(0.4);

        newDisplayArray[i] = displayArray[i + 1];
        newMemoryArray[i] = memoryArray[i + 1];
        setDisplayArray([...newDisplayArray]);
        setMemoryArray([...newMemoryArray]);
        await sleep(0.6);
      }
    }

    setCurrentCodeLine(4);
    setAnimationStep('Removing element...');
    await sleep(0.5);

    newDisplayArray.pop();
    newMemoryArray.pop();
    setDisplayArray([...newDisplayArray]);
    setMemoryArray([...newMemoryArray]);
    setOriginalArray([...newDisplayArray]);
    setAnimationStep(`Successfully deleted ${deletedValue}`);
    setHeapMemory(prev => ({
      ...prev,
      arrayObject: { ...prev.arrayObject, data: [...newDisplayArray] }
    }));
    await sleep(1);
    resetAnimation();
  }, [deleteIndex, displayArray, memoryArray, sleep, resetAnimation,
      setCurrentCodeLine, setCurrentElementIndex, setCurrentMemoryIndex,
      setElementStates, setAnimationStep, setDisplayArray, setMemoryArray,
      setOriginalArray, setHeapMemory, setCurrentStackFrame]);

  useEffect(() => {
    // Fallback if isAnimating is undefined
    if (!isPlaying || isAnimating === undefined || isAnimating) return;

    setIsAnimating(true);
    const runAnimation = async () => {
      try {
        switch (operation) {
          case 'search':
            await animateSearch();
            break;
          case 'access':
            await animateAccess();
            break;
          case 'insert':
            await animateInsert();
            break;
          case 'delete':
            await animateDelete();
            break;
        }
      } catch (error) {
        console.error('Animation error:', error);
        setAnimationStep('Animation interrupted');
      } finally {
        setIsAnimating(false);
        setIsPlaying(false);
      }
    };
    runAnimation();
  }, [isPlaying, isAnimating, operation, animateSearch, animateAccess, animateInsert,
      animateDelete, setIsAnimating, setIsPlaying, setAnimationStep]);

  return null; // No UI, only logic
};

export default ArrayOperations;