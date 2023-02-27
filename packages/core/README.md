# `@reactea/core`

`@reactea/core` is a Webpack configuration package that provides the basic configuration for a React application. It is designed to be extendable and configurable via other `@reactea` packages.

Ideally, you'll only use `baseConfig` unless you're creating a custom base. Extensions should be compatible with `baseConfig`.

## Installation

To install `@reactea/core`, run the following command:

```sh
npm install --save-dev @reactea/core
```

## Usage

In your `webpack.config.js` file, import `@reactea/core` and call the default export function to obtain the base configuration.

```js
import { createConfig, extendConfig } from "@reactea/config";
import baseConfig from "@reactea/core/css";

export default function myConfig() {
  const config = createConfig();

  extendConfig(reactea, baseConfig());

  return config;
}
```

## Configuration

The base configuration includes the following:

- `coreConfig`: Basic Webpack configuration for a React application.
- `htmlConfig`: Configuration for generating an HTML file with Webpack and injecting the appropriate script tags.
- `jsConfig`: Configuration for processing JavaScript files with SWC and optionally enabling React Fast Refresh.
- `svgConfig`: Configuration for processing SVG files with the `@svgr/webpack` loader.
- `cssConfig`: Configuration for processing CSS files with PostCSS and the appropriate loaders.
- `imageConfig`: Configuration for processing image files with the `asset` loader.

These configurations can be extended or overridden via the `extendConfig` function provided by the `@reactea/config` package.

## Core Configuration

`@reactea/core/core` provides a configuration object for a basic Webpack configuration for a React application. It includes support for ESLint, process.env, and copying the `public` directory to the build output.

```js
import { createConfig, extendConfig } from "@reactea/config";
import coreConfig from "@reactea/core/core";

export default function myConfig() {
  const config = createConfig();

  extendConfig(reactea, coreConfig());

  return config;
}
```

## Configuration

The `coreConfig` object includes the following:

- `entry`: The entry point of the application, which defaults to `"./src/index.js"`.
- `output`: The output directory and filename for the generated JavaScript bundle, which defaults to `"dist/js/[name].[contenthash:8].js"`.
- `outputPath`: The output directory for generated files, which defaults to `"dist"`.
- `publicPath`: The public URL for the output directory, which defaults to `"/"`.
- `resolve`: Configuration for resolving modules.
- `module`: Configuration for processing files with loaders.
- `plugins`: A list of Webpack plugins to apply.

Note that `coreConfig` does not accept any parameters. If you need to customize the configuration,

## HTML Configuration

`@reactea/core/html` provides a configuration object for generating an HTML file with Webpack and injecting the appropriate script tags. By default, it generates an `index.html` file in the `public` directory, and injects the generated script tags. It also inlines the runtime chunk if the application is being built for production.

```js
import { createConfig, extendConfig } from "@reactea/config";
import htmlConfig from "@reactea/core/html";

export default function myBaseConfig() {
  const config = createConfig();

  // ...
  extendConfig(reactea, htmlConfig());

  return config;
}
```

### Parameters

- `htmlFiles` (default: `["index.html"]`): An array of HTML files to generate and inject script tags into.

## JS Configuration

`@reactea/core/js` provides a configuration object for processing JavaScript files with SWC and React Fast Refresh. By default, it includes support for TypeScript, JSX, Flow, and some ESnext features, and compiles application JS with SWC. It also includes experimental support for React Fast Refresh.

```js
import { createConfig, extendConfig } from "@reactea/config";
import jsConfig from "@reactea/core/js";

export default function myBaseConfig() {
  const config = createConfig();

  // ...
  extendConfig(reactea, jsConfig());

  return config;
}
```

## SVG Configuration

`@reactea/core/svg` provides a configuration object for processing SVG files with the `@svgr/webpack` loader. By default, it configures the loader to use the `@svgr/webpack` plugin to optimize SVG files and generate React components.

```js
import { createConfig, extendConfig } from "@reactea/config";
import svgConfig from "@reactea/core/svg";

export default function myBaseConfig() {
  const config = createConfig();

  // ...
  extendConfig(reactea, svgConfig());

  return config;
}
```

## CSS Configuration

`@reactea/core/css` provides a configuration object for processing CSS files with PostCSS and the appropriate loaders. By default, it includes support for importing CSS files and CSS modules.

```js
import { createConfig, extendConfig } from "@reactea/config";
import cssConfig from "@reactea/core/css";

export default function myBaseConfig() {
  const config = createConfig();

  // ...
  extendConfig(reactea, cssConfig());

  return config;
}
```

## Image Configuration

`@reactea/core/image` provides a configuration object for processing image files with the `asset` loader. By default, it includes support for BMP, GIF, JPEG, PNG, and AVIF images, and embeds small images as data URLs to avoid requests.

```js
import { createConfig, extendConfig } from "@reactea/config";
import baseConfig from "@reactea/core";

export default function myBaseConfig() {
  const config = createConfig();

  // ...
  extendConfig(reactea, baseConfig());

  return config;
}
```
