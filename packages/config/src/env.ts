import { expand } from "dotenv-expand";
import { config } from "dotenv-flow";
import { createHash } from "node:crypto";

expand(config());

// we can gurantee these variables exist:

// Useful for resolving the correct path to static assets in `public`.
// For example, <img src={process.env.PUBLIC_URL + '/img/logo.png'} />.
// This should only be used as an escape hatch. Normally you would put
// images into the `src` and `import` them in code to get their paths.
process.env.PUBLIC_URL ||= "";

// Useful for determining whether we’re running in production mode.
// Most importantly, it switches React into the correct mode.
process.env.NODE_ENV ||= "development";

// Whether or not react-refresh is enabled.
// It is defined here so it is available in the webpackHotDevClient.
process.env.FAST_REFRESH = (process.env.FAST_REFRESH !== "false").toString();

// as long as env.js is imported
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      PUBLIC_URL: string;
      NODE_ENV: string;
      FAST_REFRESH: string;
    }
  }
}

export const envRaw: Record<string, string> = {};

const includeEnv: string[] = ["NODE_ENV", "PUBLIC_URL", "FAST_REFRESH"];

for (const env in process.env) {
  const value = process.env[env];

  if (
    typeof value !== "undefined" &&
    (env.startsWith("REACT_APP_") || includeEnv.includes(env))
  ) {
    envRaw[env] = value;
  }
}

const envHash = createHash("md5");
envHash.update(JSON.stringify(envRaw));
export const envRawHash = envHash.digest("hex");

export const envRawStringified: Record<string, string> = {};
for (const key in envRaw) envRawStringified[key] = JSON.stringify(envRaw[key]);
