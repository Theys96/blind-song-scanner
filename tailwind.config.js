/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial-t":
          "radial-gradient(ellipse at top, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
