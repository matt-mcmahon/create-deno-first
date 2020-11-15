import { configNPM } from "./npm.ts";

const env = await configNPM("npm");

console.log(JSON.stringify(env));
