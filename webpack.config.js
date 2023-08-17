// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); 

module.exports = {
  mode: 'development', // or 'development' for development mode
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'encryption.js',
    library: 'encryption',
    libraryTarget: 'umd',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
  ],
  resolve: {
    fallback: {
      "crypto": false,
      "stream": false,
      "buffer": false
    }
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
    ],
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  }
};
