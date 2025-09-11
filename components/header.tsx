"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

export default function Header() {
  const [openNav, setOpenNav] = useState(false)
  const pathname = usePathname()
  const { setTheme, theme } = useTheme()

  // Close mobile nav when window resizes to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1080) {
        setOpenNav(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Industries", href: "/industries" },
    { name: "Testimonials", href: "/testimonials" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/fc-logo.png"
              alt="FOCUS Care Logo"
              width={150}
              height={75}
              className="w-auto h-[75px]"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex xl:gap-6" aria-label="Main Navigation">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-secondary",
                pathname === item.href ? "text-secondary" : "text-muted-foreground",
              )}
              aria-current={pathname === item.href ? "page" : undefined}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="default" className="hidden xl:inline-flex mr-2">
            <Link href="/contact">Contact Us</Link>
          </Button>

          <div className="hidden md:flex">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="xl:hidden"
            onClick={() => setOpenNav(!openNav)}
            aria-expanded={openNav}
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
          >
            {openNav ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        id="mobile-menu"
        className={`${openNav ? "block" : "hidden"} xl:hidden transition-all duration-300 ease-in-out`}
      >
        <div className="container px-4 py-4 bg-background shadow-md">
          <nav className="flex flex-col space-y-4" aria-label="Mobile Navigation">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-base font-medium transition-colors hover:text-secondary p-2",
                  pathname === item.href ? "text-secondary bg-muted rounded-md" : "text-muted-foreground",
                )}
                onClick={() => setOpenNav(false)}
                aria-current={pathname === item.href ? "page" : undefined}
              >
                {item.name}
              </Link>
            ))}

            <div className="flex items-center justify-between pt-4 mt-4 border-t">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
                className="md:hidden"
              >
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>

              <Button asChild variant="default" onClick={() => setOpenNav(false)}>
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}

