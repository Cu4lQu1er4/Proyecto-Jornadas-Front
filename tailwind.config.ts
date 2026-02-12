import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FFFFFF",
        surface: "#F5F7FA",
        border: "#E0E0E0",
        text: {
          DEFAULT: "#4A4A4A",
          muted: "#6B7280",
        },
        primary: {
          DEFAULT: "#2836FB",
          hover: "#1D4ED8",
          soft: "#E8EBFF",
        },
        success: {
          DEFAULT: "#52D920",
          soft: "#EAFBE3",
        },
        warning: {
          DEFAULT: "#FF6F0F",
          soft: "#FFF1E6",
        },
        danger: {
          DEFAULT: "#EE1B1B",
          soft: "#FFEAEA",
        },
      },
      fontSize: {
        h1: ["3rem", { lineHeight: "2.5rem", fontWeight: "700" }],
        h2: ["2rem", { lineHeight: "2rem", fontWeight: "600" }],
        h3: ["1.5rem", { lineHeight: "1.75rem", fontWeight: "600" }],
        body: ["1rem", { lineHeight: "1.5rem" }],
        small: ["0.875rem", { lineHeight: "1.25rem" }],
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
