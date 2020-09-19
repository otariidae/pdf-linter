const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  context: __dirname,
  node: {
    fs: "empty",
    module: "empty",
  },
  entry: {
    bundle: "./src/index.tsx",
    "bundle.worker": "pdfjs-dist/build/pdf.worker.entry.js",
  },
  mode: "development",
  devtool: "source-map",
  devServer: {
    contentBase: "./dist",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
  },
}
