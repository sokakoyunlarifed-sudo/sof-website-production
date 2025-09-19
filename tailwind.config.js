/** @type {import('tailwindcss').Config} */
export default {
   content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      keyframes: {
    marquee: {
      '0%': { transform: 'translateX(100%)' },
      '100%': { transform: 'translateX(-100%)' },
    },
  },
  animation: {
    marquee: 'marquee 20s linear infinite',
  },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
      },
      colors: {
        'primary': '#E30613',   // 🔴 Logo kırmızısı (ana renk)
        'secondary': '#B0000D', // 🟥 Daha koyu kırmızı (hover/border için)
        'accent': '#FF4D4D',    // 🔴 Açık kırmızı/ton farkı (detay ve vurgu için)
        'background': '#FFFFFF' // ⚪ Beyaz (temiz zemin, logo ile uyumlu)
      },
      container: {
        center: true,
        padding:{ DEFAULT: '1rem', sm: '3rem'},
      } ,
    },
  },
  plugins: [],
}

