import type { CSSLoaderOptions } from "../css-loader.js";
import { isDevelopment, shouldUseSourceMap } from "./base.js";
import { appDir } from "./consts.js";
import { createConfig, ReacteaConfig } from "./index.js";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import getCSSModuleLocalIdent from "react-dev-utils/getCSSModuleLocalIdent.js";
import type { RuleSetRule } from "webpack";

const require = createRequire(import.meta.url);

// style files regexes
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;

// common function to get style loaders
export const getStyleLoaders = (
  cssOptions: CSSLoaderOptions,
  preProcessor?: RuleSetRule
) => {
  const loaders: RuleSetRule[] = [
    ...(isDevelopment
      ? [
          {
            loader: require.resolve("style-loader"),
          },
        ]
      : []),
    ...(!isDevelopment
      ? [
          {
            loader: MiniCssExtractPlugin.loader,
            // css is located in `static/css`, use '../../' to locate index.html folder
            // in production `paths.publicUrlOrPath` can be a relative path
          },
        ]
      : []),
    {
      loader: require.resolve("css-loader"),
      options: cssOptions,
    },

    {
      // Options for PostCSS as we reference these options twice
      // Adds vendor prefixing based on your specified browser support in
      // package.json
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          // Necessary for external CSS imports to work
          // https://github.com/facebook/create-react-app/issues/2677
          ident: "postcss",
          config: false,
          plugins: [
            "postcss-flexbugs-fixes",
            [
              "postcss-preset-env",
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
        },
        sourceMap: shouldUseSourceMap,
      },
    },
  ];

  if (preProcessor) {
    loaders.push(
      {
        loader: require.resolve("resolve-url-loader"),
        options: {
          sourceMap: shouldUseSourceMap,
          root: resolve("src", appDir),
        },
      },
      preProcessor
    );
  }
  return loaders as (RuleSetRule | string)[];
};

export default function cssConfig(): ReacteaConfig {
  return createConfig({
    oneOf: [
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
        use: getStyleLoaders({
          importLoaders: 1,
          sourceMap: shouldUseSourceMap,
          modules: {
            mode: "icss",
          },
        }),
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
        use: getStyleLoaders({
          importLoaders: 1,
          sourceMap: shouldUseSourceMap,
          modules: {
            mode: "local",
            getLocalIdent: getCSSModuleLocalIdent,
          },
        }),
      },
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
