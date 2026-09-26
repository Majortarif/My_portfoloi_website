/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#08090B',
          900: '#0B0D10',
          800: '#12151A',
          700: '#1A1E25',
          600: '#252A33',
          500: '#3A4150',
        },
        paper: {
          100: '#F2F3F5',
          200: '#E7E9EC',
          300: '#C7CBD3',
          400: '#8B92A0',
        },
        signal: {
          DEFAULT: '#3ECF8E',
          soft: '#2BA875',
          dim: '#1F5B44',
        },
        clay: {
          DEFAULT: '#E88A4C',
          soft: '#C97038',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        content: '1200px',
      },
      backgroundImage: {
        grid: 'linear-gradient(to right, rgba(231,233,236,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(231,233,236,0.04) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
}
