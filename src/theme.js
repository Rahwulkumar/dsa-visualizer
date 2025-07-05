// Space-themed design system for DSA Visualizer
export const theme = {
  // Color palette - Deep space theme
  colors: {
    // Primary space colors
    space: {
      void: '#000000',
      deep: '#0a0a0f',
      dark: '#151520',
      medium: '#1a1a2e',
      light: '#16213e',
      accent: '#0f3460',
    },
    
    // Cosmic blues and teals
    cosmic: {
      primary: '#00d4ff',
      secondary: '#0099cc',
      tertiary: '#006699',
      glow: '#00ffff',
      ice: '#b3e5fc',
    },
    
    // Nebula colors (subtle accents)
    nebula: {
      pink: '#ff6b9d',
      purple: '#9b59b6',
      blue: '#3498db',
      teal: '#1abc9c',
      green: '#2ecc71',
    },
    
    // UI states
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
    
    // Gradients
    gradients: {
      primary: 'linear-gradient(135deg, #000000 0%, #0a0a0f 25%, #151520 50%, #1a1a2e 100%)',
      cosmic: 'linear-gradient(45deg, #00d4ff 0%, #0099cc 50%, #006699 100%)',
      nebula: 'linear-gradient(135deg, #ff6b9d 0%, #9b59b6 50%, #3498db 100%)',
      card: 'linear-gradient(135deg, rgba(26, 26, 46, 0.8) 0%, rgba(21, 21, 32, 0.9) 100%)',
      glow: 'radial-gradient(circle, rgba(0, 212, 255, 0.1) 0%, transparent 70%)',
    }
  },

  // Typography
  typography: {
    fonts: {
      primary: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
      display: '"Orbitron", monospace',
      code: '"Fira Code", "Consolas", monospace',
    },
    
    sizes: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
      '6xl': '3.75rem',  // 60px
      '7xl': '4.5rem',   // 72px
      '8xl': '6rem',     // 96px
      '9xl': '8rem',     // 128px
    },
    
    weights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    
    lineHeights: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    }
  },

  // Spacing system
  spacing: {
    px: '1px',
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
    32: '8rem',     // 128px
    40: '10rem',    // 160px
    48: '12rem',    // 192px
    56: '14rem',    // 224px
    64: '16rem',    // 256px
  },

  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Shadows and effects
  effects: {
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 212, 255, 0.05)',
      md: '0 4px 6px -1px rgba(0, 212, 255, 0.1)',
      lg: '0 10px 15px -3px rgba(0, 212, 255, 0.1)',
      xl: '0 20px 25px -5px rgba(0, 212, 255, 0.1)',
      '2xl': '0 25px 50px -12px rgba(0, 212, 255, 0.25)',
      cosmic: '0 0 20px rgba(0, 212, 255, 0.5)',
      nebula: '0 0 30px rgba(255, 107, 157, 0.3)',
    },
    
    blur: {
      sm: '4px',
      md: '8px',
      lg: '12px',
      xl: '16px',
      '2xl': '24px',
      '3xl': '40px',
    },
    
    glows: {
      cosmic: {
        boxShadow: '0 0 20px rgba(0, 212, 255, 0.5), 0 0 40px rgba(0, 212, 255, 0.3), 0 0 60px rgba(0, 212, 255, 0.1)',
      },
      nebula: {
        boxShadow: '0 0 20px rgba(255, 107, 157, 0.4), 0 0 40px rgba(155, 89, 182, 0.3)',
      },
      success: {
        boxShadow: '0 0 20px rgba(0, 255, 136, 0.4)',
      }
    }
  },

  // Border radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },

  // Transitions
  transitions: {
    default: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fast: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
    slow: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    spring: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  },

  // Animation keyframes
  animations: {
    float: {
      '0%, 100%': { transform: 'translateY(0px)' },
      '50%': { transform: 'translateY(-10px)' },
    },
    
    pulse: {
      '0%, 100%': { opacity: 1 },
      '50%': { opacity: 0.5 },
    },
    
    glow: {
      '0%, 100%': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.5)' },
      '50%': { boxShadow: '0 0 30px rgba(0, 212, 255, 0.8)' },
    },
    
    rotate: {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' },
    },
    
    twinkle: {
      '0%, 100%': { opacity: 0.3, transform: 'scale(1)' },
      '50%': { opacity: 1, transform: 'scale(1.2)' },
    },
    
    drift: {
      '0%': { transform: 'translateX(-100vw) translateY(0)' },
      '100%': { transform: 'translateX(100vw) translateY(-50px)' },
    }
  },

  // Component variants
  components: {
    button: {
      primary: {
        base: 'px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105',
        cosmic: 'bg-gradient-to-r from-cosmic-primary to-cosmic-secondary text-white shadow-lg hover:shadow-cosmic',
        nebula: 'bg-gradient-to-r from-nebula-pink to-nebula-purple text-white shadow-lg hover:shadow-nebula',
        ghost: 'border-2 border-cosmic-primary text-cosmic-primary hover:bg-cosmic-primary hover:text-white',
        glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20',
      },
      
      sizes: {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
        xl: 'px-10 py-5 text-xl',
      }
    },
    
    card: {
      base: 'rounded-xl border border-ui-border backdrop-blur-sm transition-all duration-300',
      glass: 'bg-white/5 backdrop-blur-md border-white/10',
      solid: 'bg-space-medium border-ui-borderLight',
      glow: 'shadow-lg hover:shadow-cosmic transform hover:scale-105',
      interactive: 'cursor-pointer hover:bg-white/10 hover:border-cosmic-primary/50',
    },
    
    text: {
      heading: 'font-display font-bold text-ui-text',
      subheading: 'font-primary font-semibold text-ui-textSecondary',
      body: 'font-primary text-ui-text',
      muted: 'font-primary text-ui-textMuted',
      code: 'font-code text-cosmic-primary',
    }
  },

  // Z-index layers
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },

  // Content max widths
  containers: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1400px',
    '3xl': '1600px',
    '4xl': '1800px',
    full: '100%',
  },
};

// Utility functions
export const getSpacing = (value) => theme.spacing[value] || value;
export const getColor = (colorPath) => {
  const paths = colorPath.split('.');
  let color = theme.colors;
  
  for (const path of paths) {
    color = color[path];
    if (!color) return colorPath;
  }
  
  return color;
};

export const getBreakpoint = (bp) => `@media (min-width: ${theme.breakpoints[bp]})`;

// CSS-in-JS helper
export const css = (styles) => {
  if (typeof styles === 'string') return styles;
  
  return Object.entries(styles)
    .map(([key, value]) => `${key}: ${value}`)
    .join('; ');
};

// Theme context hook
export const useTheme = () => theme;

export default theme;
