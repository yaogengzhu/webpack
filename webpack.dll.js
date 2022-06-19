const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    library: [
      'react',
      'react-dom',
    ],
  },
  output: {
    filename: '[name].dll.js',
    path: path.join(__dirname, 'build/libary'),
    library: '[name]',
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]',
      path: path.join(__dirname, 'build/libary/[name].json'),
    }),
  ],
};
