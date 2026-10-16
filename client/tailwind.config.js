/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f2f7f4',
          100: '#e1ede7',
          200: '#c2dbcf',
          300: '#9ec4b2',
          400: '#529676',
          500: '#2d6a4f',
          600: '#235740',
          700: '#1b4332',
          800: '#143826',
          900: '#0d281a',
        },
        ivory: {
          50: '#fdfcf9',
          100: '#faf7f2',
          200: '#f4ede2',
          300: '#ebe0d0',
          400: '#dac7af',
        },
        terracotta: {
          50: '#fbf5f2',
          100: '#f5e7e0',
          200: '#ecd0c4',
          300: '#dfb09e',
          400: '#d0866b',
          500: '#c86d51',
          600: '#b85d38',
          700: '#9c4627',
          800: '#7c351c',
        },
        charcoal: {
          50: '#f6f7f7',
          100: '#e2e4e5',
          300: '#8c9398',
          500: '#535b62',
          700: '#2d3339',
          800: '#1f2429',
          900: '#14171a',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
