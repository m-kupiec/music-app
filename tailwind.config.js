/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "spotify-green": "#1ED760",
        "spotify-green-highlight": "#1FDF64",
        "spotify-white": "#FFFFFF",
        "spotify-black": "#121212",
        "spotify-black-text": "#000000",
      },
    },
  },
  plugins: [],
};
