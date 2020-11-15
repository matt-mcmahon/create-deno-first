import { configPackageJSON } from "./package.ts";

const [tempDir] = Deno.args;

try {
  const packageName = await configPackageJSON(tempDir)("ignored");
  console.log(packageName);
} catch (err) {
  console.error(err);
}
