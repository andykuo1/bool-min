const path = require('path');
const webpack = require('webpack');

module.exports = {
  //Change this to 'production' for optimizations
  mode: "development",
  //Entry point to start bundling...
  entry: {
    test: './test/index.js'
  },
  output: {
    //Output to ./dist/bundle.js
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    publicPath: 'dist/'
  },
  resolve: {
    //Resolve by filename without extensions
    extensions: ['*', '.js', '.jsx', '.mjs'],
    //Resolve by absolute path
    modules: [
      'node_modules',
      path.resolve('./src'),
      path.resolve('./res'),
      path.resolve('./test')
    ]
  }
};
