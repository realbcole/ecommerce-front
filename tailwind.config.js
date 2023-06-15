/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        primaryDark: '#293241',
        primaryBg: '#98C1D9',
        secondaryBg: '#E0FBFC',
        secondary: '#EE6C4D',
        extraDetails: '#bfdbe4',
      },
      gridTemplateColumns: {
        // Product description and image
        featured: '.8fr 1.2fr',
        cart: '1.3fr 0.7fr',
        product: '0.8fr 1.2fr',
      },
      keyframes: {
        fly: {
          '100%': {
            top: 0,
            left: '70%',
            opacity: 0,
            display: 'none',
            maxHeight: '25px',
            maxWidth: '25px',
            borderRadius: '100%',
          },
        },
      },
      animation: {
        fly: 'fly 1s',
      },
    },
  },
  plugins: [],
};
