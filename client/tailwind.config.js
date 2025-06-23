/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EFE9F4',
          100: '#DED3E9',
          200: '#BDA7D3',
          300: '#9C7BBE',
          400: '#7B50A8',
          500: '#5A2493',
          600: '#4B0082',  // Royal Indigo
          700: '#3D006A',
          800: '#2F0051',
          900: '#210038',
        },
        secondary: {
          50: '#FFF0EB',
          100: '#FFE1D6',
          200: '#FFC3AE',
          300: '#FFA585',
          400: '#FF875D',
          500: '#FF6B35',  // Coral Orange
          600: '#F55620',
          700: '#E04410',
          800: '#C23C0E',
          900: '#A3330C',
        },
        accent: {
          50: '#E0FBF7',
          100: '#C1F6EF',
          200: '#83EDDF',
          300: '#45E4CF',
          400: '#0EDCBF',
          500: '#00BFA6',  // Tropical Teal
          600: '#00A894',
          700: '#009182',
          800: '#007A6F',
          900: '#00635A',
        },
        background: '#FDF6F0',  // Cream White
        card: '#EFE9F4',        // Light Lilac
        text: {
          main: '#2C2C2C',      // Charcoal Gray
          light: '#6B7280'      // Slate Gray
        },
        error: {
          50: '#FBE9EA',
          100: '#F7D4D6',
          200: '#EFA9AD',
          300: '#E77E83',
          400: '#DF595F',
          500: '#E63946',       // Rose Red
          600: '#D12836',
          700: '#BD1C2A',
          800: '#A9171F',
          900: '#951519',
        }
      },
      fontFamily: {
        sans: ['Inter var', 'Inter', 'sans-serif'],
        display: ['Montserrat', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'wave': 'wave 1.5s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
        'shimmer': 'shimmer 2s infinite linear',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        wave: {
          '0%': { transform: 'rotate(0deg)' },
          '15%': { transform: 'rotate(14deg)' },
          '30%': { transform: 'rotate(-8deg)' },
          '40%': { transform: 'rotate(14deg)' },
          '50%': { transform: 'rotate(-4deg)' },
          '60%': { transform: 'rotate(10deg)' },
          '70%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(0deg)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'music-pattern': "url('/src/assets/music-pattern.png')",
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'inner-soft': 'inset 0 2px 10px 0 rgba(0, 0, 0, 0.06)',
        'emboss': '0 1px 2px rgba(0,0,0,0.1), 0 -1px 0 rgba(255,255,255,0.3)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
