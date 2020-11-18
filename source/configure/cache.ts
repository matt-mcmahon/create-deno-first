import { askYesNo, isYes, question } from "../../remote/fluentty.ts";
import { ifElse } from "../../remote/functional.ts";

export const configDenoDir = (defaultTo: string) =>
  () =>
    question("Local Deno cache directory:")
      .defaultTo(defaultTo)
      .andSuggest()
      .IO()
      .then(
        (denoDir) => [["USE_CACHE", "--cached-only"], ["DENO_DIR", denoDir]],
      );

const disableCache = () => [["USE_CACHE", ""]];

function configureLockFile(defaultTo: string) {
  return question("Lock-File Name:")
    .defaultTo(defaultTo).andSuggest();
}

const configDenoCache = (defaultTo: string) =>
  askYesNo("Enable local Deno cache?")
    .defaultTo(defaultTo).justAccept();

export const configCache = (defaultTo: string) => {
  const useCache = configDenoCache(Deno.env.get("USE_CACHE") ? "yes" : "no");
  useCache.then(() =>
    ifElse(
      isYes,
      configDenoDir(Deno.env.get("DENO_DIR") ?? ".deno"),
      disableCache,
    )
  );
};
