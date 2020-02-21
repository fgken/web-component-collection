const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
const ManifestPlugin = require("webpack-manifest-plugin");
const webpack = require("webpack");

module.exports = function (webpackEnv) {
  const isEnvDevelopment = webpackEnv === "development";
  const isEnvProduction = webpackEnv === "production";

  return {
    mode: isEnvProduction ? "production" : isEnvDevelopment && "development",
    devtool: isEnvDevelopment && "inline-source-map",
    entry: {
      app: "./src/index.tsx"
    },
    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.tsx', '.json', '.jsx']
    },
    output: {
      filename: isEnvProduction
        ? "static/js/[name].[contenthash:8].js"
        : isEnvDevelopment && "static/js/bundle.js",
      path: path.resolve(__dirname, "dist")
    },
    plugins: [
      // Report progress during a compilation
      new webpack.ProgressPlugin(),
      // remove all files inside build directory
      new CleanWebpackPlugin(),
      // Generates an `index.html` file
      new HtmlWebpackPlugin({
        title: "Web Component Collection",
        template: "public/index.html"
      }),
      // Watcher doesn't work well if you mistype casing in a path so we use
      // a plugin that prints an error when you attempt to do this.
      // See https://github.com/facebook/create-react-app/issues/240
      isEnvDevelopment && new CaseSensitivePathsPlugin(),
      new MiniCssExtractPlugin({
        filename: "static/css/[name].[contenthash:8].css"
      }),
      // Generate an asset manifest file
      new ManifestPlugin()
    ].filter(Boolean),
    module: {
      rules: [
        {
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          loader: "babel-loader",
          options: {
            // It enables caching results for faster rebuilds.
            // See https://github.com/babel/babel-loader/issues/351#issuecomment-417968076
            // why cacheDirectory is true in development environment only.
            cacheDirectory: isEnvDevelopment,
            // See https://github.com/facebook/create-react-app/pull/6846
            // for context on why cacheCompression is disabled.
            cacheCompression: false
          }
        },
        {
          test: /\.(css|sass|scss)$/,
          exclude: /node_modules/,
          use: [
            // Inject CSS into the DOM.
            "style-loader",
            // Translates CSS into CommonJS
            "css-loader",
            // Compiles Sass to CSS
            "sass-loader"
          ]
        }
      ]
    }
  };
};
