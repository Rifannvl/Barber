/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "dark-bg": "#1A1A1A",
        "light-text": "#F0F0F0",
        "brand-blue": "#00A9FF",
        "dark-card": "#2C2C2C",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        display: ["Syne", "sans-serif"],
      },
    },
  },
  plugins: [],
};
