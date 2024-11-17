const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(),
  ],
  theme: {
    colors: {
      bgColor: "rgb(227 227 227 / <alpha-value>)",
      primary: "rgb(var(--color-primary) / <alpha-value>)",
      secondary: "rgb(var(--color-secondary) / <alpha-value>)",
      blue: "rgb(var(--color-blue) / <alpha-value>)",
      white: "rgb(var(--color-white) / <alpha-value>)",
      ascent: {
        1: "rgb(var(--color-ascent1) / <alpha-value>)",
        2: "rgb(var(--color-ascent2) / <alpha-value>)",
      },
    },
    screens: {
      xs: "400px",
      sm: "640px",

      md: "768px",

      lg: "1024px",

      xl: "1280px",

      "2xl": "1536px",
    },
    extend: {
      maxWidth: {
        '40p': '80%',
        '10p': '10%',
      },
      minWidth: {
        '40p': '80%',
        '10p': '10%',
        '90p': '90%',
      },
      minHeight: {
        '80p': '80%',
        '10p': '10%',
      },
      maxHeight: {
        '80p': '80%',
        '10p': '10%',
      },
      spacing: {
        '460px': '460px', // positive value for future use if needed
        'negative-460px': '-460px', // custom negative value
      }
    },
  },
  plugins: [
    flowbite.plugin(),
  ],
}