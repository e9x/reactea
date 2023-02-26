import type { ReacteaConfig } from "@reactea/config";
import { createConfig } from "@reactea/config";
import { shouldUseSourceMap } from "@reactea/config/base";
import { getStyleLoaders } from "@reactea/config/css";
import { createRequire } from "node:module";
import getCSSModuleLocalIdent from "react-dev-utils/getCSSModuleLocalIdent.js";

const require = createRequire(import.meta.url);

const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

export default function sassConfig(): ReacteaConfig {
  return createConfig({
    oneOf: [
      // Opt-in support for SASS (using .scss or .sass extensions).
      // By default we support SASS Modules with the
      // extensions .module.scss or .module.sass
      {
        test: sassRegex,
        exclude: sassModuleRegex,
        use: getStyleLoaders(
          {
            importLoaders: 3,
            sourceMap: shouldUseSourceMap,
            modules: {
              mode: "icss",
            },
          },
          {
            loader: "sass-loader",
            options: {
              implementation: require.resolve("sass"),
              sourceMap: true,
            },
          }
        ),
        // Don't consider CSS imports dead code even if the
        // containing package claims to have no side effects.
        // Remove this when webpack adds a warning or an error for this.
        // See https://github.com/webpack/webpack/issues/6571
        sideEffects: true,
      },
      // Adds support for CSS Modules, but using SASS
      // using the extension .module.scss or .module.sass
      {
        test: sassModuleRegex,
        use: getStyleLoaders(
          {
            importLoaders: 3,
            sourceMap: shouldUseSourceMap,
            modules: {
              mode: "local",
              getLocalIdent: getCSSModuleLocalIdent,
            },
          },
          {
            loader: "sass-loader",
            options: {
              implementation: require.resolve("sass"),
              sourceMap: true,
            },
          }
        ),
      },
    ],
  });
}
