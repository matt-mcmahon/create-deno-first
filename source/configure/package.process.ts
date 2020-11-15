import { configPackageJSON } from "./package.ts";

const [tempDir] = Deno.args;

try {
  const entries: [string, string][] = await configPackageJSON(tempDir);
  const env = Object.fromEntries(entries);
  console.log(JSON.stringify(env));
} catch (err) {
  console.error(err);
}
