import { IO } from "../../remote/fluentty.ts";
import { configCache } from "./cache.ts";

for (const qs of configCache(".deno")) {
  const as = IO(...qs);
  console.table(as);
}
