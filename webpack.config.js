const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const CopyPlugin = require("copy-webpack-plugin")

const outpath = path.join(__dirname, "dist")

module.exports = {
  context: __dirname,
  entry: {
    bundle: "./src/index.tsx",
    "bundle.worker": "pdfjs-dist/build/pdf.worker.entry.js",
  },
  mode: "development",
  devtool: "source-map",
  devServer: {
    static: {
      directory: outpath
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html"
    }),
    new CopyPlugin({
      patterns: [{ from: "node_modules/pdfjs-dist/cmaps", to: "cmaps" }]
    })
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
    path: outpath,
    filename: "[name].js",
    clean: true
  },
}
