const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          fix: true
        }
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              [
                "@babel/plugin-transform-react-jsx",
                {
                  pragma: "h", // default pragma is React.createElement
                  pragmaFrag: "Fragment", // default is React.Fragment
                  throwIfNamespace: false // defaults to true
                }
              ],
              [
                "module-resolver",
                {
                  root: ["./src"],
                  alias: {
                    components: './src/components',
                    hooks: './src/hooks',
                    api: './src/api',
                    contexts: './src/contexts'
                  }
                }
              ]
            ],
            presets: [
                [
                  "@babel/preset-env",
                  {
                    targets: "firefox 37"
                  }
                ]
              ]
          }
        }
      }
    ]
  }
};
