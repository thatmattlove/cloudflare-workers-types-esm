import { compareVersions } from "compare-versions";
import _package from "../package.json";

import type { PackageJson } from "type-fest";

const package_ = _package as PackageJson;

const thisVersion = package_.version!;

export async function needsUpdate(latestVersion: string | undefined): Promise<boolean> {
  if (typeof latestVersion !== "string") {
    throw new TypeError(`Failed to parse latest version. Got: '${latestVersion}'`);
  }
  const comparison = compareVersions(latestVersion, thisVersion);
  return comparison > 0;
}
