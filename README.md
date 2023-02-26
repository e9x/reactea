# Reactea

React with a cup of tea.

## Usage

```sh
npm install -D @reactea/base cross-env webpack webpack-cli
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
import baseConfig from "@reactea/config/base";

const reactea = createConfig();

extendConfig(reactea, baseConfig());
// TODO: add more plugins

const config = compileConfig(reactea);

export default config;
```

With SCSS support:

```sh
npm install -D @reactea/sass
```

`webpack.config.mjs`

```js
import { compileConfig, createConfig, extendConfig } from "@reactea/config";
import baseConfig from "@reactea/config/base";
import sassConfig from "@reactea/sass";

const reactea = createConfig();

extendConfig(reactea, baseConfig());
extendConfig(reactea, sassConfig());

const config = compileConfig(reactea);

export default config;
```
