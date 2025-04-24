/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6",
        secondary: "#10B981",
        background: "#F9FAFB",
        surface: "#FFFFFF",
        error: "#EF4444",
        text: "#1F2937",
        textSecondary: "#6B7280"
      }
    },
  },
  plugins: [],
}
