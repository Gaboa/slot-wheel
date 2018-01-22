const config = require("./config")

module.exports = (options) => ({
  staticFolder: 'src/assets',
  dist: `${config.prodDir}`,
  homepage: `${config.devURL}`
})