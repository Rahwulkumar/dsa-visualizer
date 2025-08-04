/**
 * Test file for Linear Search Algorithm
 * This verifies the linear search function works correctly according to requirements
 */

// Mock functions to simulate the visualization environment
const mockSetElementStates = (fn) => console.log('Element states updated:', typeof fn === 'function' ? 'function' : fn);
const mockSetFoundIndex = (index) => console.log('Found index set to:', index);
const mockSetAnimationStep = (step) => console.log('Animation step:', step);
const mockSetCurrentCodeLine = (line) => console.log('Current code line:', line);
const mockSetCurrentElementIndex = (index) => console.log('Current element index:', index);
const mockSetCurrentMemoryIndex = (index) => console.log('Current memory index:', index);

// Mock sleep function for testing
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, Math.min(ms, 50))); // Speed up for testing

// Mock isPlaying state
let isPlaying = true;

// Linear Search Algorithm - Standalone Implementation
const linearSearch = async (array, target, delay) => {
  if (!Array.isArray(array)) {
    throw new Error('First parameter must be an array');
  }
  
  if (typeof delay !== 'number' || delay < 0) {
    throw new Error('Delay must be a positive number in milliseconds');
  }

  console.log(`\n🔍 Starting linear search for target: ${target} in array: [${array.join(', ')}]`);
  
  // Initialize visualization state
  mockSetElementStates({});
  mockSetFoundIndex(null);
  mockSetAnimationStep(`Starting linear search for target value: ${target}`);
  mockSetCurrentCodeLine(0); // Function definition
  
  // Start from the first element and iterate to the last
  for (let i = 0; i < array.length; i++) {
    if (!isPlaying) break; // Allow interruption
    
    // Highlight current element being examined
    mockSetCurrentElementIndex(i);
    mockSetCurrentMemoryIndex(i);
    mockSetCurrentCodeLine(1); // Loop line
    mockSetAnimationStep(`Examining element at index ${i}: ${array[i]}`);
    mockSetElementStates(prev => ({ ...prev, [i]: 'examining' }));
    
    // Wait for the specified delay
    await sleep(delay);
    
    // Compare the current element with the target value
    mockSetCurrentCodeLine(2); // Comparison line
    mockSetAnimationStep(`Comparing ${array[i]} with target ${target}`);
    await sleep(delay * 0.5);
    
    // Check if match is found
    if (array[i] === target) {
      // Match found - highlight the element and stop
      mockSetCurrentCodeLine(3); // Return statement line
      mockSetElementStates(prev => ({ ...prev, [i]: 'found' }));
      mockSetFoundIndex(i);
      mockSetAnimationStep(`✅ Match found! Target ${target} found at index ${i}`);
      await sleep(delay * 1.5);
      console.log(`✅ SUCCESS: Found ${target} at index ${i}`);
      return i; // Return the index where element was found
    } else {
      // No match - mark as checked and continue
      mockSetElementStates(prev => ({ ...prev, [i]: 'checked' }));
      mockSetAnimationStep(`❌ No match. ${array[i]} ≠ ${target}, continuing...`);
      await sleep(delay * 0.3);
    }
  }
  
  // If loop completes without finding the element
  mockSetCurrentCodeLine(4); // Return -1 line
  mockSetAnimationStep(`❌ Target ${target} not found in array`);
  mockSetCurrentElementIndex(-1);
  mockSetCurrentMemoryIndex(-1);
  mockSetFoundIndex(-1);
  await sleep(delay);
  console.log(`❌ NOT FOUND: Target ${target} not found in array`);
  return -1; // Element not found
};

// Test Cases
const runTests = async () => {
  console.log('🧪 Starting Linear Search Algorithm Tests\n');
  
  // Test 1: Element found at beginning
  console.log('=== Test 1: Element at beginning ===');
  const result1 = await linearSearch([5, 10, 15, 20, 25], 5, 100);
  console.log(`Expected: 0, Got: ${result1}, ${result1 === 0 ? '✅ PASS' : '❌ FAIL'}\n`);
  
  // Test 2: Element found in middle
  console.log('=== Test 2: Element in middle ===');
  const result2 = await linearSearch([5, 10, 15, 20, 25], 15, 100);
  console.log(`Expected: 2, Got: ${result2}, ${result2 === 2 ? '✅ PASS' : '❌ FAIL'}\n`);
  
  // Test 3: Element found at end
  console.log('=== Test 3: Element at end ===');
  const result3 = await linearSearch([5, 10, 15, 20, 25], 25, 100);
  console.log(`Expected: 4, Got: ${result3}, ${result3 === 4 ? '✅ PASS' : '❌ FAIL'}\n`);
  
  // Test 4: Element not found
  console.log('=== Test 4: Element not found ===');
  const result4 = await linearSearch([5, 10, 15, 20, 25], 99, 100);
  console.log(`Expected: -1, Got: ${result4}, ${result4 === -1 ? '✅ PASS' : '❌ FAIL'}\n`);
  
  // Test 5: Empty array
  console.log('=== Test 5: Empty array ===');
  const result5 = await linearSearch([], 5, 100);
  console.log(`Expected: -1, Got: ${result5}, ${result5 === -1 ? '✅ PASS' : '❌ FAIL'}\n`);
  
  // Test 6: Single element array - found
  console.log('=== Test 6: Single element - found ===');
  const result6 = await linearSearch([42], 42, 100);
  console.log(`Expected: 0, Got: ${result6}, ${result6 === 0 ? '✅ PASS' : '❌ FAIL'}\n`);
  
  // Test 7: Single element array - not found
  console.log('=== Test 7: Single element - not found ===');
  const result7 = await linearSearch([42], 99, 100);
  console.log(`Expected: -1, Got: ${result7}, ${result7 === -1 ? '✅ PASS' : '❌ FAIL'}\n`);
  
  console.log('🎉 All tests completed!');
};

// Run tests if this file is executed directly
runTests().catch(console.error);

// For browser/module compatibility
if (typeof window !== 'undefined') {
  window.linearSearchTest = { linearSearch, runTests };
}
