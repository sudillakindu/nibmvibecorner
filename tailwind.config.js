export default {
  darkMode: 'class',
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        serif: ['Raleway', 'serif'],
        display: ['Montserrat', 'sans-serif'],
      },
      colors: {
        // Primary colors
        mustard: {
          50: '#FEF9E7',
          100: '#FCF3CF',
          200: '#F9E79F',
          300: '#F7DB6F',
          400: '#F5D03F',
          500: '#F4C430', // Warm Mustard Yellow
          600: '#DAB02B',
          700: '#B59226',
          800: '#907420',
          900: '#76601B',
        },
        chocolate: {
          50: '#F5F0EE',
          100: '#EBE1DD',
          200: '#D7C3BB',
          300: '#C3A599',
          400: '#AF8777',
          500: '#9B6855',
          600: '#7D5444',
          700: '#5C4033', // Rich Chocolate Brown
          800: '#4A3329',
          900: '#38271F',
        },
        sand: {
          50: '#FCF9F6',
          100: '#F9F3ED',
          200: '#F3E7DB',
          300: '#EDDBC9',
          400: '#E6CFB7',
          500: '#D4B795',
          600: '#C19A6B', // Desert Sand
          700: '#B38756',
          800: '#946D45',
          900: '#7A5A3A',
        },
        saddle: {
          50: '#F7F2EE',
          100: '#EFE5DD',
          200: '#DFCBBB',
          300: '#CFB199',
          400: '#BF9777',
          500: '#AF7D55',
          600: '#9C6E4B',
          700: '#8B4513', // Saddle Brown
          800: '#6F360F',
          900: '#57290C',
        },
        orange: {
          50: '#FFF8E6',
          100: '#FFF1CC',
          200: '#FFE399',
          300: '#FFD566',
          400: '#FFC433',
          500: '#FFB347', // Soft Orange
          600: '#FFA114',
          700: '#E08A00',
          800: '#AD6B00',
          900: '#7A4C00',
        },
        cream: {
          50: '#FFFFFF',
          100: '#FEFEFE',
          200: '#FAFAFA',
          300: '#F7F7F7',
          400: '#F4F2F0',
          500: '#EEE2DC', // Cream / Off-white
          600: '#E5D0C5',
          700: '#DCBEAE',
          800: '#D3AC97',
          900: '#CA9A80',
        },
        charcoal: {
          50: '#EAEAEA',
          100: '#D6D6D6',
          200: '#ADADAD',
          300: '#858585',
          400: '#5C5C5C',
          500: '#3B2F2F', // Dark Brown for text
          600: '#292929',
          700: '#1F1F1F',
          800: '#151515',
          900: '#111111',
        },
      },
      boxShadow: {
        'glow': '0 0 15px rgba(244, 196, 48, 0.5)',
        'glow-orange': '0 0 15px rgba(255, 179, 71, 0.5)',
        'glow-brown': '0 0 15px rgba(92, 64, 51, 0.3)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delay': 'float-delay 8s ease-in-out infinite',
        'float-slow': 'float-slow 10s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'mustard-gradient': 'linear-gradient(135deg, #F4C430 0%, #FFB347 100%)',
        'brown-gradient': 'linear-gradient(135deg, #5C4033 0%, #8B4513 100%)',
        'sand-gradient': 'linear-gradient(135deg, #C19A6B 0%, #EEE2DC 100%)',
        'paper-texture': 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")',
      },
    },
  },
  plugins: [],
}