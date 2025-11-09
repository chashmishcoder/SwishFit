/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'basketball-orange': '#FF6600',
        'court-blue': '#1E3A8A',
        'success-green': '#10B981',
      },
    },
  },
  plugins: [],
}
