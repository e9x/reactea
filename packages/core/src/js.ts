import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import { createConfig } from "@reactea/config";
import {
  isDevelopment,
  shouldLint,
  shouldUseReactRefresh,
  shouldUseSourceMap,
  isEnvProductionProfile,
  moduleFileExtensions,
  srcDir,
} from "@reactea/config/consts";
import type { JsMinifyOptions } from "@swc/core";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import { createRequire } from "node:module";
import TerserPlugin from "terser-webpack-plugin";

const require = createRequire(import.meta.url);

export default function jsConfig() {
  return createConfig({
    oneOf: [
      // Process application JS with SWC.
      // The preset includes JSX, Flow, TypeScript, and some ESnext features.
      {
        test: /\.[mc]?[jt]sx?$/,
        include: srcDir,
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
            externalHelpers: false,
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
            externalHelpers: false,
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
    resolve: {
      alias: [
        // Support React Native Web

        // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
        {
          name: "react-native",
          alias: "react-native-web",
        },
        // Allows for better profiling with ReactDevTools
        ...(isEnvProductionProfile
          ? [
              { name: "react-dom$", alias: "react-dom/profiling" },
              {
                name: "scheduler/tracing",
                alias: "scheduler/tracing-profiling",
              },
            ]
          : []),
      ],
      extensions: moduleFileExtensions,
    },
  });
}
