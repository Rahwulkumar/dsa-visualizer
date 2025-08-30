// Backup of working SearchingLogic before binary search enhancement
import React, { useEffect, useCallback, useRef } from 'react';

const SearchingLogic = ({
  displayArray,
  searchTarget,
  setSearchTarget,
  operation,
  isPlaying,
  setIsPlaying,
  isAnimating,
  setIsAnimating,
  speed,
  setCurrentElementIndex,
  setCurrentCodeLine,
  setCurrentMemoryIndex,
  setElementStates,
  setAnimationStep,
  setFoundIndex,
  setCurrentIteration,
  setComparisons,
  setSearchRange,
  setCurrentStackFrame,
  setHeapMemory
}) => {
  const stepsRef = useRef([]);
  const stepRef = useRef(0);

  // Generate a random search target from the array
  const generateSearchTarget = useCallback(() => {
    if (displayArray.length === 0) return null;
    // 70% chance to pick from array, 30% chance to pick random number not in array
    if (Math.random() < 0.7) {
      return displayArray[Math.floor(Math.random() * displayArray.length)];
    } else {
      // Generate a number not in the array
      let target;
      do {
        target = Math.floor(Math.random() * 100) + 1;
      } while (displayArray.includes(target));
      return target;
    }
  }, [displayArray]);

  // Linear Search Algorithm
  const generateLinearSearchSteps = useCallback((array, target) => {
    const steps = [];
    let comparisons = 0;

    // Step 1: Initialize
    steps.push({
      type: 'init',
      currentElementIndex: -1,
      currentCodeLine: 0,
      elementStates: {},
      animationStep: `Starting linear search for ${target}`,
      currentIteration: 0,
      comparisons: 0,
      foundIndex: -1
    });

    // Step 2: Start loop
    steps.push({
      type: 'loop_start',
      currentCodeLine: 1,
      animationStep: 'Starting loop through array',
      currentStackFrame: {
        function: 'linearSearch',
        variables: {
          'arr': `[${array.join(', ')}]`,
          'target': target,
          'i': 0
        }
      }
    });

    // Search through array
    for (let i = 0; i < array.length; i++) {
      // Move to current element
      steps.push({
        type: 'compare',
        currentElementIndex: i,
        currentCodeLine: 2,
        elementStates: (prev) => {
          const newStates = { ...prev };
          // Mark all previous elements as visited
          for (let j = 0; j < i; j++) {
            newStates[j] = 'visited';
          }
          // Mark current element as comparing
          newStates[i] = 'comparing';
          return newStates;
        },
        animationStep: `Checking element at index ${i}: ${array[i]}`,
        currentIteration: i + 1,
        currentStackFrame: {
          function: 'linearSearch',
          variables: {
            'arr': `[${array.join(', ')}]`,
            'target': target,
            'i': i
          }
        }
      });

      // Compare with target
      comparisons++;
      steps.push({
        type: 'comparison',
        currentCodeLine: 3,
        animationStep: `Comparing ${array[i]} with ${target}`,
        comparisons: comparisons
      });

      // Check if found
      if (array[i] === target) {
        steps.push({
          type: 'found',
          currentCodeLine: 4,
          elementStates: (prev) => {
            const newStates = { ...prev };
            newStates[i] = 'found';
            return newStates;
          },
          foundIndex: i,
          animationStep: `Found target ${target} at index ${i}!`
        });
        return steps;
      }
    }

    // Not found
    steps.push({
      type: 'not_found',
      currentElementIndex: -1,
      currentCodeLine: 5,
      elementStates: (prev) => {
        const newStates = { ...prev };
        // Mark all elements as visited
        for (let j = 0; j < array.length; j++) {
          newStates[j] = 'visited';
        }
        return newStates;
      },
      animationStep: `Target ${target} not found in array`,
      foundIndex: -1
    });

    return steps;
  }, []);

  // Enhanced Binary Search Algorithm with proper visualization
  const generateBinarySearchSteps = useCallback((array, target) => {
    const steps = [];
    let comparisons = 0;
    let foundIndex = -1;
    let left = 0;
    let right = array.length - 1;

    // Step 1: Initialize
    steps.push({
      type: 'init',
      currentElementIndex: -1,
      currentCodeLine: 0,
      elementStates: {},
      animationStep: `🎯 Starting binary search for target ${target} in sorted array`,
      currentIteration: 0,
      comparisons: 0,
      searchRange: { left: -1, right: -1, mid: -1 },
      foundIndex: -1
    });

    // Step 2: Show initial array and setup
    steps.push({
      type: 'setup',
      currentCodeLine: 1,
      animationStep: `📋 Array: [${array.join(', ')}] - Setting up search boundaries`,
      searchRange: { left, right, mid: -1 },
      elementStates: () => {
        const newStates = {};
        for (let i = 0; i < array.length; i++) {
          newStates[i] = 'inRange'; // All elements are initially in search range
        }
        return newStates;
      },
      currentStackFrame: {
        function: 'binarySearch',
        variables: {
          'arr': `[${array.join(', ')}]`,
          'target': target,
          'left': left,
          'right': right
        }
      }
    });

    // Step 3: Show initial boundaries
    steps.push({
      type: 'show_boundaries',
      currentCodeLine: 1,
      animationStep: `🔍 Initial boundaries: left = ${left}, right = ${right} (searching entire array)`,
      searchRange: { left, right, mid: -1 },
      elementStates: (prev) => {
        const newStates = { ...prev };
        // Highlight the boundaries
        newStates[left] = 'inRange';
        newStates[right] = 'inRange';
        return newStates;
      }
    });

    let iteration = 0;
    while (left <= right) {
      iteration++;
      
      // Step 4: Show while condition check
      steps.push({
        type: 'while_check',
        currentCodeLine: 2,
        animationStep: `🔄 Iteration ${iteration}: Check if left (${left}) <= right (${right}) → ${left <= right ? 'Continue' : 'Stop'}`,
        currentIteration: iteration,
        searchRange: { left, right, mid: -1 }
      });

      const mid = Math.floor((left + right) / 2);

      // Step 5: Calculate and highlight mid
      steps.push({
        type: 'calculate_mid',
        currentCodeLine: 3,
        currentElementIndex: mid,
        elementStates: (prev) => {
          const newStates = { ...prev };
          // Clear previous states and set new ones
          for (let i = 0; i < array.length; i++) {
            if (i < left || i > right) {
              newStates[i] = 'excluded'; // Outside current search range
            } else if (i === mid) {
              newStates[i] = 'comparing'; // Mid element being calculated
            } else {
              newStates[i] = 'inRange'; // In current search range
            }
          }
          return newStates;
        },
        animationStep: `📐 Calculate mid: (${left} + ${right}) ÷ 2 = ${mid} → Checking arr[${mid}] = ${array[mid]}`,
        currentIteration: iteration,
        searchRange: { left, right, mid },
        currentStackFrame: {
          function: 'binarySearch',
          variables: {
            'arr': `[${array.join(', ')}]`,
            'target': target,
            'left': left,
            'right': right,
            'mid': mid
          }
        }
      });

      // Step 6: Highlight the array division
      steps.push({
        type: 'show_division',
        currentCodeLine: 3,
        currentElementIndex: mid,
        elementStates: (prev) => {
          const newStates = { ...prev };
          for (let i = 0; i < array.length; i++) {
            if (i < left || i > right) {
              newStates[i] = 'excluded';
            } else if (i === mid) {
              newStates[i] = 'comparing'; // Mid element highlighted
            } else if (i >= left && i < mid) {
              newStates[i] = 'inRange'; // Left half
            } else if (i > mid && i <= right) {
              newStates[i] = 'inRange'; // Right half  
            }
          }
          return newStates;
        },
        animationStep: `✂️ Array split: Left[${left}..${mid-1}] | Mid[${mid}] | Right[${mid+1}..${right}]`,
        searchRange: { left, right, mid }
      });

      // Step 7: Compare with target
      comparisons++;
      steps.push({
        type: 'comparison',
        currentCodeLine: 4,
        currentElementIndex: mid,
        elementStates: (prev) => {
          const newStates = { ...prev };
          newStates[mid] = 'comparing';
          return newStates;
        },
        animationStep: `🔍 Compare: arr[${mid}] = ${array[mid]} vs target = ${target}`,
        comparisons: comparisons,
        searchRange: { left, right, mid }
      });

      if (array[mid] === target) {
        // Found the target
        foundIndex = mid;
        steps.push({
          type: 'found',
          currentCodeLine: 5,
          currentElementIndex: mid,
          elementStates: (prev) => {
            const newStates = { ...prev };
            newStates[mid] = 'found';
            return newStates;
          },
          foundIndex: foundIndex,
          animationStep: `🎉 SUCCESS! Found target ${target} at index ${mid}`,
          searchRange: { left, right, mid }
        });
        break;
      } else if (array[mid] < target) {
        // Search right half
        steps.push({
          type: 'decision_right',
          currentCodeLine: 6,
          currentElementIndex: mid,
          animationStep: `📊 ${array[mid]} < ${target} → Target is larger, search RIGHT half`,
          elementStates: (prev) => {
            const newStates = { ...prev };
            // Mark left half and mid as excluded
            for (let i = left; i <= mid; i++) {
              newStates[i] = 'excluded';
            }
            // Keep right half in range
            for (let i = mid + 1; i <= right; i++) {
              newStates[i] = 'inRange';
            }
            return newStates;
          },
          searchRange: { left, right, mid }
        });
        
        left = mid + 1;
        
        steps.push({
          type: 'update_left',
          currentCodeLine: 7,
          animationStep: `➡️ Update boundaries: left = ${left}, right = ${right} (eliminated left half)`,
          searchRange: { left, right, mid: -1 },
          elementStates: (prev) => {
            const newStates = { ...prev };
            // Update visualization for new range
            for (let i = 0; i < array.length; i++) {
              if (i < left || i > right) {
                newStates[i] = 'excluded';
              } else {
                newStates[i] = 'inRange';
              }
            }
            return newStates;
          },
          currentStackFrame: {
            function: 'binarySearch',
            variables: {
              'arr': `[${array.join(', ')}]`,
              'target': target,
              'left': left,
              'right': right
            }
          }
        });
      } else {
        // Search left half
        steps.push({
          type: 'decision_left',
          currentCodeLine: 8,
          currentElementIndex: mid,
          animationStep: `📊 ${array[mid]} > ${target} → Target is smaller, search LEFT half`,
          elementStates: (prev) => {
            const newStates = { ...prev };
            // Mark right half and mid as excluded
            for (let i = mid; i <= right; i++) {
              newStates[i] = 'excluded';
            }
            // Keep left half in range
            for (let i = left; i < mid; i++) {
              newStates[i] = 'inRange';
            }
            return newStates;
          },
          searchRange: { left, right, mid }
        });
        
        right = mid - 1;
        
        steps.push({
          type: 'update_right',
          currentCodeLine: 9,
          animationStep: `⬅️ Update boundaries: left = ${left}, right = ${right} (eliminated right half)`,
          searchRange: { left, right, mid: -1 },
          elementStates: (prev) => {
            const newStates = { ...prev };
            // Update visualization for new range
            for (let i = 0; i < array.length; i++) {
              if (i < left || i > right) {
                newStates[i] = 'excluded';
              } else {
                newStates[i] = 'inRange';
              }
            }
            return newStates;
          },
          currentStackFrame: {
            function: 'binarySearch',
            variables: {
              'arr': `[${array.join(', ')}]`,
              'target': target,
              'left': left,
              'right': right
            }
          }
        });
      }
    }

    // If not found
    if (foundIndex === -1) {
      steps.push({
        type: 'not_found',
        currentCodeLine: 10,
        elementStates: (prev) => {
          const newStates = { ...prev };
          // Mark all elements as excluded
          for (let i = 0; i < array.length; i++) {
            newStates[i] = 'excluded';
          }
          return newStates;
        },
        animationStep: `❌ Search exhausted! Target ${target} not found in array`,
        foundIndex: -1,
        searchRange: { left: -1, right: -1, mid: -1 }
      });
    }

    return steps;
  }, []);

  // Execute animation steps
  const executeStep = useCallback(async (step) => {
    if (step.currentElementIndex !== undefined) setCurrentElementIndex(step.currentElementIndex);
    if (step.currentCodeLine !== undefined) setCurrentCodeLine(step.currentCodeLine);
    if (step.currentMemoryIndex !== undefined) setCurrentMemoryIndex(step.currentMemoryIndex);
    if (step.elementStates !== undefined) {
      if (typeof step.elementStates === 'function') {
        setElementStates(step.elementStates);
      } else {
        setElementStates(step.elementStates);
      }
    }
    if (step.animationStep !== undefined) setAnimationStep(step.animationStep);
    if (step.foundIndex !== undefined) setFoundIndex(step.foundIndex);
    if (step.currentIteration !== undefined) setCurrentIteration(step.currentIteration);
    if (step.comparisons !== undefined) setComparisons(step.comparisons);
    if (step.searchRange !== undefined) setSearchRange(step.searchRange);
    if (step.currentStackFrame !== undefined) setCurrentStackFrame(step.currentStackFrame);

    // Update memory model
    if (step.currentElementIndex !== undefined) {
      setHeapMemory(prevMemory => ({
        ...prevMemory,
        elements: prevMemory.elements.map((element, index) => ({
          ...element,
          highlighted: index === step.currentElementIndex
        }))
      }));
    }
  }, [setCurrentElementIndex, setCurrentCodeLine, setCurrentMemoryIndex, setElementStates, setAnimationStep, setFoundIndex, setCurrentIteration, setComparisons, setSearchRange, setCurrentStackFrame, setHeapMemory]);

  // Animation control
  const runAnimation = useCallback(async () => {
    if (!isPlaying || stepsRef.current.length === 0) return;

    setIsAnimating(true);

    for (let i = stepRef.current; i < stepsRef.current.length; i++) {
      if (!isPlaying) break;

      stepRef.current = i;
      await executeStep(stepsRef.current[i]);
      await new Promise(resolve => setTimeout(resolve, speed));
    }

    setIsAnimating(false);
    setIsPlaying(false);
    stepRef.current = 0;
  }, [isPlaying, speed, executeStep, setIsAnimating, setIsPlaying]);

  // Start search when play is triggered
  useEffect(() => {
    if (isPlaying && !isAnimating && displayArray.length > 0) {
      let target = searchTarget;
      
      // Generate target if not set by user
      if (target === null) {
        target = generateSearchTarget();
        setSearchTarget(target);
      }
      
      // Generate steps
      if (operation === 'linearSearch') {
        stepsRef.current = generateLinearSearchSteps(displayArray, target);
      } else if (operation === 'binarySearch') {
        stepsRef.current = generateBinarySearchSteps(displayArray, target);
      }
      
      stepRef.current = 0;
      runAnimation();
    }
  }, [isPlaying, isAnimating, displayArray, searchTarget, operation, generateSearchTarget, setSearchTarget, generateLinearSearchSteps, generateBinarySearchSteps, runAnimation]);

  // Reset when array changes or operation changes
  useEffect(() => {
    stepRef.current = 0;
    stepsRef.current = [];
    // Don't reset searchTarget here - let user keep their input
  }, [displayArray, operation]);

  return null; // This component doesn't render anything
};

export default SearchingLogic;
