import {
  askYesNo,
  noop,
  question,
  verifyWriteTextFile,
} from "../remote/fluentty.ts";
import { ifElse } from "../remote/functional.ts";
import { basename } from "../remote/path.ts";
import { configImportMap } from "./configure/import_map.ts";
import { configMakefiles } from "./configure/makefile.ts";
import { configNPM } from "./configure/npm.ts";
import { configPackageJSON } from "./configure/package.ts";
import denoMk from "./makefiles/deno.ts";
import nodeMk from "./makefiles/node.ts";

export type ConfigModule = (defaultTo: string) => Promise<string>;

export const configDenoDir: ConfigModule = async (defaultTo) =>
  question("Local Deno cache directory:")
    .defaultTo(".deno")
    .andSuggest()
    .IO();

export const configureLockFile: ConfigModule = async (defaultTo) =>
  question("Lock-File Name:").defaultTo(defaultTo)
    .andSuggest()
    .IO();

export const configEnv = (): Promise<[string, string][]> => {
  const whenTrue = () => makeEntry(configDenoDir, "DENO_DIR", ".deno");
  return askYesNo("Enable local Deno cache?")
    .defaultTo("yes").justAccept()
    .IO()
    .then(ifElse(isYes, whenTrue, noop));
};

const makeEntry: (
  configFn: ConfigModule,
  key: string,
  defaultTo: string,
) => Promise<[string, string]> = async (f, k, v) => [
  k,
  await f(Deno.env.get(k) ?? v),
];

const entries: [string, string][] = [
  await makeEntry(configImportMap, "IMPORT_MAP", "import_map.json"),
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
