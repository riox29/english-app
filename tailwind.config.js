/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // se adapta automáticamente al sistema del usuario
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          600: '#4338ca',
          700: '#3730a3',
        },
      },
    },
  },
  plugins: [],
};