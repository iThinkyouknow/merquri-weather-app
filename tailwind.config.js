/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        '1A1A1A': '#1A1A1A',
        '28124D': '#28124D'
      },
      fontSize: {
        '3xs': '0.5rem',
        '2xs': '0.625rem'
      }
    },
  },
  plugins: [],
}