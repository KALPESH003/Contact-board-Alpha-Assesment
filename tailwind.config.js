/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#FFFFFF',
        ink: '#37352F',
        muted: '#6F6D68',
        line: '#E9E9E7',
        hover: '#F7F7F5',
        column: '#F7F7F5',
        accent: {
          DEFAULT: '#1F6FC5',
          dark: '#195CA3',
          soft: '#E7F3FD',
        },
      },
      fontFamily: {
        sans: [
          'Inter Variable',
          'Inter',
          'ui-sans-serif',
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
        card: '0 1px 2px rgba(15, 15, 15, 0.06)',
        glass: '0 1px 0 rgba(255,255,255,0.6) inset, 0 8px 30px rgba(20, 12, 40, 0.22)',
        sheet: '0 12px 40px rgba(20, 12, 40, 0.28)',
        panel: '-8px 0 32px rgba(15, 15, 15, 0.12)',
        toast: '0 6px 20px rgba(15, 15, 15, 0.18)',
      },
      keyframes: {
        'slide-in': {
          from: { transform: 'translateX(24px)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
      },
      animation: {
        'slide-in': 'slide-in 160ms ease-out',
        'fade-in': 'fade-in 160ms ease-out',
      },
    },
  },
  plugins: [],
};
