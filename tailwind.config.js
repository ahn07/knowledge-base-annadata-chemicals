/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx,mdx}",
    "./lib/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#17212b",
        steel: "#4b6478",
        mist: "#f4f7f6",
        leaf: "#3a7d44",
        copper: "#b86b3f",
        river: "#287c8e",
        zinc: "#64748b",
      },
      boxShadow: {
        soft: "0 18px 45px rgba(23, 33, 43, 0.08)",
      },
    },
  },
  plugins: [],
};
