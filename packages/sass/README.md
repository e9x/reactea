# `@reactea/sass`

A plugin for `@reactea/config` that adds support for SASS stylesheets.

This handles .module.scss, .module.sass, .scss, and .sass files.

## Installation

```
npm install --save-dev @reactea/sass
```

## Usage

In your `webpack.config.js` file, import `@reactea/sass` and call the default export function to obtain the configuration for SASS.

webpack.config.js:

```js
import { compileConfig, createConfig, extendConfig } from "@reactea/config";
import sassConfig from "@reactea/sass";

const reactea = createConfig();

extendConfig(reactea, baseConfig());
extendConfig(reactea, sassConfig());

const config = compileConfig(reactea);

export default config;
```

src/react-app-env.d.ts:

```ts
/// <reference types="@reactea/sass/env" />
```
