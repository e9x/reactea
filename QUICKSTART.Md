# Quickstart

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

## More extensions

See the READMEs for each package in this monorepo.
