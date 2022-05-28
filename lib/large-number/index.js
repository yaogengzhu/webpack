if (process.env.NODE_ENV !== 'production') {
  module.exports = require('dist/large-numbr.min.js')
} else {
  module.exports = require('dist/large-numbr.js')
}