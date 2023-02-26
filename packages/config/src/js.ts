import {
  isDevelopment,
  shouldLint,
  shouldUseReactRefresh,
  shouldUseSourceMap,
} from "./base.js";
import { appDir } from "./consts.js";
import { createConfig } from "./index.js";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import type { JsMinifyOptions } from "@swc/core";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import { createRequire } from "node:module";
import { join } from "node:path";
import TerserPlugin from "terser-webpack-plugin";

const require = createRequire(import.meta.url);

export default function jsConfig() {
  return createConfig({
    oneOf: [
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
    ],
    plugins: [
      // Experimental hot reloading for React .
      // https://github.com/facebook/react/tree/main/packages/react-refresh
      ...(isDevelopment && shouldUseReactRefresh
        ? [
            new ReactRefreshWebpackPlugin({
              overlay: false,
            }),
          ]
        : []),
      ...(shouldLint ? [new ForkTsCheckerWebpackPlugin()] : []),
    ],
    minimizers: [
      new TerserPlugin<JsMinifyOptions>({
        minify: TerserPlugin.swcMinify,
      }),
    ],
  });
}
