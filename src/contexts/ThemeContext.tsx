import React, { createContext, useContext, useState, useEffect } from "react";

export type DesignTheme = "corporate" | "modern" | "warm";

interface ThemeContextType {
  theme: DesignTheme;
  setTheme: (theme: DesignTheme) => void;
  themeClass: string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<DesignTheme>("corporate");

  const themeClass = `theme-${theme}`;

  useEffect(() => {
    // Remove all theme classes
    document.documentElement.classList.remove("theme-corporate", "theme-modern", "theme-warm");
    // Add current theme class
    document.documentElement.classList.add(themeClass);
  }, [themeClass]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themeClass }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
