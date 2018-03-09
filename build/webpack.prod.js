const domain = '//c137.zwait.cc/';
const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const baseWebpackConfig = require('./webpack.base');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const htmlWebpackPlugin = require('html-webpack-plugin');
const outputPath = path.join(__dirname, '../dist');
module.exports = merge(baseWebpackConfig, {
    devtool: false,
    entry: {
        polyfill: 'babel-polyfill',
        app: '../src/index.js',
    },
    output: {
        path: outputPath,
        publicPath: domain,
        filename: 'js/[name].[chunkhash:8].js',
        chunkFilename: "js/[name].[chunkhash:8].js"
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production'),
                DEBUG: false
            }
        }),
        new htmlWebpackPlugin({
            template: path.join(__dirname, '../index.html'),
            favicon: path.resolve(__dirname, '../favicon.ico')
        }),
        new webpack.optimize.UglifyJsPlugin({
            // 最紧凑的输出
            beautify: false,
            // 删除所有的注释
            comments: false,
            compress: {
                // 在UglifyJs删除没有用到的代码时不输出警告
                warnings: false,
                // 删除所有的 `console` 语句
                // 还可以兼容ie浏览器
                drop_console: true,
                // 内嵌定义了但是只用到一次的变量
                collapse_vars: true,
                // 提取出出现多次但是没有定义成变量去引用的静态值
                reduce_vars: true,
            }
        }),
        // 压缩css, 还用cssnano做了不知道是什么的处理（
        new OptimizeCSSPlugin(),      // 此项目的css从80kb减小到了50kb   
        // 预编译所有模块到一个闭包中，提升代码在浏览器中的执行速度
        new webpack.optimize.ModuleConcatenationPlugin(),
    ]
});