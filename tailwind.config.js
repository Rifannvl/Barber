// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "dark-bg": "#111827",
        "dark-card": "#1F2937",
        "brand-gold": "#B9945A", // <-- Warna Emas
        "light-text": "#F3F4F6",
        // Warna untuk Light Mode
        "light-bg": "#F9FAFB", // Abu-abu sangat terang
        "light-card": "#FFFFFF", // Putih
        "dark-text": "#111827", // Kebalikan dari light-text
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"], // <-- Font untuk teks biasa
        display: ["Playfair Display", "serif"], // <-- Font untuk judul
      },
    },
  },
  plugins: [],
};
