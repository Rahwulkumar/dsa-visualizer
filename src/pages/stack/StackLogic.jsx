import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import AnimationController from '../../utils/AnimationController';

const StackLogic = ({
  operation,
  isPlaying,
  speed,
  pushValue,
  stack,
  maxSize,
  setIsAnimating,
  setIsPlaying,
  setStack,
  setCurrentElementIndex,
  setCurrentMemoryIndex,
  setCurrentCodeLine,
  setElementStates,
  setAnimationStep,
  setCurrentIteration,
  setCurrentStackFrame,
  setHeapMemory,
  setFoundIndex,
  isAnimating
}) => {
  const animationRef = useRef(null);
  const runningRef = useRef(false);

  const animationController = useMemo(() => {
    return new AnimationController({
      setCurrentCodeLine,
      setCurrentElementIndex,
      setCurrentMemoryIndex: setCurrentMemoryIndex || setCurrentElementIndex,
      setElementStates,
      setAnimationStep,
      setCurrentIteration: setCurrentIteration || (() => {}),
      setCurrentStackFrame: setCurrentStackFrame || (() => {}),
      setHeapMemory: setHeapMemory || (() => {}),
      setFoundIndex: setFoundIndex || (() => {})
    }, speed);
  }, [setCurrentCodeLine, setCurrentElementIndex, setCurrentMemoryIndex, setElementStates, setAnimationStep, setCurrentIteration, setCurrentStackFrame, setHeapMemory, setFoundIndex, speed]);

  useEffect(() => {
    animationController.setSpeed(speed);
  }, [speed, animationController]);

  const resetAnimation = useCallback(() => {
    animationController.reset();
    setIsPlaying(false);
    setIsAnimating(false);
  runningRef.current = false;
    // keep current stack state
    if (animationRef.current) clearTimeout(animationRef.current);
  }, [animationController, setIsAnimating, setIsPlaying]);

  const finishAnimation = useCallback(() => {
    animationController.reset();
    setIsPlaying(false);
    setIsAnimating(false);
  runningRef.current = false;
    if (animationRef.current) clearTimeout(animationRef.current);
  }, [animationController, setIsAnimating, setIsPlaying]);

  const animatePush = useCallback(async () => {
    const value = parseInt(pushValue);
    if (isNaN(value) || !Number.isInteger(value)) {
      setAnimationStep('Invalid push value');
      resetAnimation();
      return;
    }
    if (stack.length >= maxSize) {
      setAnimationStep('Stack is full');
      resetAnimation();
      return;
    }

    animationController.start();

    // Step 0 - start
    const ok = await animationController.syncStep(
      0,
      () => {},
      () => {
        animationController.updateStackFrame({ value, targetIndex, operation: 'push', stackSize: stack.length });
      },
      `Starting push operation for value ${value}...`,
      0.8
    );
    if (!ok) return;

    // Step 1 - prepare push
    await animationController.syncStep(
      1,
      () => {},
      () => {},
      'Preparing to push element...',
      1.0
    );
    if (!animationController.isActive()) return;

    // Step 2 - highlight target index
    const targetIndex = stack.length; // will be new top
    await animationController.syncStep(
      2,
      () => {
        animationController.highlightElement(targetIndex, 'pushing');
      },
      () => {
        // show where element will go
        animationController.updateStackFrame({ targetIndex, operation: 'push_prepare' });
      },
      `Highlighting target index ${targetIndex}`,
      1.2
    );
    if (!animationController.isActive()) return;

    // Step 3 - push to stack
    await animationController.syncStep(
      3,
      () => {
        setStack(prev => {
          const newArr = [...prev, value];
          const heap = {
            stackObject: {
              address: '0x7f8b1c000000',
              size: newArr.length,
              data: newArr,
              top: newArr.length - 1
            },
            elements: newArr.map((v, i) => ({ address: `0x${(parseInt('7f8b1c000000', 16) + i * 4).toString(16)}`, value: v }))
          };
          animationController.updateHeapMemory(heap);
          return newArr;
        });
      },
      `Pushed ${value} onto stack`,
      1.5
    );
    if (!animationController.isActive()) return;

    // Step 4 - complete
    await animationController.syncStep(
      4,
      () => {},
      () => {},
      `✅ Successfully pushed ${value}`,
      1.0
    );

    finishAnimation();
  }, [pushValue, stack, maxSize, animationController, resetAnimation, finishAnimation, setAnimationStep, setStack]);

  const animatePop = useCallback(async () => {
    if (stack.length === 0) {
      setAnimationStep('Stack is empty - cannot pop');
      resetAnimation();
      return;
    }

    animationController.start();

    const topIndex = stack.length - 1;
    const topValue = stack[topIndex];

    const ok = await animationController.syncStep(
      0,
      () => {},
      () => {
        animationController.updateStackFrame({ topIndex, topValue, operation: 'pop', stackSize: stack.length });
      },
      'Starting pop operation...',
      0.8
    );
    if (!ok) return;

    await animationController.syncStep(
      1,
      () => {
        animationController.highlightElement(topIndex, 'popping');
      },
      () => {
        animationController.updateStackFrame({ topIndex, topValue, operation: 'pop_prepare' });
      },
      `Highlighting top element ${topValue} for removal`,
      1.2
    );
    if (!animationController.isActive()) return;

    await animationController.syncStep(
      2,
      () => {
        setStack(prev => {
          const newArr = prev.slice(0, -1);
          const heap = {
            stackObject: {
              address: '0x7f8b1c000000',
              size: newArr.length,
              data: newArr,
              top: newArr.length - 1
            },
            elements: newArr.map((v, i) => ({ address: `0x${(parseInt('7f8b1c000000', 16) + i * 4).toString(16)}`, value: v }))
          };
          animationController.updateHeapMemory(heap);
          return newArr;
        });
      },
      `Removed top element ${topValue}`,
      1.5
    );
    if (!animationController.isActive()) return;

    await animationController.syncStep(
      3,
      () => {},
      () => {},
      `✅ Successfully popped ${topValue}`,
      1.0
    );

    finishAnimation();
  }, [stack, animationController, resetAnimation, finishAnimation, setAnimationStep, setStack]);

  const animatePeek = useCallback(async () => {
    if (stack.length === 0) {
      setAnimationStep('Stack is empty - nothing to peek');
      resetAnimation();
      return;
    }

    animationController.start();

    const topIndex = stack.length - 1;
    const topValue = stack[topIndex];

    const ok = await animationController.syncStep(
      0,
      () => {},
      () => {
        animationController.updateStackFrame({ topIndex, topValue, operation: 'peek', stackSize: stack.length });
      },
      'Starting peek operation...',
      0.8
    );
    if (!ok) return;

    await animationController.syncStep(
      1,
      () => {
        animationController.highlightElement(topIndex, 'peeking');
      },
      () => {},
      `Peeking at top element ${topValue}`,
      1.5
    );
    if (!animationController.isActive()) return;

    await animationController.syncStep(
      2,
      () => {},
      () => {},
      `✅ Top element is: ${topValue}`,
      1.0
    );

    finishAnimation();
  }, [stack, animationController, resetAnimation, finishAnimation, setAnimationStep]);

  const animateDisplay = useCallback(async () => {
    if (stack.length === 0) {
      setAnimationStep('Stack is empty - nothing to display');
      resetAnimation();
      return;
    }

    animationController.start();

    // Step 0 - init
    const ok = await animationController.syncStep(
      0,
      () => {},
      () => {
        animationController.updateStackFrame({ operation: 'display', stackSize: stack.length });
      },
      'Starting display operation...',
      0.8
    );
    if (!ok) return;

    // Traverse from top to bottom
    for (let i = stack.length - 1; i >= 0; i--) {
      if (!animationController.isActive()) break;
      animationController.setIteration(stack.length - 1 - i);
      await animationController.syncStep(
        1,
        () => {
          animationController.highlightElement(i, 'displaying');
        },
        () => {
          animationController.updateStackFrame({ displayIndex: i, value: stack[i], operation: 'display_iter' });
        },
        `Displaying element ${i}: ${stack[i]}`,
        0.8
      );
    }

    await animationController.syncStep(
      2,
      () => {},
      () => {},
      `✅ Displayed all ${stack.length} elements in stack`,
      1.0
    );

    finishAnimation();
  }, [stack, animationController, resetAnimation, finishAnimation, setAnimationStep]);

  useEffect(() => {
    if (!isPlaying || isAnimating) return;
    if (runningRef.current) return; // already running

    runningRef.current = true;
    setIsAnimating(true);

    const runAnimation = async () => {
      try {
        switch (operation) {
          case 'push':
            await animatePush();
            break;
          case 'pop':
            await animatePop();
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
      } finally {
        runningRef.current = false;
      }
    };

    runAnimation();
  }, [
    isPlaying,
    isAnimating,
    operation,
    animatePush,
    animatePop,
    animatePeek,
    animateDisplay,
    setIsAnimating,
    setAnimationStep,
    resetAnimation
  ]);

  useEffect(() => {
    const timeout = animationRef.current;
    return () => {
      if (timeout) clearTimeout(timeout);
      animationController.cleanup();
    };
  }, [animationController]);

  return null;
};

StackLogic.propTypes = {
  operation: PropTypes.string.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  speed: PropTypes.number.isRequired,
  pushValue: PropTypes.string.isRequired,
  stack: PropTypes.array.isRequired,
  maxSize: PropTypes.number.isRequired,
  setIsAnimating: PropTypes.func.isRequired,
  setIsPlaying: PropTypes.func.isRequired,
  setStack: PropTypes.func.isRequired,
  setCurrentElementIndex: PropTypes.func.isRequired,
  setCurrentMemoryIndex: PropTypes.func,
  setCurrentCodeLine: PropTypes.func.isRequired,
  setElementStates: PropTypes.func.isRequired,
  setAnimationStep: PropTypes.func.isRequired,
  setCurrentIteration: PropTypes.func,
  setCurrentStackFrame: PropTypes.func,
  setHeapMemory: PropTypes.func,
  setFoundIndex: PropTypes.func,
  isAnimating: PropTypes.bool
};

export default StackLogic;
