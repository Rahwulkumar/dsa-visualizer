import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import AnimationController from '../../utils/AnimationController';

const QueueLogic = ({
  operation,
  isPlaying,
  speed,
  enqueueValue,
  displayQueue,
  memoryQueue,
  // eslint-disable-next-line no-unused-vars
  codeLanguage,
  queueSize,
  front,
  rear,
  setIsAnimating,
  setIsPlaying,
  setDisplayQueue,
  setMemoryQueue,
  // eslint-disable-next-line no-unused-vars
  setOriginalQueue,
  setCurrentElementIndex,
  setCurrentCodeLine,
  setCurrentMemoryIndex,
  setElementStates,
  setAnimationStep,
  setFoundIndex,
  setHeapMemory,
  setCurrentStackFrame,
  setCurrentIteration,
  setFront,
  setRear,
  setPeekValue,
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
      setFoundIndex,
      setHeapMemory
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
    setHeapMemory,
    speed
  ]);

  // Update animation controller speed when speed changes
  useEffect(() => {
    animationController.setSpeed(speed);
  }, [speed, animationController]);

  // Debug: Warn if isAnimating is undefined
  useEffect(() => {
    if (isAnimating === undefined) {
      console.warn('isAnimating prop is undefined in QueueLogic. Check props passed from QueueVisualizerPage.');
    }
  }, [isAnimating]);

  const resetAnimation = useCallback(() => {
    animationController.reset();
    setIsPlaying(false);
    setIsAnimating(false);
    setDisplayQueue([...displayQueue]);
    setMemoryQueue([...memoryQueue]);
    initializeMemoryModel();
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
  }, [
    animationController,
    displayQueue,
    memoryQueue,
    setIsPlaying,
    setIsAnimating,
    setDisplayQueue,
    setMemoryQueue,
    initializeMemoryModel
  ]);

  const finishAnimation = useCallback(() => {
    animationController.reset();
    setIsPlaying(false);
    setIsAnimating(false);
    // Don't reset the queue state - keep the current state
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
  }, [
    animationController,
    setIsPlaying,
    setIsAnimating
  ]);

  const animateEnqueue = useCallback(async () => {
    const value = parseInt(enqueueValue);
    if (isNaN(value) || !Number.isInteger(value)) {
      setAnimationStep('Invalid enqueue value');
      resetAnimation();
      return;
    }
    if (displayQueue.length >= queueSize) {
      setAnimationStep('Queue is full');
      resetAnimation();
      return;
    }

    // Start animation controller
    animationController.start();
    
    // Step 0: Initialize enqueue operation
    const success = await animationController.syncStep(
      0, // code line
      () => {}, // no visual action yet
      () => {
        animationController.updateStackFrame({ 
          value,
          rear: rear,
          operation: 'enqueue',
          queueSize: displayQueue.length
        });
      }, // memory action
      `Starting enqueue operation for value ${value}...`, // description
      0.8 // delay multiplier
    );
    if (!success) return;

    // Step 1: Check if queue is full
    await animationController.syncStep(
      1,
      () => {},
      () => {
        animationController.updateStackFrame({ 
          value,
          rear: rear,
          operation: 'enqueue',
          queueSize: displayQueue.length,
          maxSize: queueSize,
          isFull: displayQueue.length >= queueSize
        });
      },
      'Checking if queue is full...',
      1.0
    );
    if (!animationController.isActive()) return;

    // Step 2: Increment rear pointer
    const newRear = displayQueue.length === 0 ? 0 : rear + 1;
    await animationController.syncStep(
      2,
      () => {
        setRear(newRear);
      },
      () => {
        animationController.updateStackFrame({ 
          value,
          oldRear: rear,
          newRear: newRear,
          operation: 'enqueue'
        });
      },
      `Moving rear pointer to position ${newRear}`,
      1.2
    );
    if (!animationController.isActive()) return;

    // Step 3: Add element to queue
    await animationController.syncStep(
      3,
      () => {
        const newQueue = [...displayQueue, value];
        setDisplayQueue(newQueue);
        setMemoryQueue(newQueue);
        animationController.highlightElement(newQueue.length - 1, 'enqueuing');
        
        // Update peek value if this is the first element
        if (displayQueue.length === 0) {
          setPeekValue(value);
          setFront(0);
        }
      },
      () => {
        const newQueue = [...displayQueue, value];
        setHeapMemory({
          queueObject: { 
            address: '0x7f8b1c000000', 
            size: newQueue.length, 
            data: newQueue, 
            front: displayQueue.length === 0 ? 0 : front, 
            rear: newRear 
          },
          elements: newQueue.map((val, index) => ({
            address: `0x${(parseInt('7f8b1c000000', 16) + index * 4).toString(16)}`,
            value: val
          }))
        });
      },
      `Adding element ${value} to rear of queue`,
      1.5
    );
    if (!animationController.isActive()) return;

    // Step 4: Enqueue complete
    await animationController.syncStep(
      4,
      () => {},
      () => {},
      `✅ Successfully enqueued ${value}. Queue size: ${displayQueue.length + 1}`,
      1.0
    );
    
    finishAnimation();
  }, [
    enqueueValue,
    displayQueue,
    queueSize,
    rear,
    front,
    animationController,
    resetAnimation,
    finishAnimation,
    setAnimationStep,
    setRear,
    setDisplayQueue,
    setMemoryQueue,
    setPeekValue,
    setFront,
    setHeapMemory
  ]);

  const animateDequeue = useCallback(async () => {
    if (displayQueue.length === 0) {
      setAnimationStep('Queue is empty - cannot dequeue');
      resetAnimation();
      return;
    }

    // Start animation controller
    animationController.start();
    
    const frontElement = displayQueue[front];
    
    // Step 0: Initialize dequeue operation
    const success = await animationController.syncStep(
      0,
      () => {},
      () => {
        animationController.updateStackFrame({ 
          frontElement,
          front: front,
          operation: 'dequeue',
          queueSize: displayQueue.length
        });
      },
      'Starting dequeue operation...',
      0.8
    );
    if (!success) return;

    // Step 1: Check if queue is empty
    await animationController.syncStep(
      1,
      () => {},
      () => {
        animationController.updateStackFrame({ 
          frontElement,
          front: front,
          operation: 'dequeue',
          queueSize: displayQueue.length,
          isEmpty: displayQueue.length === 0
        });
      },
      'Checking if queue is empty...',
      1.0
    );
    if (!animationController.isActive()) return;

    // Step 2: Highlight element to be removed
    await animationController.syncStep(
      2,
      () => {
        animationController.highlightElement(front, 'dequeuing');
      },
      () => {},
      `Highlighting front element (${frontElement}) for removal`,
      1.2
    );
    if (!animationController.isActive()) return;

    // Step 3: Remove element and update front pointer
    await animationController.syncStep(
      3,
      () => {
        const newQueue = displayQueue.slice(1); // Remove first element
        setDisplayQueue(newQueue);
        setMemoryQueue(newQueue);
        
        // Update front and rear pointers
        if (newQueue.length === 0) {
          setFront(0);
          setRear(-1);
          setPeekValue(null);
        } else {
          setFront(0); // Reset front to 0 for simplicity
          setRear(newQueue.length - 1);
          setPeekValue(newQueue[0]);
        }
      },
      () => {
        const newQueue = displayQueue.slice(1);
        setHeapMemory({
          queueObject: { 
            address: '0x7f8b1c000000', 
            size: newQueue.length, 
            data: newQueue, 
            front: newQueue.length === 0 ? 0 : 0, 
            rear: newQueue.length === 0 ? -1 : newQueue.length - 1
          },
          elements: newQueue.map((val, index) => ({
            address: `0x${(parseInt('7f8b1c000000', 16) + index * 4).toString(16)}`,
            value: val
          }))
        });
      },
      `Removing element ${frontElement} from front of queue`,
      1.5
    );
    if (!animationController.isActive()) return;

    // Step 4: Dequeue complete
    await animationController.syncStep(
      4,
      () => {},
      () => {},
      `✅ Successfully dequeued ${frontElement}. Queue size: ${displayQueue.length - 1}`,
      1.0
    );
    
    finishAnimation();
  }, [
    displayQueue,
    front,
    animationController,
    resetAnimation,
    finishAnimation,
    setAnimationStep,
    setDisplayQueue,
    setMemoryQueue,
    setFront,
    setRear,
    setPeekValue,
    setHeapMemory
  ]);

  const animatePeek = useCallback(async () => {
    if (displayQueue.length === 0) {
      setAnimationStep('Queue is empty - nothing to peek');
      resetAnimation();
      return;
    }

    // Start animation controller
    animationController.start();
    
    const frontElement = displayQueue[front];
    
    // Step 0: Initialize peek operation
    const success = await animationController.syncStep(
      0,
      () => {},
      () => {
        animationController.updateStackFrame({ 
          operation: 'peek',
          queueSize: displayQueue.length
        });
      },
      'Starting peek operation...',
      0.8
    );
    if (!success) return;

    // Step 1: Check if queue is empty
    await animationController.syncStep(
      1,
      () => {},
      () => {
        animationController.updateStackFrame({ 
          operation: 'peek',
          queueSize: displayQueue.length,
          isEmpty: displayQueue.length === 0
        });
      },
      'Checking if queue is empty...',
      1.0
    );
    if (!animationController.isActive()) return;

    // Step 2: Highlight front element
    await animationController.syncStep(
      2,
      () => {
        animationController.highlightElement(front, 'peeking');
      },
      () => {
        animationController.updateStackFrame({ 
          frontElement,
          front: front,
          operation: 'peek'
        });
      },
      `Accessing front element at index ${front}`,
      1.5
    );
    if (!animationController.isActive()) return;

    // Step 3: Return front element value
    await animationController.syncStep(
      3,
      () => {},
      () => {},
      `✅ Front element is: ${frontElement}`,
      1.5
    );
    
    finishAnimation();
  }, [
    displayQueue,
    front,
    animationController,
    resetAnimation,
    finishAnimation,
    setAnimationStep
  ]);

  const animateDisplay = useCallback(async () => {
    if (displayQueue.length === 0) {
      setAnimationStep('Queue is empty - nothing to display');
      resetAnimation();
      return;
    }

    // Start animation controller
    animationController.start();
    
    // Step 0: Initialize display operation
    const success = await animationController.syncStep(
      0,
      () => {},
      () => {
        animationController.updateStackFrame({ 
          operation: 'display',
          queueSize: displayQueue.length,
          front: front,
          rear: rear
        });
      },
      'Starting queue display operation...',
      0.8
    );
    if (!success) return;

    // Step 1: Traverse and highlight each element
    for (let i = 0; i < displayQueue.length; i++) {
      if (!animationController.isActive()) break;
      
      animationController.setIteration(i);
      
      await animationController.syncStep(
        1,
        () => {
          animationController.highlightElement(i, 'displaying');
        },
        () => {
          animationController.updateStackFrame({ 
            currentIndex: i,
            currentValue: displayQueue[i],
            operation: 'display',
            progress: `${i + 1}/${displayQueue.length}`
          });
        },
        `Displaying element ${i}: ${displayQueue[i]}`,
        0.8
      );
    }

    // Step 2: Display complete
    await animationController.syncStep(
      2,
      () => {},
      () => {},
      `✅ Displayed all ${displayQueue.length} elements in queue`,
      1.0
    );
    
    finishAnimation();
  }, [
    displayQueue,
    front,
    rear,
    animationController,
    resetAnimation,
    finishAnimation,
    setAnimationStep
  ]);

  // Main effect to handle animation triggers
  useEffect(() => {
    if (!isPlaying || isAnimating) return;

    setIsAnimating(true);

    const runAnimation = async () => {
      try {
        switch (operation) {
          case 'enqueue':
            await animateEnqueue();
            break;
          case 'dequeue':
            await animateDequeue();
            break;
          case 'peek':
            await animatePeek();
            break;
          case 'display':
            await animateDisplay();
            break;
          default:
            setAnimationStep('Unknown operation');
            resetAnimation();
        }
      } catch (error) {
        console.error('Animation error:', error);
        resetAnimation();
      }
    };

    runAnimation();
  }, [
    isPlaying,
    isAnimating,
    operation,
    animateEnqueue,
    animateDequeue,
    animatePeek,
    animateDisplay,
    setIsAnimating,
    setAnimationStep,
    resetAnimation
  ]);

  // Cleanup on unmount
  useEffect(() => {
    const timeout = animationRef.current;
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
      animationController.cleanup();
    };
  }, [animationController]);

  return null; // This component only handles logic, no rendering
};

