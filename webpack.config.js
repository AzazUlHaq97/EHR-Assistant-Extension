const path = require('path');

module.exports = {
  entry: './background.js', // Entry point where you will use the SDK
  output: {
    filename: 'background.bundle.js', // This is the bundled file
    path: path.resolve(__dirname, 'dist')
  },
  mode: 'production'
};
