import type { Config } from "tailwindcss";
import tailwindAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        navy: {
          DEFAULT: "#0F1E35",
          "2": "#1A2E4A",
          light: "#2A4F82",
          foreground: "#FFFFFF",
        },
        orange: {
          DEFAULT: "#F05A1A",
          "2": "#FF7A3D",
        },
        cream: {
          DEFAULT: "#FAF7F2",
          "2": "#F0EBE1",
        },
        "dep-gray": "#6B7280",
        "dep-border": "#E5E0D8",
        page: "#EDE8DF",
        "dep-red": "#DC2626",
        green: {
          DEFAULT: "#1B8A4E",
          foreground: "#FFFFFF",
        },
        primary: {
          DEFAULT: "#F05A1A",
          hover: "#FF7A3D",
          foreground: "#FFFFFF",
        },
        success: {
          DEFAULT: "#1B8A4E",
          foreground: "#FFFFFF",
        },
        danger: {
          DEFAULT: "#C62828",
          foreground: "#FFFFFF",
        },
        surface: "#FAF7F2",
        muted: {
          DEFAULT: "#F0EBE1",
          foreground: "#6B7280",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
      },
      fontFamily: {
        syne: ["var(--font-syne)", "Syne", "sans-serif"],
        dm: ["var(--font-dm)", "DM Sans", "sans-serif"],
        sans: ["var(--font-dm)", "DM Sans", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tight2: "-0.125rem",
        tight3: "-0.15rem",
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
    },
  },
  plugins: [tailwindAnimate],
};

export default config;
