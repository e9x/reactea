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
import baseConfig from "@reactea/base";

// TODO: plugins, etc

export default baseConfig;
```
