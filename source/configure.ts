import { verifyWriteTextFile } from "../remote/fluentty.ts";
import { basename } from "../remote/path.ts";
import { configImportMap } from "./configure/import_map.ts";
import { configMakefiles } from "./configure/makefile.ts";
import { configNPM } from "./configure/npm.ts";
import { configPackageJSON } from "./configure/package.ts";
import denoMk from "./makefiles/deno.ts";
import nodeMk from "./makefiles/node.ts";

export type ConfigModule = (defaultTo: string) => Promise<string>;

const makeEntry = async (
  fn: ConfigModule,
  varName: string,
  defaultTo: string,
): Promise<[string, string]> => [
  varName,
  await fn(Deno.env.get(varName) ?? defaultTo),
];

const entries: [string, string][] = [
  await makeEntry(configImportMap(Deno.cwd()), "IMPORT_MAP", "import_map.json"),
  await makeEntry(configNPM, "NPM", "npm"),
  await makeEntry(
    configPackageJSON("platform/node"),
    "NPM_PACKAGE_NAME",
    basename(Deno.cwd()),
  ),
];

await verifyWriteTextFile(".env")(
  entries.map((v) => v.join("=")).join("\n"),
);

await configMakefiles([
  ["Makefile", denoMk],
  ["platform/node/Makefile", nodeMk],
]);
