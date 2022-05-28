// 资源解析、样式增强、目录清理、css 提取

const glob = require('glob');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const EsLintPlugin = require('eslint-webpack-plugin');
const autoprefixer = require('autoprefixer');

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
  entry,
  output: {
    clean: true,
  },
  module: {
    rules: [
      { test: /\.txt$/, use: 'raw-loader' },
      { test: /\.(js|jsx)$/, use: ['babel-loader', 'eslint-loader'] },
      { test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader'] },
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
          {
            loader: 'url-loader',
            options: {
              limit: 20280, // 20k, 小于20k 自动base64
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
    new FriendlyErrorsWebpackPlugin(),
    new EsLintPlugin(),
  ].concat(htmlWebpackPlugin),
};
