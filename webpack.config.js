const path = require("path");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: ["./bootstrap/js/index.js", "./bootstrap/style/save.scss"],
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "js/[name].bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.(scss)$/,
        use: [
            MiniCssExtractPlugin.loader,
          {
            loader: "css-loader?-url", // translates CSS into CommonJS modules
          },
          {
            loader: "postcss-loader", // Run post css actions
            options: {
              plugins: function () {
                // post css plugins, can be exported to postcss.config.js
                return [require("autoprefixer")];
              },
            },
          },
          {
            loader: "sass-loader", // compiles Sass to CSS
          },
        ],
      },
    ],
  },
  plugins: [new MiniCssExtractPlugin({filename: 'style/[name].css'})]
};
