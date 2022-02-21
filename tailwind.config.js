module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage : {
        'main': "url('../public/background.png')",
      },
      colors: {
        'lit': {
          100: '#e7ddff',
          400: '#5F35B8',
          '400/.75': 'rgba(95, 53, 184, .75)', 
          '400/.5': 'rgba(95, 53, 184, .5)', 
          500: '#7660A8',
          900: '#281647',
          'dark': '#0B021F',
          'red': '#FF3743',
        },
        'purple':{
          'text': '#8159d9',
        },
        'grey' : {
          'main': '#22242C',
          'text': '#80818A',
        },
        'base': {
          'main': '#131824'
        },
        'red': 'red',
      },
      height: {
        '108': '32rem',
      },
      borderRadius:{
        '4xl': '32px'
      },
      transitionTimingFunction: {
        'in-expo': 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
        'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
        'lit': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      fontSize: {
        'h1': '1.25rem',
        'xs': '0.65rem',
        '2xs': '0.5rem',
      }
    },

    boxShadow: {
      'lit': 'rgb(0 0 0 / 25%) 0px 10px 30px',
    },


  },
  plugins: [],
}