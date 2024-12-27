"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { lightTheme, darkTheme } from "@/lib/themes";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const root = document.documentElement;
    const savedTheme = localStorage.getItem("theme") as Theme;
    
    if (savedTheme) {
      setTheme(savedTheme);
      const themeColors = savedTheme === "light" ? lightTheme : darkTheme;
      Object.entries(themeColors).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
    }
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const newTheme = theme === "dark" ? "light" : "dark";
    const themeColors = newTheme === "light" ? lightTheme : darkTheme;
    
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    
    Object.entries(themeColors).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}