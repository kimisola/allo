const path = require('path');

module.exports = {
  entry: './src/index.js',
  devServer: {
    contentBase: './dist',
    historyApiFallback: true
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  module: {
        rules: [
           {
             test: /\.js$/,
             use: [
               'babel-loader',
            ],
        },
        // { 
        //   test: /\.js$/, 
        //   exclude: /node_modules/, 
        //   loader: "babel-loader" 
        // },
        {
          test: /\.css$/,
          use: [
          'style-loader',
          'css-loader',
          ],
        },
        {
　　　　　test: /\.(png|jpg)$/,
         use: 'file-loader?limit=8192&name=images/[hash:8].[name].[ext]'
  　　　}
      ],
    },
    mode: 'development'
};