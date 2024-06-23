const path = require('path');

module.exports = {
  resolve: {
    fallback: {
        // stream: false
      stream: require.resolve('stream-browserify'),
      crypto: require.resolve('crypto-browserify'), // Add other polyfills as necessary
    },
  },
  // Other configurations...
};
