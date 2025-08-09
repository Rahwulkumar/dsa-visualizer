import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import AnimationController from '../../utils/AnimationController';

const ArrayLogic = ({
  operation,
  isPlaying,
  speed,
  searchValue,
  accessIndex,
  insertValue,
  insertIndex,
  deleteIndex,
  displayArray,
  memoryArray,
  codeLanguage,
  arraySize,
  setIsAnimating,
  setIsPlaying,
  setDisplayArray,
  setMemoryArray,
  setOriginalArray,
  setCurrentElementIndex,
  setCurrentCodeLine,
  setCurrentMemoryIndex,
  setElementStates,
  setAnimationStep,
  setFoundIndex,
  setHeapMemory,
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
      console.warn('isAnimating prop is undefined in ArrayLogic. Check props passed from ArrayVisualizerPage.');
    }
  }, [isAnimating]);

  const resetAnimation = useCallback(() => {
    animationController.reset();
    setIsPlaying(false);
    setIsAnimating(false);
    setDisplayArray([...displayArray]);
    setMemoryArray([...memoryArray]);
    initializeMemoryModel();
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
  }, [
    animationController,
    displayArray,
    memoryArray,
    setIsPlaying,
    setIsAnimating,
    setDisplayArray,
    setMemoryArray,
    initializeMemoryModel
  ]);

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

    // Start animation controller
    animationController.start();
    
    // Step 0: Initialize search
    const success = await animationController.syncStep(
      0, // code line
      () => {}, // no visual action yet
      () => {}, // no memory action yet
      'Starting linear search...', // description
      0.8 // delay multiplier
    );
    if (!success) return;

    // Step 1: Begin loop iteration
    await animationController.syncStep(
      1,
      () => {},
      () => {},
      'Setting up loop to iterate through array',
      0.6
    );
    if (!animationController.isActive()) return;

    // Main search loop with perfect synchronization
    for (let i = 0; i < displayArray.length; i++) {
      if (!animationController.isActive()) break;
      
      // Update iteration counter
      animationController.setIteration(i);
      
      // Step 2: Highlight current element
      await animationController.syncStep(
        2,
        () => {
          animationController.highlightElement(i, 'checking');
        },
        () => {
          animationController.updateStackFrame({ 
            i, 
            currentValue: displayArray[i],
            target,
            operation: 'search'
          });
        },
        `Checking element at index ${i}: ${displayArray[i]}`,
        1.0
      );
      if (!animationController.isActive()) break;

      // Step 3: Compare values
      await animationController.syncStep(
        3,
        () => {},
        () => {},
        `Comparing ${displayArray[i]} with target ${target}`,
        0.8
      );
      if (!animationController.isActive()) break;

      // Step 4: Check if found
      if (displayArray[i] === target) {
        await animationController.syncStep(
          4,
          () => {
            animationController.highlightElement(i, 'found');
            animationController.setFoundIndex(i);
          },
          () => {},
          `🎉 Target found at index ${i}!`,
          1.5
        );
        
        // Step 5: Return found index
        await animationController.syncStep(
          5,
          () => {},
          () => {},
          `Returning index ${i}`,
          1.0
        );
        
        resetAnimation();
        return;
      } else {
        // Mark as checked and continue
        animationController.highlightElement(i, 'checked');
        await animationController.delay(0.3);
      }
    }

    // Step 6: Not found
    await animationController.syncStep(
      6,
      () => {},
      () => {},
      'Target not found in array',
      1.2
    );
    
    resetAnimation();
  }, [
    displayArray,
    searchValue,
    animationController,
    resetAnimation
  ]);

  const animateAccess = useCallback(async () => {
    const index = parseInt(accessIndex);
    if (isNaN(index) || !Number.isInteger(index) || index < 0 || index >= displayArray.length) {
      setAnimationStep(`Invalid index (0 to ${displayArray.length - 1})`);
      resetAnimation();
      return;
    }

    // Start animation controller
    animationController.start();

    // Step 0: Start access operation
    await animationController.syncStep(
      0,
      () => {},
      () => {},
      'Starting array access operation...',
      0.6
    );
    if (!animationController.isActive()) return;

    // Step 1: Validate index bounds
    await animationController.syncStep(
      1,
      () => {},
      () => {},
      `Validating index ${index} is within bounds [0, ${displayArray.length - 1}]`,
      0.8
    );
    if (!animationController.isActive()) return;

    // Step 2: Index is valid
    await animationController.syncStep(
      2,
      () => {},
      () => {},
      'Index is valid, proceeding with access',
      0.6
    );
    if (!animationController.isActive()) return;

    // Step 3: Calculate memory address and access
    await animationController.syncStep(
      3,
      () => {
        animationController.highlightElement(index, 'accessed');
      },
      () => {
        animationController.updateStackFrame({ 
          index, 
          value: displayArray[index],
          memoryAddress: `0x${(1000 + index * 4).toString(16)}`,
          operation: 'access'
        });
      },
      `Calculating memory address and accessing element`,
      1.0
    );
    if (!animationController.isActive()) return;

    // Step 4: Return value
    await animationController.syncStep(
      4,
      () => {},
      () => {},
      `✅ Accessed value ${displayArray[index]} at index ${index} - Time Complexity: O(1)`,
      1.5
    );
    
    resetAnimation();
  }, [
    accessIndex,
    displayArray,
    animationController,
    resetAnimation
  ]);

  const animateInsert = useCallback(async () => {
    const index = parseInt(insertIndex);
    const value = parseInt(insertValue);
    if (
      isNaN(index) ||
      !Number.isInteger(index) ||
      isNaN(value) ||
      !Number.isInteger(value) ||
      index < 0 ||
      index > displayArray.length
    ) {
      setAnimationStep(`Invalid index (0 to ${displayArray.length}) or value`);
      resetAnimation();
      return;
    }
    if (codeLanguage === 'c' && displayArray.length >= arraySize) {
      setAnimationStep('Array is full (fixed size in C)');
      resetAnimation();
      return;
    }

    animationController.start();
    
    let newDisplayArray = [...displayArray];
    let newMemoryArray = [...memoryArray];

    // Step 0: Start insertion
    await animationController.syncStep(
      0,
      () => {},
      () => {},
      'Starting array insertion operation...',
      0.6
    );
    if (!animationController.isActive()) return;

    // Step 1: Validate index bounds
    await animationController.syncStep(
      1,
      () => {},
      () => {},
      `Validating insertion index ${index} is valid [0, ${displayArray.length}]`,
      0.8
    );
    if (!animationController.isActive()) return;

    // Handle insertion logic based on position
    if (index < displayArray.length) {
      // Step 2: Need to shift elements
      await animationController.syncStep(
        2,
        () => {},
        () => {},
        'Index is in middle - need to shift elements right',
        0.8
      );
      if (!animationController.isActive()) return;

      // Step 3: Animate shifting elements
      await animationController.syncStep(
        3,
        () => {
          // Highlight elements that will be shifted
          const shiftStates = {};
          for (let i = index; i < displayArray.length; i++) {
            shiftStates[i] = 'shifting';
          }
          animationController.setElementStates(shiftStates);
        },
        () => {
          animationController.updateStackFrame({
            operation: 'insert',
            shiftFrom: index,
            shiftTo: displayArray.length,
            insertValue: value
          });
        },
        `Shifting elements from index ${index} to right...`,
        1.5
      );
      if (!animationController.isActive()) return;

      // Perform the shift
      newDisplayArray.splice(index, 0, value);
      newMemoryArray.splice(index, 0, value);
    } else {
      // Step 2: Simple append at end
      await animationController.syncStep(
        2,
        () => {},
        () => {},
        'Index is at end - simple append operation',
        0.6
      );
      if (!animationController.isActive()) return;

      newDisplayArray.push(value);
      newMemoryArray.push(value);
    }

    // Step 4: Insert the new value
    await animationController.syncStep(
      4,
      () => {
        animationController.highlightElement(index, 'inserted');
        setDisplayArray(newDisplayArray);
        setMemoryArray(newMemoryArray);
        setOriginalArray(newDisplayArray);
      },
      () => {
        animationController.updateStackFrame({
          operation: 'insert',
          index,
          newValue: value,
          arrayLength: newDisplayArray.length
        });
      },
      `Inserting value ${value} at index ${index}`,
      1.2
    );
    if (!animationController.isActive()) return;

    // Step 5: Update array size and complete
    await animationController.syncStep(
      5,
      () => {},
      () => {},
      `✅ Insertion complete! Array size: ${newDisplayArray.length} - Time Complexity: O(n)`,
      1.5
    );

    resetAnimation();
  }, [
    insertIndex,
    insertValue,
    displayArray,
    memoryArray,
    arraySize,
    codeLanguage,
    animationController,
    resetAnimation,
    setDisplayArray,
    setMemoryArray,
    setOriginalArray
  ]);

  const animateDelete = useCallback(async () => {
    const index = parseInt(deleteIndex);
    if (isNaN(index) || !Number.isInteger(index) || index < 0 || index >= displayArray.length) {
      setAnimationStep(`Invalid index (0 to ${displayArray.length - 1})`);
      resetAnimation();
      return;
    }

    animationController.start();
    
    const deletedValue = displayArray[index];
    let newDisplayArray = [...displayArray];
    let newMemoryArray = [...memoryArray];

    // Step 0: Start deletion
    await animationController.syncStep(
      0,
      () => {},
      () => {},
      'Starting array deletion operation...',
      0.6
    );
    if (!animationController.isActive()) return;

    // Step 1: Validate index
    await animationController.syncStep(
      1,
      () => {},
      () => {},
      `Validating deletion index ${index} is within bounds [0, ${displayArray.length - 1}]`,
      0.8
    );
    if (!animationController.isActive()) return;

    // Step 2: Mark element for deletion
    await animationController.syncStep(
      2,
      () => {
        animationController.highlightElement(index, 'deleting');
      },
      () => {
        animationController.updateStackFrame({
          operation: 'delete',
          index,
          deletedValue,
          arrayLength: displayArray.length
        });
      },
      `Marking element ${deletedValue} at index ${index} for deletion`,
      1.0
    );
    if (!animationController.isActive()) return;

    // Step 3: Shift elements left (if not last element)
    if (index < displayArray.length - 1) {
      await animationController.syncStep(
        3,
        () => {
          // Highlight elements that will be shifted
          const shiftStates = {};
          for (let i = index + 1; i < displayArray.length; i++) {
            shiftStates[i] = 'shifting';
          }
          animationController.setElementStates(shiftStates);
        },
        () => {},
        `Shifting elements from index ${index + 1} to left...`,
        1.5
      );
      if (!animationController.isActive()) return;
    }

    // Step 4: Perform deletion
    newDisplayArray.splice(index, 1);
    newMemoryArray.splice(index, 1);

    await animationController.syncStep(
      4,
      () => {
        setDisplayArray(newDisplayArray);
        setMemoryArray(newMemoryArray);
        setOriginalArray(newDisplayArray);
      },
      () => {
        animationController.updateStackFrame({
          operation: 'delete',
          deletedValue,
          newArrayLength: newDisplayArray.length
        });
      },
      `Removing element ${deletedValue} from array`,
      1.2
    );
    if (!animationController.isActive()) return;

    // Step 5: Complete deletion
    await animationController.syncStep(
      5,
      () => {},
      () => {},
      `✅ Deletion complete! Array size: ${newDisplayArray.length} - Time Complexity: O(n)`,
      1.5
    );

    resetAnimation();
  }, [
    deleteIndex,
    displayArray,
    memoryArray,
    animationController,
    resetAnimation,
    setDisplayArray,
    setMemoryArray,
    setOriginalArray
  ]);

  // Effect to handle animation triggering
  useEffect(() => {
    if (isPlaying) {
      setIsAnimating(true);
      switch (operation) {
        case 'search':
          animateSearch();
          break;
        case 'access':
          animateAccess();
          break;
        case 'insert':
          animateInsert();
          break;
        case 'delete':
          animateDelete();
          break;
        default:
          setIsPlaying(false);
          setIsAnimating(false);
      }
    } else {
      animationController.stop();
      setIsAnimating(false);
    }
  }, [isPlaying]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      animationController.stop();
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [animationController]);

  return null; // This component doesn't render anything
};

ArrayLogic.propTypes = {
  operation: PropTypes.oneOf(['search', 'access', 'insert', 'delete']).isRequired,
  isPlaying: PropTypes.bool.isRequired,
  speed: PropTypes.number.isRequired,
  searchValue: PropTypes.string,
  accessIndex: PropTypes.string,
  insertValue: PropTypes.string,
  insertIndex: PropTypes.string,
  deleteIndex: PropTypes.string,
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
  setFoundIndex: PropTypes.func.isRequired,
  setHeapMemory: PropTypes.func.isRequired,
  setCurrentStackFrame: PropTypes.func.isRequired,
  setCurrentIteration: PropTypes.func.isRequired,
  initializeMemoryModel: PropTypes.func.isRequired,
  isAnimating: PropTypes.bool
};

export default ArrayLogic;
