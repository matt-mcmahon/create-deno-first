import { stripColor } from "../remote/colors.ts";
import { always } from "../remote/functional.ts";

export type JSONData = ReturnType<typeof JSON.parse>;

export async function stringifyJSON(data: JSONData) {
  return JSON.stringify(data, null, "\t");
}

export async function parseJSON(data: JSONData) {
  return JSON.parse(data);
}

export function strip(string: string) {
  return stripColor(string).trim();
}

// deno-fmt-ignore
export const tapPromise
  : <A, B>(f: (a: A) => Promise<B>) => (a: A) => Promise<A>
  = (f) => (a) => f(a).then(always(a));

export async function readFile(filePath: string) {
  return Deno.readTextFile(filePath);
}
