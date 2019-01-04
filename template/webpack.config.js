const path = require('path');
const webpack = require('webpack');

module.exports = (env, argv) => ({
  entry: './src/loader.jsx',
  output: {
    path: path.resolve(__dirname),
    filename: 'adventure.js'
  },
  devServer: {
    hot: true,
    contentBase: path.join(__dirname, 'src')
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      $hideDebug: env.production
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
  mode: env.production ? 'production' : 'development',
});