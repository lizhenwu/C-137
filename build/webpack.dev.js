const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const baseWebpackConfig = require('./webpack.base');
const htmlWebpackPlugin = require('html-webpack-plugin');
const outputPath = path.join(__dirname, '../dist');

module.exports = merge(baseWebpackConfig, {
    devtool: 'source-map',
    entry: {
      app: '../src/index.js',
    },
    output: {
        path: outputPath,
        // publicPath: '/',
        filename: 'js/[name].js',
        chunkFilename: "js/[name].[chunkhash:8].js"
    },
    devServer:{
        open: true,
        proxy: {
            '/api': 'http://localhost:8080'
        },
        port: 3000,
        compress: true,
        hot: true,
        https: false,
        noInfo: true,
        contentBase: path.resolve(__dirname, '../dist')
    },
    plugins: [
        // 定义全局变量，webpack在编译时进行替换
        // 把程序中用到的process.env.NODE_ENV替换成'development', 比如本项目在store.js中定义domain时用
        // process.env.NODE_ENV做了判断
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development')
            }
        }),
        new htmlWebpackPlugin({
            template: path.resolve(__dirname, '../index.html'),
            favicon: path.resolve(__dirname, '../favicon.ico')
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin()
    ]
})