"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Accessibility, Type, ZoomIn } from "lucide-react"

export default function AccessibilityTools() {
  const [isOpen, setIsOpen] = useState(false)
  const [fontSize, setFontSize] = useState(100)
  const [highContrast, setHighContrast] = useState(false)

  const increaseFontSize = () => {
    if (fontSize < 150) {
      const newSize = fontSize + 10
      setFontSize(newSize)
      document.documentElement.style.fontSize = `${newSize}%`
    }
  }

  const decreaseFontSize = () => {
    if (fontSize > 90) {
      const newSize = fontSize - 10
      setFontSize(newSize)
      document.documentElement.style.fontSize = `${newSize}%`
    }
  }

  const resetFontSize = () => {
    setFontSize(100)
    document.documentElement.style.fontSize = "100%"
  }

  const toggleHighContrast = () => {
    setHighContrast(!highContrast)
    document.body.classList.toggle("high-contrast")
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative">
        <Button
          variant="default"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-label="Accessibility tools"
          className="rounded-full shadow-lg"
        >
          <Accessibility className="h-5 w-5" />
        </Button>

        {isOpen && (
          <div className="absolute bottom-full right-0 mb-2 w-64 rounded-lg bg-background p-4 shadow-lg border">
            <h2 className="mb-3 font-bold">Accessibility Tools</h2>

            <div className="mb-4">
              <h3 className="mb-2 text-sm font-medium">Text Size</h3>
              <div className="flex items-center justify-between">
                <Button variant="outline" size="sm" onClick={decreaseFontSize} aria-label="Decrease font size">
                  <Type className="h-4 w-4 mr-1" /> A-
                </Button>
                <Button variant="outline" size="sm" onClick={resetFontSize} aria-label="Reset font size">
                  Reset
                </Button>
                <Button variant="outline" size="sm" onClick={increaseFontSize} aria-label="Increase font size">
                  <Type className="h-4 w-4 mr-1" /> A+
                </Button>
              </div>
            </div>

            <div className="mb-2">
              <Button
                variant={highContrast ? "default" : "outline"}
                size="sm"
                className="w-full"
                onClick={toggleHighContrast}
                aria-pressed={highContrast}
              >
                <ZoomIn className="h-4 w-4 mr-2" /> High Contrast
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

