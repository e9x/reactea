import { createConfig } from "@reactea/config";
import {
  emitErrorsAsWarnings,
  isDevelopment,
  shouldLint,
  appDir,
} from "@reactea/config/consts";
import { envRawStringified } from "@reactea/config/env";
import CaseSensitivePathsPlugin from "@umijs/case-sensitive-paths-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import ESLintWebpackPlugin from "eslint-webpack-plugin";
import { join, resolve } from "node:path";
import ModuleNotFoundPlugin from "react-dev-utils/ModuleNotFoundPlugin.js";
import formatter from "react-dev-utils/eslintFormatter.js";
import webpack from "webpack";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

export default function coreConfig() {
  return createConfig({
    plugins: [
      // unused assets
      new CleanWebpackPlugin(),
      // This gives some necessary context to module not found errors, such as
      // the requesting resource.
      new ModuleNotFoundPlugin(resolve(".")),
      // Makes some environment variables available to the JS code, for example:
      // if (process.env.NODE_ENV === 'production') { ... }. See `@reactea/config/env`.
      // It is absolutely essential that NODE_ENV is set to production
      // during a production build.
      // Otherwise React will be compiled in the very slow development mode.
      new webpack.DefinePlugin({
        "process.env": envRawStringified,
      }),
      // Watcher doesn't work well if you mistype casing in a path so we use
      // a plugin that prints an error when you attempt to do this.
      // See https://github.com/facebook/create-react-app/issues/240
      ...(isDevelopment ? [new CaseSensitivePathsPlugin()] : []),
      ...(process.env.WEBPACK_BUNDLE_ANALYZER === "true"
        ? [
            new BundleAnalyzerPlugin({
              analyzerMode: "static",
            }),
          ]
        : []),
      ...(shouldLint
        ? [
            new ESLintWebpackPlugin({
              // Plugin options
              extensions: ["js", "mjs", "jsx", "ts", "tsx"],
              formatter,
              eslintPath: "eslint",
              failOnError: !(isDevelopment && emitErrorsAsWarnings),
              cache: true,
              cacheLocation: join(
                appDir,
                "node_modules",
                ".cache",
                ".eslintcache"
              ),
            }),
          ]
        : []),
    ],
  });
}
