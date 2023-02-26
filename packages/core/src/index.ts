import coreConfig from "./core.js";
import cssConfig from "./css.js";
import htmlConfig from "./html.js";
import imageConfig from "./image.js";
import jsConfig from "./js.js";
import svgConfig from "./svg.js";
import { createConfig, extendConfig } from "@reactea/config";

export default function baseConfig() {
  const config = createConfig();

  extendConfig(config, coreConfig());
  extendConfig(config, htmlConfig());
  extendConfig(config, jsConfig());
  extendConfig(config, svgConfig());
  extendConfig(config, cssConfig());
  extendConfig(config, imageConfig());

  return config;
}
