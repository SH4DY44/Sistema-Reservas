/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep Tech Blue Backgrounds
        'brand-dark': '#0B1120', // Darker than slate-950
        'brand-surface': '#151E32', // Slightly lighter blue-grey
        
        // Primary Blue (Electric/Neon feel but readable)
        'brand-blue': {
          DEFAULT: '#3B82F6', // Standard Blue-500
          hover: '#2563EB',   // Blue-600
          glow: 'rgba(59, 130, 246, 0.5)'
        },

        // Secondary Orange (High Contrast Accent)
        'brand-orange': {
          DEFAULT: '#F97316', // Orange-500
          hover: '#EA580C',   // Orange-600
          glow: 'rgba(249, 115, 22, 0.5)'
        }
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }
    },
  },
  plugins: [],
}
