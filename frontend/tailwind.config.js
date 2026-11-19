/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        marca: {
          50: '#f3fbe9',
          100: '#e3f6cf',
          200: '#c8eda4',
          300: '#a6e071',
          400: '#85cc46',
          500: '#67b32a',
          600: '#4e901e',
          700: '#3c6f1c',
          800: '#33591c',
          900: '#2c4b1b',
          950: '#13290a',
        },
        lima: '#c5ea2b',
        tinta: '#12161a',
        coral: '#e4322b',
        crema: '#f7f7f2',
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      boxShadow: {
        tarjeta: '0 1px 2px rgba(16,24,40,.06), 0 8px 24px -12px rgba(16,24,40,.18)',
        flotante: '0 24px 60px -20px rgba(16,24,40,.35)',
      },
      keyframes: {
        'aparecer': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'deslizar': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'latir': {
          '0%,100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.12)' },
        },
      },
      animation: {
        aparecer: 'aparecer .35s ease-out both',
        deslizar: 'deslizar .3s ease-out both',
        latir: 'latir .4s ease-in-out',
      },
    },
  },
  plugins: [],
};
