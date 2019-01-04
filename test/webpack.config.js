const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: path.join(__dirname, './index.jsx'),
  output: {
    path: path.resolve(__dirname),
    filename: 'adventure.js'
  },
  devServer: {
    hot: true,
    contentBase: path.join(__dirname)
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      $hideDebug: JSON.stringify(false)
    })
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ]
  },
  externals: {
    'react-dom': 'ReactDOM',
    'react': 'React',
  },
  mode: 'development'
};
