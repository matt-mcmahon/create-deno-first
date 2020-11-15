import { configNPM } from "./npm.ts";

const env = await configNPM();

console.log(JSON.stringify(env));
