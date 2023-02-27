import type { ReacteaConfig } from "@reactea/config";
import { createConfig } from "@reactea/config";
import { isDevelopment, shouldUseSourceMap } from "@reactea/config/consts";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { createRequire } from "node:module";
import getCSSModuleLocalIdent from "react-dev-utils/getCSSModuleLocalIdent.js";

const require = createRequire(import.meta.url);

// style files regexes
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;

export default function cssConfig(): ReacteaConfig {
  return createConfig({
    cssLoaders: [
      // "postcss" loader applies autoprefixer to our CSS.
      // "css" loader resolves paths in CSS and adds assets as dependencies.
      // "style" loader turns CSS into JS modules that inject <style> tags.
      // In production, we use MiniCSSExtractPlugin to extract that CSS
      // to a file, but in development "style" loader enables hot editing
      // of CSS.
      // By default we support CSS Modules with the extension .module.css
      {
        test: cssRegex,
        exclude: cssModuleRegex,
        cssOptions: {
          importLoaders: 1,
          sourceMap: shouldUseSourceMap,
          modules: {
            mode: "icss",
          },
        },
        // Don't consider CSS imports dead code even if the
        // containing package claims to have no side effects.
        // Remove this when webpack adds a warning or an error for this.
        // See https://github.com/webpack/webpack/issues/6571
        sideEffects: true,
      },
      // Adds support for CSS Modules (https://github.com/css-modules/css-modules)
      // using the extension .module.css
      {
        test: cssModuleRegex,
        cssOptions: {
          importLoaders: 1,
          sourceMap: shouldUseSourceMap,
          modules: {
            mode: "local",
            getLocalIdent: getCSSModuleLocalIdent,
          },
        },
      },
    ],
    postCSSPlugins: [
      require.resolve("postcss-flexbugs-fixes"),
      [
        require.resolve("postcss-preset-env"),
        {
          autoprefixer: {
            flexbox: "no-2009",
          },
          stage: 3,
        },
      ],
      // Adds PostCSS Normalize as the reset css with default options,
      // so that it honors browserslist config in package.json
      // which in turn let's users customize the target behavior as per their needs.
      "postcss-normalize",
    ],
    plugins: [
      ...(!isDevelopment
        ? [
            new MiniCssExtractPlugin({
              // Options similar to the same options in webpackOptions.output
              // both options are optional
              filename: "static/css/[name].[contenthash:8].css",
              chunkFilename: "static/css/[name].[contenthash:8].chunk.css",
            }),
          ]
        : []),
    ],
    minimizers: [new CssMinimizerPlugin()],
  });
}
