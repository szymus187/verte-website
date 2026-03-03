/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html'],
  theme: {
    extend: {
      colors: {
        verte: {
          50: '#f0f9f4',
          100: '#daf0e3',
          200: '#b8e1c9',
          300: '#89cca7',
          400: '#56b17f',
          500: '#3a9464',
          600: '#2d7850',
          700: '#245f40',
          800: '#1f4d35',
          900: '#1a402d',
          950: '#0d2318',
        },
        cream: {
          50: '#fdfaf6',
          100: '#f9f3ea',
          200: '#f0e6d5',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        body: ['Outfit', 'system-ui', 'sans-serif'],
      },
    }
  },
  plugins: [],
}
