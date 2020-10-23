import { describe } from "../lib/remote/describe";
import { example } from "./module";

describe("passing-test", ({ assert }) => {
  // example is a function
  assert({
    actual: typeof example,
    expected: "function",
    value: example,
    should: "be a function",
  });
});

describe("failing-test", ({ assert }) => {
  // but example() doesn't return anything
  assert({
    actual: example(),
    expected: "it works",
  });
});