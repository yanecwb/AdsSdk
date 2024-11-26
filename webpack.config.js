const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: "./index.ts",
  output: {
    filename: "index.min.js",
    path: path.resolve(__dirname, "dist"),
    library: "MyLibrary",
    libraryTarget: "umd",
    globalObject: "this",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.ts$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-typescript"],
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    minimize: true, // zip
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: true,
          mangle: true, // Confusing variable names
        },
      }),
    ],
  },
  mode: "production",
};
