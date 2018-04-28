const path = require('path');
const webpack = require('webpack');
const outputPath = path.join(__dirname, '../dist');
module.exports = {
    entry: {
        vendor: ['vue', 'vue-router', 'vuex', 'axios']
    },
    output: {
        path: outputPath,
        filename: 'lib/[name].dll.js',
        library: '[name]'
    },
    plugins: [
        new webpack.optimize.ModuleConcatenationPlugin(),
        // vue 中有对process.env.NODE_ENV的检测以决定运行在什么模式
        // webpack打包用的是vue.runtime.esm.js
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development'),
                DEBUG: false
            }
        }),
        // new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn|en-gb/),
        new webpack.DllPlugin({
            context: path.resolve(__dirname, '../'),
            path: path.resolve(__dirname, './[name]-manifest.json'),
            name: '[name]'
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
        })
    ]
}