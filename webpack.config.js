
module.exports = {
  entry: {
    bundle: './client/src/all.ts'
  },
  output: {
    path: 'server/assets/js',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'ts-loader'
      }
    ]
  }
}
