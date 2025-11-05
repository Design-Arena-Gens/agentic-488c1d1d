import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        "sand-50": "#fdf9f3",
        "sand-100": "#f5e9d9",
        "sand-200": "#e8d4b5",
        "sand-900": "#32261c",
        "emerald-500": "#2dd4bf",
        "emerald-900": "#064e3b",
        "midnight-800": "#1e293b"
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"]
      },
      backgroundImage: {
        "islamic-pattern":
          "radial-gradient(circle at 1px 1px, rgba(45, 212, 191, 0.14) 1px, transparent 0)"
      },
      animation: {
        float: "float 12s ease-in-out infinite"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" }
        }
      }
    }
  },
  plugins: []
};

export default config;
