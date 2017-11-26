const path = require('path');
const webpack = require('webpack');
const { optimize: { CommonsChunkPlugin }, ProvidePlugin } = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { AureliaPlugin } = require('aurelia-webpack-plugin');
//const BabiliPlugin = require('babili-webpack-plugin'); // ES6 compatible minfication/compresion

module.exports = {
  entry: {
    main: [ 
      'aurelia-bootstrapper'
    ]
  },

  output: {
    path: path.resolve(__dirname, 'target/www'),
    publicPath: '/',
    filename: '[name].js',    
    chunkFilename: '[name].js'
  },

  resolve: {
    extensions: ['.js'],
    modules: ['./src/main/webapp/src', 'node_modules'],
  },

  module: {
    rules: [
      { test: /\.(js)$/,
        loaders: 'babel-loader',
        exclude: /node_modules/,
        query: { // use 'babel-preset-env' without transforming ES6 modules, and with added support for decorators
          presets: [['env', { modules: false }]],
          plugins: ['transform-class-properties', 'transform-decorators-legacy']
        }
      },
      { test: /\.css$/i, 
        use: [
          'style-loader', 
          'css-loader'
        ] 
      },
      { test: /\.html$/i, 
        use: 'html-loader' }
    ]
  },  

  plugins: [
	// init aurelia-webpack-plugin
	new AureliaPlugin(),
	/*new CommonsChunkPlugin({
		name: "commons",
		filename: "commons.js",
		chunks: ["A", "B"]
	});*/
    // required polyfills for non-evergreen browsers
    new ProvidePlugin({        
        Map: 'core-js/es6/map',
        WeakMap: 'core-js/es6/weak-map',
        Promise: 'core-js/es6/promise',
        regeneratorRuntime: 'regenerator-runtime' // to support await/async syntax
    }),
    new CopyWebpackPlugin([
        { from: 'static/favicon.ico', to: 'favicon.ico' }
    ]),
    // have Webpack copy over the index.html and inject appropriate script tag for Webpack-bundled entry point 'main.js'
    new HtmlWebpackPlugin({
        template: '!html-webpack-plugin/lib/loader!./src/main/webapp/index.html',
        filename: 'index.html'
    })
  ],
  devServer: {
      port: 3000
  }
};