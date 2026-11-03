/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#080B14',
        sidebar: '#0D1220',
        card: {
          DEFAULT: '#121A2B',
          hover: '#182238',
          border: 'rgba(255, 255, 255, 0.08)'
        },
        primary: {
          DEFAULT: '#7C5CFC',
          hover: '#6845EE',
          light: '#9B82FD',
          glow: 'rgba(124, 92, 252, 0.25)'
        },
        accent: {
          DEFAULT: '#22D3EE',
          hover: '#06B6D4',
          glow: 'rgba(34, 211, 238, 0.25)'
        },
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace']
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'wave': 'wave 1.2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 15px rgba(124, 92, 252, 0.2)' },
          '100%': { boxShadow: '0 0 25px rgba(34, 211, 238, 0.4)' },
        },
        wave: {
          '0%': { height: '20%' },
          '100%': { height: '100%' },
        }
      }
    },
  },
  plugins: [],
}

