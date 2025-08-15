import React from 'react';
import PropTypes from 'prop-types';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const codeTemplates = {
  python: {
    push: `class Stack:
    def __init__(self, capacity):
        self.stack = []
        self.capacity = capacity

    def push(self, item):
        if len(self.stack) == self.capacity:
            raise Exception("Stack Overflow")
        self.stack.append(item)
`,
    pop: `class Stack:
    # ... (other methods)
    def pop(self):
        if not self.stack:
            raise Exception("Stack Underflow")
        return self.stack.pop()
`,
    peek: `class Stack:
    # ... (other methods)
    def peek(self):
        if not self.stack:
            return None
        return self.stack[-1]
`,
  },
  java: {
    push: `public class Stack {
    private int[] stack;
    private int top;
    private int capacity;

    public Stack(int capacity) {
        this.capacity = capacity;
        stack = new int[capacity];
        top = -1;
    }

    public void push(int item) {
        if (top == capacity - 1) {
            throw new StackOverflowError("Stack Overflow");
        }
        stack[++top] = item;
    }
`,
    pop: `public class Stack {
    // ... (other methods)
    public int pop() {
        if (top == -1) {
            throw new EmptyStackException();
        }
        return stack[top--];
    }
`,
    peek: `public class Stack {
    // ... (other methods)
    public int peek() {
        if (top == -1) {
            throw new EmptyStackException();
        }
        return stack[top];
    }
`,
  },
  c: {
    push: `#include <stdio.h>
#include <stdlib.h>

#define MAX_SIZE 10

typedef struct {
    int items[MAX_SIZE];
    int top;
} Stack;

void push(Stack *s, int item) {
    if (s->top == MAX_SIZE - 1) {
        printf("Stack Overflow\\n");
        return;
    }
    s->items[++(s->top)] = item;
}
`,
    pop: `// ... (other code)
int pop(Stack *s) {
    if (s->top == -1) {
        printf("Stack Underflow\\n");
        return -1; // Error code
    }
    return s->items[(s->top)--];
}
`,
    peek: `// ... (other code)
int peek(Stack *s) {
    if (s->top == -1) {
        printf("Stack is empty\\n");
        return -1; // Error code
    }
    return s->items[s->top];
}
`,
  },
};

const CodeDisplay = ({ codeLanguage, operation, currentCodeLine, animationStep }) => {
  const code = codeTemplates[codeLanguage][operation];
  
  const complexityInfo = {
    push: { time: 'O(1)', space: 'O(1)', description: 'Constant time insertion at top' },
    pop: { time: 'O(1)', space: 'O(1)', description: 'Constant time removal from top' },
    peek: { time: 'O(1)', space: 'O(1)', description: 'Constant time access to top element' }
  };

  return (
    <div className="col-span-3 flex flex-col glass-card p-6 h-full bg-gradient-to-br from-gray-900/90 to-purple-900/90 backdrop-blur-xl border border-gray-700/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"></span>
          {codeLanguage.toUpperCase()} - {operation.charAt(0).toUpperCase() + operation.slice(1)}
        </h3>
        <span className="text-sm text-gray-300 bg-gray-800/50 px-3 py-1 rounded-full">
          Code View
        </span>
      </div>
      <div className="flex items-center gap-3 text-xs mb-3">
        <span className="bg-green-900/50 text-green-300 px-2 py-1 rounded">
          Time: {complexityInfo[operation].time}
        </span>
        <span className="bg-blue-900/50 text-blue-300 px-2 py-1 rounded">
          Space: {complexityInfo[operation].space}
        </span>
      </div>
      <p className="text-xs text-gray-400 mb-3">{complexityInfo[operation].description}</p>
      
      <div className="flex-1 overflow-auto">
        <SyntaxHighlighter
          language={codeLanguage === 'c' ? 'c' : codeLanguage}
          style={atomDark}
          showLineNumbers
          wrapLines
          lineNumberStyle={{ color: '#6b7280' }}
          lineProps={lineNumber => {
            const style = { 
              display: 'block',
              width: '100%',
              transition: 'background-color 0.3s ease-in-out',
            };
            if (lineNumber === currentCodeLine) {
              style.backgroundColor = 'rgba(56, 189, 248, 0.2)';
              style.boxShadow = 'inset 3px 0 0 0 #38bdf8';
            }
            return { style };
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
      <div className="mt-4 p-3 bg-gradient-to-r from-gray-800/80 to-gray-900/70 rounded-lg text-sm text-yellow-300/90 border border-white/10 font-mono shadow-inner">
        <span className="font-bold text-yellow-200/90 mr-2">&gt;</span>
        {animationStep}
      </div>
    </div>
  );
};

CodeDisplay.propTypes = {
  codeLanguage: PropTypes.oneOf(['python', 'java', 'c']).isRequired,
  operation: PropTypes.oneOf(['push', 'pop', 'peek']).isRequired,
  currentCodeLine: PropTypes.number.isRequired,
  animationStep: PropTypes.string.isRequired
};

CodeDisplay.defaultProps = {
  codeLanguage: 'python',
  operation: 'push',
  currentCodeLine: -1,
  animationStep: 'Ready for operation'
};

export default CodeDisplay;
