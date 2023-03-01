# `@reactea/sw`

<a href="https://www.npmjs.com/package/@reactea/sw"><img src="https://img.shields.io/npm/v/@reactea/sw.svg?maxAge=3600" alt="npm version" /></a>

`@reactea/sw` is a Webpack configuration package that provides the basic configuration for a Service Worker in a Progressive Web Application (PWA). It is designed to be extendable and configurable via other `@reactea` packages.

### Installation

To install `@reactea/sw`, run the following command:

```bash
npm install --save-dev @reactea/sw
```

### Usage

In your `webpack.config.js` file, import `@reactea/sw` and call the default export function to obtain the configuration for a Service Worker.

```js
import { createConfig, extendConfig } from "@reactea/config";
import swConfig from "@reactea/sw";

export default function myConfig() {
  const config = createConfig();

  extendConfig(reactea, swConfig());

  return config;
}
```

### Configuration

`@reactea/sw` provides a configuration object for generating the Service Worker script with the `InjectManifest` plugin from `workbox-webpack-plugin`. By default, it injects the Service Worker script from the `src/service-worker.js` file, and precaches all assets except for `.map`, `asset-manifest.json`, and `LICENSE` files. It also increases the maximum file size that can be precached to 5MB.
