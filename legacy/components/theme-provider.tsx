"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

export const ThemeContext = createContext({ theme: "", setTheme: (theme: string) => {} })

export function useTheme() {
  const context = useContext(ThemeContext)
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState("")

  useEffect(() => {
    setMounted(true)
    // Check for system preference
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const systemTheme = mediaQuery.matches ? "dark" : "light"

    // Get stored theme or use system preference
    const storedTheme = localStorage.getItem("theme") || systemTheme
    setTheme(storedTheme)

    // Apply theme to document
    if (storedTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    // Listen for system preference changes
    const handleChange = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? "dark" : "light"
      if (!localStorage.getItem("theme")) {
        setTheme(newTheme)
        if (newTheme === "dark") {
          document.documentElement.classList.add("dark")
        } else {
          document.documentElement.classList.remove("dark")
        }
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  const setThemeValue = (newTheme: string) => {
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  return { theme, setTheme: setThemeValue }
}

