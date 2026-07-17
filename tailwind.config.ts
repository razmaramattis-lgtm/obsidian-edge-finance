import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
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
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
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
        rose: {
          DEFAULT: "hsl(var(--rose))",
          glow: "hsl(var(--rose-glow))",
        },
        teal: {
          DEFAULT: "hsl(var(--teal))",
          glow: "hsl(var(--teal-glow))",
        },
        copper: {
          DEFAULT: "hsl(var(--copper))",
          glow: "hsl(var(--copper-glow))",
        },
        forest: {
          DEFAULT: "hsl(var(--forest))",
          deep: "hsl(var(--forest-deep))",
        },
        sage: "hsl(var(--sage))",
        cream: "hsl(var(--cream))",
        warm: "hsl(var(--warm))",
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
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
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "counter-tick": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        "pulse-gold": {
          "0%, 100%": { boxShadow: "0 0 0 0 hsl(43 65% 52% / 0.4)" },
          "50%": { boxShadow: "0 0 20px 5px hsl(43 65% 52% / 0.1)" },
        },
        "slide-in-left": {
          "0%": { transform: "translateX(-20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "drift-x": {
          "0%, 100%": { transform: "translateX(-10px)" },
          "50%": { transform: "translateX(10px)" },
        },
        "drift-y": {
          "0%, 100%": { transform: "translateY(-10px)" },
          "50%": { transform: "translateY(10px)" },
        },
        "blob-morph": {
          "0%, 100%": { borderRadius: "62% 38% 44% 56% / 40% 62% 38% 60%" },
          "20%": { borderRadius: "42% 58% 66% 34% / 58% 36% 64% 42%" },
          "40%": { borderRadius: "58% 42% 38% 62% / 46% 64% 36% 54%" },
          "60%": { borderRadius: "36% 64% 56% 44% / 62% 40% 60% 38%" },
          "80%": { borderRadius: "64% 36% 48% 52% / 38% 58% 42% 62%" },
        },
        "card-bob": {
          "0%, 100%": { transform: "translateY(-6px)" },
          "50%": { transform: "translateY(6px)" },
        },
        "scroll-dot": {
          "0%": { transform: "translateY(0)", opacity: "0" },
          "30%": { opacity: "1" },
          "80%": { transform: "translateY(14px)", opacity: "0" },
          "100%": { transform: "translateY(14px)", opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.7s ease-out forwards",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "counter-tick": "counter-tick 1s ease-in-out infinite",
        "pulse-gold": "pulse-gold 3s ease-in-out infinite",
        "slide-in-left": "slide-in-left 0.5s ease-out forwards",
        "drift-x": "drift-x 17s ease-in-out infinite",
        "drift-y": "drift-y 11s ease-in-out infinite",
        "blob-morph": "blob-morph 14s ease-in-out infinite",
        "card-bob": "card-bob 6s ease-in-out infinite",
        "scroll-dot": "scroll-dot 1.8s ease-in-out infinite",
      },

    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
