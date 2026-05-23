import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        shell: {
          900: "#07111F",
          800: "#0B1220",
          700: "#0F1A2E",
          600: "#172238",
        },
        panel: {
          DEFAULT: "#F8FAFC",
          card: "#FFFFFF",
        },
        ink: {
          DEFAULT: "#0F172A",
          muted: "#64748B",
          subtle: "#94A3B8",
        },
        border: {
          DEFAULT: "#E2E8F0",
          strong: "#CBD5E1",
        },
        brand: {
          blue: "#2563EB",
          blueDeep: "#1D4ED8",
          green: "#10B981",
          amber: "#F59E0B",
          red: "#EF4444",
          gold: "#D4AF37",
          goldDeep: "#B8902C",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        serif: ["'Source Serif 4'", "Georgia", "serif"],
      },
      boxShadow: {
        panel: "0 1px 2px rgba(15,23,42,0.04), 0 8px 24px -12px rgba(15,23,42,0.08)",
        floating: "0 24px 48px -24px rgba(15,23,42,0.35)",
        ring: "0 0 0 1px rgba(15,23,42,0.06)",
      },
      backgroundImage: {
        "shell-radial":
          "radial-gradient(120% 80% at 50% -20%, rgba(37,99,235,0.18) 0%, rgba(7,17,31,0) 60%), radial-gradient(80% 60% at 100% 100%, rgba(212,175,55,0.08) 0%, rgba(7,17,31,0) 50%)",
        "certificate":
          "radial-gradient(120% 80% at 0% 0%, rgba(212,175,55,0.18) 0%, rgba(255,255,255,0) 60%), radial-gradient(80% 60% at 100% 100%, rgba(37,99,235,0.08) 0%, rgba(255,255,255,0) 60%)",
      },
      keyframes: {
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
      },
      animation: {
        "pulse-soft": "pulse-soft 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
