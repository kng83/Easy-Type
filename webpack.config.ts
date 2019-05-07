
import path from 'path';
import fs from 'fs';
import NodemonPlugin = require('nodemon-webpack-plugin');
import CopyPlugin = require('copy-webpack-plugin');
import webpack from 'webpack';

const nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function (x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function (mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

const config: webpack.Configuration = {
  mode: 'development',
  entry: "./server/app.ts",
  target: "node",
  watchOptions: {
    aggregateTimeout: 100,
    poll: true
  },
  node:{
    __filename: false,
    __dirname: false
  },
  stats: {
    warningsFilter: /^(?!CriticalDependenciesWarning$)/ //used for compiling express app
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "server.js"
  },
  module: {
    rules: [
      {
        test: /\.txt$/i,
        use: 'raw-loader',
      },
      {
        test: /\.js$/i,
        use:'raw-loader'
      },
      

      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'awesome-typescript-loader',
            options: {
              transpileOnly: true,
              configFileName: path.resolve(__dirname, "server/tsconfig.json")

            }
          }
        ],
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  devtool: 'source-map',
  externals: nodeModules,
  plugins: [
    new CopyPlugin([
      {from:'./server/public',to:'./public'}
    ]),
    new NodemonPlugin()
  ]
};

export default config;
