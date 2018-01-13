const config = require("./config")

module.exports = (options) => ({
  staticFolder: 'src/img',
  dist: `${config.prodDir}/v${config.version}`,
  homepage: `${config.buildURL}/v${config.version}`
})