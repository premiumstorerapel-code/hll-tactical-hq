/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bunker: {
          950: '#0a0d0e',
          900: '#101416',
          850: '#151b1e',
          800: '#1b2226',
          700: '#263138',
          600: '#34434c',
          500: '#485c68',
        },
        tactical: {
          amber: '#f59e0b',
          'amber-glow': '#fbbf24',
          olive: '#4d5b44',
          red: '#ef4444',
          blue: '#3b82f6',
          green: '#22c55e',
          cyan: '#06b6d4',
          danger: '#dc2626'
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'Consolas', 'Courier New', 'monospace'],
        display: ['"Chakra Petch"', 'Rajdhani', 'Impact', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'bunker-glow': '0 0 25px rgba(245, 158, 11, 0.15)',
        'tactical-card': '0 4px 20px -2px rgba(0, 0, 0, 0.7)',
        'radar': '0 0 15px rgba(34, 197, 94, 0.3)'
      }
    },
  },
  plugins: [],
}
