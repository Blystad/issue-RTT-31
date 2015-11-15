/*eslint-disable*/
var path = require('path');
var util = require('util');
var webpack = require('webpack');

var plugins = [
  new webpack.ProvidePlugin({
    $: "jquery",
    jQuery: "jquery"
  }),
];

plugins.push(
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin(),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('development'),
    },
    '__PRODUCTION__': false,
    '__TEST__': false,
  })
);

module.exports = plugins;