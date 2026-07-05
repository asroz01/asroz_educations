"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      className="
        flex items-center justify-center w-8 h-8 rounded-xl
        bg-[#ECECEC] dark:bg-[#1D1D1D]
        text-[#1D1D1D]/50 dark:text-white/50
        shadow-[3px_3px_7px_rgba(0,0,0,0.1),-2px_-2px_5px_rgba(255,255,255,0.9)]
        dark:shadow-[3px_3px_7px_rgba(0,0,0,0.5),-2px_-2px_5px_rgba(255,255,255,0.04)]
        hover:text-[#CF291D] dark:hover:text-[#CF291D]
        hover:shadow-[4px_4px_10px_rgba(0,0,0,0.12),-3px_-3px_8px_rgba(255,255,255,0.95)]
        dark:hover:shadow-[4px_4px_10px_rgba(0,0,0,0.6),-3px_-3px_8px_rgba(255,255,255,0.06)]
        active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.09),inset_-1px_-1px_3px_rgba(255,255,255,0.8)]
        transition-all duration-200
      "
    >
      {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
    </button>
  );
}
