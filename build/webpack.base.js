const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const cleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const nodeModules = path.resolve(__dirname, '../node_modules');
const sourcePath = path.join(__dirname, '../src');

const isDev = !!(process.env.NODE_ENV != 'production');

const cssLoaders = [{
        loader: 'css-loader', 
        options: {
            sourceMap: isDev,
            minimize: !isDev
        }
    }, {
        loader: 'postcss-loader', 
        options: {
            sourceMap: isDev
        }
    }, {
        loader: 'less-loader', 
        options: {
            sourceMap: isDev,
            globalVars: {
                '@primal-bg': '#F5EBC7'
            }
        }
    }]

// 构建生产环境版本时提取css为单独文件 
// ExtractTextPlugin好像有一个disabale选项用来决定dev和prod环境下是否启用
const finalCssLoader = ExtractTextPlugin.extract({
    fallback: "style-loader",
    use: cssLoaders
});
module.exports = {
    context: sourcePath,
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',   // 默认用babel-loader处理组件内的js
                options: {
                    extractCSS: !isDev
                }
            },
            {
                test: /\.js$/,
                exclude: nodeModules,
                include: sourcePath,
                use: [
                    'babel-loader'
                ],
            },
            {
                test: /\.(css|less)$/,
                use: isDev ? [{loader: 'style-loader'}].concat(cssLoaders) : finalCssLoader
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 8192,
                    name: 'font/[name].[hash:8].[ext]'
                }
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 8192,
                        name: 'images/[name].[hash:8].[ext]'
                    }
                }]
            }
        ],
        noParse: /jquery|lodash|node_modules\//    // 避免大的库文件被loaders处理
    },
    resolve: {
        extensions: ['.js', '.vue', '.css', '.less'],
        modules: [sourcePath, nodeModules],
    },
    plugins: [
        new cleanWebpackPlugin(['dist'], {
            root: path.resolve(__dirname, '../'),
            exclude: 'lib/*.*'
        }),
        new ExtractTextPlugin('css/[name].[contenthash:8].css'),
        new webpack.DllReferencePlugin({
            context: path.resolve(__dirname, "../"),
            manifest: require('./vendor-manifest.json'),
        }),
        new ProgressBarPlugin(),
    ]
}