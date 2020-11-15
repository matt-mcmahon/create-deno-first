import { configImportMap } from "./import_map.ts";

const [tempDir = "temp"] = Deno.args;

Deno.mkdirSync(tempDir, { recursive: true });

const importMap = await configImportMap(tempDir)("import_map.json");

console.log(importMap);
