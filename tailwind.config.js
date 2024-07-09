/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Georgia", "serif"]
      },
      colors: {
        blue: {
          500: "#4299e1"
        },
        green: {
          500: "#48bb78"
        }
      }
    }
  },
  plugins: []
};
