/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      scrollbar: {
        hide: 'scrollbar-hide',
      },
    },
  },
  variants: {
    scrollbar: ['responsive'],
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities(
        {
          '.scrollbar-hide::-webkit-scrollbar': { display: 'none' },
          '.scrollbar-hide': {
            '-ms-overflow-style': 'none',
            'scrollbar-width': 'none',
          },
        },
        ['responsive']
      );
    },
  ],
};

