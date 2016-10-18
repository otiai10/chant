/* global require:false, process:false, module:false */
var webpack = require("webpack");

var plugins = [];
if (process.env.NODE_ENV == "production") {
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: { warnings: false },
    mangle: false
  }));
}
plugins.push(new webpack.DefinePlugin({
  "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development")
}));

module.exports = {
  entry: {
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
