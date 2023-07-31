// webpack.config.js
const path = require('path');

module.exports = {
  mode: 'production', // or 'development' for development mode
  entry: {
    'oprf': path.resolve(__dirname, 'oprf.js'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    library: 'encryption-js',
    libraryTarget: 'umd',
  },
};
