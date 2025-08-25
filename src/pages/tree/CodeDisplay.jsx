import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code } from 'lucide-react';
import '../../styles/globals.css';

// Explicit IDs will be added to key elements for testing and accessibility
const CodeDisplay = ({ codeLanguage, operation, currentCodeLine, animationStep, currentIteration }) => {
  const [tooltip, setTooltip] = useState({ show: false, content: '', x: 0, y: 0 });

  const codeTemplates = {
    python: {
      insert: [
        'def insert(root, value):',
        '    if root is None:',
        '        return Node(value)',
        '    if value < root.data:',
        '        root.left = insert(root.left, value)',
        '    else:',
        '        root.right = insert(root.right, value)',
        '    return root'
      ],
      search: [
        'def search(root, value):',
        '    if root is None:',
        '        return False',
        '    if root.data == value:',
        '        return True',
        '    elif value < root.data:',
        '        return search(root.left, value)',
        '    else:',
        '        return search(root.right, value)'
      ],
      delete: [
        'def delete(root, value):',
        '    if root is None:',
        '        return root',
        '    if value < root.data:',
        '        root.left = delete(root.left, value)',
        '    elif value > root.data:',
        '        root.right = delete(root.right, value)',
        '    else:',
        '        # Node to delete found',
        '        if root.left is None:',
        '            return root.right',
        '        elif root.right is None:',
        '            return root.left',
        '        # Find inorder successor',
        '        root.data = min_value(root.right)',
        '        root.right = delete(root.right, root.data)',
        '    return root'
      ],
      inorder: [
        'def inorder(root):',
        '    if root is not None:',
        '        inorder(root.left)',
        '        print(root.data)',
        '        inorder(root.right)'
      ],
      preorder: [
        'def preorder(root):',
        '    if root is not None:',
        '        print(root.data)',
        '        preorder(root.left)',
        '        preorder(root.right)'
      ],
      postorder: [
        'def postorder(root):',
        '    if root is not None:',
        '        postorder(root.left)',
        '        postorder(root.right)',
        '        print(root.data)'
      ]
    },
    java: {
      insert: [
        'public TreeNode insert(TreeNode root, int value) {',
        '    if (root == null) {',
        '        return new TreeNode(value);',
        '    }',
        '    if (value < root.val) {',
        '        root.left = insert(root.left, value);',
        '    } else {',
        '        root.right = insert(root.right, value);',
        '    }',
        '    return root;',
        '}'
      ],
      search: [
        'public boolean search(TreeNode root, int value) {',
        '    if (root == null) {',
        '        return false;',
        '    }',
        '    if (root.val == value) {',
        '        return true;',
        '    } else if (value < root.val) {',
        '        return search(root.left, value);',
        '    } else {',
        '        return search(root.right, value);',
        '    }',
        '}'
      ],
      delete: [
        'public TreeNode delete(TreeNode root, int value) {',
        '    if (root == null) return root;',
        '    if (value < root.val) {',
        '        root.left = delete(root.left, value);',
        '    } else if (value > root.val) {',
        '        root.right = delete(root.right, value);',
        '    } else {',
        '        if (root.left == null) return root.right;',
        '        if (root.right == null) return root.left;',
        '        root.val = minValue(root.right);',
        '        root.right = delete(root.right, root.val);',
        '    }',
        '    return root;',
        '}'
      ],
      inorder: [
        'public void inorder(TreeNode root) {',
        '    if (root != null) {',
        '        inorder(root.left);',
        '        System.out.print(root.val + " ");',
        '        inorder(root.right);',
        '    }',
        '}'
      ],
      preorder: [
        'public void preorder(TreeNode root) {',
        '    if (root != null) {',
        '        System.out.print(root.val + " ");',
        '        preorder(root.left);',
        '        preorder(root.right);',
        '    }',
        '}'
      ],
      postorder: [
        'public void postorder(TreeNode root) {',
        '    if (root != null) {',
        '        postorder(root.left);',
        '        postorder(root.right);',
        '        System.out.print(root.val + " ");',
        '    }',
        '}'
      ]
    },
    c: {
      insert: [
        'TreeNode* insert(TreeNode* root, int value) {',
        '    if (root == NULL) {',
        '        TreeNode* newNode = malloc(sizeof(TreeNode));',
        '        newNode->data = value;',
        '        newNode->left = newNode->right = NULL;',
        '        return newNode;',
        '    }',
        '    if (value < root->data)',
        '        root->left = insert(root->left, value);',
        '    else',
        '        root->right = insert(root->right, value);',
        '    return root;',
        '}'
      ],
      search: [
        'bool search(TreeNode* root, int value) {',
        '    if (root == NULL)',
        '        return false;',
        '    if (root->data == value)',
        '        return true;',
        '    else if (value < root->data)',
        '        return search(root->left, value);',
        '    else',
        '        return search(root->right, value);',
        '}'
      ],
      delete: [
        'TreeNode* delete(TreeNode* root, int value) {',
        '    if (root == NULL) return root;',
        '    if (value < root->data)',
        '        root->left = delete(root->left, value);',
        '    else if (value > root->data)',
        '        root->right = delete(root->right, value);',
        '    else {',
        '        if (root->left == NULL) {',
        '            TreeNode* temp = root->right;',
        '            free(root);',
        '            return temp;',
        '        }',
        '        else if (root->right == NULL) {',
        '            TreeNode* temp = root->left;',
        '            free(root);',
        '            return temp;',
        '        }',
        '        TreeNode* temp = minValueNode(root->right);',
        '        root->data = temp->data;',
        '        root->right = delete(root->right, temp->data);',
        '    }',
        '    return root;',
        '}'
      ],
      inorder: [
        'void inorder(TreeNode* root) {',
        '    if (root != NULL) {',
        '        inorder(root->left);',
        '        printf("%d ", root->data);',
        '        inorder(root->right);',
        '    }',
        '}'
      ],
      preorder: [
        'void preorder(TreeNode* root) {',
        '    if (root != NULL) {',
        '        printf("%d ", root->data);',
        '        preorder(root->left);',
        '        preorder(root->right);',
        '    }',
        '}'
      ],
      postorder: [
        'void postorder(TreeNode* root) {',
        '    if (root != NULL) {',
        '        postorder(root->left);',
        '        postorder(root->right);',
        '        printf("%d ", root->data);',
        '    }',
        '}'
      ]
    }
  };

  const codeExplanations = {
    insert: {
      0: 'Define insert function',
      1: 'Check for empty tree (base case)',
      2: 'Create new node',
      3: 'Compare value with current node',
      4: 'Insert in left subtree',
      5: 'Insert in right subtree',
      6: 'Return root node',
      7: 'Insert operation complete'
    },
    search: {
      0: 'Define search function',
      1: 'Check for empty tree',
      2: 'Return false if not found',
      3: 'Check if value matches',
      4: 'Return true if found',
      5: 'Compare value with current node',
      6: 'Search left subtree',
      7: 'Search right subtree'
    },
    delete: {
      0: 'Define delete function',
      1: 'Check for empty tree',
      2: 'Compare value with current node',
      3: 'Delete from left subtree',
      4: 'Delete from right subtree',
      5: 'Node to delete found',
      6: 'Case 1: No left child',
      7: 'Case 2: No right child',
      8: 'Case 3: Two children',
      9: 'Find inorder successor',
      10: 'Replace with successor',
      11: 'Delete successor',
      12: 'Delete operation complete'
    },
    inorder: {
      0: 'Define inorder traversal',
      1: 'Check if node exists',
      2: 'Visit left subtree',
      3: 'Process current node',
      4: 'Visit right subtree'
    },
    preorder: {
      0: 'Define preorder traversal',
      1: 'Check if node exists',
      2: 'Process current node',
      3: 'Visit left subtree',
      4: 'Visit right subtree'
    },
    postorder: {
      0: 'Define postorder traversal',
      1: 'Check if node exists',
      2: 'Visit left subtree',
      3: 'Visit right subtree',
      4: 'Process current node'
    }
  };

  const showTooltip = (content, event) => {
    setTooltip({ show: true, content, x: event.clientX + 10, y: event.clientY - 10 });
  };

  const hideTooltip = () => setTooltip({ show: false, content: '', x: 0, y: 0 });

  const lines = (codeTemplates[codeLanguage] && codeTemplates[codeLanguage][operation]) || ['// Code not available'];

  return (
  <div id="tree-codedisplay" className="col-span-3 flex flex-col glass-card p-4 h-full" role="region" aria-labelledby="tree-code-title">
      <h3 id="tree-code-title" className="text-lg font-bold text-white flex items-center gap-2">
        <Code className="w-5 h-5 text-cyan-400" />
        <span id="tree-code-language">Code ({codeLanguage.toUpperCase()})</span>
      </h3>

  <div id="tree-code-box" className="bg-gray-900/90 rounded-lg p-4 font-mono text-sm flex-1 overflow-auto scrollbar-thin">
        {lines.map((line, index) => (
          <motion.div
            id={`tree-code-line-${index}`}
            key={index}
            className={`py-1 px-2 rounded transition-all duration-300 ${currentCodeLine === index ? 'bg-cyan-500/30 border-l-4 border-cyan-400 text-cyan-100' : 'text-gray-300'}`}
            animate={{ scale: currentCodeLine === index ? 1.02 : 1, x: currentCodeLine === index ? 8 : 0 }}
            onMouseEnter={(e) => showTooltip(codeExplanations[operation]?.[index] || 'Code explanation', e)}
            onMouseLeave={hideTooltip}
          >
            <span id={`tree-code-line-num-${index}`} className="text-gray-500 mr-3 w-6 inline-block text-right">{index + 1}</span>
            <span id={`tree-code-line-text-${index}`}>{line}</span>
          </motion.div>
        ))}
      </div>

      {tooltip.show && (
        <motion.div
          id="tree-code-tooltip"
          className="fixed bg-gray-800/90 text-white text-sm p-2 rounded shadow-lg z-50"
          style={{ top: tooltip.y, left: tooltip.x }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {tooltip.content}
        </motion.div>
      )}

      <div id="tree-code-status" className="mt-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
        <div id="tree-code-current-step" className="text-sm text-gray-300 mb-1">Current Step:</div>
        <div id="tree-code-animation-step" className="text-cyan-300 font-medium">{animationStep}</div>
        {typeof currentIteration === 'number' && currentIteration >= 0 && (
          <div id="tree-code-iteration" className="text-xs text-gray-400 mt-1">Iteration: {currentIteration + 1}</div>
        )}
      </div>
    </div>
  );
};

export default CodeDisplay;
