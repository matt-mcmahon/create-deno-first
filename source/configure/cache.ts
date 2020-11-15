import { ifElse, when } from "../../remote/functional.ts";
import { askYesNo, IO, isYes, noop, question } from "../../remote/fluentty.ts";
import type { ConfigModule } from "../configure.ts";
import { assertEquals as assert } from "../../remote/asserts.ts";

function configDenoDir(defaultTo: string): () => Promise<[string, string][]> {
  return async () =>
    question("Local Deno cache directory:")
      .defaultTo(defaultTo)
      .andSuggest()
      .IO()
      .then(
        (denoDir) => [["USE_CACHE", "--cached-only"], ["DENO_DIR", denoDir]],
      );
}

const disableCache = () => [["USE_CACHE", ""]];

function configureLockFile(defaultTo: string) {
  return question("Lock-File Name:")
    .defaultTo(defaultTo).andSuggest();
}

const configDenoCache = (defaultTo: string) =>
  askYesNo("Enable local Deno cache?")
    .defaultTo(defaultTo).justAccept();

export const configureCache = function* (
  defaultTo: string,
) {
  const q1 = [
    configDenoCache(Deno.env.get("USE_CACHE") ? "yes" : "no"),
  ];
  const a1
   = yield q1;

  const afterIO = [
    ifElse(
      (a) => a === "yes",
      () => configDenoDir(Deno.env.get("DENO_DIR") ?? ".deno"),
      disableCache,
    ),
  ];

  return q1;
};

Deno.test("configureCache", async () => {
  const doIO = configureCache("yes");

  const q1 = doIO.next().value;
  const a1 = await IO(...q1);

  {
    const actual = a1;
    const expected = ["yes"];
    assert(actual, expected);
  }

  const q2 = doIO.next().value;
  const a2 = await IO(...q1);

  {
    const actual = a2;
    const expected = [""];
    assert(actual, expected);
  }

  console.dir(a1);
});