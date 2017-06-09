/**
 * Client build command should be executed on the project top,
 * where "package.json" located.
 */

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

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

module.exports = [
  {
    entry: {
      index: './client/src/js/entrypoints/index.js'
    },
    output: {
      filename: './app/public/js/[name].js'
    },
    module: {
      loaders: [
        {test: /\.jsx?$/, loader: 'babel-loader'},
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx']
    },
    plugins: plugins,
  },
  {
    entry: {
      index: './client/src/scss/entrypoints/index.scss'
    },
    output: {
      filename: './app/public/css/[name].css'
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          loader: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use:[
              process.env.NODE_ENV == 'production' ? 'css-loader?minimize' : 'css-loader',
              'sass-loader'
            ],
          })
        },
      ]
    },
    plugins: [
      new ExtractTextPlugin({filename:'./app/public/css/[name].css', allChunks:true})
    ],
  }
];
