module.exports = function(_, argv = {}) {
  const path = require('path');
  const webpack = require('webpack');
  const CircularDependencyPlugin = require('circular-dependency-plugin');
  const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
  const CopyPlugin = require('copy-webpack-plugin');
  const TerserPlugin = require("terser-webpack-plugin");

  const getConfig = require('./bin/utils');
  const { mode = 'production', outputPath = path.resolve(__dirname, 'build') } = argv;
  const isProduction = mode === 'production';
  const { entry, patterns } = getConfig(outputPath, Boolean(argv.outputPath));

  const config = {
    entry,
    output: {
      path: outputPath,
      filename: '[name].js',
      library: {
        name: '[name]',
        type: 'self',
      },
      libraryTarget: 'window',
      clean: isProduction
    },
    optimization: {
      minimize: isProduction,
      usedExports: false,
      minimizer: [
        new TerserPlugin({
          extractComments: false,
        }),
      ],
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
      new CircularDependencyPlugin({
        exclude: /node_modules/,
        failOnError: true
      }),
      new CopyPlugin({ patterns })
    ]
  };
  return config;
};
