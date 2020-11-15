import { ifElse } from "../../remote/functional.ts";
import { askYesNo, isYes, question } from "../../remote/fluentty.ts";
import type { ConfigModule } from "../configure.ts";

export const configDenoDir: ConfigModule = async (defaultTo) =>
  question("Local Deno cache directory:")
    .defaultTo(".deno")
    .andSuggest()
    .IO();

export const configureLockFile: ConfigModule = async (defaultTo) =>
  question("Lock-File Name:").defaultTo(defaultTo)
    .andSuggest()
    .IO();

export const configEnv = (env: Env): Promise<Env> => {
  const whenTrue = configDenoDir(env);
  const whenFalse = (): Promise<Env> => Promise.resolve(env);
  return askYesNo("Enable local Deno cache?")
    .defaultTo("yes").justAccept()
    .IO()
    .then(ifElse(isYes, whenTrue, whenFalse));
};
