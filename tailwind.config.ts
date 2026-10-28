import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.tsx",
    "./store/**/*.ts",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
