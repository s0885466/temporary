const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const CopyPlugin = require("copy-webpack-plugin");
const {
  outputConfig,
  copyPluginPatterns,
  entryConfig,
  devServer,
} = require("./env.config");

const microStrScrypt = `promise new Promise(resolve => {
      const urlParams = new URLSearchParams(window.location.search)
      const version = urlParams.get('app1VersionParam')
      // This part depends on how you plan on hosting and versioning your federated modules
      const remoteUrlWithVersion = 'http://localhost:4000/remoteEntry.js'
      const script = document.createElement('script')
      script.src = remoteUrlWithVersion
      script.onload = () => {
        // the injected script has loaded and is available on window
        // we can now resolve this Promise
        const proxy = {
          get: (request) => window.microApp.get(request),
          init: (...arg) => {
            try {
              return window.microApp.init(...arg)
            } catch(e) {
              console.log('remote container already initialized')
            }
          }
        }
       
        resolve(proxy)
      }
      // inject this script with the src set to the versioned remoteEntry.js
      document.head.appendChild(script);
    })
    `;

module.exports = (env, options) => {
  return {
    mode: options.mode,
    entry: entryConfig,
    devServer,
    devtool: "inline-source-map",
    // Dev only
    // Target must be set to web for hmr to work with .browserlist
    // https://github.com/webpack/webpack-dev-server/issues/2758#issuecomment-710086019
    target: "web",
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: [
            // We're in dev and want HMR, SCSS is handled in JS
            // In production, we want our css as files
            "style-loader",
            "css-loader",
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  plugins: [["postcss-preset-env"]],
                },
              },
            },
          ],
        },
        {
          test: /\.(?:ico|gif|png|jpg|jpeg|svg)$/i,
          type: "javascript/auto",
          loader: "file-loader",
          options: {
            publicPath: "../",
            name: "[path][name].[ext]",
            context: path.resolve(__dirname, "src/assets"),
            emitFile: false,
          },
        },
        {
          test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
          type: "javascript/auto",
          exclude: /images/,
          loader: "file-loader",
          options: {
            publicPath: "../",
            context: path.resolve(__dirname, "src/assets"),
            name: "[path][name].[ext]",
            emitFile: false,
          },
        },
      ],
    },
    resolve: { extensions: [".tsx", ".ts", ".js"] },
    output: {
      filename: "js/[name].bundle.js",
      path: path.resolve(__dirname, outputConfig.destPath),
      publicPath: "",
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        inject: true,
        minify: false,
      }),
      new CopyPlugin(copyPluginPatterns),
      new ModuleFederationPlugin({
        name: "host",
        remotes: {
          // убираем все поскольку будем грузить микрофронт динамически
        },
        shared: {
          react: { singleton: true, eager: true },
          "react-dom": {
            requiredVersion: "18.2.0",
            singleton: true,
            eager: true,
          },
        },
      }),
    ],
  };
};
