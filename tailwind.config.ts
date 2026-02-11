import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    screens: {
      // Custom responsive breakpoints
      sm: '640px',   // Mobile landscape / Small tablets
      md: '768px',   // Tablets
      lg: '1024px',  // Laptops / Small desktops
      xl: '1280px',  // Desktops
      '2xl': '1536px', // Large desktops
    },
    extend: {
      colors: {
        // Legacy color variables (keep for backward compatibility)
        background: 'var(--background)',
        foreground: 'var(--foreground)',

        // Custom brand colors for hospital theme
        brand: {
          light: '#93C5FD',    // Light blue for accents
          DEFAULT: '#3B82F6',   // Primary brand blue
          dark: '#1E40AF',      // Dark blue for emphasis
        },

        // Medical/Hospital specific colors
        medical: {
          primary: '#0EA5E9',   // Medical blue
          success: '#10B981',   // Success green (for completed)
          warning: '#F59E0B',   // Warning amber (for waiting)
          danger: '#EF4444',    // Danger red (for urgent)
          info: '#6366F1',      // Info indigo
        },

        // Enhanced dark mode colors
        dark: {
          bg: {
            primary: '#0F172A',   // Dark background
            secondary: '#1E293B', // Card background
            tertiary: '#334155',  // Elevated surfaces
          },
          text: {
            primary: '#F1F5F9',   // Primary text
            secondary: '#CBD5E1', // Secondary text
            muted: '#94A3B8',     // Muted text
          },
        },
      },

      // Custom spacing for consistent layouts
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },

      // Custom border radius
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};

export default config;
