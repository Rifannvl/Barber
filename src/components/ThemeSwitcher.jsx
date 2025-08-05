// src/components/ThemeSwitcher.jsx
import React from "react";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-light-card dark:bg-dark-card/50 text-dark-text dark:text-light-text hover:bg-gray-200 dark:hover:bg-dark-card transition-all"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
};

export default ThemeSwitcher;
