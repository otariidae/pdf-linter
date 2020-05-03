const path = require("path")

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
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
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
