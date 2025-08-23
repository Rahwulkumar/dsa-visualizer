import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code } from 'lucide-react';
import '../../styles/globals.css';

const CodeDisplay = ({ codeLanguage, operation, currentCodeLine, animationStep, currentIteration }) => {
  const [tooltip, setTooltip] = useState({ show: false, content: '', x: 0, y: 0 });

  const codeTemplates = {
    python: {
      enqueue: ['def enqueue(queue, value):', '    if len(queue) >= MAX_SIZE:', '        raise Exception("Queue is full")', '    # Add element to rear', '    queue.append(value)', '    # Enqueue complete'],
      dequeue: ['def dequeue(queue):', '    if len(queue) == 0:', '        raise Exception("Queue is empty")', '    # Remove element from front', '    return queue.pop(0)', '    # Dequeue complete'],
      peek: ['def peek(queue):', '    if len(queue) == 0:', '        raise Exception("Queue is empty")', '    # Return front element', '    return queue[0]', '    # Peek complete'],
      display: ['def display(queue):', '    if len(queue) == 0:', '        print("Queue is empty")', '    # Traverse queue', '    for element in queue:', '        print(element)', '    # Display complete']
    },
    java: {
      enqueue: ['public void enqueue(Queue<Integer> queue, int value) {', '    if (queue.size() >= MAX_SIZE) {', '        throw new RuntimeException("Queue is full");', '    }', '    // Add element to rear', '    queue.offer(value);', '    // Enqueue complete', '}'],
      dequeue: ['public int dequeue(Queue<Integer> queue) {', '    if (queue.isEmpty()) {', '        throw new RuntimeException("Queue is empty");', '    }', '    // Remove element from front', '    return queue.poll();', '    // Dequeue complete', '}'],
      peek: ['public int peek(Queue<Integer> queue) {', '    if (queue.isEmpty()) {', '        throw new RuntimeException("Queue is empty");', '    }', '    // Return front element', '    return queue.peek();', '    // Peek complete', '}'],
      display: ['public void display(Queue<Integer> queue) {', '    if (queue.isEmpty()) {', '        System.out.println("Queue is empty");', '        return;', '    }', '    // Traverse queue', '    for (Integer element : queue) {', '        System.out.println(element);', '    }', '    // Display complete', '}']
    },
    c: {
      enqueue: ['void enqueue(Queue* q, int value) {', '    if (q->rear >= MAX_SIZE - 1) {', '        printf("Queue is full\\n");', '        return;', '    }', '    // Add element to rear', '    q->data[++q->rear] = value;', '    // Enqueue complete', '}'],
      dequeue: ['int dequeue(Queue* q) {', '    if (q->front > q->rear) {', '        printf("Queue is empty\\n");', '        return -1;', '    }', '    // Remove element from front', '    return q->data[q->front++];', '    // Dequeue complete', '}'],
      peek: ['int peek(Queue* q) {', '    if (q->front > q->rear) {', '        printf("Queue is empty\\n");', '        return -1;', '    }', '    // Return front element', '    return q->data[q->front];', '    // Peek complete', '}'],
      display: ['void display(Queue* q) {', '    if (q->front > q->rear) {', '        printf("Queue is empty\\n");', '        return;', '    }', '    // Traverse queue', '    for (int i = q->front; i <= q->rear; i++) {', '        printf("%d ", q->data[i]);', '    }', '    // Display complete', '}']
    }
  };

  const codeExplanations = {
    enqueue: {
      0: 'Function to add element to rear of queue',
      1: 'Check if queue has reached maximum capacity',
      2: 'Throw error if queue is full',
      3: 'Ready to add element to rear',
      4: 'Add element to rear position',
      5: 'Update rear pointer and queue size',
      6: 'Enqueue operation complete'
    },
    dequeue: {
      0: 'Function to remove element from front of queue',
      1: 'Check if queue is empty',
      2: 'Throw error if queue is empty',
      3: 'Ready to remove front element',
      4: 'Remove and return front element',
      5: 'Update front pointer and queue size',
      6: 'Dequeue operation complete'
    },
    peek: {
      0: 'Function to view front element without removing',
      1: 'Check if queue is empty',
      2: 'Throw error if queue is empty',
      3: 'Ready to access front element',
      4: 'Return front element value',
      5: 'Peek operation complete'
    },
    display: {
      0: 'Function to display all queue elements',
      1: 'Check if queue is empty',
      2: 'Print empty message if no elements',
      3: 'Start traversing from front to rear',
      4: 'Process each element in order',
      5: 'Print current element',
      6: 'Display operation complete'
    }
  };

  const showTooltip = (content, event) => {
    setTooltip({ show: true, content, x: event.clientX + 10, y: event.clientY - 10 });
  };

  const hideTooltip = () => {
    setTooltip({ show: false, content: '', x: 0, y: 0 });
  };

  return (
    <div className="col-span-4 flex flex-col glass-card p-4 h-full">
      <h3 className="text-lg font-bold text-white flex items-center gap-2">
        <Code className="w-5 h-5 text-cyan-400" />
        Code ({codeLanguage.toUpperCase()})
      </h3>
      <div className="bg-gray-900/90 rounded-lg p-4 font-mono text-sm flex-1 overflow-auto">
        {(codeTemplates[codeLanguage]?.[operation] || []).map((line, index) => (
          <motion.div
            key={index}
            className={`py-1 px-2 rounded transition-all duration-300 ${
              currentCodeLine === index ? 'bg-cyan-500/30 border-l-4 border-cyan-400 text-cyan-100' : 'text-gray-300'
            }`}
            animate={{ scale: currentCodeLine === index ? 1.02 : 1, x: currentCodeLine === index ? 8 : 0 }}
            onMouseEnter={(e) => showTooltip(codeExplanations[operation]?.[index] || 'Code explanation', e)}
            onMouseLeave={hideTooltip}
          >
            <span className="text-gray-500 mr-3 w-6 inline-block text-right">{index + 1}</span>
            {line}
          </motion.div>
        ))}
      </div>
      {tooltip.show && (
        <motion.div
          className="fixed bg-gray-800/90 text-white text-sm p-2 rounded shadow-lg z-50"
          style={{ top: tooltip.y, left: tooltip.x }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {tooltip.content}
        </motion.div>
      )}
      <div className="mt-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
        <div className="text-sm text-gray-300 mb-1">Current Step:</div>
        <div className="text-cyan-300 font-medium">{animationStep}</div>
        {currentIteration >= 0 && (
          <div className="text-xs text-gray-400 mt-1">
            Iteration: {currentIteration + 1}
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeDisplay;
