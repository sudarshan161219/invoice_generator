import { useEffect, useState, type ReactNode } from "react";
import type { Theme } from "@/types/theme";
import { ThemeContext } from "../context/theme-context";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>("light");

  // Set initial theme from localStorage or system preference
  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const defaultTheme = stored ?? (prefersDark ? "dark" : "light");

    setTheme(defaultTheme);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);

    // Apply/remove `dark` class on <html>
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const toggleLight = () => {
    setTheme("light");
  };

  const toggleDark = () => {
    setTheme("dark");
  };

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, toggleLight, toggleDark, setTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
