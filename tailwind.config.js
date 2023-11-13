/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },

      animation: {
        "bounce-up": "bounceUp 1s ease-in-out",
      },

      colors: {
        themePurple: "#715CA8",
        themeYellow: "#EFC638",
        themeDarkPurple: "#2B103B",
      },
    },
  },
  darkMode: "media", // class
  plugins: [],
};
