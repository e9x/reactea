import "webpack-dev-server";
import { appDir } from "./consts.js";
import cssConfig from "./css.js";
import { envRaw, envRawStringified } from "./env.js";
import { createConfig, extendConfig } from "./index.js";
import jsConfig from "./js.js";
import svgConfig from "./svg.js";
import CaseSensitivePathsPlugin from "@umijs/case-sensitive-paths-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import ESLintWebpackPlugin from "eslint-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { createRequire } from "node:module";
import { join, resolve } from "node:path";
import InlineChunkHtmlPlugin from "react-dev-utils/InlineChunkHtmlPlugin.js";
import InterpolateHtmlPlugin from "react-dev-utils/InterpolateHtmlPlugin.js";
import ModuleNotFoundPlugin from "react-dev-utils/ModuleNotFoundPlugin.js";
import formatter from "react-dev-utils/eslintFormatter.js";
import webpack from "webpack";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

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

export const isDevelopment = process.env.NODE_ENV !== "production";

// Variable used for enabling profiling in Production
// passed into alias object. Uses a flag if passed into the build command
export const isEnvProductionProfile =
  !isDevelopment && process.argv.includes("--profile");

export const shouldUseReactRefresh = envRaw.FAST_REFRESH;

export default function baseConfig() {
  const config = createConfig({
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

  extendConfig(config, jsConfig());
  extendConfig(config, svgConfig());
  extendConfig(config, cssConfig());

  return config;
}
