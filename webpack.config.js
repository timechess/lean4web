const path = require("path");
const webpack = require('webpack');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');

module.exports = env => {
  const environment = process.env.NODE_ENV
  const isDevelopment = environment === 'development'

  const babelOptions = {
      presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
    plugins: [
      isDevelopment && require.resolve('react-refresh/babel'),
    ].filter(Boolean),
  };

  global.$RefreshReg$ = () => {};
  global.$RefreshSig$ = () => () => {};

  return {
    entry: ["./client/src/index.tsx"],
    mode: isDevelopment ? 'development' : 'production',
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: [/server/, /node_modules/],
          use: [{
            loader: require.resolve('babel-loader'),
            options: babelOptions,
          }]
        },
        {
          test: /\.tsx?$/,
          use: [{
            loader: 'ts-loader',
            options: { allowTsInNodeModules: true }
          }],
          exclude: /node_modules(?!\/lean4)/, // Allow .ts imports from node_modules/lean4
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"]
        },
        {
          test: /\.svg$/i,
          issuer: /\.[jt]sx?$/,
          use: [{
            loader: "@svgr/webpack",
            options: { dimensions: false }
          }],
        },
      ]
    },
    resolve: {
      extensions: ["*", ".js", ".jsx", ".tsx", ".ts"],
      fallback: {
        "http": require.resolve("stream-http") ,
         "path": require.resolve("path-browserify")
        },
    },
    output: {
      path: path.resolve(__dirname, "client/dist/"),
      filename: "bundle.js",
    },
    devServer: {
      proxy: {
        '/websocket': {
           target: 'ws://localhost:8080',
           ws: true
        },
      },
      static: path.join(__dirname, 'client/public/'),
      port: 3000,
      hot: true,
    },
    devtool: "source-map",
    plugins: [
      !isDevelopment && new WebpackShellPluginNext({
        onBuildEnd:{
          scripts: [
            // It's hard to set up webpack to copy the index.html correctly,
            // so we copy it explicitly after every build:
            'cp client/public/index.html client/dist/',
            // Similarly, I haven't been able to load `onigasm.wasm` properly:
            'cp client/public/onigasm.wasm client/dist/',
            // Also copy the example files
            'cp -R client/public/examples client/dist/examples',
          ],
          blocking: false,
          parallel: true
        }
      }),
      isDevelopment && new ReactRefreshWebpackPlugin(),
    ].filter(Boolean)
  };
}
