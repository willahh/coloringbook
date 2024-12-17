/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#00101f',
      },
      fontFamily: {
        'sans': ['Helvetica', 'Arial', 'sans-serif']
      }
    },
  },
  plugins: [],
};
