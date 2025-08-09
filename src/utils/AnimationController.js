/**
 * Animation Controller for synchronized array visualization
 * Ensures code highlighting, visual elements, and memory updates happen in perfect sync
 */
class AnimationController {
  constructor(callbacks, speed = 1000) {
    this.callbacks = callbacks;
    this.speed = speed;
    this.isRunning = false;
    this.currentTimeout = null;
  }

  setSpeed(newSpeed) {
    this.speed = newSpeed;
  }

  start() {
    this.isRunning = true;
  }

  stop() {
    this.isRunning = false;
    if (this.currentTimeout) {
      clearTimeout(this.currentTimeout);
      this.currentTimeout = null;
    }
  }

  isActive() {
    return this.isRunning;
  }

  /**
   * Synchronized step that updates code, visual, and memory simultaneously
   * @param {number} codeLineIndex - The code line to highlight
   * @param {Function} visualAction - Function to update visual elements
   * @param {Function} memoryAction - Function to update memory visualization
   * @param {string} stepDescription - Description for the animation step
   * @param {number} delayMultiplier - Multiply base speed by this factor
   */
  async syncStep(codeLineIndex, visualAction, memoryAction, stepDescription, delayMultiplier = 1) {
    if (!this.isRunning) return false;

    try {
      // Update all panels simultaneously
      this.callbacks.setCurrentCodeLine(codeLineIndex);
      this.callbacks.setAnimationStep(stepDescription);
      
      // Execute visual and memory actions
      if (visualAction) await visualAction();
      if (memoryAction) await memoryAction();

      // Wait for the specified duration
      await this.delay(delayMultiplier);
      return true;
    } catch (error) {
      console.error('Animation step error:', error);
      return false;
    }
  }

  /**
   * Update element highlighting with proper state management
   */
  highlightElement(index, state = 'checking') {
    if (!this.isRunning) return;
    
    this.callbacks.setCurrentElementIndex(index);
    this.callbacks.setCurrentMemoryIndex(index);
    this.callbacks.setElementStates(prev => ({
      ...prev,
      [index]: state
    }));
  }

  /**
   * Clear element highlighting
   */
  clearElementHighlight(index) {
    if (!this.isRunning) return;
    
    this.callbacks.setElementStates(prev => {
      const newStates = { ...prev };
      delete newStates[index];
      return newStates;
    });
  }

  /**
   * Set multiple element states at once
   */
  setElementStates(states) {
    if (!this.isRunning) return;
    
    this.callbacks.setElementStates(prev => ({
      ...prev,
      ...states
    }));
  }

  /**
   * Update iteration counter for loops
   */
  setIteration(iteration) {
    if (!this.isRunning) return;
    
    this.callbacks.setCurrentIteration(iteration);
  }

  /**
   * Update stack frame for memory visualization
   */
  updateStackFrame(frame) {
    if (!this.isRunning) return;
    
    this.callbacks.setCurrentStackFrame(frame);
  }

  /**
   * Set found index for search operations
   */
  setFoundIndex(index) {
    if (!this.isRunning) return;
    
    this.callbacks.setFoundIndex(index);
  }

  /**
   * Controlled delay that can be interrupted
   */
  delay(multiplier = 1) {
    return new Promise((resolve) => {
      if (!this.isRunning) {
        resolve();
        return;
      }

      this.currentTimeout = setTimeout(() => {
        this.currentTimeout = null;
        resolve();
      }, this.speed * multiplier);
    });
  }

  /**
   * Reset all animation states
   */
  reset() {
    this.stop();
    
    // Reset all states to initial values
    this.callbacks.setCurrentElementIndex(-1);
    this.callbacks.setCurrentCodeLine(-1);
    this.callbacks.setCurrentMemoryIndex(-1);
    this.callbacks.setElementStates({});
    this.callbacks.setCurrentIteration(-1);
    this.callbacks.setAnimationStep('Ready for operation');
    this.callbacks.setFoundIndex(-1);
    this.callbacks.setCurrentStackFrame(null);
  }
}

export default AnimationController;
