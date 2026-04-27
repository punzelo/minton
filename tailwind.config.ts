import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        court: {
          50: "#edfdf7",
          100: "#d4f8eb",
          500: "#18a97a",
          700: "#0f7658",
          900: "#0b3f34"
        },
        ink: "#17201c"
      }
    },
  },
  plugins: [],
};

export default config;
