import type { ReacteaConfig } from "@reactea/config";
import { isPostCSSLoader } from "@reactea/core/css";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

/**
 * Injects TailwindCSS into your configuration.
 * Must be called after all modifications/before compiling the config.
 * @param config The current config.
 */
export default function loadTailwind(config: ReacteaConfig): ReacteaConfig {
  for (const rule of config.oneOf) {
    if (Array.isArray(rule.use))
      for (const use of rule.use)
        if (isPostCSSLoader(use))
          use.options.postcssOptions.plugins.unshift(
            require.resolve("tailwindcss")
          );
  }

  return config;
}
