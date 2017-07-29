var path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath:'/'
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
              test:/\.(png|svg|jpg|gif)$/,
              use:[
                  'file-loader'
              ]
          }
      ]
  },
  resolve: {
       alias: { 'vue': 'vue/dist/vue.js' } 
    },
  devServer:{
       inline:true,
       watchContentBase: true
  }

};
