import { run } from "./src";

async function main() {
  const result = await run();
  for (const line of result) {
    console.log(line);
  }
}

main();
