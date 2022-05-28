const path = require('path');
const glob = require('glob');
// const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
// const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');

const setMAP = () => {
  const entry = {};
  const htmlWebpackPlugin = [];
  const entryFiles = glob.sync(path.join(__dirname, './src/*/index.jsx'));
  Object.keys(entryFiles).forEach((index) => {
    const entryFile = entryFiles[index];
    const match = entryFile.match(/src\/(.*)\/index\.jsx/);
    const pageName = match && match[1];
    entry[pageName] = entryFile;
    htmlWebpackPlugin.push(
      new HtmlWebpackPlugin({
        template: path.join(__dirname, `src/${pageName}/index.html`),
        filename: `${pageName}.html`,
        chunks: ['venders', pageName], // 需要引入venders
        inject: true,
        minify: {
          html5: true,
          collapseWhitespace: true,
          preserveLineBreaks: false,
          minifyCSS: true,
          removeComments: true,
        },
      }),
    );
  });
  return {
    entry,
    htmlWebpackPlugin,
  };
};

const { entry, htmlWebpackPlugin } = setMAP();
module.exports = {
  // mode: 'none',
  mode: 'production',
  stats: 'errors-only', // 发生错误时，才打印日志
  entry,
  output: {
    clean: true,
    filename: '[name]_[chunkhash:6].js', // chunkhash
    path: path.join(__dirname, 'dist/js'),
  },
  resolve: {
    extensions: ['.js', '.jsx', '.less'],
    aliasFields: ['browser'],
  },
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' },
      {
        test: /\.(js|jsx)$/,
        use: ['babel-loader'],
      },
      // { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      // { test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader'] },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  autoprefixer({
                    overrideBrowserslist: [
                      'last 10 Chrome versions',
                      'last 5 Firefox versions',
                      'Safari >= 6',
                      'ie> 8',
                    ],
                  }),
                ],
              },
            },
          },
          {
            loader: 'px2rem-loader',
            options: {
              remUnit: 75,
              remPrecesion: 8, // 小数点位数
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif|jpeg|svg)$/,
        use: [
          // {
          //   loader: 'url-loader',
          //   options: {
          //     limit: 20280, // 20k, 小于20k 自动base64
          //   }
          // }
          {
            loader: 'file-loader',
            options: {
              name: '[name]_[hash:8][emoji].[ext]',
            },
          },
        ],
      },
      { test: /\.(woff|woff2|eot|ttf|otf)$/, use: 'file-loader' },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name][contenthash:6].css',
    }),
    new CssMinimizerPlugin(),
    new FriendlyErrorsWebpackPlugin(),
    function () {
      this.hooks.done.tap('done', (stats) => {
        if (stats.compilation.errors) {
          console.log('??');
          // console.log(stats);
        }
      });
    },
    // new webpack.optimize.ModuleConcatenationPlugin(), // mode --> production 默认开启
    // new HtmlWebpackExternalsPlugin({
    //   externals: [
    //     {
    //       module: 'react',
    //       entry: 'https://unpkg.com/react@18/umd/react.production.min.js',
    //       global: 'React'
    //     },
    //     {
    //       module: 'react-dom',
    //       entry: 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
    //       global: 'ReactDOM'
    //     }
    //   ]
    // })
    // 多页面打包，就复制多个htmlWebpackPlugin
  ].concat(htmlWebpackPlugin),
  // devtool: 'inline-source-map', // eval source-map inline-source-map
  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 20000, // 最小包体积
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
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
