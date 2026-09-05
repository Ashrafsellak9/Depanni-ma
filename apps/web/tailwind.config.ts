import type { Config } from "tailwindcss";
import tailwindAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0B1B2B",
          soft: "#1E3149",
        },
        paper: {
          DEFAULT: "#F5EFE6",
          2: "#EBE3D5",
        },
        rust: {
          DEFAULT: "#D9451F",
          deep: "#A8320F",
        },
        sand: "#C9A87A",
        line: "#DDD3C1",
        avatar: {
          1: "#E8D5C4",
          2: "#C8D5B9",
          3: "#B8C5D6",
          4: "#E5C9A8",
          5: "#D4B5B0",
        },
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
          DEFAULT: "#2F7D5B",
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
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      fontSize: {
        xs: ["12px", { lineHeight: "16px" }],
        sm: ["14px", { lineHeight: "20px" }],
        base: ["16px", { lineHeight: "26px" }],
        lg: ["18px", { lineHeight: "28px" }],
        xl: ["22px", { lineHeight: "30px" }],
        "display-1": [
          "clamp(2.75rem, 6vw, 4.75rem)",
          { lineHeight: "1.02", letterSpacing: "-0.03em" },
        ],
        "display-2": [
          "clamp(2rem, 4.5vw, 3.25rem)",
          { lineHeight: "1.05", letterSpacing: "-0.025em" },
        ],
        "display-3": [
          "clamp(1.5rem, 3vw, 2.25rem)",
          { lineHeight: "1.15", letterSpacing: "-0.02em" },
        ],
      },
      boxShadow: {
        card: "0 1px 0 rgba(11,27,43,0.04), 0 12px 32px -12px rgba(11,27,43,0.12)",
        lift: "0 2px 0 rgba(11,27,43,0.04), 0 18px 40px -14px rgba(11,27,43,0.18)",
      },
      maxWidth: {
        landing: "1240px",
      },
      letterSpacing: {
        tight2: "-0.125rem",
        tight3: "-0.15rem",
      },
      transitionDuration: {
        400: "400ms",
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
        "pulse-soft": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.55", transform: "scale(1.15)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        "ping-slow": {
          "0%": { transform: "scale(1)", opacity: "1" },
          "75%, 100%": { transform: "scale(2.5)", opacity: "0" },
        },
        "live-feed-marquee": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        float: "float 4s ease-in-out infinite",
        "ping-slow": "ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite",
        "live-feed-marquee": "live-feed-marquee 40s linear infinite",
      },
    },
  },
  plugins: [tailwindAnimate],
};

export default config;
