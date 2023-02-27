import type { CSSLoaderOptions } from "../css-loader.js";
import { appDir, isDevelopment, shouldUseSourceMap } from "./consts.js";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import type { RuleSetRule } from "webpack";

const require = createRequire(import.meta.url);

export interface CSSLoader extends Exclude<RuleSetRule, "use"> {
  cssOptions: CSSLoaderOptions;
  preProcessor?: RuleSetRule;
}

export type PostCSSPlugin = string | [string, any];

export function compileCSSLoader(
  loader: CSSLoader,
  postCSSPlugins: PostCSSPlugin[]
) {
  const c: Partial<CSSLoader> & Partial<RuleSetRule> = { ...loader };
  delete c.cssOptions;
  delete c.preProcessor;
  c.use = getStyleLoaders(
    loader.cssOptions,
    loader.preProcessor,
    postCSSPlugins
  );
  return c as RuleSetRule;
}

// common function to get style loaders
function getStyleLoaders(
  cssOptions: CSSLoaderOptions,
  preProcessor: RuleSetRule | undefined,
  postCSSPlugins: PostCSSPlugin[]
) {
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
          plugins: postCSSPlugins,
        },
        sourceMap: shouldUseSourceMap,
      },
    },
  ];

  if (preProcessor)
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

  return loaders as (RuleSetRule | string)[];
}
