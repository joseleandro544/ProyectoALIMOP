/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'azul-cabecera': '#1e40af', // Azul Cabecera
        'azul-pie': '#1e3a8a',      // Azul Pie de Página
        'blanco-interface': '#ffffff', // Fondo Blanco
        'naranja-alerta': '#f97316',   // Acento Naranja (descuentos/vencimientos)
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'], // Fuente Outfit Premium
      },
      boxShadow: {
        'premium': '0 4px 20px -2px rgba(30, 64, 175, 0.08), 0 2px 10px -1px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
