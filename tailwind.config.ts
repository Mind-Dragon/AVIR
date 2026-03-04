import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "white-sand": "#f7f3f0",
        "off-black": "#312e2c",
        "joshua-rocks": "#604e44",
        "light-shade": "#ede4dd",
        "desert-tan": "#ddcdc0",
        "near-black": "#0c0a09",
      },
      fontFamily: {
        manrope: ["Manrope", "sans-serif"],
        termina: ["termina", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
