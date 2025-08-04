// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ThemeProvider } from "./context/ThemeContext"; // Pastikan impor ini ada

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      {" "}
      {/* Pastikan App dibungkus ini */}
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
