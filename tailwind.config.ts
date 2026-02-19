import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#040713",
        foreground: "#f5f7ff",
        muted: "#98a2b3",
        card: "#0f172a",
        accent: "#3b82f6"
      }
    }
  },
  plugins: []
} satisfies Config;
