const config = require("./config")

module.exports = (options) => ({
  staticFolder: 'src/img',
  dist: `${config.prodDir}`,
  homepage: `${config.devURL}`
})