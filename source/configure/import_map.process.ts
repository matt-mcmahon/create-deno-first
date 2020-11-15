import { configImportMap } from "./import_map.ts";

const [tempDir = "temp"] = Deno.args;

Deno.mkdirSync(tempDir, { recursive: true });

const env = await configImportMap(tempDir);

console.log(JSON.stringify(env));
