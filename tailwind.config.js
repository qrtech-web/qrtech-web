// tailwind.config.js
module.exports = {
  darkMode: 'media',
  content: ['./public/index.html','./src/**/*.{js,jsx,ts,tsx}'],
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
        // Texto por defecto
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Arial', 'sans-serif'], // cuerpo/UI
        // Titulares
        heading: ['Manrope', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'], // h1–h6
        // Marca (logo)
        brand: ['Carter One', 'system-ui', 'sans-serif'], // SOLO logo/brand
      },
      letterSpacing: {
        // tracking fino para títulos
        'tighter-1': '-0.0125em',   // h1–h2
        'tighter-2': '-0.006em',    // h3–h4
        'wide-1': '0.02em',         // overline/chips
      },
      fontSize: {
        // Escalas con clamp() para responsive fluido
        'display': ['clamp(2.25rem, 1.6rem + 2.1vw, 3.5rem)', { lineHeight: '1.1' }],   // 36→56px
        'h1':      ['clamp(1.875rem, 1.45rem + 1.4vw, 2.75rem)', { lineHeight: '1.15' }],// 30→44px
        'h2':      ['clamp(1.5rem, 1.28rem + 0.9vw, 2.125rem)',  { lineHeight: '1.2' }], // 24→34px
        'h3':      ['clamp(1.25rem, 1.16rem + 0.35vw, 1.5rem)',  { lineHeight: '1.25' }],// 20→24px
        'body':    ['1rem',   { lineHeight: '1.6' }],   // 16px base legible
        'body-lg': ['1.125rem',{ lineHeight: '1.55' }], // 18px para párrafos destacados
        'caption': ['0.875rem',{ lineHeight: '1.45' }], // 14px
        'overline':['0.75rem', { lineHeight: '1.2' }],  // 12px, usar poco
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
