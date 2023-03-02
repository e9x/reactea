import { createConfig } from "@reactea/config";
import {
  isDevelopment,
  shouldInlineRuntimeChunk,
  publicDir,
  distDir,
} from "@reactea/config/consts";
import { envRaw } from "@reactea/config/env";
import type { Filter } from "copy-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { join } from "node:path";
import InlineChunkHtmlPlugin from "react-dev-utils/InlineChunkHtmlPlugin.js";
import InterpolateHtmlPlugin from "react-dev-utils/InterpolateHtmlPlugin.js";

/**
 *
 * @param htmlFiles key: filename, value: template path
 * @param copyFilter Callback for CopyPlugin.
 */
export default function htmlConfig(
  options: {
    htmlFiles?: Record<string, string>;
    copyFilter?: Filter;
  } = {}
) {
  const htmlFiles = options.htmlFiles || {
    "index.html": join(publicDir, "index.html"),
  };

  const copyFilter =
    options.copyFilter || ((f) => f !== join(publicDir, "index.html"));

  return createConfig({
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: publicDir,
            to: distDir,
            filter: copyFilter,
          },
        ],
      }),
      // Generates an `index.html` file with the <script> injected.
      ...Object.entries(htmlFiles).map(
        ([filename, template]) =>
          new HtmlWebpackPlugin({
            inject: true,
            filename,
            template,
          })
      ),
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
    ],
  });
}
