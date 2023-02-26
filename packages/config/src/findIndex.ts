import { access, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const indexes = [
  "index.js",
  "index.jsx",
  "index.cjs",
  "index.cjsx",
  "index.mjs",
  "index.mjsx",
  "index.ts",
  "index.tsx",
  "index.mts",
  "index.mtsx",
  "index.cts",
  "index.ctsx",
];

export default async function findEntryPoint(dir: string) {
  try {
    const pkg = JSON.parse(await readFile(join(dir, "package.json"), "utf-8"));
    if (
      typeof pkg === "object" &&
      pkg !== null &&
      typeof pkg.main === "string"
    ) {
      return resolve(pkg.main, dir);
    }
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
  }

  for (const index of indexes) {
    const path = join(dir, "src", index);

    try {
      await access(path);
      return path;
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
    }
  }

  throw new Error("Cannot find entry point for your application.");
}
