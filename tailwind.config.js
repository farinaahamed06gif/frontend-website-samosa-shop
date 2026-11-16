/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        crust: {
          50: '#fdf8f0',
          100: '#faefdc',
          200: '#f4dcaf',
          300: '#ecc37c',
          400: '#e4a549',
          500: '#dc8724',
          600: '#c06719',
          700: '#994a17',
          800: '#7c3b1a',
          900: '#673218',
        },
        obsidian: {
          950: '#070809',
          900: '#0d0f12',
          800: '#15191e',
          700: '#1f252d',
          600: '#2d3540',
        },
        chutney: {
          mint: '#10b981',
          tamarind: '#b45309',
          spicy: '#ef4444',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Outfit', 'Cabinet Grotesk', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'ui-monospace', 'monospace']
      },
      boxShadow: {
        'glow-warm': '0 0 50px -10px rgba(220, 135, 36, 0.25)',
        'glow-ambient': '0 20px 80px -20px rgba(0, 0, 0, 0.8)',
      }
    },
  },
  plugins: [],
}

