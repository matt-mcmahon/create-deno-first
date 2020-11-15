import { askYesNo, isYes, question } from "../../remote/fluentty.ts";
import { existsSync } from "../../remote/fs.ts";
import { ifElse, when } from "../../remote/functional.ts";
import { join } from "../../remote/path.ts";
import { tapPromise as tap } from "../utils.ts";

const emptyImportMap = JSON.stringify({ imports: {} }, null, "\t");

const createEmptyImportMap = (path: string) =>
  () => Deno.writeTextFile(path, emptyImportMap);

const noImportMap = () => async () => "";

function useImportMap(
  path: string,
  defaultFileName: string,
): () => Promise<string> {
  return async () => {
    const importMap = await question("Import-map filename:")
      .defaultTo(defaultFileName).andSuggest()
      .IO();

    const fullPath = join(path, importMap);

    if (!existsSync(fullPath)) {
      const foo = await askYesNo(`${importMap} does not exist, create?`)
        .defaultTo("yes")
        .justAccept()
        .IO()
        .then(when(isYes)(tap(createEmptyImportMap(fullPath))));
    }

    return importMap;
  };
}

export const configImportMap = (targetDir: string) =>
  async (defaultFileName = "import_map.json") =>
    await askYesNo("Use an import-map?")
      .defaultTo("no").justAccept()
      .IO()
      .then(
        ifElse(
          (yes: string) => yes === "yes",
          useImportMap(targetDir, defaultFileName),
          noImportMap(),
        ),
      );
