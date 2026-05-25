import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}", "../../packages/ui/src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: "#0F1E35", "2": "#1A2E4A" },
        orange: { DEFAULT: "#F05A1A", "2": "#FF7A3D" },
        cream: { DEFAULT: "#FAF7F2", "2": "#F0EBE1" },
        page: "#EDE8DF",
        "dep-border": "#E5E0D8",
        green: { DEFAULT: "#1B8A4E" },
        "dep-red": "#DC2626",
        "dep-purple": "#7C3AED",
        "dep-gray": "#6B7280",
      },
      fontFamily: {
        syne: ["var(--font-syne)", "Syne", "sans-serif"],
        dm: ["var(--font-dm)", "DM Sans", "sans-serif"],
        sans: ["var(--font-dm)", "DM Sans", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tight2: "-0.125rem",
      },
    },
  },
  plugins: [],
};

export default config;
