import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        light: {
          background: "#FFFFFF",
          surface: "#F9FAFB",
          primary: "#2563EB",
          secondary: "#7C3AED",
          text: {
            primary: "#111827",
            secondary: "#374151",
          },
          success: "#10B981",
          error: "#EF4444",
        },
        dark: {
          background: "#0F172A",
          surface: "#1E293B",
          primary: "#3B82F6",
          secondary: "#A78BFA",
          text: {
            primary: "#F9FAFB",
            secondary: "#CBD5E1",
          },
          success: "#34D399",
          error: "#F87171",
        },
      },
    },
  },
  plugins: [],
};

export default config;
