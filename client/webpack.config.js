/* global require:false, process:false, module:false */
var webpack = require("webpack");

var plugins = [];
if (process.env.NODE_ENV == "production") {
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: { warnings: false },
    mangle: true
  }));
}

module.exports = {
  entry: {
    channel: "./client/src/js/entrypoints/channel.js",
    index: "./client/src/js/entrypoints/index.js",
  },
  output: {filename:"./app/assets/js/[name].js"},
  module: {
    loaders: [
      {test: /.jsx?$/, loader: "babel-loader"}
    ]
  },
  resolve: {
    extensions: ["", ".js", ".jsx"]
  },
  plugins: plugins
};
