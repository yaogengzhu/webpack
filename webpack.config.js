const path = require('path')

module.exports = {
  entry: {
    index: './src/index.js',
    search: './src/search.js'
  },
  output: {
    clean: true,
    filename: '[name].js',
    path: path.join(__dirname, 'dist/js')
  },
  mode: 'production'
}
