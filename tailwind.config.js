/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          void: '#000000',
          deep: '#0a0a0f',
          dark: '#151520',
          medium: '#1a1a2e',
          light: '#16213e',
          accent: '#0f3460',
        },
        cosmic: {
          primary: '#00d4ff',
          secondary: '#0099cc',
          tertiary: '#006699',
          glow: '#00ffff',
          ice: '#b3e5fc',
        },
        nebula: {
          pink: '#ff6b9d',
          purple: '#9b59b6',
          blue: '#3498db',
          teal: '#1abc9c',
          green: '#2ecc71',
        },
        ui: {
          text: '#ffffff',
          textSecondary: '#b3b3b3',
          textMuted: '#666666',
          border: '#2a2a3e',
          borderLight: '#3a3a4e',
          success: '#00ff88',
          warning: '#ffaa00',
          error: '#ff4444',
          info: '#00d4ff',
        },
      },
      fontFamily: {
        display: ['"Orbitron"', 'monospace'],
        code: ['"Fira Code"', '"Consolas"', 'monospace'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'twinkle': 'twinkle 2s ease-in-out infinite',
        'drift': 'drift 15s linear infinite',
        'slow-rotate': 'slowRotate 30s linear infinite',
        'orbit-slow': 'orbitSlow 60s linear infinite',
        'orbit-fast': 'orbitFast 40s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.5)' },
          '50%': { boxShadow: '0 0 30px rgba(0, 212, 255, 0.8)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
        drift: {
          '0%': { transform: 'translateX(-100vw) translateY(0)' },
          '100%': { transform: 'translateX(100vw) translateY(-50px)' },
        },
        slowRotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        orbitSlow: {
          '0%': { transform: 'rotate(0deg) translateX(300px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(300px) rotate(-360deg)' },
        },
        orbitFast: {
          '0%': { transform: 'rotate(0deg) translateX(200px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(200px) rotate(-360deg)' },
        },
      },
      boxShadow: {
        'cosmic': '0 0 20px rgba(0, 212, 255, 0.5), 0 0 40px rgba(0, 212, 255, 0.3), 0 0 60px rgba(0, 212, 255, 0.1)',
        'nebula': '0 0 20px rgba(255, 107, 157, 0.4), 0 0 40px rgba(155, 89, 182, 0.3)',
        'success': '0 0 20px rgba(0, 255, 136, 0.4)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}