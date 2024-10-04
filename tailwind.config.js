/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "spotify-green": "#1ED760",
        "spotify-white": "#FFFFFF",
        "spotify-black": "#121212",
      },
    },
  },
  plugins: [],
};
