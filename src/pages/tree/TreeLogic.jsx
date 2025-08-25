import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import AnimationController from '../../utils/AnimationController';

const TreeLogic = ({
  operation,
  isPlaying,
  speed,
  insertValue,
  searchValue,
  deleteValue,
  tree,
  maxSize,
  setIsAnimating,
  setIsPlaying,
  setTree,
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
    if (animationRef.current) clearTimeout(animationRef.current);
  }, [animationController, setIsAnimating, setIsPlaying]);

  const finishAnimation = useCallback(() => {
    animationController.reset();
    setIsPlaying(false);
    setIsAnimating(false);
    runningRef.current = false;
    if (animationRef.current) clearTimeout(animationRef.current);
  }, [animationController, setIsAnimating, setIsPlaying]);

  const animateInsert = useCallback(async () => {
    const value = parseInt(insertValue);
    if (isNaN(value) || !Number.isInteger(value)) {
      setAnimationStep('Invalid insert value');
      resetAnimation();
      return;
    }
    if (tree.length >= maxSize) {
      setAnimationStep('Tree has reached maximum size');
      resetAnimation();
      return;
    }

    animationController.start();

    // Step 0 - start
    const ok = await animationController.syncStep(
      0,
      () => {},
      () => {
        animationController.updateStackFrame({ value, operation: 'insert', treeSize: tree.length });
      },
      `Starting insert operation for value ${value}...`,
      0.8
    );
    if (!ok) return;

    // Step 1 - check if tree is empty
    await animationController.syncStep(
      1,
      () => {},
      () => {},
      'Checking if tree is empty...',
      1.0
    );
    if (!animationController.isActive()) return;

    if (tree.length === 0) {
      // Step 2 - create root node
      await animationController.syncStep(
        2,
        () => {
          setTree(prev => {
            const newNode = { value, left: null, right: null, isRoot: true };
            const newTree = [newNode];
            const heap = {
              treeObject: {
                address: '0x7f8b1c000000',
                size: newTree.length,
                root: value,
                height: 1,
                nodes: newTree.map((node, i) => ({ 
                  address: `0x${(parseInt('7f8b1c000000', 16) + i * 24).toString(16)}`,
                  value: node.value,
                  left: node.left,
                  right: node.right
                }))
              }
            };
            animationController.updateHeapMemory(heap);
            return newTree;
          });
          animationController.highlightElement(0, 'inserting');
        },
        () => {},
        `Created root node with value ${value}`,
        1.5
      );
    } else {
      // Find position to insert (simplified BST insertion)
      let currentIndex = 0;
      let insertIndex = tree.length;
      
      // Step 2 - traverse to find insertion point
      while (currentIndex < tree.length) {
        if (!animationController.isActive()) return;
        
        await animationController.syncStep(
          2,
          () => {
            animationController.highlightElement(currentIndex, 'searching');
          },
          () => {
            animationController.updateStackFrame({ 
              currentNode: tree[currentIndex].value, 
              targetValue: value, 
              operation: 'insert_traverse' 
            });
          },
          `Comparing ${value} with node ${tree[currentIndex].value}`,
          1.0
        );
        
        if (value < tree[currentIndex].value) {
          if (tree[currentIndex].left === null) {
            break; // Found insertion point
          }
          currentIndex = tree[currentIndex].left;
        } else if (value > tree[currentIndex].value) {
          if (tree[currentIndex].right === null) {
            break; // Found insertion point
          }
          currentIndex = tree[currentIndex].right;
        } else {
          // Value already exists
          await animationController.syncStep(
            3,
            () => {},
            () => {},
            `Value ${value} already exists in the tree`,
            1.0
          );
          finishAnimation();
          return;
        }
      }

      // Step 3 - insert new node
      await animationController.syncStep(
        3,
        () => {
          setTree(prev => {
            const newTree = [...prev];
            const newNode = { value, left: null, right: null, isRoot: false };
            newTree.push(newNode);
            
            // Update parent's child pointer
            if (value < newTree[currentIndex].value) {
              newTree[currentIndex].left = insertIndex;
            } else {
              newTree[currentIndex].right = insertIndex;
            }
            
            const heap = {
              treeObject: {
                address: '0x7f8b1c000000',
                size: newTree.length,
                root: newTree[0].value,
                height: Math.floor(Math.log2(newTree.length)) + 1,
                nodes: newTree.map((node, i) => ({ 
                  address: `0x${(parseInt('7f8b1c000000', 16) + i * 24).toString(16)}`,
                  value: node.value,
                  left: node.left,
                  right: node.right
                }))
              }
            };
            animationController.updateHeapMemory(heap);
            return newTree;
          });
          animationController.highlightElement(insertIndex, 'inserting');
        },
        () => {},
        `Inserted ${value} as new node`,
        1.5
      );
    }
    if (!animationController.isActive()) return;

    // Step 4 - complete
    await animationController.syncStep(
      4,
      () => {},
      () => {},
      `✅ Successfully inserted ${value}`,
      1.0
    );

    finishAnimation();
  }, [insertValue, tree, maxSize, animationController, resetAnimation, finishAnimation, setAnimationStep, setTree]);

  const animateSearch = useCallback(async () => {
    const value = parseInt(searchValue);
    if (isNaN(value) || !Number.isInteger(value)) {
      setAnimationStep('Invalid search value');
      resetAnimation();
      return;
    }
    if (tree.length === 0) {
      setAnimationStep('Tree is empty - cannot search');
      resetAnimation();
      return;
    }

    animationController.start();

    const ok = await animationController.syncStep(
      0,
      () => {},
      () => {
        animationController.updateStackFrame({ value, operation: 'search', treeSize: tree.length });
      },
      `Starting search operation for value ${value}...`,
      0.8
    );
    if (!ok) return;

    let currentIndex = 0;
    let found = false;

    // Traverse tree to search
    while (currentIndex < tree.length && currentIndex !== null) {
      if (!animationController.isActive()) return;

      await animationController.syncStep(
        1,
        () => {
          animationController.highlightElement(currentIndex, 'searching');
        },
        () => {
          animationController.updateStackFrame({ 
            currentNode: tree[currentIndex].value, 
            targetValue: value, 
            operation: 'search_compare' 
          });
        },
        `Comparing ${value} with node ${tree[currentIndex].value}`,
        1.2
      );

      if (tree[currentIndex].value === value) {
        found = true;
        break;
      } else if (value < tree[currentIndex].value) {
        currentIndex = tree[currentIndex].left;
      } else {
        currentIndex = tree[currentIndex].right;
      }
    }

    await animationController.syncStep(
      2,
      () => {
        if (found) {
          animationController.setFoundIndex(currentIndex);
        }
      },
      () => {},
      found ? `✅ Found ${value} at node ${currentIndex}` : `❌ Value ${value} not found in tree`,
      1.5
    );

    finishAnimation();
  }, [searchValue, tree, animationController, resetAnimation, finishAnimation, setAnimationStep]);

  const animateDelete = useCallback(async () => {
    const value = parseInt(deleteValue);
    if (isNaN(value) || !Number.isInteger(value)) {
      setAnimationStep('Invalid delete value');
      resetAnimation();
      return;
    }
    if (tree.length === 0) {
      setAnimationStep('Tree is empty - cannot delete');
      resetAnimation();
      return;
    }

    animationController.start();

    const ok = await animationController.syncStep(
      0,
      () => {},
      () => {
        animationController.updateStackFrame({ value, operation: 'delete', treeSize: tree.length });
      },
      `Starting delete operation for value ${value}...`,
      0.8
    );
    if (!ok) return;

    // Find node to delete
    let deleteIndex = -1;
    for (let i = 0; i < tree.length; i++) {
      if (tree[i].value === value) {
        deleteIndex = i;
        break;
      }
    }

    if (deleteIndex === -1) {
      await animationController.syncStep(
        1,
        () => {},
        () => {},
        `Value ${value} not found in tree`,
        1.0
      );
      finishAnimation();
      return;
    }

    await animationController.syncStep(
      1,
      () => {
        animationController.highlightElement(deleteIndex, 'deleting');
      },
      () => {
        animationController.updateStackFrame({ 
          deleteNode: tree[deleteIndex].value, 
          operation: 'delete_found' 
        });
      },
      `Found node to delete: ${value}`,
      1.2
    );
    if (!animationController.isActive()) return;

    // Simplified deletion (just remove from array for demo)
    await animationController.syncStep(
      2,
      () => {
        setTree(prev => {
          const newTree = prev.filter((_, index) => index !== deleteIndex);
          const heap = {
            treeObject: {
              address: '0x7f8b1c000000',
              size: newTree.length,
              root: newTree.length > 0 ? newTree[0].value : null,
              height: newTree.length > 0 ? Math.floor(Math.log2(newTree.length)) + 1 : 0,
              nodes: newTree.map((node, i) => ({ 
                address: `0x${(parseInt('7f8b1c000000', 16) + i * 24).toString(16)}`,
                value: node.value,
                left: node.left,
                right: node.right
              }))
            }
          };
          animationController.updateHeapMemory(heap);
          return newTree;
        });
      },
      () => {},
      `Removed node with value ${value}`,
      1.5
    );
    if (!animationController.isActive()) return;

    await animationController.syncStep(
      3,
      () => {},
      () => {},
      `✅ Successfully deleted ${value}`,
      1.0
    );

    finishAnimation();
  }, [deleteValue, tree, animationController, resetAnimation, finishAnimation, setAnimationStep, setTree]);

  const animateTraversal = useCallback(async (traversalType) => {
    if (tree.length === 0) {
      setAnimationStep('Tree is empty - nothing to traverse');
      resetAnimation();
      return;
    }

    animationController.start();

    const ok = await animationController.syncStep(
      0,
      () => {},
      () => {
        animationController.updateStackFrame({ operation: traversalType, treeSize: tree.length });
      },
      `Starting ${traversalType} traversal...`,
      0.8
    );
    if (!ok) return;

    // Simple traversal order for demo (just visit nodes in array order)
    for (let i = 0; i < tree.length; i++) {
      if (!animationController.isActive()) break;
      
      animationController.setIteration(i);
      await animationController.syncStep(
        1,
        () => {
          animationController.highlightElement(i, 'traversing');
        },
        () => {
          animationController.updateStackFrame({ 
            currentNode: tree[i].value, 
            visitOrder: i + 1,
            operation: `${traversalType}_visit` 
          });
        },
        `Visiting node ${i}: ${tree[i].value}`,
        0.8
      );
    }

    await animationController.syncStep(
      2,
      () => {},
      () => {},
      `✅ Completed ${traversalType} traversal of ${tree.length} nodes`,
      1.0
    );

    finishAnimation();
  }, [tree, animationController, resetAnimation, finishAnimation, setAnimationStep]);

  useEffect(() => {
    if (!isPlaying || isAnimating) return;
    if (runningRef.current) return; // already running

    runningRef.current = true;
    setIsAnimating(true);

    const runAnimation = async () => {
      try {
        switch (operation) {
          case 'insert':
            await animateInsert();
            break;
          case 'search':
            await animateSearch();
            break;
          case 'delete':
            await animateDelete();
            break;
          case 'inorder':
            await animateTraversal('inorder');
            break;
          case 'preorder':
            await animateTraversal('preorder');
            break;
          case 'postorder':
            await animateTraversal('postorder');
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
    animateInsert,
    animateSearch,
    animateDelete,
    animateTraversal,
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

TreeLogic.propTypes = {
  operation: PropTypes.string.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  speed: PropTypes.number.isRequired,
  insertValue: PropTypes.string.isRequired,
  searchValue: PropTypes.string.isRequired,
  deleteValue: PropTypes.string.isRequired,
  tree: PropTypes.array.isRequired,
  maxSize: PropTypes.number.isRequired,
  setIsAnimating: PropTypes.func.isRequired,
  setIsPlaying: PropTypes.func.isRequired,
  setTree: PropTypes.func.isRequired,
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

export default TreeLogic;
