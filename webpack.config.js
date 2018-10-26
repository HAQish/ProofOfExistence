const webpack = require("webpack");
const path = require("path");

module.exports = {
  mode: "production",
  entry: ["@babel/polyfill", "./client/src/index.jsx"],
  output: {
    path: path.resolve(__dirname, "client/dist/"),
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: "babel-loader",
        options: {
          presets: [
            "@babel/env",
            "@babel/react"
          ]
        }
      }
    ]
  },
  devtool: "source-map"
}