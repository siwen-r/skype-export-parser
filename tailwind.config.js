module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {},
    boxShadow: {
      inner: 'inset 0 4px 8px 0 rgba(0, 0, 0, 0.06)',
    },
    minWidth: {
      '1/4': '25%'
    },
    maxWidth: {
      '1/2': '50%'
    },
    flex: {
      'nowrap': '0 0 auto'
    }
  },
  variants: {
    extend: {
      borderWidth: ['dark'],
      textColor: ['dark']
    }
  },
  plugins: [],
}
