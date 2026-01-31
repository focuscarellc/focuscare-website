import type { Config } from "tailwindcss"
import plugin from "tailwindcss/plugin"
import defaultTheme from "tailwindcss/defaultTheme"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      screens: {
        xl: "1080px",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Custom colors for direct use
        "brand-blue": "#19204e",
        "brand-teal": "#3fd0c3",
        "brand-bg": "#e4f2f7",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      backgroundImage: {
        "gradient-light": "linear-gradient(to bottom, #e4f2f7, #ffffff)",
        "gradient-dark": "linear-gradient(to bottom, #19204e, #0f1229)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...defaultTheme.fontFamily.sans],
      },
      typography: ({ theme }: { theme: any }) => ({
        DEFAULT: {
          css: {
            // General paragraph spacing and line height
            p: {
              marginTop: theme('spacing.6'),
              marginBottom: theme('spacing.6'),
              lineHeight: theme('lineHeights.relaxed'),
            },
            // Headings styles
            h1: {
              color: theme('colors.primary.DEFAULT'),
              fontSize: theme('fontSize.3xl'),
              fontWeight: theme('fontWeight.extrabold'),
              marginTop: theme('spacing.16'),
              marginBottom: theme('spacing.8'),
            },
            h2: {
              color: theme('colors.primary.DEFAULT'),
              fontSize: theme('fontSize.xl'),
              fontWeight: theme('fontWeight.bold'),
              marginTop: theme('spacing.12'),
              marginBottom: theme('spacing.6'),
            },
            h3: {
              color: theme('colors.primary.DEFAULT'),
              fontSize: theme('fontSize.xl'),
              fontWeight: theme('fontWeight.semibold'),
              marginTop: theme('spacing.10'),
              marginBottom: theme('spacing.4'),
            },
            // Lists
            ul: {
              marginTop: theme('spacing.6'),
              marginBottom: theme('spacing.6'),
            },
            ol: {
              marginTop: theme('spacing.6'),
              marginBottom: theme('spacing.6'),
            },
            // Links
            a: {
              color: theme('colors.brand-teal'),
              textDecoration: 'underline',
              fontWeight: theme('fontWeight.medium'),
              '&:hover': {
                color: theme('colors.brand-blue'),
              },
            },
            // Inline code
            code: {
              backgroundColor: theme('colors.muted.DEFAULT'),
              borderRadius: theme('borderRadius.sm'),
              padding: '0.2em 0.4em',
              fontWeight: theme('fontWeight.normal'),
              '&::before': { content: 'none' },
              '&::after': { content: 'none' },
            },
            // Blockquotes
            blockquote: {
              color: theme('colors.gray.700'),
              borderLeftColor: theme('colors.brand-teal'),
              paddingLeft: theme('spacing.4'),
              fontStyle: 'italic',
              marginTop: theme('spacing.8'),
              marginBottom: theme('spacing.8'),
            },
          },
        },
        // Dark mode typography styles
        invert: {
          css: {
            p: {
              color: theme('colors.gray.300'),
            },
            h1: {
              color: theme('colors.white'),
            },
            h2: {
              color: theme('colors.white'),
            },
            h3: {
              color: theme('colors.white'),
            },
            a: {
              color: theme('colors.brand-teal'), // Keep teal for dark mode links
              '&:hover': {
                color: theme('colors.white'),
              },
            },
            blockquote: {
              color: theme('colors.gray.300'),
              borderLeftColor: theme('colors.brand-teal'),
            },
            code: {
              backgroundColor: theme('colors.muted.DEFAULT'), // Assuming muted adapts for dark mode
              color: theme('colors.white'),
            },
          },
        },
      }),
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config

export default config

