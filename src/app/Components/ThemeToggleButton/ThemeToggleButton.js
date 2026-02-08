"use client";


import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { useTheme } from "next-themes";

export function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();
console.log(theme)
  const handleToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    
      <AnimatedThemeToggler onClick={handleToggle} className="w-10 h-10 text-gray-700 dark:text-gray-200" />
   
  );
}