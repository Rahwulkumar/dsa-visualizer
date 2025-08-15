import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code } from 'lucide-react';
import '../../styles/globals.css';

const CodeDisplay = ({ codeLanguage, operation, currentCodeLine, animationStep, currentIteration }) => {
  const [tooltip, setTooltip] = useState({ show: false, content: '', x: 0, y: 0 });

  const codeTemplates = {
    python: {
      search: [
        'def search_linked_list(head, target):',
        '    current = head',
        '    while current is not None:',
        '        if current.data == target:',
        '            return current',
        '        current = current.next',
        '    return None  # Not found'
      ],
      insert: [
        'def insert_at_position(head, position, value):',
        '    new_node = ListNode(value)',
        '    if position == 0:',
        '        new_node.next = head',
        '        return new_node',
        '    current = head',
        '    for i in range(position - 1):',
        '        current = current.next',
        '    new_node.next = current.next',
        '    current.next = new_node',
        '    return head'
      ],
      delete: [
        'def delete_node(head, target):',
        '    if head.data == target:',
        '        return head.next',
        '    current = head',
        '    while current.next:',
        '        if current.next.data == target:',
        '            current.next = current.next.next',
        '            return head',
        '        current = current.next',
        '    return head  # Not found'
      ],
      traverse: [
        'def traverse_list(head):',
        '    current = head',
        '    while current is not None:',
        '        print(current.data)',
        '        current = current.next',
        '    print("End of list")'
      ]
    },
    java: {
      search: [
        'public ListNode search(ListNode head, int target) {',
        '    ListNode current = head;',
        '    while (current != null) {',
        '        if (current.data == target) {',
        '            return current;',
        '        }',
        '        current = current.next;',
        '    }',
        '    return null;  // Not found',
        '}'
      ],
      insert: [
        'public ListNode insert(ListNode head, int position, int value) {',
        '    ListNode newNode = new ListNode(value);',
        '    if (position == 0) {',
        '        newNode.next = head;',
        '        return newNode;',
        '    }',
        '    ListNode current = head;',
        '    for (int i = 0; i < position - 1; i++) {',
        '        current = current.next;',
        '    }',
        '    newNode.next = current.next;',
        '    current.next = newNode;',
        '    return head;',
        '}'
      ],
      delete: [
        'public ListNode delete(ListNode head, int target) {',
        '    if (head.data == target) {',
        '        return head.next;',
        '    }',
        '    ListNode current = head;',
        '    while (current.next != null) {',
        '        if (current.next.data == target) {',
        '            current.next = current.next.next;',
        '            return head;',
        '        }',
        '        current = current.next;',
        '    }',
        '    return head;  // Not found',
        '}'
      ],
      traverse: [
        'public void traverse(ListNode head) {',
        '    ListNode current = head;',
        '    while (current != null) {',
        '        System.out.print(current.data + " -> ");',
        '        current = current.next;',
        '    }',
        '    System.out.println("null");',
        '}'
      ]
    },
    c: {
      search: [
        'Node* search(Node* head, int target) {',
        '    Node* current = head;',
        '    while (current != NULL) {',
        '        if (current->data == target) {',
        '            return current;',
        '        }',
        '        current = current->next;',
        '    }',
        '    return NULL;  /* Not found */',
        '}'
      ],
      insert: [
        'Node* insert(Node* head, int position, int value) {',
        '    Node* newNode = malloc(sizeof(Node));',
        '    newNode->data = value;',
        '    if (position == 0) {',
        '        newNode->next = head;',
        '        return newNode;',
        '    }',
        '    Node* current = head;',
        '    for (int i = 0; i < position - 1; i++) {',
        '        current = current->next;',
        '    }',
        '    newNode->next = current->next;',
        '    current->next = newNode;',
        '    return head;',
        '}'
      ],
      delete: [
        'Node* delete(Node* head, int target) {',
        '    if (head->data == target) {',
        '        Node* temp = head;',
        '        head = head->next;',
        '        free(temp);',
        '        return head;',
        '    }',
        '    Node* current = head;',
        '    while (current->next != NULL) {',
        '        if (current->next->data == target) {',
        '            Node* temp = current->next;',
        '            current->next = current->next->next;',
        '            free(temp);',
        '            return head;',
        '        }',
        '        current = current->next;',
        '    }',
        '    return head;  /* Not found */',
        '}'
      ],
      traverse: [
        'void traverse(Node* head) {',
        '    Node* current = head;',
        '    while (current != NULL) {',
        '        printf("%d -> ", current->data);',
        '        current = current->next;',
        '    }',
        '    printf("NULL\\n");',
        '}'
      ]
    }
  };

  const codeExplanations = {
    search: {
      0: 'Function to search for a value in linked list',
      1: 'Initialize current pointer to head node',
      2: 'Traverse until reaching NULL (end of list)',
      3: 'Check if current node\'s data matches target',
      4: 'Found! Return the current node',
      5: 'Move to next node via pointer',
      6: 'End of list reached, target not found',
      7: 'Return null to indicate not found'
    },
    insert: {
      0: 'Function to insert node at specified position',
      1: 'Create new node with given value',
      2: 'Special case: inserting at head (position 0)',
      3: 'Set new node\'s next to current head',
      4: 'Return new node as new head',
      5: 'Traverse to position before insertion point',
      6: 'Loop to find correct position',
      7: 'Continue traversing via next pointers',
      8: 'Set new node\'s next to current\'s next',
      9: 'Link previous node to new node',
      10: 'Return original head (unchanged)',
      11: 'Insertion complete'
    },
    delete: {
      0: 'Function to delete node with target value',
      1: 'Special case: deleting head node',
      2: 'Return next node as new head',
      3: 'Start traversal from head',
      4: 'Check each node\'s next node for target',
      5: 'If next node has target value',
      6: 'Skip next node by updating pointer',
      7: 'Return original head',
      8: 'Move to next node to continue search',
      9: 'Target not found, return unchanged list',
      10: 'Deletion complete (or not found)'
    },
    traverse: {
      0: 'Function to traverse entire linked list',
      1: 'Initialize current pointer to head',
      2: 'Continue until reaching NULL',
      3: 'Process current node (print data)',
      4: 'Move to next node via pointer',
      5: 'Indicate end of list reached'
    }
  };

  const showTooltip = (content, event) => {
    setTooltip({ 
      show: true, 
      content, 
      x: event.clientX + 10, 
      y: event.clientY - 10 
    });
  };

  const hideTooltip = () => {
    setTooltip({ show: false, content: '', x: 0, y: 0 });
  };

  const getCurrentCode = () => {
    return codeTemplates[codeLanguage]?.[operation] || [];
  };

  const getCurrentExplanations = () => {
    return codeExplanations[operation] || {};
  };

  return (
    <div className="col-span-4 flex flex-col glass-card p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Code className="w-5 h-5 text-cyan-400" />
          Linked List Code ({codeLanguage.toUpperCase()})
        </h3>
        <div className="text-sm text-gray-400">
          Operation: <span className="text-cyan-400 font-semibold capitalize">{operation}</span>
        </div>
      </div>

      <div className="bg-gray-900/90 rounded-lg p-4 font-mono text-sm flex-1 overflow-auto">
        {getCurrentCode().map((line, index) => (
          <motion.div
            key={index}
            className={`py-1 px-2 rounded transition-all duration-300 cursor-pointer ${
              currentCodeLine === index 
                ? 'bg-cyan-500/30 border-l-4 border-cyan-400 text-cyan-100 shadow-lg' 
                : 'text-gray-300 hover:bg-gray-800/50'
            }`}
            animate={{ 
              scale: currentCodeLine === index ? 1.02 : 1, 
              x: currentCodeLine === index ? 8 : 0 
            }}
            onMouseEnter={(e) => {
              const explanation = getCurrentExplanations()[index];
              if (explanation) {
                showTooltip(explanation, e);
              }
            }}
            onMouseLeave={hideTooltip}
          >
            <span className="text-gray-500 mr-3 w-6 inline-block text-right select-none">
              {index + 1}
            </span>
            <span className="leading-relaxed">{line}</span>
          </motion.div>
        ))}
      </div>

      {/* Animation Status */}
      {animationStep && (
        <div className="mt-4 p-3 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg border border-blue-500/30">
          <div className="text-sm text-blue-200">
            <strong>Status:</strong> {animationStep}
          </div>
          {currentIteration >= 0 && (
            <div className="text-xs text-blue-300 mt-1">
              Current iteration: {currentIteration}
            </div>
          )}
        </div>
      )}

      {/* Code Complexity Info */}
      <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
        <div className="bg-gray-800/50 p-2 rounded border border-gray-700/50">
          <div className="text-gray-400">Time Complexity</div>
          <div className="text-cyan-400 font-bold">
            {operation === 'search' || operation === 'traverse' ? 'O(n)' :
             operation === 'insert' || operation === 'delete' ? 'O(n)' : 'O(n)'}
          </div>
        </div>
        <div className="bg-gray-800/50 p-2 rounded border border-gray-700/50">
          <div className="text-gray-400">Space Complexity</div>
          <div className="text-green-400 font-bold">O(1)</div>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip.show && (
        <motion.div
          className="fixed bg-gray-800/95 text-white text-sm p-3 rounded-lg shadow-2xl z-50 max-w-xs border border-cyan-500/30"
          style={{ top: tooltip.y, left: tooltip.x }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="font-medium text-cyan-200">{tooltip.content}</div>
        </motion.div>
      )}
    </div>
  );
};

export default CodeDisplay;
