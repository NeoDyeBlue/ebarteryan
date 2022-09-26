/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      display: "Poppins, sans-serif",
      body: "Inter, sans-serif",
    },
    colors: {
      transparent: "transparent",
      green: {
        DEFAULT: "#85CB33",
        light: "#E7F6D1",
      },
      cyan: "#68EDCB",
      brown: "#3B341F",
      red: "#CB3333",
      black: {
        DEFAULT: "#000",
        light: "#100B00",
      },
      white: {
        DEFAULT: "#fff",
        dark: "#F7F7F7",
      },
      gray: {
        100: "#D2D2D2",
        200: "#8F8F8F",
        300: "#5C5C5C",
        400: "#404040",
      },
    },
    container: {
      padding: {
        DEFAULT: "1.5rem",
        sm: "1.5rem",
        lg: "2rem",
        xl: "2.5rem",
        "2xl": "3rem",
      },
    },
    extend: {},
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
