import { question } from "../../remote/fluentty.ts";

export const configNPM = (defaultTo: string) =>
  question("NPM executable:")
    .suggest("npm", "pnpm", "yarn").ignoreCase().matchInitial()
    .defaultTo(defaultTo).justAccept()
    .retry()
    .IO();
