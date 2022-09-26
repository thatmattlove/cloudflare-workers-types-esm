import { compareVersions } from "compare-versions";
import _package from "../package.json" assert { type: "json" };

import type { PackageJson } from "type-fest";

const package_ = _package as PackageJson;

const thisVersion = package_.version!;

export async function needsUpdate(latestVersion: string | undefined): Promise<boolean> {
  if (typeof latestVersion !== "string") {
    throw new TypeError(`Failed to parse latest version. Got: '${latestVersion}'`);
  }
  // Temporary patch for NPM issue where I accidentally published 3.16.0 without dist.
  if (thisVersion.match(/actual/gi) !== null) {
    return false;
  }
  const comparison = compareVersions(latestVersion, thisVersion);
  return comparison > 0;
}
