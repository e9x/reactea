import { cwd } from "node:process";
import findEntryPoint from "./findIndex.js";

export const appDir = cwd();
export const entryPoint = await findEntryPoint(appDir);
