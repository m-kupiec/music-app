/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "spotify-green": "#1ED760",
        "spotify-green-highlight": "#1FDF64",
        "spotify-white": "#FFFFFF",
        "spotify-white-text": "#FFFFFF",
        "spotify-black": "#121212",
        "spotify-black-text": "#000000",
        "spotify-red": "#E91429",
      },
    },
  },
  plugins: [],
};
