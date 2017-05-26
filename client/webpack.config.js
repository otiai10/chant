/**
 * Client build command should be executed on the project top,
 * where "package.json" located.
 */

var webpack = require('webpack');

var plugins = [
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  }),
];
if (process.env.NODE_ENV == 'production') {
  plugins.push(new webpack.optimize.UglifyJsPlugin({
    // compress: { warnings: false },
    mangle: true
  }));
}

module.exports = {
  entry: {
    index: './client/src/entrypoints/index.js'
  },
  output: {
    filename: './app/public/js/[name].js'
  },
  module: {
    loaders: [
      {test: /.jsx?$/, loader: 'babel-loader'}
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: plugins,
};
