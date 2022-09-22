import { Octokit } from "@octokit/rest";

export async function latestRelease(): Promise<string | undefined> {
  const octo = new Octokit();
  const latest = await octo.rest.repos.getLatestRelease({
    owner: "cloudflare",
    repo: "workers-types",
  });
  const version = latest.data.name?.replace("v", "");
  return version;
}
