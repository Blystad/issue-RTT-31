/*eslint-disable*/
var path = require('path');

var loaders = [
  { test: /\.jsx?$/, exclude: [path.resolve('node_modules'), path.resolve('src/vendor')], loaders: ['babel'] },
];

module.exports = loaders;