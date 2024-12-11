/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
  purge: [
        './src/**/*.html',
        './src/**/*.js',
    ],
  darkMode: 'class', // or 'media' or 'class'
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
}

