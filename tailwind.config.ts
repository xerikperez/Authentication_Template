/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb", // blue-600
        "primary-foreground": "#ffffff",

        secondary: "#f3f4f6", // gray-100
        "secondary-foreground": "#111827", // gray-900

        destructive: "#ef4444", // red-500
        background: "#ffffff",
        accent: "#f9fafb",
        ring: "#3b82f6",
      },
    },
  },
  plugins: [],
};
