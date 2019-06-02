const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/main/index.js',
  module: {
    rules: [
      {
        test: /\.node$/,
        use: 'node-loader',
      },
      {
        test: /\.(m?js|node)$/,
        parser: { amd: false },
        use: {
          loader: '@marshallofsound/webpack-asset-relocator-loader',
          options: {
            outputAssetBase: 'native_modules',
          },
        },
      }
    ]
  },
  plugins: [
    new CopyPlugin([
      { from: 'src/main/sensor/', to: 'sensor' }
    ])
  ]
};
