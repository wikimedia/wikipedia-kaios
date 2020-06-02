const path = require('path')
const webpack = require('webpack');
const StylelintPlugin = require('stylelint-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    minimizer: [
      // keep the name when sending the error logging
      new TerserPlugin({
        terserOptions: {
          keep_classnames: true,
          keep_fnames: true
        }
      })
    ]
  },
  performance: {
    hints: false
  },
  devServer: {
    publicPath: '/dist/',
    watchOptions: {
      ignored: ['dist', 'node_modules']
    }
  },
  plugins: [
    new StylelintPlugin({
      context: './style/',
      files: '*.less',
      fix: true
    }),
    new webpack.DefinePlugin({
      APP_VERSION: JSON.stringify(require('./package.json').version),
      INSTRUMENTATION: JSON.stringify(!!parseInt(process.env.INSTRUMENTATION)),
      // "RANDOM" is already used in the terminal, so using just "RAND"
      RANDOM: JSON.stringify(!!parseInt(process.env.RAND)),
      DISABLE_REQUEST_HEADER: JSON.stringify(!!parseInt(process.env.DISABLE_REQUEST_HEADER))
    }),
    new webpack.EnvironmentPlugin()
  ],
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
      }
    ]
  }
};
