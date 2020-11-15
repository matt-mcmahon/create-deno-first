import { configCache } from "./cache.ts";

await configCache(env).then((env) => {
  console.log(env.stringify());
});
