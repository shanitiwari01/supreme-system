const path = require('path')
const defaultSourceExts = require('metro-config/src/defaults/defaults').sourceExts

module.exports = {
  projectRoot: path.resolve(__dirname, '../../'),
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  }
}