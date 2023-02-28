# Extensions

Extensions add features to Reactea.

## Extensions should not be complex

- Extensions shouldn't have to modify the behavior of other extensions/webpack features

  Ideally, the extension that's being modified should be forked or be made more configurable to be easier to work with. Sometimes, a feature will need to be implemented in `@reactea/config` to facilitate this.

  Example of a hacky implementation that modifies the config:

  Implementing Tailwind: https://github.com/e9x/reactea/commit/5ea13f10a6c6e171fef3f13fcf1262d35ee2d372#diff-c85d7b32fabcc8e38fc194fd041ce7c54f985ed7e2f0d429408bd99bfe7b1b59

  - The config was passed directly to the extension.

  Changes in `@reactea/config`: https://github.com/e9x/reactea/commit/b745a0cf9f1140ed165fa72188f0f8577a34732b

  - PostCSS plugins is now an extendable array. PostCSS is built into Reactea.

## Type definitions

Plugins that implement rules (ie. `oneOf`) should provide accompanying type definitions for usage in the Reactea app. For example, `@reactea/core` provides type definitions that can be used as such:

src/react-app-env.d.ts:

```ts
/// <reference types="@reactea/core/env" />
```

Now all the features from `@reactea/base` work with TypeScript code:

```ts
import styles from "./style.module.css";

styles; // (alias) const styles: { readonly [key: string]: string; }
```

Ideally, you would export the individual type definitions for every component that you export. For `@reactea/core`, it's:

```ts
/// <reference types="@reactea/core/env/core.js" />
/// <reference types="@reactea/core/env/css.js" />
/// <reference types="@reactea/core/env/image.js" />
/// <reference types="@reactea/core/env/svg.js" />
```

`.js` is at the end of each reference for module resolution

Ideally, like `@reactea/core`, you would also export the env for when your config is used.

Another example: In `@reactea/sass`, only the type definitions for `*.module.scss` and `*.module.sass` are exported.
