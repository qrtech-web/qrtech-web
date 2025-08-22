// tailwind.config.js
module.exports = {
  darkMode: 'media',
  content: [
    "./public/index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/styles/**/*.css"
  ],
  theme: {
    extend: {
      
      colors: {
        primary: '#4f46e5',      // tu --accent
        secondary: '#22c55e',    // tu --accent2
        'dark-bg': '#0f172a',
        'light-bg': '#f8fafc',
        'soft-text': '#94a3b8',
      },
      fontFamily: {
        sans: ['Carter One','-apple-system','BlinkMacSystemFont','Segoe UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue','sans-serif'],
        mono: ['source-code-pro','Menlo','Monaco','Consolas','Courier New','monospace'],
        carter: ['"Carter One"', 'cursive'],
      },
      borderRadius: {
        lg: '14px', // tu --radius
      },
      boxShadow: {
        card: '0 2px 6px rgba(0,0,0,.25)', // tu --shadow-s
      }
    }
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),

  ],
}
