import { isDevelopment, shouldInlineRuntimeChunk, appDir } from "./consts.js";
import { envRaw } from "./env.js";
import { createConfig } from "./index.js";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { join } from "node:path";
import InlineChunkHtmlPlugin from "react-dev-utils/InlineChunkHtmlPlugin.js";
import InterpolateHtmlPlugin from "react-dev-utils/InterpolateHtmlPlugin.js";

export default function htmlConfig() {
  return createConfig({
    plugins: [
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
    ],
  });
}
