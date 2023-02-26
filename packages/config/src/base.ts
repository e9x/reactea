import "webpack-dev-server";
import { envRaw, envRawStringified } from "./env.js";
import { appDir } from "./consts.js";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import CaseSensitivePathsPlugin from "@umijs/case-sensitive-paths-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import ESLintWebpackPlugin from "eslint-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { join, resolve } from "node:path";
import formatter from "react-dev-utils/eslintFormatter.js";
import InlineChunkHtmlPlugin from "react-dev-utils/InlineChunkHtmlPlugin.js";
import InterpolateHtmlPlugin from "react-dev-utils/InterpolateHtmlPlugin.js";
import ModuleNotFoundPlugin from "react-dev-utils/ModuleNotFoundPlugin.js";
import getCSSModuleLocalIdent from "react-dev-utils/getCSSModuleLocalIdent.js";
import type { RuleSetRule } from "webpack";
import webpack from "webpack";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import { createRequire } from "node:module";
import type { CSSLoaderOptions } from "../css-loader.js";
import type { ReacteaConfig } from "./index.js";

const require = createRequire(import.meta.url);

export const shouldLint = process.env.DISABLE_LINT !== "true";

// Source maps are resource heavy and can cause out of memory issue for large source files.
export const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== "false";

// Some apps do not need the benefits of saving a web request, so not inlining the chunk
// makes for a smoother build process.
export const shouldInlineRuntimeChunk =
  process.env.INLINE_RUNTIME_CHUNK !== "false";

export const emitErrorsAsWarnings = process.env.ESLINT_NO_DEV_ERRORS === "true";

export const imageInlineSizeLimit = parseInt(
  process.env.IMAGE_INLINE_SIZE_LIMIT || "10000"
);

// style files regexes
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;

export const isDevelopment = process.env.NODE_ENV !== "production";

// Variable used for enabling profiling in Production
// passed into alias object. Uses a flag if passed into the build command
export const isEnvProductionProfile =
  !isDevelopment && process.argv.includes("--profile");

export const shouldUseReactRefresh = envRaw.FAST_REFRESH;

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

export default function baseConfig(): ReacteaConfig {
  return {
    oneOf: [
      // "url" loader works like "file" loader except that it embeds assets
      // smaller than specified limit in bytes as data URLs to avoid requests.
      // A missing `test` is equivalent to a match.
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.avif$/],
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: imageInlineSizeLimit,
          },
        },
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: require.resolve("@svgr/webpack"),
            options: {
              prettier: false,
              svgo: false,
              svgoConfig: {
                plugins: [{ removeViewBox: false }],
              },
              titleProp: true,
              ref: true,
            },
          },
          {
            loader: require.resolve("file-loader"),
            options: {
              name: "static/media/[name].[hash].[ext]",
            },
          },
        ],
        issuer: {
          and: [/\.(ts|tsx|js|jsx|md|mdx)$/],
        },
      },
      // Process application JS with SWC.
      // The preset includes JSX, Flow, TypeScript, and some ESnext features.
      {
        test: /\.[mc]?[jt]sx?$/,
        include: join(appDir, "src"),
        loader: require.resolve("swc-loader"),
        options: {
          sourceMaps: shouldUseSourceMap,
          minify: !isDevelopment,
          jsc: {
            parser: {
              syntax: "typescript",
              tsx: true,
              decorators: false,
              dynamicImport: true,
            },
            transform: {
              react: {
                runtime: "automatic",
                development: isDevelopment,
              },
            },
            target: "es2015",
            externalHelpers: true,
          },
        },
      },
      // Process any JS outside of the app with SWC.
      // Unlike the application JS, we only compile the standard ES features.
      {
        test: /\.(js|mjs)$/,
        exclude: /@swc(?:\/|\\{1,2})helpers/,
        loader: require.resolve("swc-loader"),
        options: {
          minify: !isDevelopment,
          sourceMaps: shouldUseSourceMap,
          jsc: {
            target: "es2015",
            externalHelpers: true,
          },
        },
      },
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
      // unused assets
      new CleanWebpackPlugin(),
      // Generates an `index.html` file with the <script> injected.
      new HtmlWebpackPlugin({
        inject: true,
        template: join(appDir, "public", "index.html"),
      }),
      // Inlines the webpack runtime script. This script is too small to warrant
      // a network request.
      // https://github.com/facebook/create-react-app/issues/5358
      ...(!isDevelopment && shouldInlineRuntimeChunk
        ? [new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/])]
        : []),
      // Makes some environment variables available in index.html.
      // The public URL is available as %PUBLIC_URL% in index.html, e.g.:
      // <link rel="icon" href="%PUBLIC_URL%/favicon.ico">
      // It will be an empty string unless you specify "homepage"
      // in `package.json`, in which case it will be the pathname of that U
      new InterpolateHtmlPlugin(HtmlWebpackPlugin, envRaw),
      // This gives some necessary context to module not found errors, such as
      // the requesting resource.
      new ModuleNotFoundPlugin(resolve(".")),
      // Makes some environment variables available to the JS code, for example:
      // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
      // It is absolutely essential that NODE_ENV is set to production
      // during a production build.
      // Otherwise React will be compiled in the very slow development mode.
      new webpack.DefinePlugin({
        "process.env": envRawStringified,
      }),
      // Experimental hot reloading for React .
      // https://github.com/facebook/react/tree/main/packages/react-refresh
      ...(isDevelopment && shouldUseReactRefresh
        ? [
            new ReactRefreshWebpackPlugin({
              overlay: false,
            }),
          ]
        : []),
      // Watcher doesn't work well if you mistype casing in a path so we use
      // a plugin that prints an error when you attempt to do this.
      // See https://github.com/facebook/create-react-app/issues/240
      ...(isDevelopment && new CaseSensitivePathsPlugin(),
      !isDevelopment
        ? [
            new MiniCssExtractPlugin({
              // Options similar to the same options in webpackOptions.output
              // both options are optional
              filename: "static/css/[name].[contenthash:8].css",
              chunkFilename: "static/css/[name].[contenthash:8].chunk.css",
            }),
          ]
        : []),
      ...(process.env.WEBPACK_BUNDLE_ANALYZER === "true"
        ? [
            new BundleAnalyzerPlugin({
              analyzerMode: "static",
            }),
          ]
        : []),
      ...(shouldLint ? [new ForkTsCheckerWebpackPlugin()] : []),
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
  };
}
