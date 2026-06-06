import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"]
      },
      colors: {
        ink: "#1f2933",
        olive: "#586f4f",
        clay: "#a86646",
        linen: "#f7f2ea",
        mist: "#e8edf0"
      },
      boxShadow: {
        soft: "0 18px 60px rgba(31, 41, 51, 0.08)"
      },
      screens: {
        xs: "480px"
      },
      keyframes: {
        "toast-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        "toast-in": "toast-in 200ms ease-out"
      }
    }
  },
  plugins: []
};

export default config;
