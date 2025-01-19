const webpack = require('webpack');

module.exports = {
  resolve: {
    fallback: {
      global: require.resolve('global'),
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      global: require.resolve('global'),
    }),
  ],
};
