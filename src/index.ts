import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { needsUpdate } from "./needs-update";
import { latestRelease } from "./latest-release";
import { collect } from "./collect";
import { parse } from "./parse";
import { updateVersion } from "./version";

import type { PathLike } from "node:fs";
import type { ParseOptions } from "./parse";

interface FlowOptions extends ParseOptions {
  outFile?: PathLike;
}

const __filename = fileURLToPath(import.meta.url);

async function exists(toCheck: PathLike): Promise<boolean> {
  try {
    await fs.promises.access(toCheck);
    return true;
  } catch {
    return false;
  }
}

async function defaultOutFile(): Promise<string> {
  // should be <repo root>/dist
  const outDirectory = path.resolve(
    path.dirname(
      // repo root
      path.resolve(
        // src
        path.dirname(
          // This file
          __filename,
        ),
      ),
    ),
    "dist",
  );
  const outDirectoryExists = await exists(outDirectory);
  if (!outDirectoryExists) {
    await fs.promises.mkdir(outDirectory);
  }
  const outFile = path.resolve(outDirectory, "cloudflare-workers-types.ts");
  return outFile;
}

export async function run(options: FlowOptions = {}) {
  let { outFile, module: module_ = false, ...parseOptions } = options;
  if (typeof outFile === "undefined") {
    outFile = await defaultOutFile();
  }
  const latestVersion = await latestRelease();
  const shouldUpdate = await needsUpdate(latestVersion);

  if (!shouldUpdate) {
    console.log("::set-output name=version::no-update");
    return;
  }

  const typesFile = await collect();
  await parse(typesFile, outFile, { module: module_, ...parseOptions });
  await updateVersion(latestVersion!);
  console.log(`::set-output name=version::${latestVersion!}`);
}
