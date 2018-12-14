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
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              ["@babel/preset-env", { targets: "last 1 Chrome version" }],
              "@babel/preset-react"
            ]
          }
        }
      }
    ]
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js"
  }
}
