const path = require('path');
const StylelintPlugin = require('stylelint-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    publicPath: '/dist/',
    watchOptions: {
      ignored: ['dist', 'node_modules']
    }
  },
  plugins: [new StylelintPlugin({
    context: './style/',
    files: '*.less',
    fix: true
  })],
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
                    contexts: './src/contexts',
                    i18n: './i18n'
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
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          { loader: 'less-loader', options: { sourceMap: true } },
        ]
      },
      {
        test: /\.json$/,
        include: [path.resolve(__dirname, "i18n")],
        use: [
          {
            loader: 'banana-i18n-loader',
          },
        ],
      },
    ]
  }
};
