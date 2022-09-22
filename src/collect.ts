import fs from "node:fs";
import path from "node:path";
import { WritableStream } from "node:stream/web";
import extractZip from "extract-zip";
import { Octokit } from "octokit";

async function downloadLatestRelease(): Promise<string> {
  const { temporaryDirectory } = await import("tempy");
  const octo = new Octokit();
  const latest = await octo.rest.repos.getLatestRelease({
    owner: "cloudflare",
    repo: "workers-types",
  });
  if (latest.data.zipball_url === null) {
    throw new Error("Failed to collect latest release ZIP file");
  }
  const response = await fetch(latest.data.zipball_url);
  const tempDirectory = temporaryDirectory();
  const outFile = path.resolve(tempDirectory, `cloudflare-workers-types-${latest.data.name}.zip`);
  const writeStream = fs.createWriteStream(outFile);
  const stream = new WritableStream({
    write: (c) => {
      writeStream.write(c);
    },
  });
  await response.body?.pipeTo(stream);
  return outFile;
}

async function getLatestTypes(zipFile: string): Promise<string> {
  const directory = path.dirname(zipFile);
  await extractZip(zipFile, { dir: directory });
  for (const child of await fs.promises.readdir(directory)) {
    const childPath = path.resolve(directory, child);
    const stat = await fs.promises.stat(childPath);
    if (stat.isDirectory()) {
      const file = path.join(childPath, "index.d.ts");
      const fileStat = await fs.promises.stat(file);
      if (fileStat.isFile()) {
        return file;
      }
    }
  }
  throw new Error(`Failed to unzip ${zipFile}`);
}

export async function collect(): Promise<string> {
  const release = await downloadLatestRelease();
  const latest = await getLatestTypes(release);
  return latest;
}
