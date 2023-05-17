module.exports = function(_, argv) {
  const path = require('path');
  const webpack = require('webpack');
  const CircularDependencyPlugin = require('circular-dependency-plugin');
  const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

  const isProduction = argv.mode === 'production';
  const config = {
    entry: [
      './src/DSWidget.ts',
    ],
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'DSWidget.js',
      library: 'DSWidget',
      libraryTarget: 'window',
    },
    optimization: {
      minimize: isProduction,
      usedExports: true
    },
    target: 'web',
    mode: argv.mode,
    devtool: isProduction ? false : 'cheap-module-source-map',
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
      modules: [path.resolve('./src'),'node_modules'],
    },

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
              {
                  loader: 'ts-loader',
                  options: {
                      configFile: 'tsconfig.json',
                      transpileOnly: true
                  }
              }
          ]
        },
        {
          test: /\.ttf$/,
          type: 'asset',
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: 'style-loader',
              options: {
                esModule: true
              },
            },
            {
              loader: 'css-loader',
              options: {
                modules: {
                  mode: "local",
                  localIdentName: "[local]--[hash:base64:5]",
                  exportLocalsConvention: "camelCaseOnly",
                  namedExport: true
                },
                import: false,
                url: false
              }
            },
            'postcss-loader',
            'sass-loader'
          ]
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.svg$/,
          use: 'null-loader'
        }
      ]
    },

    plugins: [
      new ForkTsCheckerWebpackPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      new CircularDependencyPlugin({
        exclude: /node_modules/,
        failOnError: true
      }),
      new webpack.HotModuleReplacementPlugin()
    ]
  };
  return config;
};
