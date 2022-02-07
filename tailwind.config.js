module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage : {
        'main': "url('../assets/background.png')",
      },
      colors: {
        'lit': {
          900: '#281647',
          400: '#5F35B8',
          500: '#7660A8',

        },
        'grey' : {
          'main': '#22242C',
          'text': '#80818A',
        },
      },
      borderRadius:{
        '4xl': '32px'
      },
      transitionTimingFunction: {
        'in-expo': 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
        'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
        'lit': 'cubic-bezier(0.4, 0, 0.2, 1)',
      }
    },

    boxShadow: {
      'lit': 'rgb(0 0 0 / 25%) 0px 10px 30px',
    },


  },
  plugins: [],
}