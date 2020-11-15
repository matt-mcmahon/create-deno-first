import { assertEquals } from "../../remote/asserts.ts";
import {
  configureTestProcess,
  forceWriteTextFile,
} from "../../remote/fluentty.ts";
import { strip } from "../utils.ts";

const startTestProcess = configureTestProcess(
  "source/configure/npm.process.ts",
);

Deno.test("npm.ts :: use default", async () => {
  const tp = await startTestProcess();

  {
    const actual = strip(await tp.read());
    const expected = "NPM executable: (npm, pnpm, yarn)";
    const message = `expected:\n\t${Deno.inspect(expected)}\n` +
      `got:\n\t${Deno.inspect(actual)}`;
    assertEquals(actual, expected, message);
  }

  await tp.write();

  {
    const actual = JSON.parse(strip(await tp.read()));
    const expected = [["NPM", "npm"]];
    const message = `expected:\n\t${Deno.inspect(expected)}\n` +
      `got:\n\t${Deno.inspect(actual)}`;
    assertEquals(actual, expected, message);
  }
  await tp.end();
});

Deno.test("npm.ts :: use npm", async () => {
  const tp = await startTestProcess();

  {
    const actual = strip(await tp.read());
    const expected = "NPM executable: (npm, pnpm, yarn)";
    const message = `expected:\n\t${Deno.inspect(expected)}\n` +
      `got:\n\t${Deno.inspect(actual)}`;
    assertEquals(actual, expected, message);
  }

  await tp.write("npm");

  {
    const actual = JSON.parse(strip(await tp.read()));
    const expected = [["NPM", "npm"]];
    const message = `expected:\n\t${Deno.inspect(expected)}\n` +
      `got:\n\t${Deno.inspect(actual)}`;
    assertEquals(actual, expected, message);
  }

  await tp.end();
});

Deno.test("npm.ts :: use pnpm", async () => {
  const tp = await startTestProcess();

  {
    const actual = strip(await tp.read());
    const expected = "NPM executable: (npm, pnpm, yarn)";
    const message = `expected:\n\t${Deno.inspect(expected)}\n` +
      `got:\n\t${Deno.inspect(actual)}`;
    assertEquals(actual, expected, message);
  }

  await tp.write("pnpm");

  {
    const actual = JSON.parse(strip(await tp.read()));
    const expected = [["NPM", "pnpm"]];
    const message = `expected:\n\t${Deno.inspect(expected)}\n` +
      `got:\n\t${Deno.inspect(actual)}`;
    assertEquals(actual, expected, message);
  }

  await tp.end();
});

Deno.test("npm.ts :: use yarn", async () => {
  const tp = await startTestProcess();

  {
    const actual = strip(await tp.read());
    const expected = "NPM executable: (npm, pnpm, yarn)";
    const message = `expected:\n\t${Deno.inspect(expected)}\n` +
      `got:\n\t${Deno.inspect(actual)}`;
    assertEquals(actual, expected, message);
  }

  await tp.write("yarn");

  {
    const actual = JSON.parse(strip(await tp.read()));
    const expected = [["NPM", "yarn"]];
    const message = `expected:\n\t${Deno.inspect(expected)}\n` +
      `got:\n\t${Deno.inspect(actual)}`;
    assertEquals(actual, expected, message);
  }

  await tp.end();
});

Deno.test("npm.ts :: use junk, retry", async () => {
  const tp = await startTestProcess();

  {
    const actual = strip(await tp.read());
    const expected = "NPM executable: (npm, pnpm, yarn)";
    const message = `expected:\n\t${Deno.inspect(expected)}\n` +
      `got:\n\t${Deno.inspect(actual)}`;
    assertEquals(actual, expected, message);
  }

  await tp.write("junk");

  {
    const actual = strip(await tp.read());
    const expected = "NPM executable: (npm, pnpm, yarn)";
    const message = `expected:\n\t${Deno.inspect(expected)}\n` +
      `got:\n\t${Deno.inspect(actual)}`;
    assertEquals(actual, expected, message);
  }

  await tp.write();

  {
    const actual = JSON.parse(strip(await tp.read()));
    const expected = [["NPM", "npm"]];
    const message = `expected:\n\t${Deno.inspect(expected)}\n` +
      `got:\n\t${Deno.inspect(actual)}`;
    assertEquals(actual, expected, message);
  }
  await tp.end();
});
