/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#fafafa",
        card: "#ffffff",
        ink: "#121110",
        muted: "#57534c",
        line: "#dcdcdc",
        red: "#b3222a",
        redbright: "#d6343c",
        crimson: "#7a0f14",
        tint: "#f6e9e8",
      },
    },
  },
  plugins: [],
};
