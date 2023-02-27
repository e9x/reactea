import { createConfig } from "@reactea/config";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

export default function tailwindConfig() {
  return createConfig({
    postCSSPlugins: [require.resolve("tailwindcss")],
  });
}
