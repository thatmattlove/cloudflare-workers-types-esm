import fs from "node:fs";
import path from "node:path";
import prettier from "prettier";
import type { PackageJson } from "type-fest";

export async function updateVersion(newVersion: string) {
  const package_ = (await import("../package.json", { assert: { type: "json" } })) as PackageJson;
  const prettierOptions = package_.prettier as prettier.Options;
  const newPackage = { ...package_ };
  newPackage.version = newVersion;
  const newPackageString = JSON.stringify(newPackage);
  const result = prettier.format(newPackageString, {
    parser: "json-stringify",
    ...prettierOptions,
  });
  // eslint-disable-next-line unicorn/prefer-module
  const newPackagePath = path.resolve(path.dirname(__dirname), "package.json");
  await fs.promises.writeFile(newPackagePath, result);
  return result;
}
