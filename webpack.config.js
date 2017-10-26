const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const cleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: {
      app: './src/index.js',
      vendor:['vue','vue-router']
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'build'),
    // sourceMapFilename: '[file].map'
  },
  resolve: {
    extensions: ['.js','.vue']
  },
  module:{
      rules:[
          {
            test:/\.vue$/,
            use:[
                'vue-loader'
            ]
          },
          {
              test:/\.css$/,
              use:[
                  'style-loader',
                  'css-loader'
              ]
          },
          {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'file-loader',
            options: {
              limit: 10000,
            //   name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
            }
          },
          {
              test:/\.(png|svg|jpg|gif)$/,
              use:[
                  'file-loader'
              ]
          }
      ]
  },
  devtool: 'inline-source-map',
  devServer:{
      open:true,
      proxy: {
          '/api': 'http://localhost:8080'
      },
      port: 3000,
      compress: true,
      hot: true,
      https: false,
      noInfo: true,
      contentBase: './build'
  },
  plugins:[
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        filename: 'vendor-[hash].min.js',
    }),
    // new webpack.NoEmitOnErrorsPlugin(),
    new cleanWebpackPlugin(['build']),
    new HtmlWebpackPlugin({
        template: path.resolve(__dirname,'index.html'),
        favicon: path.resolve(__dirname,'favicon.ico')
    }),
  ]
};
