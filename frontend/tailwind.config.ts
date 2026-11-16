import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    container: { center: true, padding: { DEFAULT: '1.25rem', lg: '2rem' }, screens: { '2xl': '1280px' } },
    extend: {
      colors: {
        teal: {
          50: '#ECF8FB', 100: '#D3EFF5', 200: '#A7DFEB', 300: '#6FC7DB', 400: '#4EC0D7',
          500: '#178FA7', 600: '#137A8F', 700: '#106374', 800: '#0E4F5D', 900: '#0B3E49',
        },
        navy: {
          50: '#EEF2F8', 100: '#D9E1EE', 200: '#B0C0DA', 300: '#7F96BD', 400: '#4F6C9E',
          500: '#2C4A7E', 600: '#1C3563', 700: '#13284D', 800: '#0D1E3B', 900: '#08152B', 950: '#050D1C',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(8,21,43,.04), 0 8px 24px -12px rgba(8,21,43,.12)',
        lift: '0 2px 4px rgba(8,21,43,.04), 0 24px 48px -20px rgba(8,21,43,.25)',
      },
      keyframes: {
        'fade-up': { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'none' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        dash: { to: { strokeDashoffset: '0' } },
        pulseRing: { '0%': { transform: 'scale(.8)', opacity: '.8' }, '100%': { transform: 'scale(2.2)', opacity: '0' } },
      },
      animation: {
        'fade-up': 'fade-up .7s cubic-bezier(.2,.7,.2,1) both',
        float: 'float 6s ease-in-out infinite',
        dash: 'dash 3s ease forwards',
        'pulse-ring': 'pulseRing 2.4s cubic-bezier(.2,.6,.4,1) infinite',
      },
    },
  },
  plugins: [],
};
export default config;
