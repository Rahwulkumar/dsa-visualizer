import { useState, useCallback, useRef } from 'react';
import AnimationController from '../../utils/AnimationController';

const useHashTableLogic = (initialTableSize = 7) => {
  const [hashTable, setHashTable] = useState(() => Array(initialTableSize).fill(null));
  const [tableSize, setTableSize] = useState(initialTableSize);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [currentKey, setCurrentKey] = useState(null);
  const [currentOperation, setCurrentOperation] = useState(null);
  const [animationStep, setAnimationStep] = useState(null);
  const [currentIteration, setCurrentIteration] = useState(null);
  const [currentCodeLine, setCurrentCodeLine] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(800);
  const [operationResult, setOperationResult] = useState(null);
  const [showHashCalculation, setShowHashCalculation] = useState(false);

  const animationControllerRef = useRef(null);
  const operationQueueRef = useRef([]);
  const currentStepRef = useRef(0);

  // Initialize animation controller
  if (!animationControllerRef.current) {
    animationControllerRef.current = new AnimationController();
  }

  // Hash function
  const hashFunction = useCallback((key) => {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash += key.charCodeAt(i);
    }
    return hash;
  }, []);

  // Calculate hash index
  const getHashIndex = useCallback((key) => {
    return hashFunction(key) % tableSize;
  }, [hashFunction, tableSize]);

  // Animation step executor
  const executeStep = useCallback(async (step) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setCurrentCodeLine(step.codeLine || 0);
        setAnimationStep(step.description);
        setCurrentIteration(step.iteration);
        setCurrentIndex(step.index);
        setCurrentKey(step.key);
        setShowHashCalculation(step.showHash || false);
        
        if (step.updateTable) {
          setHashTable(step.updateTable);
        }
        
        if (step.result !== undefined) {
          setOperationResult(step.result);
        }
        
        resolve();
      }, animationSpeed);
    });
  }, [animationSpeed]);

  // Insert operation
  const insertSteps = useCallback((key, value) => {
    const steps = [];
    const index = getHashIndex(key);
    let newTable = [...hashTable];
    
    steps.push({
      codeLine: 0,
      description: `Starting insert operation for key "${key}" with value "${value}"`,
      key: key,
      index: null,
      showHash: false
    });

    steps.push({
      codeLine: 1,
      description: `Calculating hash value for key "${key}"`,
      key: key,
      index: null,
      showHash: true
    });

    steps.push({
      codeLine: 2,
      description: `Hash index calculated: ${index}`,
      key: key,
      index: index,
      showHash: true
    });

    steps.push({
      codeLine: 3,
      description: `Checking bucket at index ${index} for collisions`,
      key: key,
      index: index,
      showHash: false
    });

    if (!newTable[index] || newTable[index].length === 0) {
      newTable[index] = [{ key, value }];
      
      steps.push({
        codeLine: 4,
        description: `Bucket is empty, creating new bucket`,
        key: key,
        index: index,
        updateTable: [...newTable]
      });

      steps.push({
        codeLine: 5,
        description: `Inserted key-value pair into new bucket`,
        key: key,
        index: index,
        updateTable: [...newTable]
      });
    } else {
      steps.push({
        codeLine: 6,
        description: `Bucket exists, checking for existing key`,
        key: key,
        index: index
      });

      let keyExists = false;
      for (let i = 0; i < newTable[index].length; i++) {
        steps.push({
          codeLine: 8,
          description: `Checking entry ${i + 1} in the chain`,
          key: key,
          index: index,
          iteration: i + 1
        });

        if (newTable[index][i].key === key) {
          newTable[index][i] = { key, value };
          keyExists = true;
          
          steps.push({
            codeLine: 9,
            description: `Key found! Updating existing value`,
            key: key,
            index: index,
            iteration: i + 1,
            updateTable: [...newTable]
          });

          steps.push({
            codeLine: 10,
            description: `Value updated successfully`,
            key: key,
            index: index,
            updateTable: [...newTable]
          });
          break;
        }
      }

      if (!keyExists) {
        newTable[index].push({ key, value });
        
        steps.push({
          codeLine: 11,
          description: `Key not found, adding to end of chain`,
          key: key,
          index: index,
          updateTable: [...newTable]
        });

        steps.push({
          codeLine: 12,
          description: `New key-value pair added to chain`,
          key: key,
          index: index,
          updateTable: [...newTable]
        });
      }
    }

    steps.push({
      codeLine: 13,
      description: `Insert operation completed successfully`,
      key: key,
      index: index,
      updateTable: [...newTable],
      result: { success: true, message: `Inserted "${key}": "${value}"` }
    });

    return steps;
  }, [hashTable, getHashIndex]);

  // Search operation
  const searchSteps = useCallback((key) => {
    const steps = [];
    const index = getHashIndex(key);
    
    steps.push({
      codeLine: 0,
      description: `Starting search operation for key "${key}"`,
      key: key,
      index: null,
      showHash: false
    });

    steps.push({
      codeLine: 1,
      description: `Calculating hash value for key "${key}"`,
      key: key,
      index: null,
      showHash: true
    });

    steps.push({
      codeLine: 2,
      description: `Hash index calculated: ${index}`,
      key: key,
      index: index,
      showHash: true
    });

    steps.push({
      codeLine: 3,
      description: `Checking if bucket exists at index ${index}`,
      key: key,
      index: index,
      showHash: false
    });

    if (!hashTable[index] || hashTable[index].length === 0) {
      steps.push({
        codeLine: 4,
        description: `Bucket is empty, key not found`,
        key: key,
        index: index,
        result: { success: false, message: `Key "${key}" not found` }
      });
    } else {
      steps.push({
        codeLine: 5,
        description: `Bucket exists, searching through chain`,
        key: key,
        index: index
      });

      let found = false;
      for (let i = 0; i < hashTable[index].length; i++) {
        steps.push({
          codeLine: 6,
          description: `Checking entry ${i + 1}: "${hashTable[index][i].key}"`,
          key: key,
          index: index,
          iteration: i + 1
        });

        if (hashTable[index][i].key === key) {
          found = true;
          steps.push({
            codeLine: 7,
            description: `Key found! Value is "${hashTable[index][i].value}"`,
            key: key,
            index: index,
            iteration: i + 1,
            result: { success: true, message: `Found "${key}": "${hashTable[index][i].value}"` }
          });
          break;
        }
      }

      if (!found) {
        steps.push({
          codeLine: 9,
          description: `Key not found in chain`,
          key: key,
          index: index,
          result: { success: false, message: `Key "${key}" not found` }
        });
      }
    }

    return steps;
  }, [hashTable, getHashIndex]);

  // Delete operation
  const deleteSteps = useCallback((key) => {
    const steps = [];
    const index = getHashIndex(key);
    let newTable = [...hashTable];
    
    steps.push({
      codeLine: 0,
      description: `Starting delete operation for key "${key}"`,
      key: key,
      index: null,
      showHash: false
    });

    steps.push({
      codeLine: 1,
      description: `Calculating hash value for key "${key}"`,
      key: key,
      index: null,
      showHash: true
    });

    steps.push({
      codeLine: 2,
      description: `Hash index calculated: ${index}`,
      key: key,
      index: index,
      showHash: true
    });

    steps.push({
      codeLine: 3,
      description: `Checking if bucket exists at index ${index}`,
      key: key,
      index: index,
      showHash: false
    });

    if (!newTable[index] || newTable[index].length === 0) {
      steps.push({
        codeLine: 4,
        description: `Bucket is empty, key not found`,
        key: key,
        index: index,
        result: { success: false, message: `Key "${key}" not found for deletion` }
      });
    } else {
      steps.push({
        codeLine: 5,
        description: `Bucket exists, searching for key to delete`,
        key: key,
        index: index
      });

      let found = false;
      for (let i = 0; i < newTable[index].length; i++) {
        steps.push({
          codeLine: 6,
          description: `Checking entry ${i + 1}: "${newTable[index][i].key}"`,
          key: key,
          index: index,
          iteration: i + 1
        });

        if (newTable[index][i].key === key) {
          found = true;
          
          steps.push({
            codeLine: 7,
            description: `Key found! Removing from chain`,
            key: key,
            index: index,
            iteration: i + 1
          });

          newTable[index].splice(i, 1);
          
          steps.push({
            codeLine: 8,
            description: `Entry removed from chain`,
            key: key,
            index: index,
            updateTable: [...newTable]
          });

          if (newTable[index].length === 0) {
            newTable[index] = null;
            steps.push({
              codeLine: 9,
              description: `Chain is empty, cleaning up bucket`,
              key: key,
              index: index,
              updateTable: [...newTable]
            });
          }

          steps.push({
            codeLine: 10,
            description: `Delete operation completed successfully`,
            key: key,
            index: index,
            updateTable: [...newTable],
            result: { success: true, message: `Deleted key "${key}"` }
          });
          break;
        }
      }

      if (!found) {
        steps.push({
          codeLine: 12,
          description: `Key not found in chain`,
          key: key,
          index: index,
          result: { success: false, message: `Key "${key}" not found for deletion` }
        });
      }
    }

    return steps;
  }, [hashTable, getHashIndex]);

  // Execute operation with animation
  const executeOperation = useCallback(async (operation, ...args) => {
    if (isAnimating) return;

    setIsAnimating(true);
    setIsPlaying(true);
    setOperationResult(null);
    setCurrentOperation(operation);

    let steps = [];
    switch (operation) {
      case 'insert':
        steps = insertSteps(args[0], args[1]);
        break;
      case 'search':
        steps = searchSteps(args[0]);
        break;
      case 'delete':
        steps = deleteSteps(args[0]);
        break;
      default:
        steps = [];
    }

    operationQueueRef.current = steps;
    currentStepRef.current = 0;

    // Execute steps
    for (let i = 0; i < steps.length; i++) {
      if (!isPlaying && animationControllerRef.current) {
        await animationControllerRef.current.pause();
      }
      await executeStep(steps[i]);
      currentStepRef.current = i + 1;
    }

    // Reset animation state
    setTimeout(() => {
      setIsAnimating(false);
      setIsPlaying(false);
      setCurrentIndex(null);
      setCurrentKey(null);
      setAnimationStep(null);
      setCurrentIteration(null);
      setCurrentCodeLine(0);
      setShowHashCalculation(false);
    }, 1000);
  }, [isAnimating, isPlaying, executeStep, insertSteps, searchSteps, deleteSteps]);

  // Public methods
  const insert = useCallback((key, value) => {
    executeOperation('insert', key, value);
  }, [executeOperation]);

  const search = useCallback((key) => {
    executeOperation('search', key);
  }, [executeOperation]);

  const deleteKey = useCallback((key) => {
    executeOperation('delete', key);
  }, [executeOperation]);

  const reset = useCallback(() => {
    if (animationControllerRef.current) {
      animationControllerRef.current.stop();
    }
    setHashTable(Array(tableSize).fill(null));
    setCurrentIndex(null);
    setCurrentKey(null);
    setCurrentOperation(null);
    setAnimationStep(null);
    setCurrentIteration(null);
    setCurrentCodeLine(0);
    setIsAnimating(false);
    setIsPlaying(false);
    setOperationResult(null);
    setShowHashCalculation(false);
    operationQueueRef.current = [];
    currentStepRef.current = 0;
  }, [tableSize]);

  const playPause = useCallback(() => {
    if (animationControllerRef.current) {
      if (isPlaying) {
        animationControllerRef.current.pause();
        setIsPlaying(false);
      } else {
        animationControllerRef.current.resume();
        setIsPlaying(true);
      }
    }
  }, [isPlaying]);

  const stepForward = useCallback(async () => {
    if (currentStepRef.current < operationQueueRef.current.length) {
      await executeStep(operationQueueRef.current[currentStepRef.current]);
      currentStepRef.current += 1;
    }
  }, [executeStep]);

  const changeTableSize = useCallback((newSize) => {
    if (!isAnimating && hashTable.every(bucket => !bucket || bucket.length === 0)) {
      setTableSize(newSize);
      setHashTable(Array(newSize).fill(null));
    }
  }, [isAnimating, hashTable]);

  // Calculate statistics
  const totalEntries = hashTable.reduce((total, bucket) => 
    total + (bucket ? bucket.length : 0), 0
  );
  
  const loadFactor = totalEntries / tableSize;

  return {
    // State
    hashTable,
    tableSize,
    currentIndex,
    currentKey,
    currentOperation,
    animationStep,
    currentIteration,
    currentCodeLine,
    isAnimating,
    isPlaying,
    animationSpeed,
    operationResult,
    showHashCalculation,
    totalEntries,
    loadFactor,

    // Methods
    insert,
    search,
    delete: deleteKey,
    reset,
    playPause,
    stepForward,
    setAnimationSpeed,
    changeTableSize
  };
};

export default useHashTableLogic;
