const config = require("./config")

module.exports = (options) => ({
  staticFolder: 'src/assets',
  dist: `${config.prodDir}/v${config.version}`,
  homepage: `${config.buildURL}/v${config.version}`
})