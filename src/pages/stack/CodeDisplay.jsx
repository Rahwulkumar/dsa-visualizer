import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code } from 'lucide-react';
import '../../styles/globals.css';

// Explicit IDs will be added to key elements for testing and accessibility
const CodeDisplay = ({ codeLanguage, operation, currentCodeLine, animationStep, currentIteration }) => {
  const [tooltip, setTooltip] = useState({ show: false, content: '', x: 0, y: 0 });

  const codeTemplates = {
    python: {
      push: ['def push(stack, value):', '    if len(stack) == capacity:', '        raise Exception("Stack Overflow")', '    stack.append(value)', '    # push complete'],
      pop: ['def pop(stack):', '    if not stack:', '        raise Exception("Stack Underflow")', '    return stack.pop()', '    # pop complete'],
      peek: ['def peek(stack):', '    if not stack:', '        return None', '    return stack[-1]', '    # peek complete']
    },
    java: {
      push: ['public void push(int item) {', '    if (top == capacity - 1) {', '        throw new StackOverflowError();', '    }', '    stack[++top] = item;', '}'],
      pop: ['public int pop() {', '    if (top == -1) {', '        throw new EmptyStackException();', '    }', '    return stack[top--];', '}'],
      peek: ['public int peek() {', '    if (top == -1) {', '        throw new EmptyStackException();', '    }', '    return stack[top];', '}']
    },
    c: {
      push: ['void push(Stack *s, int item) {', '    if (s->top == MAX_SIZE - 1) {', '        printf("Stack Overflow\\n");', '        return;', '    }', '    s->items[++(s->top)] = item;', '}'],
      pop: ['int pop(Stack *s) {', '    if (s->top == -1) {', '        printf("Stack Underflow\\n");', '        return -1;', '    }', '    return s->items[(s->top)--];', '}'],
      peek: ['int peek(Stack *s) {', '    if (s->top == -1) {', '        printf("Stack is empty\\n");', '        return -1;', '    }', '    return s->items[s->top];', '}']
    }
  };

  const codeExplanations = {
    push: {
      0: 'Define push function',
      1: 'Check for overflow condition',
      2: 'Handle overflow by raising/printing error',
      3: 'Add element to top of stack',
      4: 'Push operation complete'
    },
    pop: {
      0: 'Define pop function',
      1: 'Check for underflow/empty stack',
      2: 'Handle underflow',
      3: 'Remove and return top element',
      4: 'Pop operation complete'
    },
    peek: {
      0: 'Define peek function',
      1: 'Check for empty stack',
      2: 'Handle empty',
      3: 'Return top element',
      4: 'Peek operation complete'
    }
  };

  const showTooltip = (content, event) => {
    setTooltip({ show: true, content, x: event.clientX + 10, y: event.clientY - 10 });
  };

  const hideTooltip = () => setTooltip({ show: false, content: '', x: 0, y: 0 });

  const lines = (codeTemplates[codeLanguage] && codeTemplates[codeLanguage][operation]) || ['// Code not available'];

  return (
  <div id="stack-codedisplay" className="col-span-3 flex flex-col glass-card p-4 h-full" role="region" aria-labelledby="stack-code-title">
      <h3 id="stack-code-title" className="text-lg font-bold text-white flex items-center gap-2">
        <Code className="w-5 h-5 text-cyan-400" />
        <span id="stack-code-language">Code ({codeLanguage.toUpperCase()})</span>
      </h3>

  <div id="stack-code-box" className="bg-gray-900/90 rounded-lg p-4 font-mono text-sm flex-1 overflow-auto scrollbar-thin">
        {lines.map((line, index) => (
          <motion.div
            id={`stack-code-line-${index}`}
            key={index}
            className={`py-1 px-2 rounded transition-all duration-300 ${currentCodeLine === index ? 'bg-cyan-500/30 border-l-4 border-cyan-400 text-cyan-100' : 'text-gray-300'}`}
            animate={{ scale: currentCodeLine === index ? 1.02 : 1, x: currentCodeLine === index ? 8 : 0 }}
            onMouseEnter={(e) => showTooltip(codeExplanations[operation]?.[index] || 'Code explanation', e)}
            onMouseLeave={hideTooltip}
          >
            <span id={`stack-code-line-num-${index}`} className="text-gray-500 mr-3 w-6 inline-block text-right">{index + 1}</span>
            <span id={`stack-code-line-text-${index}`}>{line}</span>
          </motion.div>
        ))}
      </div>

      {tooltip.show && (
        <motion.div
          id="stack-code-tooltip"
          className="fixed bg-gray-800/90 text-white text-sm p-2 rounded shadow-lg z-50"
          style={{ top: tooltip.y, left: tooltip.x }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {tooltip.content}
        </motion.div>
      )}

      <div id="stack-code-status" className="mt-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
        <div id="stack-code-current-step" className="text-sm text-gray-300 mb-1">Current Step:</div>
        <div id="stack-code-animation-step" className="text-cyan-300 font-medium">{animationStep}</div>
        {typeof currentIteration === 'number' && currentIteration >= 0 && (
          <div id="stack-code-iteration" className="text-xs text-gray-400 mt-1">Iteration: {currentIteration + 1}</div>
        )}
      </div>
    </div>
  );
};

export default CodeDisplay;
