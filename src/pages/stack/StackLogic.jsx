import { useEffect, useCallback, useMemo } from 'react';
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
  setTopElement,
  setCurrentElementIndex,
  setCurrentCodeLine,
  setElementStates,
  setAnimationStep,
}) => {
  const animationController = useMemo(() => new AnimationController({
    setCurrentCodeLine,
    setCurrentElementIndex,
    setCurrentMemoryIndex: () => {}, // Not used in stack but required for compatibility
    setElementStates,
    setAnimationStep,
    setCurrentIteration: () => {}, // Not used in stack but required for compatibility
    setCurrentStackFrame: () => {}, // Not used in stack but required for compatibility
    setFoundIndex: () => {} // Not used in stack but required for compatibility
  }, speed), [speed, setCurrentCodeLine, setCurrentElementIndex, setElementStates, setAnimationStep]);

  useEffect(() => {
    animationController.setSpeed(speed);
  }, [speed, animationController]);

  const resetAnimation = useCallback(() => {
    setIsPlaying(false);
    setIsAnimating(false);
    setElementStates({});
    setCurrentElementIndex(-1);
    setCurrentCodeLine(-1);
    setAnimationStep('Ready for operation');
  }, [setIsPlaying, setIsAnimating, setElementStates, setCurrentElementIndex, setCurrentCodeLine, setAnimationStep]);

  const animatePush = useCallback(async () => {
    const value = parseInt(pushValue);
    if (isNaN(value)) {
      setAnimationStep('Invalid value. Please enter a number.');
      return;
    }
    
    try {
      setIsAnimating(true);
      
      // Step 1: Check for stack overflow
      await animationController.syncStep(
        7, 
        () => {
          setCurrentElementIndex(-1);
          setElementStates({});
        }, 
        () => {}, 
        'Checking for stack overflow...',
        0.8
      );
      if (!animationController.isActive()) return;

      if (stack.length >= maxSize) {
        await animationController.syncStep(
          8, 
          () => {}, 
          () => {}, 
          'Error: Stack Overflow!',
          1.5
        );
        resetAnimation();
        return;
      }

      // Step 2: Push the value and highlight
      const newIndex = stack.length;
      await animationController.syncStep(
        9, 
        () => {
          const newStack = [...stack, value];
          setStack(newStack);
          setCurrentElementIndex(newIndex);
          setElementStates({ [newIndex]: 'pushing' });
        }, 
        () => {}, 
        `Pushing ${value} onto the stack`,
        1.2
      );
      if (!animationController.isActive()) return;

      // Step 3: Complete push operation
      await animationController.syncStep(
        9, 
        () => {
          setElementStates({});
        }, 
        () => {}, 
        'Push complete.',
        1.0
      );
      resetAnimation();
    } catch (error) {
      setAnimationStep(`Error: ${error.message}`);
      resetAnimation();
    }
  }, [pushValue, stack, maxSize, animationController, setStack, setCurrentElementIndex, setElementStates, setAnimationStep, resetAnimation]);

  const animatePop = useCallback(async () => {
    setIsAnimating(true);

    await animationController.syncStep(
      4, 
      () => {}, 
      () => {}, 
      'Checking for stack underflow...',
      1.0
    );
    if (!animationController.isActive()) return;

    if (stack.length === 0) {
      await animationController.syncStep(
        5, 
        () => {}, 
        () => {}, 
        'Error: Stack Underflow!',
        1.5
      );
      resetAnimation();
      return;
    }

    const poppedValue = stack[stack.length - 1];
    const topIndex = stack.length - 1;
    await animationController.syncStep(
      6, 
      () => {
        setElementStates({ [topIndex]: 'popping' });
        setCurrentElementIndex(topIndex);
      }, 
      () => {}, 
      `Popping ${poppedValue} from the stack`,
      1.2
    );
    if (!animationController.isActive()) return;
    
    await animationController.delay(0.5);

    const newStack = stack.slice(0, -1);
    await animationController.syncStep(
      7, 
      () => {
        setStack(newStack);
        setElementStates({});
        setCurrentElementIndex(-1);
      }, 
      () => {}, 
      `Popped value: ${poppedValue}`,
      1.0
    );
    resetAnimation();
  }, [stack, animationController, setStack, setElementStates, setAnimationStep, setCurrentElementIndex, setIsAnimating, resetAnimation]);

  const animatePeek = useCallback(async () => {
    try {
      setIsAnimating(true);

      // Step 1: Check if stack is empty
      await animationController.syncStep(
        4, 
        () => {
          setCurrentElementIndex(-1);
          setElementStates({});
        }, 
        () => {}, 
        'Checking if stack is empty...',
        1.0
      );
      if (!animationController.isActive()) return;

      if (stack.length === 0) {
        await animationController.syncStep(
          5, 
          () => {}, 
          () => {}, 
          'Stack is empty. Cannot peek.',
          1.5
        );
        resetAnimation();
        return;
      }

      // Step 2: Highlight top element
      const topValue = stack[stack.length - 1];
      const topIndex = stack.length - 1;
      await animationController.syncStep(
        7, 
        () => {
          setCurrentElementIndex(topIndex);
          setElementStates({ [topIndex]: 'peeking' });
        }, 
        () => {}, 
        `Peeking at top element: ${topValue}`,
        1.0
      );
      if (!animationController.isActive()) return;

      await animationController.syncStep(
        8, 
        () => {
          setElementStates({});
        }, 
        () => {}, 
        `Top element is ${topValue}.`,
        1.0
      );
      resetAnimation();
    } catch (error) {
      setAnimationStep(`Error: ${error.message}`);
      resetAnimation();
    }
  }, [stack, animationController, setCurrentElementIndex, setElementStates, setAnimationStep, resetAnimation]);

  useEffect(() => {
    if (isPlaying) {
      setIsAnimating(true);
      switch (operation) {
        case 'push':
          animatePush();
          break;
        case 'pop':
          animatePop();
          break;
        case 'peek':
          animatePeek();
          break;
        default:
          setIsPlaying(false);
          setIsAnimating(false);
      }
    } else {
      // Stop any ongoing animation
      setIsAnimating(false);
    }
  }, [isPlaying, operation, animatePush, animatePop, animatePeek, setIsAnimating, setIsPlaying]);

  return null;
};

StackLogic.propTypes = {
  operation: PropTypes.oneOf(['push', 'pop', 'peek']).isRequired,
  isPlaying: PropTypes.bool.isRequired,
  speed: PropTypes.number.isRequired,
  pushValue: PropTypes.string,
  stack: PropTypes.array.isRequired,
  maxSize: PropTypes.number.isRequired,
  setIsAnimating: PropTypes.func.isRequired,
  setIsPlaying: PropTypes.func.isRequired,
  setStack: PropTypes.func.isRequired,
  setCurrentElementIndex: PropTypes.func.isRequired,
  setCurrentCodeLine: PropTypes.func.isRequired,
  setElementStates: PropTypes.func.isRequired,
  setAnimationStep: PropTypes.func.isRequired,
};

export default StackLogic;
