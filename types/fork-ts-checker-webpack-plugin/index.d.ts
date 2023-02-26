/**
 * Shim because fork-ts-checker-webpack-plugin causes countless typescript errors
 */

import type { WebpackPluginInstance } from "webpack";

export default class ForkTsCheckerWebpackPlugin
  implements WebpackPluginInstance
{
  apply(): void;
}
