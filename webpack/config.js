/*eslint-disable*/
var path = require('path');
var util = require('util');
var pkg = require('../package.json');

var loaders = require('./loaders');
var plugins = require('./plugins');

var node_modules = path.resolve(__dirname, 'node_modules');
var reactPath = path.resolve(node_modules, 'react/dist/react.js');

var DEV = process.env.NODE_ENV === 'development';
var entry = {
  app: ['./src/main/js/Main.js']
};

if (DEV) {
  entry.app.push(
    util.format(
      'webpack-dev-server/client?http://%s:%d',
      pkg.config.devHost,
      pkg.config.devPort
    )
  );
  entry.app.push('webpack/hot/only-dev-server');
}

var config = {
  target: 'web',
  devtool: DEV ? 'eval' : 'source-map',
  entry: entry,
  output: {
    path: path.resolve(pkg.config.buildDir),
    filename: 'bundle.js',
    publicPath: '/',
  },
  module: {
    loaders: loaders,
    noParse: [ reactPath ]
  },
  plugins: plugins,
  resolve: {
    extensions: ['', '.js', '.json', '.jsx']
  }
};

module.exports = config;