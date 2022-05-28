const { merge } = require('webpack-merge');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const baseConfig = require('./webpack.base');

const SsrConfig = {
  mode: 'production',
  stats: 'errors-only',
  module: {
    rules: [
      {
        test: /\.(css|less)?$/,
        use: 'ignore-loader',
      },
    ],
  },
  plugins: [
    new CssMinimizerPlugin({
      assetNameRegex: /\.css$/g,
    }),
    new HtmlWebpackExternalsPlugin({
      externals: [
        {
          module: 'react',
          entry: 'https://unpkg.com/react@18/umd/react.production.min.js',
          global: 'React',
        },
        {
          module: 'react-dom',
          entry: 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
          global: 'ReactDOM',
        },
      ],
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 20000, // 最小包体积
      minRemainingSize: 0,
      minChunks: 2,
      cacheGroups: {
        commons: {
          test: /(react|react-dom)/,
          name: 'venders',
          chunks: 'all',
        },
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
};

module.exports = merge(baseConfig, SsrConfig);
