import findEntryPoint from "./findIndex.js";
import { cwd } from "node:process";

export const appDir = cwd();
export const entryPoint = await findEntryPoint(appDir);
