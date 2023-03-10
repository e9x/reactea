import {
  isDevelopment,
  shouldUseSourceMap,
  appDir,
  entryPoint,
  distDir,
} from "./consts.js";
import { envRawHash } from "./env.js";
import type { CSSLoader, PostCSSPlugin } from "./postcss.js";
import { compileCSSLoader } from "./postcss.js";
import { createRequire } from "node:module";
import { join } from "node:path";
import type {
  RuleSetRule,
  Configuration,
  Compiler,
  WebpackPluginInstance,
} from "webpack";
import type { Configuration as DevServerConfiguration } from "webpack-dev-server";

const require = createRequire(import.meta.url);

export interface ReacteaConfig {
  oneOf: RuleSetRule[];
  cssLoaders: CSSLoader[];
  postCSSPlugins: PostCSSPlugin[];
  plugins: (
    | ((this: Compiler, compiler: Compiler) => void)
    | WebpackPluginInstance
  )[];
  minimizers: (
    | ((this: Compiler, compiler: Compiler) => void)
    | WebpackPluginInstance
    | "..."
  )[];
  resolve: {
    extensions: string[];
    alias: {
      /**
       * New request.
       */
      alias: string | false | string[];
      /**
       * Request to be redirected.
       */
      name: string;
      /**
       * Redirect only exact matching request.
       */
      onlyModule?: boolean;
    }[];
  };
}

interface PartialReacteaConfig extends Partial<Omit<ReacteaConfig, "resolve">> {
  resolve?: Partial<ReacteaConfig["resolve"]>;
}

export function createConfig(config: PartialReacteaConfig = {}): ReacteaConfig {
  return {
    oneOf: config.oneOf || [],
    cssLoaders: config.cssLoaders || [],
    postCSSPlugins: config.postCSSPlugins || [],
    plugins: config.plugins || [],
    minimizers: config.minimizers || [],
    resolve: {
      alias: config.resolve?.alias || [],
      extensions: config.resolve?.extensions || [],
    },
  };
}

export function extendConfig(config: ReacteaConfig, extension: ReacteaConfig) {
  config.oneOf.push(...extension.oneOf);
  config.cssLoaders.push(...extension.cssLoaders);
  config.postCSSPlugins.push(...extension.postCSSPlugins);
  config.plugins.push(...extension.plugins);
  config.minimizers.push(...extension.minimizers);
  config.resolve.alias.push(...extension.resolve.alias);
  config.resolve.extensions.push(...extension.resolve.extensions);
}

export function compileConfig(
  reacteaConfig: ReacteaConfig,
  devServer: DevServerConfiguration = {}
) {
  const config: Configuration = {
    target: "browserslist",
    devServer: {
      port: 3000,
      // https://webpack.js.org/configuration/dev-server/#devserverhistoryapifallback
      // to test 404 pages
      historyApiFallback: true,
      ...devServer,
    },
    // Webpack noise constrained to errors and warnings
    // stats: 'errors-warnings',
    mode: isDevelopment ? "development" : "production",
    // Stop compilation early in production
    // bail: isEnvProduction,
    devtool: isDevelopment ? "eval" : shouldUseSourceMap ? "source-map" : false,
    // These are the "entry points" to our application.
    // This means they will be the "root" imports that are included in JS bundle.
    entry: entryPoint,
    output: {
      // The build folder.
      path: distDir,
      // Add /* filename */ comments to generated require()s in the output.
      pathinfo: isDevelopment,
      // There will be one main bundle, and one file per asynchronous chunk.
      // In development, it does not produce real files.
      filename: isDevelopment
        ? "static/js/bundle.js"
        : "static/js/[name].[contenthash:8].js",
      // There are also additional JS chunk files if you use code splitting.
      chunkFilename: isDevelopment
        ? "static/js/[name].chunk.js"
        : "static/js/[name].[contenthash:8].chunk.js",
      assetModuleFilename: "static/media/[name].[hash][ext]",
      // webpack uses `publicPath` to determine where the app is being served from.
      // It requires a trailing slash, or the file assets will get an incorrect path.
      // We inferred the "public path" (such as / or /my-project) from homepage.
      publicPath: process.env.PUBLIC_URL + "/",
    },
    cache: {
      type: "filesystem",
      version: envRawHash,
      cacheDirectory: join(appDir, "node_modules", ".cache"),
      store: "pack",
    },
    resolve: {
      // These are the reasonable defaults supported by the Node ecosystem.
      // We also include JSX as a common component filename extension to support
      // some tools, although we do not recommend using it, see:
      // https://github.com/facebook/create-react-app/issues/290
      // `web` extension prefixes have been added for better support
      // for React Native Web.
      extensions: reacteaConfig.resolve.extensions,
      alias: reacteaConfig.resolve.alias,
    },
    optimization: {
      minimize: !isDevelopment,
      minimizer: reacteaConfig.minimizers,
    },
    module: {
      strictExportPresence: true,
      rules: [
        // Handle node_modules packages that contain sourcemaps
        ...(shouldUseSourceMap
          ? [
              {
                enforce: "pre",
                test: /\.(js|mjs|jsx|ts|tsx|css)$/,
                exclude: /@swc(?:\/|\\{1,2})helpers/,
                loader: require.resolve("source-map-loader"),
              } as {
                // the type is lost for some reason
                // enforce MUST be "pre"
                enforce: "pre";
                test: RegExp;
                exclude: RegExp;
                loader: string;
              },
            ]
          : []),
        {
          // "oneOf" will traverse all following loaders until one will
          // match the requirements. When no loader matches it will fall
          // back to the "file" loader at the end of the loader list.
          oneOf: [
            ...reacteaConfig.oneOf,
            ...reacteaConfig.cssLoaders.map((loader) =>
              compileCSSLoader(loader, reacteaConfig.postCSSPlugins)
            ),
            // "file" loader makes sure those assets get served by WebpackDevServer.
            // When you `import` an asset, you get its (virtual) filename.
            // In production, they would get copied to the `build` folder.
            // This loader doesn't use a "test" so it will catch all modules
            // that fall through the other loaders.
            {
              // Exclude `js` files to keep "css" loader working as it injects
              // its runtime that would otherwise be processed through "file" loader.
              // Also exclude `html` and `json` extensions so they get processed
              // by webpacks internal loaders.
              exclude: [/^$/, /\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
              type: "asset/resource",
            },
          ],
        },
      ],
    },
    plugins: reacteaConfig.plugins,
  };

  return config;
}
