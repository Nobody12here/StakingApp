/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: "rgb(43 168 164)",

      },
    },
    fontFamily: {
      heading: ["Gemsbuck"],
      base: ["Montserrat"],
    },
  },
  plugins: [],
};
