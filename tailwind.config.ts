import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FDF8F0",
        gold: "#C4A265",
        "gold-dark": "#A8873E",
        chikan: {
          50: "#faf7f2",
          100: "#f3ede0",
          200: "#e6d9bf",
          300: "#d5bf96",
          400: "#c4a265",
          500: "#b8914d",
          600: "#a47a41",
          700: "#886037",
          800: "#6f4e32",
          900: "#5c412c",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
