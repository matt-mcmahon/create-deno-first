import { describe } from "../remote/describe.ts";
import { tapPromise } from "./utils.ts";

describe("tapPromise", async ({ assert, inspect }) => {
  const sayThrice = (a: string) => Promise.resolve(a.repeat(3));

  {
    const actual = await sayThrice("boo! ");
    const expected = "boo! boo! boo! ";
    const given = inspect`${sayThrice}(${"boo! "})`;
    assert({ actual, expected, given });
  }

  {
    const actual = await tapPromise(sayThrice)("boo! ");
    const expected = "boo! ";
    assert({ actual, expected, message: "tap(sayThrice) should not repeat" });
  }
});
