const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const merge = require('webpack-merge')

const TARGET = process.env.npm_lifecycle_event

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.resolve(__dirname, 'dist') 
}

const common = {
  entry: PATHS.app,

  output: {
    path: PATHS.build,
    filename: 'bundle.js'
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: 'Nagaoka Hanabi'
    }),
    new CopyWebpackPlugin([
      {from: 'assets/**/*'}
    ]),
    new webpack.HotModuleReplacementPlugin()
  ],

  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader?modules&localIdentName=[name]__[local]__[hash:base64:5]']
      },
      {
        test: /\.(jpg|png|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 25000
        }
      },
      {
        test: /\.(jpe?g|gif|png|svg|woff|ttf|wav|mp3)$/,
        loaders: 'file'
      }
    ]
  }
}

if ('start' == TARGET || !TARGET) {
  module.exports = merge(common, {
    devServer: {
      hot: true
    }
  });
}

if ('build' == TARGET) {
  module.exports = merge(common, {});
}
