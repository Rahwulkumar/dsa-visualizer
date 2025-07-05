// DSA Visualizer Configuration Constants
export const APP_CONFIG = {
  name: 'DSA Visualizer',
  version: '1.0.0',
  description: 'Interactive Data Structures & Algorithms Universe',
  author: 'DSA Team',
  url: 'https://dsa-visualizer.vercel.app',
};

export const ANIMATION_CONFIG = {
  defaultDuration: 300,
  slowDuration: 500,
  fastDuration: 150,
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
};

export const PERFORMANCE_CONFIG = {
  maxParticles: 5000,
  maxAsteroids: 50,
  renderDistance: 400,
  frameRate: 60,
};

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export const DSA_MODULES = [
  'arrays',
  'linked-lists',
  'stacks',
  'queues',
  'trees',
  'graphs',
  'hash-tables',
  'heaps',
  'tries',
  'sorting',
  'searching',
];

export const COMPLEXITY_COLORS = {
  'O(1)': '#00ff88',
  'O(log n)': '#00d4ff',
  'O(n)': '#ffaa00',
  'O(n log n)': '#ff6b9d',
  'O(n²)': '#ff4444',
  'O(2^n)': '#9b59b6',
};