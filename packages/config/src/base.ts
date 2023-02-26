import "webpack-dev-server";
import coreConfig from "./core.js";
import cssConfig from "./css.js";
import { envRaw } from "./env.js";
import htmlConfig from "./html.js";
import { createConfig, extendConfig } from "./index.js";
import jsConfig from "./js.js";
import svgConfig from "./svg.js";

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
  const config = createConfig();

  extendConfig(config, coreConfig());
  extendConfig(config, htmlConfig());
  extendConfig(config, jsConfig());
  extendConfig(config, svgConfig());
  extendConfig(config, cssConfig());

  return config;
}
