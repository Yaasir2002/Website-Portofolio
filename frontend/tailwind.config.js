/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0B0F19', // Deepest background
          800: '#111827', // Card surface
          700: '#1F2937', // Border / Muted surface
          600: '#374151',
        },
        accent: {
          cyan: '#06B6D4',
          electric: '#00F0FF',
          violet: '#8B5CF6',
          purple: '#A855F7',
          pink: '#EC4899',
          emerald: '#10B981',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.4)',
        'glow-violet': '0 0 25px -5px rgba(139, 92, 246, 0.4)',
        'glow-combined': '0 0 35px -5px rgba(0, 240, 255, 0.25), 0 0 35px -5px rgba(168, 85, 247, 0.25)',
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
};
