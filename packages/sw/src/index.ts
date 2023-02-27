import type { ReacteaConfig } from "@reactea/config";
import { createConfig } from "@reactea/config";
import { resolveModule, srcDir } from "@reactea/config/consts";
import { join } from "node:path";
import { InjectManifest } from "workbox-webpack-plugin";

export default async function swConfig(): Promise<ReacteaConfig> {
  const swSrc = await resolveModule(join(srcDir, "service-worker"));

  if (!swSrc) throw new TypeError("Couldn't find src/service-worker script.");

  return createConfig({
    plugins: [
      new InjectManifest({
        swSrc,
        dontCacheBustURLsMatching: /\.[0-9a-f]{8}\./,
        exclude: [/\.map$/, /asset-manifest\.json$/, /LICENSE/],
        // Bump up the default maximum size (2mb) that's precached,
        // to make lazy-loading failure scenarios less likely.
        // See https://github.com/cra-template/pwa/issues/13#issuecomment-722667270
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      }),
    ],
  });
}
