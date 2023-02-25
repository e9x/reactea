/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found relative to this file in the source tree.
 */
import type {
  LintResult,
  LintResultData,
} from "eslint-webpack-plugin/types/options";

export default function formatter(
  results: LintResult[],
  data?: LintResultData | undefined
): string;
