import { access, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";

export const moduleFileExtensions: string[] = [
  ".js",
  ".jsx",
  ".cjs",
  ".cjsx",
  ".mjs",
  ".mjsx",
  ".ts",
  ".tsx",
  ".mts",
  ".mtsx",
  ".cts",
  ".ctsx",
];

export async function resolveModule(filePath: string) {
  for (const ext of moduleFileExtensions) {
    const full = `${filePath}${ext}`;

    try {
      await access(full);
      return full;
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code !== "ENOENT") throw err;
    }
  }
}

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

  const m = resolveModule(join(dir, "src", "index"));

  if (m) return m;

  throw new Error("Cannot find entry point for your application.");
}
