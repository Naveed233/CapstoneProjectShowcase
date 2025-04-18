
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        woven: {
          red: "#e20613",
          deepred: "#cc092f",
          dark: "#4b4e52",
          mid: "#808183",
          light: "#cccccc"
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}
