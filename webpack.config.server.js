const path = require("path")
const externals = require("webpack-node-externals")

module.exports = {
  context: __dirname,
  entry: "./serve.ts",
  mode: "development",
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ["ts", "js"]
  },
  target: "node",
  externals: externals(),
  output: {
    path: __dirname,
    filename: "serve.js"
  }
}
