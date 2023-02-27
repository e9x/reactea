# Reactea

React with a cup of tea.

<img src="./docs/tea.png" width="250" height="250">

## Usage

```sh
npm install -D @reactea/core cross-env webpack webpack-cli
```

`package.json`

```json
  "scripts": {
    "start": "webpack-cli serve",
    "build": "cross-env NODE_ENV=production webpack-cli"
  },
```

`webpack.config.mjs`

```js
import { compileConfig, createConfig, extendConfig } from "@reactea/config";
import baseConfig from "@reactea/core";

const reactea = createConfig();

extendConfig(reactea, baseConfig());
// TODO: add more plugins

const config = compileConfig(reactea);

export default config;
```

With SASS support:

```sh
npm install -D @reactea/sass
```

`webpack.config.mjs`

```js
import { compileConfig, createConfig, extendConfig } from "@reactea/config";
import baseConfig from "@reactea/core";
import sassConfig from "@reactea/sass";

const reactea = createConfig();

extendConfig(reactea, baseConfig());
extendConfig(reactea, sassConfig());

const config = compileConfig(reactea);

export default config;
```

With Tailwind support:

```sh
npm install -D @reactea/tailwind
```

`webpack.config.mjs`

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
