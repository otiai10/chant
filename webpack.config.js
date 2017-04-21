
var plugins = [];

module.exports = {
  entry: {
    app:     './client/src/js/app.js',
  },
  output: {
    filename: './client/dest/js/[name].js',
  },
  module: {
    loaders: [
      {test: /\.js$/,loaders: ['babel-loader']},
    ]
  },
  resolve: {
    extensions: ['.js']
  },
  plugins: plugins,
};
