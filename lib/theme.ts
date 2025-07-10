'use client';

import { createGlobalStyle } from 'styled-components';

export const theme = {
  colors: {
    primary: '#FF006E',
    secondary: '#8338EC',
    tertiary: '#3A86FF',
    success: '#06FFA5',
    danger: '#FF4365',
    warning: '#FFB700',
    dark: '#0A0E27',
    light: '#F7F9FB',
    gray: {
      100: '#F7F9FB',
      200: '#E5E9F2',
      300: '#C1C7D0',
      400: '#8993A4',
      500: '#65727E',
      600: '#4A5568',
      700: '#2D3748',
      800: '#1A202C',
      900: '#0A0E27',
    },
    gradient: {
      primary: 'linear-gradient(135deg, #FF006E 0%, #8338EC 100%)',
      secondary: 'linear-gradient(135deg, #3A86FF 0%, #06FFA5 100%)',
      danger: 'linear-gradient(135deg, #FF4365 0%, #FF006E 100%)',
      dark: 'linear-gradient(135deg, #0A0E27 0%, #1A202C 100%)',
    },
  },
  fonts: {
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    heading: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "'JetBrains Mono', 'Courier New', monospace",
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
    '4xl': '6rem',
    '5xl': '8rem',
  },
  radii: {
    none: '0',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    xl: '1.5rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    glow: '0 0 30px rgba(131, 56, 236, 0.5)',
    neon: '0 0 20px rgba(255, 0, 110, 0.8), 0 0 40px rgba(255, 0, 110, 0.4)',
  },
  transitions: {
    fast: '150ms ease-in-out',
    normal: '300ms ease-in-out',
    slow: '500ms ease-in-out',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};

export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: ${theme.fonts.body};
    background-color: ${theme.colors.dark};
    color: ${theme.colors.light};
    line-height: 1.6;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${theme.fonts.heading};
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.02em;
  }

  h1 { font-size: ${theme.fontSizes['5xl']}; }
  h2 { font-size: ${theme.fontSizes['4xl']}; }
  h3 { font-size: ${theme.fontSizes['3xl']}; }
  h4 { font-size: ${theme.fontSizes['2xl']}; }
  h5 { font-size: ${theme.fontSizes.xl}; }
  h6 { font-size: ${theme.fontSizes.lg}; }

  a {
    color: ${theme.colors.primary};
    text-decoration: none;
    transition: ${theme.transitions.fast};

    &:hover {
      color: ${theme.colors.secondary};
    }
  }

  button {
    font-family: ${theme.fonts.body};
    cursor: pointer;
    border: none;
    outline: none;
    transition: ${theme.transitions.fast};
  }

  input, textarea, select {
    font-family: ${theme.fonts.body};
    font-size: ${theme.fontSizes.md};
    border: none;
    outline: none;
  }

  code, pre {
    font-family: ${theme.fonts.mono};
  }

  ::selection {
    background-color: ${theme.colors.primary};
    color: ${theme.colors.light};
  }

  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  ::-webkit-scrollbar-track {
    background: ${theme.colors.gray[900]};
  }

  ::-webkit-scrollbar-thumb {
    background: ${theme.colors.gray[600]};
    border-radius: ${theme.radii.full};
    transition: ${theme.transitions.fast};

    &:hover {
      background: ${theme.colors.gray[500]};
    }
  }

  /* Animations */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInDown {
    from {
      opacity: 0;
      transform: translateY(-30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }

  @keyframes glow {
    0%, 100% {
      box-shadow: 0 0 20px rgba(255, 0, 110, 0.5);
    }
    50% {
      box-shadow: 0 0 40px rgba(255, 0, 110, 0.8);
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-20px);
    }
  }

  /* Utility classes */
  .gradient-text {
    background: ${theme.colors.gradient.primary};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .glass {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .neon-text {
    text-shadow: 0 0 10px ${theme.colors.primary}, 0 0 20px ${theme.colors.primary};
  }

  /* Loading animation */
  .loading-spinner {
    display: inline-block;
    width: 40px;
    height: 40px;
    border: 3px solid ${theme.colors.gray[700]};
    border-top-color: ${theme.colors.primary};
    border-radius: 50%;
    animation: rotate 1s linear infinite;
  }
`;