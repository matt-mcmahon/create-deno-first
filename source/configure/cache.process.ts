import { configEnv } from "./env.ts";

await configEnv().then((env) => {
  console.log(env.stringify());
});
