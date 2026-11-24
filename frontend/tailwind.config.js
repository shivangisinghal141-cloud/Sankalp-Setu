/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: '#002147',
          blue: '#1A365D',
          sky: '#0284C7',
          green: '#15803D',
          saffron: '#EA580C',
          purple: '#7C3AED',
          dark: '#0F172A',
          light: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Devanagari', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
