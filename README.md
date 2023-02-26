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
import { compileConfig } from "@reactea/config";
import baseConfig from "@reactea/config/base";

const r = baseConfig();

// TODO: add more plugins

const config = compileConfig(r);

export default config;
```

With SCSS support:

```sh
npm install -D @reactea/sass
```

`webpack.config.mjs`

```js
import { compileConfig, extendConfig } from "@reactea/config";
import baseConfig from "@reactea/config/base";
import sassConfig from "@reactea/sass";

const r = baseConfig();

extendConfig(r, sassConfig());

const config = compileConfig(r);

export default config;
```
