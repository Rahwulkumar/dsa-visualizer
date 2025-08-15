import React, { useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import AnimationController from '../../utils/AnimationController';

const LinkedListLogic = ({
  operation,
  isPlaying,
  speed,
  searchValue,
  insertValue,
  insertPosition,
  deleteValue,
  deletePosition,
  displayList,
  memoryList,
  codeLanguage,
  listSize,
  setIsAnimating,
  setIsPlaying,
  setDisplayList,
  setMemoryList,
  setOriginalList,
  setCurrentNodeIndex,
  setCurrentCodeLine,
  setCurrentMemoryIndex,
  setNodeStates,
  setAnimationStep,
  setFoundIndex,
  setHeapMemory,
  setCurrentStackFrame,
  setCurrentIteration,
  initializeMemoryModel,
  isAnimating
}) => {
  const animationRef = useRef(null);
  const animationControllerRef = useRef(null);
  
  // Create animation controller once on first render
  if (!animationControllerRef.current) {
    animationControllerRef.current = new AnimationController({
      setCurrentCodeLine,
      setCurrentElementIndex: setCurrentNodeIndex,
      setCurrentMemoryIndex,
      setElementStates: setNodeStates,
      setAnimationStep,
      setCurrentIteration,
      setCurrentStackFrame,
      setFoundIndex,
      setHeapMemory
    }, speed);
  }
  
  const animationController = animationControllerRef.current;
  
  // Update callbacks and speed when they change
  useEffect(() => {
    animationController.callbacks = {
      setCurrentCodeLine,
      setCurrentElementIndex: setCurrentNodeIndex,
      setCurrentMemoryIndex,
      setElementStates: setNodeStates,
      setAnimationStep,
      setCurrentIteration,
      setCurrentStackFrame,
      setFoundIndex,
      setHeapMemory
    };
    animationController.setSpeed(speed);
  }, [
    animationController,
    setCurrentCodeLine,
    setCurrentNodeIndex,
    setCurrentMemoryIndex,
    setNodeStates,
    setAnimationStep,
    setCurrentIteration,
    setCurrentStackFrame,
    setFoundIndex,
    setHeapMemory,
    speed
  ]);

  // Debug: Warn if isAnimating is undefined
  useEffect(() => {
    if (isAnimating === undefined) {
      console.warn('isAnimating prop is undefined in LinkedListLogic. Check props passed from LinkedListVisualizerPage.');
    }
  }, [isAnimating]);

  // Helper function to generate heap memory layout for linked list nodes
  const generateHeapMemory = useCallback((nodeList) => {
    if (!nodeList || nodeList.length === 0) {
      return {
        totalAllocated: 0,
        nodes: {},
        freeBlocks: [
          { address: 0x7F8B1D000000, size: 64 },
          { address: 0x7F8B1E000000, size: 128 }
        ]
      };
    }

    const heapData = {
      totalAllocated: nodeList.length * 16, // Each node takes ~16 bytes (data + pointer)
      nodes: {},
      freeBlocks: [
        // Simulate some free memory blocks
        { address: 0x7F8B1D000000, size: 64 },
        { address: 0x7F8B1E000000, size: 128 }
      ]
    };

    // Generate scattered addresses for each node
    nodeList.forEach((node, index) => {
      const baseAddress = 0x7F8B1C000000 + (index * 0x1000) + Math.floor(Math.random() * 0x500);
      heapData.nodes[`node_${node.id || index}`] = {
        address: baseAddress,
        size: 16,
        type: 'ListNode',
        data: node.data,
        next: index < nodeList.length - 1 ? 
          (0x7F8B1C000000 + ((index + 1) * 0x1000) + Math.floor(Math.random() * 0x500)) : 
          null,
        allocated: true,
        index: index
      };
    });

    return heapData;
  }, []);

  // Enhanced function to update heap memory during operations
  const updateHeapMemoryDuringOperation = useCallback((currentList, operationType, nodeInfo = null) => {
    if (!animationController) return;
    
    const heapMemory = generateHeapMemory(currentList);
    
    // Add operation-specific information to heap memory
    if (operationType === 'insert' && nodeInfo) {
      heapMemory.operationInfo = {
        type: 'insert',
        newNode: nodeInfo,
        timestamp: Date.now()
      };
    } else if (operationType === 'delete' && nodeInfo) {
      heapMemory.operationInfo = {
        type: 'delete',
        deletedNode: nodeInfo,
        timestamp: Date.now()
      };
    }
    
    animationController.updateHeapMemory(heapMemory);
    
    // Also update the main heapMemory state
    setHeapMemory({
      linkedList: {
        type: 'LinkedList',
        address: currentList.length > 0 ? currentList[0].address || '0x7F8B1C000000' : null,
        data: currentList.map(node => node.data),
        nodes: currentList.map((node, index) => ({
          address: node.address || `0x${(0x7F8B1C000000 + index * 0x1000).toString(16).toUpperCase()}`,
          data: node.data,
          next: index < currentList.length - 1 ? 
            (currentList[index + 1].address || `0x${(0x7F8B1C000000 + (index + 1) * 0x1000).toString(16).toUpperCase()}`) : 
            'NULL',
          index: index
        }))
      },
      ...heapMemory
    });
  }, [animationController, generateHeapMemory, setHeapMemory]);

  const resetAnimation = useCallback(() => {
    animationController.reset();
    setIsPlaying(false);
    setIsAnimating(false);
    // Don't reset displayList and memoryList for operations that modify data
    // setDisplayList([...displayList]);
    // setMemoryList([...memoryList]);
    initializeMemoryModel();
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
  }, [
    animationController,
    // displayList,
    // memoryList,
    setIsPlaying,
    setIsAnimating,
    // setDisplayList,
    // setMemoryList,
    initializeMemoryModel
  ]);

  const animateSearch = useCallback(async () => {
    const target = parseInt(searchValue);
    if (isNaN(target) || !Number.isInteger(target) || searchValue.trim() === '') {
      setAnimationStep('Please enter a valid search value');
      resetAnimation();
      return;
    }

    if (displayList.length === 0) {
      setAnimationStep('Linked list is empty');
      resetAnimation();
      return;
    }

    // Start animation controller
    animationController.start();
    
    // Initialize and update heap memory layout
    updateHeapMemoryDuringOperation(displayList, 'search');
    
    // Step 0: Initialize search - start at head
    await animationController.syncStep(
      0,
      () => {},
      () => {},
      'Starting linked list search from head...',
      0.8
    );
    if (!animationController.isActive()) return;

    // Step 1: Set current pointer to head
    await animationController.syncStep(
      1,
      () => {
        animationController.highlightElement(0, 'checking');
      },
      () => {
        animationController.updateStackFrame({ 
          current: displayList[0],
          target,
          position: 0,
          operation: 'search'
        });
      },
      'Setting current pointer to head node',
      1.0
    );
    if (!animationController.isActive()) return;

    // Main search loop through linked list
    for (let i = 0; i < displayList.length; i++) {
      if (!animationController.isActive()) break;
      
      // Update iteration counter
      animationController.setIteration(i);
      
      // Step 2: Check current node's data
      await animationController.syncStep(
        2,
        () => {
          animationController.highlightElement(i, 'checking');
        },
        () => {
          animationController.updateStackFrame({ 
            current: displayList[i],
            currentData: displayList[i].data,
            target,
            position: i,
            operation: 'search'
          });
        },
        `Checking node at position ${i}: data = ${displayList[i].data}`,
        1.2
      );
      if (!animationController.isActive()) break;

      // Step 3: Compare current data with target
      await animationController.syncStep(
        3,
        () => {},
        () => {},
        `Comparing ${displayList[i].data} with target ${target}`,
        0.8
      );
      if (!animationController.isActive()) break;

      // Step 4: Check if found
      if (displayList[i].data === target) {
        await animationController.syncStep(
          4,
          () => {
            animationController.highlightElement(i, 'found');
            animationController.setFoundIndex(i);
          },
          () => {},
          `🎉 Target ${target} found at position ${i}!`,
          1.5
        );
        
        // Step 5: Return found node
        await animationController.syncStep(
          5,
          () => {},
          () => {},
          `Returning node at position ${i}`,
          1.0
        );
        
        resetAnimation();
        return;
      } else {
        // Mark as checked
        animationController.highlightElement(i, 'checked');
        
        // Step 6: Move to next node (if exists)
        if (i < displayList.length - 1) {
          await animationController.syncStep(
            6,
            () => {},
            () => {},
            `Moving to next node via pointer...`,
            0.8
          );
          if (!animationController.isActive()) break;
        }
      }
    }

    // Step 7: Reached end of list - not found
    await animationController.syncStep(
      7,
      () => {},
      () => {},
      'Reached NULL - Target not found in linked list',
      1.2
    );
    
    resetAnimation();
  }, [
    displayList,
    searchValue,
    animationController,
    resetAnimation,
    setAnimationStep,
    updateHeapMemoryDuringOperation
  ]);

  const animateInsert = useCallback(async () => {
    const position = parseInt(insertPosition);
    const value = parseInt(insertValue);
    
    if (isNaN(value) || !Number.isInteger(value) || insertValue.trim() === '') {
      setAnimationStep('Please enter a valid insert value');
      resetAnimation();
      return;
    }

    if (isNaN(position) || !Number.isInteger(position) || position < 0 || position > displayList.length || insertPosition.trim() === '') {
      setAnimationStep(`Please enter valid position (0 to ${displayList.length})`);
      resetAnimation();
      return;
    }

    // Start animation controller
    animationController.start();
    
    // Initialize and update heap memory layout
    updateHeapMemoryDuringOperation(displayList, 'insert');
    
    // Step 0: Create new node
    const newNode = {
      id: Date.now(),
      data: value,
      next: null,
      memoryAddress: `0x${Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase()}`
    };

    await animationController.syncStep(
      0,
      () => {},
      () => {},
      `Creating new node with value ${value}`,
      0.8
    );
    if (!animationController.isActive()) return;

    // Handle insertion at head (position 0)
    if (position === 0) {
      await animationController.syncStep(
        1,
        () => {},
        () => {},
        'Inserting at head of linked list',
        0.8
      );
      if (!animationController.isActive()) return;

      // Step 2: Set new node's next to current head
      await animationController.syncStep(
        2,
        () => {
          animationController.highlightElement(0, 'inserting');
        },
        () => {
          animationController.updateStackFrame({ 
            newNode,
            operation: 'insert_head',
            position: 0
          });
        },
        'Setting new node\'s next pointer to current head',
        1.0
      );
      if (!animationController.isActive()) return;

      // Step 3: Update head to point to new node
      await animationController.syncStep(
        3,
        () => {
          const newList = [newNode, ...displayList];
          setDisplayList(newList);
          animationController.highlightElement(0, 'inserted');
        },
        () => {},
        'Updating head pointer to new node',
        1.2
      );
    } 
    // Handle insertion at tail
    else if (position === displayList.length) {
      await animationController.syncStep(
        1,
        () => {},
        () => {},
        'Inserting at tail of linked list',
        0.8
      );
      if (!animationController.isActive()) return;

      // Step 2: Traverse to last node
      await animationController.syncStep(
        2,
        () => {
          animationController.highlightElement(displayList.length - 1, 'traversing');
        },
        () => {
          animationController.updateStackFrame({ 
            current: displayList[displayList.length - 1],
            newNode,
            operation: 'insert_tail',
            position
          });
        },
        'Traversing to last node',
        1.0
      );
      if (!animationController.isActive()) return;

      // Step 3: Set last node's next to new node
      await animationController.syncStep(
        3,
        () => {
          const newList = [...displayList, newNode];
          setDisplayList(newList);
          animationController.highlightElement(newList.length - 1, 'inserted');
        },
        () => {},
        'Setting last node\'s next pointer to new node',
        1.2
      );
    }
    // Handle insertion at middle position
    else {
      await animationController.syncStep(
        1,
        () => {},
        () => {},
        `Inserting at position ${position} in linked list`,
        0.8
      );
      if (!animationController.isActive()) return;

      // Step 2: Traverse to position - 1
      await animationController.syncStep(
        2,
        () => {
          for (let i = 0; i < position - 1; i++) {
            animationController.highlightElement(i, 'traversing');
          }
          animationController.highlightElement(position - 1, 'checking');
        },
        () => {
          animationController.updateStackFrame({ 
            current: displayList[position - 1],
            next: displayList[position],
            newNode,
            operation: 'insert_middle',
            position
          });
        },
        `Traversing to position ${position - 1}`,
        1.2
      );
      if (!animationController.isActive()) return;

      // Step 3: Update pointers
      await animationController.syncStep(
        3,
        () => {
          const newList = [...displayList];
          newList.splice(position, 0, newNode);
          setDisplayList(newList);
          animationController.highlightElement(position, 'inserted');
        },
        () => {},
        'Updating next pointers to insert new node',
        1.2
      );
    }

    // Final step: Insertion complete
    await animationController.syncStep(
      4,
      () => {},
      () => {},
      `✅ Successfully inserted ${value} at position ${position}`,
      1.5
    );
    
    // Update memory lists to match the final displayList state
    // Use setTimeout to ensure displayList state has been updated
    setTimeout(() => {
      if (animationController.isActive() || !displayList) return;
      
      setMemoryList([...displayList]);
      setOriginalList([...displayList]);
      
      // Update heap memory with new layout
      updateHeapMemoryDuringOperation(displayList, 'insert_complete');
    }, 100);
    
    resetAnimation();
  }, [
    displayList,
    insertValue,
    insertPosition,
    animationController,
    resetAnimation,
    setDisplayList,
    setMemoryList,
    setOriginalList,
    setAnimationStep,
    updateHeapMemoryDuringOperation
  ]);

  const animateDelete = useCallback(async () => {
    const value = parseInt(deleteValue);
    const position = parseInt(deletePosition);
    
    // Determine delete mode: prioritize position if both are provided
    const hasValidPosition = !isNaN(position) && Number.isInteger(position) && deletePosition.trim() !== '';
    const hasValidValue = !isNaN(value) && Number.isInteger(value) && deleteValue.trim() !== '';
    
    if (!hasValidPosition && !hasValidValue) {
      setAnimationStep('Please specify either a value or position to delete');
      resetAnimation();
      return;
    }
    
    const deleteByPosition = hasValidPosition;

    if (deleteByPosition && (position < 0 || position >= displayList.length)) {
      setAnimationStep(`Invalid position (0 to ${displayList.length - 1})`);
      resetAnimation();
      return;
    }

    if (displayList.length === 0) {
      setAnimationStep('Linked list is empty');
      resetAnimation();
      return;
    }

    // Start animation controller
    animationController.start();

    // Initialize and update heap memory layout
    updateHeapMemoryDuringOperation(displayList, 'delete');

    let targetIndex = -1;
    let targetValue = null;

    if (deleteByPosition) {
      targetIndex = position;
      targetValue = displayList[position].data;
      
      await animationController.syncStep(
        0,
        () => {},
        () => {},
        `Deleting node at position ${position} (value: ${targetValue})`,
        0.8
      );
    } else if (hasValidValue) {
      // Delete by value - search for value first
      await animationController.syncStep(
        0,
        () => {},
        () => {},
        `Searching for node with value ${value} to delete`,
        0.8
      );
      if (!animationController.isActive()) return;

      // Find the node with target value
      for (let i = 0; i < displayList.length; i++) {
        if (!animationController.isActive()) break;
        
        await animationController.syncStep(
          1,
          () => {
            animationController.highlightElement(i, 'checking');
          },
          () => {
            animationController.updateStackFrame({ 
              current: displayList[i],
              target: value,
              position: i,
              operation: 'delete_search'
            });
          },
          `Checking node at position ${i}: data = ${displayList[i].data}`,
          1.0
        );
        if (!animationController.isActive()) break;

        if (displayList[i].data === value) {
          targetIndex = i;
          targetValue = value;
          await animationController.syncStep(
            2,
            () => {
              animationController.highlightElement(i, 'found');
            },
            () => {},
            `Found target value ${value} at position ${i}`,
            1.2
          );
          break;
        } else {
          animationController.highlightElement(i, 'checked');
        }
      }

      if (targetIndex === -1) {
        await animationController.syncStep(
          2,
          () => {},
          () => {},
          `Value ${value} not found in linked list`,
          1.2
        );
        resetAnimation();
        return;
      }
    }

    // Handle deletion at head (position 0)
    if (targetIndex === 0) {
      await animationController.syncStep(
        3,
        () => {
          animationController.highlightElement(0, 'deleting');
        },
        () => {
          animationController.updateStackFrame({ 
            nodeToDelete: displayList[0],
            operation: 'delete_head'
          });
        },
        'Deleting head node',
        1.0
      );
      if (!animationController.isActive()) return;

      // Step 4: Update head to next node
      await animationController.syncStep(
        4,
        () => {
          const newList = displayList.slice(1); // Remove first element
          setDisplayList(newList);
        },
        () => {},
        'Updating head pointer to next node',
        1.2
      );
    }
    // Handle deletion at tail
    else if (targetIndex === displayList.length - 1) {
      await animationController.syncStep(
        3,
        () => {
          animationController.highlightElement(targetIndex - 1, 'traversing');
          animationController.highlightElement(targetIndex, 'deleting');
        },
        () => {
          animationController.updateStackFrame({ 
            previous: displayList[targetIndex - 1],
            nodeToDelete: displayList[targetIndex],
            operation: 'delete_tail'
          });
        },
        'Deleting tail node',
        1.0
      );
      if (!animationController.isActive()) return;

      // Step 4: Set previous node's next to NULL
      await animationController.syncStep(
        4,
        () => {
          const newList = displayList.slice(0, -1);
          setDisplayList(newList);
        },
        () => {},
        'Setting previous node\'s next pointer to NULL',
        1.2
      );
    }
    // Handle deletion in middle
    else {
      await animationController.syncStep(
        3,
        () => {
          animationController.highlightElement(targetIndex - 1, 'traversing');
          animationController.highlightElement(targetIndex, 'deleting');
          animationController.highlightElement(targetIndex + 1, 'traversing');
        },
        () => {
          animationController.updateStackFrame({ 
            previous: displayList[targetIndex - 1],
            nodeToDelete: displayList[targetIndex],
            next: displayList[targetIndex + 1],
            operation: 'delete_middle'
          });
        },
        `Deleting node at position ${targetIndex}`,
        1.0
      );
      if (!animationController.isActive()) return;

      // Step 4: Update previous node's next pointer
      await animationController.syncStep(
        4,
        () => {
          const newList = [...displayList];
          newList.splice(targetIndex, 1);
          setDisplayList(newList);
        },
        () => {},
        'Updating previous node\'s next pointer to skip deleted node',
        1.2
      );
    }

    // Final step: Deletion complete
    await animationController.syncStep(
      5,
      () => {},
      () => {},
      `✅ Successfully deleted node with value ${targetValue} at position ${targetIndex}`,
      1.5
    );
    
    // Update memory lists to match the final displayList state
    setTimeout(() => {
      if (animationController.isActive() || !displayList) return;
      
      setMemoryList([...displayList]);
      setOriginalList([...displayList]);
      
      // Update heap memory with new layout
      updateHeapMemoryDuringOperation(displayList, 'delete_complete');
    }, 100);
    
    resetAnimation();
  }, [
    displayList,
    deleteValue,
    deletePosition,
    animationController,
    resetAnimation,
    setDisplayList,
    setMemoryList,
    setOriginalList,
    setAnimationStep,
    updateHeapMemoryDuringOperation
  ]);

  const animateTraverse = useCallback(async () => {
    if (displayList.length === 0) {
      setAnimationStep('Linked list is empty');
      resetAnimation();
      return;
    }

    // Start animation controller
    animationController.start();
    
    // Initialize and update heap memory layout
    updateHeapMemoryDuringOperation(displayList, 'traverse');
    
    // Step 0: Initialize traversal
    await animationController.syncStep(
      0,
      () => {},
      () => {},
      'Starting linked list traversal from head...',
      0.8
    );
    if (!animationController.isActive()) return;

    // Step 1: Set current pointer to head
    await animationController.syncStep(
      1,
      () => {
        animationController.highlightElement(0, 'traversing');
      },
      () => {
        animationController.updateStackFrame({ 
          current: displayList[0],
          position: 0,
          operation: 'traverse'
        });
      },
      'Setting current pointer to head node',
      1.0
    );
    if (!animationController.isActive()) return;

    // Main traversal loop
    for (let i = 0; i < displayList.length; i++) {
      if (!animationController.isActive()) break;
      
      // Update iteration counter
      animationController.setIteration(i);
      
      // Step 2: Visit current node
      await animationController.syncStep(
        2,
        () => {
          animationController.highlightElement(i, 'checking');
        },
        () => {
          animationController.updateStackFrame({ 
            current: displayList[i],
            data: displayList[i].data,
            position: i,
            operation: 'traverse'
          });
        },
        `Visiting node at position ${i}: data = ${displayList[i].data}`,
        1.2
      );
      if (!animationController.isActive()) break;

      // Mark as visited
      animationController.highlightElement(i, 'checked');

      // Step 3: Move to next node (if exists)
      if (i < displayList.length - 1) {
        await animationController.syncStep(
          3,
          () => {
            animationController.highlightElement(i + 1, 'traversing');
          },
          () => {},
          `Moving to next node via pointer...`,
          0.8
        );
        if (!animationController.isActive()) break;
      }
    }

    // Step 4: Reached end of list
    await animationController.syncStep(
      4,
      () => {},
      () => {},
      'Traversal complete - Reached NULL',
      1.2
    );
    
    resetAnimation();
  }, [
    displayList,
    animationController,
    resetAnimation,
    setAnimationStep,
    updateHeapMemoryDuringOperation
  ]);

  // Start animation based on operation
  useEffect(() => {
    if (isPlaying && !isAnimating) {
      setIsAnimating(true);
      
      switch (operation) {
        case 'search':
          animateSearch();
          break;
        case 'insert':
          animateInsert();
          break;
        case 'delete':
          animateDelete();
          break;
        case 'traverse':
          animateTraverse();
          break;
        default:
          console.warn(`Unknown operation: ${operation}`);
          resetAnimation();
      }
    }
  }, [isPlaying, isAnimating, operation, animateSearch, animateInsert, animateDelete, animateTraverse, resetAnimation, setIsAnimating]);

  // Cleanup on unmount
  useEffect(() => {
    const currentAnimationRef = animationRef.current;
    return () => {
      if (currentAnimationRef) {
        clearTimeout(currentAnimationRef);
      }
      if (animationController && typeof animationController.cleanup === 'function') {
        animationController.cleanup();
      }
    };
  }, [animationController]);

  return null; // This component only handles logic, no rendering
};

LinkedListLogic.propTypes = {
  operation: PropTypes.string.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  speed: PropTypes.number.isRequired,
  searchValue: PropTypes.string,
  insertValue: PropTypes.string,
  insertPosition: PropTypes.string,
  deleteValue: PropTypes.string,
  deletePosition: PropTypes.string,
  displayList: PropTypes.array.isRequired,
  memoryList: PropTypes.array.isRequired,
  codeLanguage: PropTypes.string.isRequired,
  listSize: PropTypes.number.isRequired,
  setIsAnimating: PropTypes.func.isRequired,
  setIsPlaying: PropTypes.func.isRequired,
  setDisplayList: PropTypes.func.isRequired,
  setMemoryList: PropTypes.func.isRequired,
  setOriginalList: PropTypes.func.isRequired,
  setCurrentNodeIndex: PropTypes.func.isRequired,
  setCurrentCodeLine: PropTypes.func.isRequired,
  setCurrentMemoryIndex: PropTypes.func.isRequired,
  setNodeStates: PropTypes.func.isRequired,
  setAnimationStep: PropTypes.func.isRequired,
  setFoundIndex: PropTypes.func.isRequired,
  setHeapMemory: PropTypes.func.isRequired,
  setCurrentStackFrame: PropTypes.func.isRequired,
  setCurrentIteration: PropTypes.func.isRequired,
  initializeMemoryModel: PropTypes.func.isRequired,
  isAnimating: PropTypes.bool
};

export default LinkedListLogic;
