const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {

  theme: {
    extend: {
      fontFamily: {
        heading: ["'Poppins'", ...fontFamily.sans],
        body: ["'Roboto'", ...fontFamily.sans],
      },
    },
  },
  plugins: [],
};