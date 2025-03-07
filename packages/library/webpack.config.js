const path = require('path');
const PnpWebpackPlugin = require('pnp-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: "./index.ts",
  output: {
    libraryTarget: 'commonjs',
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  node: {
    __dirname: false,
  },
  module: {
    rules: [
      {
        test: function(path) {
          (path.endsWith('.ts') || path.endsWith('.tsx')) && !path.endsWith('test.ts');
        },
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [PnpWebpackPlugin],
  },
  resolveLoader: {
    plugins: [PnpWebpackPlugin.moduleLoader(module)],
  },
}