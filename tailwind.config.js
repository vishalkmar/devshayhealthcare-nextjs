/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand — light "asmani" blue requested by the client (#34c0eb) plus
        // a soft gray/white ("cursor" theme) supporting palette.
        brand: {
          DEFAULT: '#34c0eb',
          50: '#eefaff',
          100: '#d9f3ff',
          200: '#b9eaff',
          300: '#86ddff',
          400: '#4cc8f5',
          500: '#34c0eb',
          600: '#1898c4',
          700: '#16789e',
          800: '#196582',
          900: '#1a546d',
        },
        ink: '#0f1722',
        muted: '#5b6b7b',
        line: '#e6ebf0',
        cloud: '#f5f8fb',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 8px 30px rgba(20, 50, 80, 0.08)',
        card: '0 4px 20px rgba(20, 50, 80, 0.06)',
      },
      keyframes: {
        floaty: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-7px)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        floaty: 'floaty 2.2s ease-in-out infinite',
        fadeUp: 'fadeUp 0.5s ease-out both',
      },
    },
  },
  plugins: [],
};
