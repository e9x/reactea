# Reactea ☕

Reactea is a monorepo containing a set of packages that allow developers to quickly set up a modern React project with Webpack.

See [quickstart](./QUICKSTART.md) to begin migrating to Reactea.

## Packages

- [`@reactea/config`](./packages/config) - A set of utilities for creating and extending Webpack configurations.
- [`@reactea/core`](./packages/core) - A base configuration for React projects with Webpack.
- [`@reactea/sass`](./packages/sass) - Adds support for Sass to a React project.
- [`@reactea/sw`](./packages/sw) - Adds support for Service Workers to a React project.
- [`@reactea/tailwind`](./packages/tailwind) - Adds support for Tailwind CSS to a React project.

## Installation

To use Reactea in your project, you can install the packages you need via npm or yarn:

```sh
npm install -D @reactea/config @reactea/core webpack webpack-cli
```

## Example Config

Here's an example of how to create a Webpack configuration using only the base `@reactea/core` package:

```js
import { compileConfig, createConfig, extendConfig } from "@reactea/config";
import baseConfig from "@reactea/core";

const reactea = createConfig();

extendConfig(reactea, baseConfig());

const config = compileConfig(reactea);

export default config;
```

This will create a simple Webpack configuration that includes a set of defaults suitable for many React projects. You can customize this configuration by adding plugins or loaders to the `reactea` object before compiling it into a configuration.

For example, to add support for Sass, you can install the `@reactea/sass` package and extend the `reactea` object as follows:

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

This will add the necessary loaders and plugins to the Webpack configuration to support Sass. You can similarly extend the configuration to support other features like Tailwind CSS or Service Workers by installing and importing the appropriate packages and merging them into the `reactea` object.
