
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
      {test: /\.js$/, exclude: /node_modules/, loaders: ['babel-loader']},
      {test: /\.json$/, loaders: ['json-loader']}
    ]
  },
  resolve: {
    extensions: ['.js','.json']
  },
  plugins: plugins,
};