QueueLogic.propTypes = {
  operation: PropTypes.string.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  speed: PropTypes.number.isRequired,
  enqueueValue: PropTypes.string.isRequired,
  displayQueue: PropTypes.array.isRequired,
  memoryQueue: PropTypes.array.isRequired,
  codeLanguage: PropTypes.string.isRequired,
  queueSize: PropTypes.number.isRequired,
  front: PropTypes.number.isRequired,
  rear: PropTypes.number.isRequired,
  setIsAnimating: PropTypes.func.isRequired,
  setIsPlaying: PropTypes.func.isRequired,
  setDisplayQueue: PropTypes.func.isRequired,
  setMemoryQueue: PropTypes.func.isRequired,
  setOriginalQueue: PropTypes.func.isRequired,
  setCurrentElementIndex: PropTypes.func.isRequired,
  setCurrentCodeLine: PropTypes.func.isRequired,
  setCurrentMemoryIndex: PropTypes.func.isRequired,
  setElementStates: PropTypes.func.isRequired,
  setAnimationStep: PropTypes.func.isRequired,
  setFoundIndex: PropTypes.func.isRequired,
  setHeapMemory: PropTypes.func.isRequired,
  setCurrentStackFrame: PropTypes.func.isRequired,
  setCurrentIteration: PropTypes.func.isRequired,
  setFront: PropTypes.func.isRequired,
  setRear: PropTypes.func.isRequired,
  setPeekValue: PropTypes.func.isRequired,
  initializeMemoryModel: PropTypes.func.isRequired,
  isAnimating: PropTypes.bool
};

export default QueueLogic;
