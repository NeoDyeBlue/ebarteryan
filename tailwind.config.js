/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')
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
    screens: {
      xs: "475px",
      ...defaultTheme.screens,
    },
    colors: {
      transparent: "transparent",
      green: {
        100: "#F2FCD6",
        200: "#E1F9AE",
        300: "#C7EF83",
        400: "#ABDF62",
        500: "#85CB33",
        600: "#68AE25",
        700: "#4F9219",
        800: "#387510",
        900: "#286109",
      },
      info: {
        100: "#CBF5FD",
        200: "#98E6FC",
        300: "#64CEF8",
        400: "#3DB4F1",
        500: "#028CE8",
        600: "#016CC7",
        700: "#0151A7",
        800: "#003986",
        900: "#00286F",
      },
      success: {
        100: "#DAFCDD",
        200: "#B6FAC3",
        300: "#8EF0AB",
        400: "#6EE19C",
        500: "#42CE88",
        600: "#30B17D",
        700: "#219471",
        800: "#157763",
        900: "#0C625A",
      },
      warning: {
        100: "#FFFDD9",
        200: "#FFFBB3",
        300: "#FFF88D",
        400: "#FFF671",
        500: "#FFF242",
        600: "#DBCE30",
        700: "#B7AB21",
        800: "#938815",
        900: "#7A6F0C",
      },
      danger: {
        100: "#FFEAD6",
        200: "#FFCFAD",
        300: "#FFAE83",
        400: "#FF8F65",
        500: "#FF5B32",
        600: "#DB3B24",
        700: "#B72119",
        800: "#930F12",
        900: "#7A0914",
      },
      cyan: "#68EDCB",
      brown: "#3B341F",
      // blue: "#4765CC",
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
    extend: {
      keyframes: {
        "color-fade": {
          "0%": { backgroundColor: "transparent" },
          "100%": { backgroundColor: "rgba(0,0,0,0.2)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
