const path = require("path")

module.exports = {
  context: __dirname,
  node: {
    fs: "empty",
    module: "empty"
  },
  entry: {
    bundle: "./src/index.js",
    worker: "pdfjs-dist/build/pdf.worker.entry.js"
  },
  mode: "development",
  devtool: "source-map",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js"
  }
}
