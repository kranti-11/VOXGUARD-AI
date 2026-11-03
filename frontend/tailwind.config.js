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
        bg: {
          DEFAULT: '#090909',
          sidebar: '#0D0D0D',
          card: '#141414',
          surface: '#1A1A1A',
          hover: '#202020',
        },
        border: {
          DEFAULT: '#262626',
          subtle: '#1F1F1F',
          strong: '#383838',
        },
        accent: {
          DEFAULT: '#B8F36B',
          hover: '#A3E635',
          muted: '#283818',
        },
        txt: {
          primary: '#F5F5F5',
          secondary: '#929292',
          muted: '#5A5A5A',
        },
        danger: {
          DEFAULT: '#F87171',
          muted: '#3B1818',
        },
        warn: {
          DEFAULT: '#EAB66A',
          muted: '#3B2D18',
        },
        ok: {
          DEFAULT: '#B8F36B',
          muted: '#1E2F13',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace']
      },
      borderRadius: {
        'xs': '4px',
        'sm': '6px',
        DEFAULT: '8px',
        'md': '8px',
        'lg': '10px',
        'xl': '12px',
      }
    },
  },
  plugins: [],
}
