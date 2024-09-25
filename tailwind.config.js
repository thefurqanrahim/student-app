/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}', // Include all files in the app directory
    './pages/**/*.{js,ts,jsx,tsx}', // If you have a pages directory
    './components/**/*.{js,ts,jsx,tsx}', // Include all files in the components directory
    './src/**/*.{js,ts,jsx,tsx}', // If you have a src directory
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
