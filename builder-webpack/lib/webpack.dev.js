const path = require('path');
const { merge } = require('webpack-merge');
const webpack = require('webpack');
const baseConfig = require('./webpack.base');

const devConfig = {
  mode: 'development',
  plugins: [new webpack.HotModuleReplacementPlugin()],
  stats: 'minimal',
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'), // webpack5.x 静态文件文章
    },
    hot: true,
  },
};

module.exports = merge(devConfig, baseConfig);
