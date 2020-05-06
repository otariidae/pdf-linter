const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const TsConfigWebpackPlugin = require("ts-config-webpack-plugin")

module.exports = {
  context: __dirname,
  node: {
    fs: "empty",
    module: "empty",
  },
  entry: {
    bundle: "./src/hosting/index.tsx",
    "bundle.worker": "pdfjs-dist/build/pdf.worker.entry.js",
  },
  mode: "development",
  devtool: "source-map",
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/hosting/index.html",
    }),
    new TsConfigWebpackPlugin(),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    path: path.join(__dirname, "dist/hosting"),
    filename: "[name].js",
  },
}
