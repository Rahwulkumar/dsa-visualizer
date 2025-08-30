import React from 'react';
import CodeDisplay from '../../components/CodeDisplay';

const HashTableCodeDisplay = ({ codeLanguage, operation, currentCodeLine, animationStep, currentIteration }) => {
  // Hash table specific code templates
  const hashTableTemplates = {
    python: {
      insert: [
        'def insert(hash_table, key, value):',
        '    # Calculate hash index',
        '    index = hash_function(key) % table_size',
        '    # Handle collision with chaining',
        '    if hash_table[index] is None:',
        '        hash_table[index] = [(key, value)]',
        '    else:',
        '        # Check if key exists',
        '        for i, (k, v) in enumerate(hash_table[index]):',
        '            if k == key:',
        '                hash_table[index][i] = (key, value)',
        '                return',
        '        # Add new key-value pair',
        '        hash_table[index].append((key, value))',
        '    # Insert complete'
      ],
      search: [
        'def search(hash_table, key):',
        '    # Calculate hash index',
        '    index = hash_function(key) % table_size',
        '    # Check if bucket exists',
        '    if hash_table[index] is None:',
        '        return None',
        '    # Search in the bucket',
        '    for k, v in hash_table[index]:',
        '        if k == key:',
        '            return v',
        '    # Key not found',
        '    return None'
      ],
      delete: [
        'def delete(hash_table, key):',
        '    # Calculate hash index',
        '    index = hash_function(key) % table_size',
        '    # Check if bucket exists',
        '    if hash_table[index] is None:',
        '        return False',
        '    # Search and remove from bucket',
        '    for i, (k, v) in enumerate(hash_table[index]):',
        '        if k == key:',
        '            del hash_table[index][i]',
        '            # Clean up empty bucket',
        '            if not hash_table[index]:',
        '                hash_table[index] = None',
        '            return True',
        '    # Key not found',
        '    return False'
      ],
      hash_function: [
        'def hash_function(key):',
        '    # Simple hash function',
        '    hash_value = 0',
        '    # Process each character',
        '    for char in str(key):',
        '        hash_value += ord(char)',
        '    # Return hash value',
        '    return hash_value'
      ]
    },
    java: {
      insert: [
        'public void insert(String key, int value) {',
        '    // Calculate hash index',
        '    int index = hashFunction(key) % tableSize;',
        '    // Handle collision with chaining',
        '    if (hashTable[index] == null) {',
        '        hashTable[index] = new ArrayList<>();',
        '    }',
        '    // Check if key exists',
        '    for (int i = 0; i < hashTable[index].size(); i++) {',
        '        Entry entry = hashTable[index].get(i);',
        '        if (entry.key.equals(key)) {',
        '            entry.value = value;',
        '            return;',
        '        }',
        '    }',
        '    // Add new entry',
        '    hashTable[index].add(new Entry(key, value));',
        '    // Insert complete',
        '}'
      ],
      search: [
        'public Integer search(String key) {',
        '    // Calculate hash index',
        '    int index = hashFunction(key) % tableSize;',
        '    // Check if bucket exists',
        '    if (hashTable[index] == null) {',
        '        return null;',
        '    }',
        '    // Search in the bucket',
        '    for (Entry entry : hashTable[index]) {',
        '        if (entry.key.equals(key)) {',
        '            return entry.value;',
        '        }',
        '    }',
        '    // Key not found',
        '    return null;',
        '}'
      ],
      delete: [
        'public boolean delete(String key) {',
        '    // Calculate hash index',
        '    int index = hashFunction(key) % tableSize;',
        '    // Check if bucket exists',
        '    if (hashTable[index] == null) {',
        '        return false;',
        '    }',
        '    // Search and remove from bucket',
        '    for (int i = 0; i < hashTable[index].size(); i++) {',
        '        if (hashTable[index].get(i).key.equals(key)) {',
        '            hashTable[index].remove(i);',
        '            return true;',
        '        }',
        '    }',
        '    // Key not found',
        '    return false;',
        '}'
      ],
      hash_function: [
        'private int hashFunction(String key) {',
        '    // Simple hash function',
        '    int hashValue = 0;',
        '    // Process each character',
        '    for (char c : key.toCharArray()) {',
        '        hashValue += (int) c;',
        '    }',
        '    // Return hash value',
        '    return hashValue;',
        '}'
      ]
    },
    c: {
      insert: [
        'void insert(HashTable* ht, char* key, int value) {',
        '    // Calculate hash index',
        '    int index = hash_function(key) % ht->size;',
        '    // Handle collision with chaining',
        '    Node* newNode = create_node(key, value);',
        '    if (ht->table[index] == NULL) {',
        '        ht->table[index] = newNode;',
        '    } else {',
        '        // Check if key exists',
        '        Node* current = ht->table[index];',
        '        while (current != NULL) {',
        '            if (strcmp(current->key, key) == 0) {',
        '                current->value = value;',
        '                free(newNode);',
        '                return;',
        '            }',
        '            if (current->next == NULL) break;',
        '            current = current->next;',
        '        }',
        '        // Add new node',
        '        current->next = newNode;',
        '    }',
        '    // Insert complete',
        '}'
      ],
      search: [
        'int search(HashTable* ht, char* key) {',
        '    // Calculate hash index',
        '    int index = hash_function(key) % ht->size;',
        '    // Search in the bucket',
        '    Node* current = ht->table[index];',
        '    while (current != NULL) {',
        '        if (strcmp(current->key, key) == 0) {',
        '            return current->value;',
        '        }',
        '        current = current->next;',
        '    }',
        '    // Key not found',
        '    return -1;',
        '}'
      ],
      delete: [
        'bool delete(HashTable* ht, char* key) {',
        '    // Calculate hash index',
        '    int index = hash_function(key) % ht->size;',
        '    Node* current = ht->table[index];',
        '    Node* prev = NULL;',
        '    // Search for the key',
        '    while (current != NULL) {',
        '        if (strcmp(current->key, key) == 0) {',
        '            if (prev == NULL) {',
        '                ht->table[index] = current->next;',
        '            } else {',
        '                prev->next = current->next;',
        '            }',
        '            free(current);',
        '            return true;',
        '        }',
        '        prev = current;',
        '        current = current->next;',
        '    }',
        '    // Key not found',
        '    return false;',
        '}'
      ],
      hash_function: [
        'int hash_function(char* key) {',
        '    // Simple hash function',
        '    int hash_value = 0;',
        '    int i = 0;',
        '    // Process each character',
        '    while (key[i] != \'\\0\') {',
        '        hash_value += key[i];',
        '        i++;',
        '    }',
        '    // Return hash value',
        '    return hash_value;',
        '}'
      ]
    }
  };

  // Hash table specific explanations
  const hashTableExplanations = {
    insert: {
      0: 'Function to insert key-value pair into hash table',
      1: 'Calculate the hash index using hash function',
      2: 'Apply modulo to fit within table size',
      3: 'Handle collision using chaining method',
      4: 'Check if the bucket is empty',
      5: 'Create new bucket with first entry',
      6: 'Bucket already has entries',
      7: 'Search for existing key in bucket',
      8: 'Iterate through chain in bucket',
      9: 'Check if current key matches',
      10: 'Update existing key with new value',
      11: 'Return after successful update',
      12: 'Key not found, add new entry',
      13: 'Append new key-value pair to chain',
      14: 'Insert operation completed successfully'
    },
    search: {
      0: 'Function to search for value by key',
      1: 'Calculate the hash index using hash function',
      2: 'Apply modulo to fit within table size',
      3: 'Check if bucket exists at calculated index',
      4: 'Return null if bucket is empty',
      5: 'Bucket exists, start searching',
      6: 'Iterate through chain in bucket',
      7: 'Check if current key matches search key',
      8: 'Return value if key found',
      9: 'Continue to next entry in chain',
      10: 'Key not found in entire chain',
      11: 'Return null indicating key not found'
    },
    delete: {
      0: 'Function to delete key-value pair from hash table',
      1: 'Calculate the hash index using hash function',
      2: 'Apply modulo to fit within table size',
      3: 'Check if bucket exists at calculated index',
      4: 'Return false if bucket is empty',
      5: 'Bucket exists, start searching for key',
      6: 'Iterate through chain to find key',
      7: 'Check if current key matches target key',
      8: 'Key found, proceed with deletion',
      9: 'Clean up empty bucket if needed',
      10: 'Update bucket to remove empty space',
      11: 'Return true indicating successful deletion',
      12: 'Continue searching in chain',
      13: 'Key not found in entire chain',
      14: 'Return false indicating key not found'
    },
    hash_function: {
      0: 'Simple hash function implementation',
      1: 'Initialize hash value accumulator',
      2: 'Start with zero hash value',
      3: 'Process each character in the key',
      4: 'Iterate through each character',
      5: 'Add ASCII value of character to hash',
      6: 'Move to next character',
      7: 'Return calculated hash value'
    }
  };

  return (
    <CodeDisplay
      codeLanguage={codeLanguage}
      operation={operation}
      currentCodeLine={currentCodeLine}
      animationStep={animationStep}
      currentIteration={currentIteration}
      codeTemplates={hashTableTemplates}
      codeExplanations={hashTableExplanations}
      title="Hash Table Implementation"
      className="h-full"
    />
  );
};

export default HashTableCodeDisplay;
