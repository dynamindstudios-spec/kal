/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bianco: {
          cream: "#f8f6f0",
          sand: "#ece7dc",
          terracotta: "#8c3a2b",
          terracottaDark: "#6b2c20",
          dark: "#1a1614",
          charcoal: "#292421",
          gold: "#c5a059",
          olive: "#4a5d3e"
        }
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Outfit', 'Assistant', '-apple-system', 'sans-serif']
      }
    },
  },
  plugins: [],
}
