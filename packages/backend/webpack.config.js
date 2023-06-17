require("../../.pnp.cjs").setup()
const path = require('path');
const PnpWebpackPlugin = require('pnp-webpack-plugin');
const slsw = require('serverless-webpack');
const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin;
const nodeExternals = require('webpack-node-externals');


module.exports = {
  mode: slsw.lib.webpack.isLocal ? "development" : "production",
  optimization: {
		minimize: false
	},
  devtool: 'source-map',
  plugins: [
    new ModuleFederationPlugin({
      shared: [{
          'library': {
            import: 'library',
            eager: true
          }
      }],
    }),
  ],
  entry: slsw.lib.entries,
  externals: [nodeExternals()],
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
        test: /\.tsx?$/,
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
};
