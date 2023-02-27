# `@reactea/tailwind`

This package provides a configuration function that can be used to integrate Tailwind CSS with `@reactea/config`.

## Usage

1. Install the `@reactea/tailwind` package:

```sh
npm install -D @reactea/tailwind
```

2. Add the configuration to your webpack configuration file:

```js
import { compileConfig, createConfig, extendConfig } from "@reactea/config";
import baseConfig from "@reactea/core";
import tailwindConfig from "@reactea/tailwind";

const reactea = createConfig();

extendConfig(reactea, baseConfig());
extendConfig(reactea, tailwindConfig());

const config = compileConfig(reactea);

export default config;
```

## Configuration

The `tailwindConfig()` function returns a `ReacteaConfig` object that can be passed to `createConfig()` and used to configure `@reactea/config`.

The configuration adds `tailwindcss` as a PostCSS plugin to the configuration.
