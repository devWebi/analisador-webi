import React from "react";
import { SunIcon, MoonIcon } from "./Icons";

const ThemeToggle = ({ theme, toggleTheme }) => (
  <button
    onClick={toggleTheme}
    className="absolute top-6 right-6 z-50 p-3 rounded-full glass-pane text-[var(--text-primary)] transition-all duration-300 hover:scale-110"
    aria-label="Toggle theme"
  >
    {/* Esta lógica decide qual ícone mostrar com base no tema atual */}
    {theme === "dark" ? <SunIcon /> : <MoonIcon />}
  </button>
);

export default ThemeToggle;
