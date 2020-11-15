import { askYesNo, isYes, question } from "../../remote/fluentty.ts";
import { existsSync } from "../../remote/fs.ts";
import { ifElse, when } from "../../remote/functional.ts";
import { tapPromise } from "../utils.ts";

function createEmptyImportMap(filename: string) {
  return async () =>
    await Deno.writeTextFile(
      filename,
      JSON.stringify({ imports: {} }, null, "\t"),
    );
}

function noImportMap(): () => Promise<string> {
  return async () => "";
}

function useImportMap(path: string): () => Promise<string> {
  return async () => {
    const importMap = await question("Import-map filename:")
      .defaultTo(path).andSuggest()
      .IO();

    if (!existsSync(importMap)) {
      await askYesNo(`${importMap} does not exist, create?`)
        .defaultTo("yes")
        .justAccept()
        .IO()
        .then(when(isYes)(tapPromise(createEmptyImportMap(importMap))));
    }

    return importMap;
  };
}

export async function configImportMap(path: string) {
  return await askYesNo("Use an import-map?")
    .defaultTo("no").justAccept()
    .IO()
    .then(
      ifElse(
        (yes: string) => yes === "yes",
        useImportMap(path),
        noImportMap(),
      ),
    );
}
