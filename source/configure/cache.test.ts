import { assertEquals } from "../../remote/asserts.ts";
import { configureTestProcess } from "../../remote/fluentty.ts";
import { strip } from "../utils.ts";

const spawnTestProcess = configureTestProcess(
  "source/configure/env.process.ts",
);

Deno.test("cache.ts :: default values", async () => {
  const tp = await spawnTestProcess();

  try {
    {
      const actual = strip(await tp.read());
      const expected = "Enable local Deno cache? (yes/no)";
      const message = "should ask if you want to enable the cache";
      assertEquals(actual, expected, message);
    }

    await tp.write("yes");

    {
      const actual = strip(await tp.read());
      const expected = "Local Deno cache directory: (.deno)";
      const message = "should ask for deno-dir path";
      assertEquals(actual, expected, message);
    }

    await tp.write();

    {
      const actual = strip(await tp.read());
      const expected = "Lock-File Name: (lock_file.json)";
      const message = "should ask for a lock-file name";
      assertEquals(actual, expected, message);
    }

    await tp.write();

    {
      const data = await tp.read();
      const actual = JSON.parse(data);
      const expected = {
        "DENO_DIR": ".deno",
        "LOCK_FILE": "lock_file.json",
      };
      assertEquals(actual, expected);
    }
  } catch (err) {
    //
  } finally {
    await tp.end();
  }
});

Deno.test("cache.ts :: no cache", async () => {
  const tp = await spawnTestProcess();

  {
    const actual = strip(await tp.read());
    const expected = "Enable local Deno cache? (yes/no)";
    const message = "should ask if you want to enable the cache";
    assertEquals(actual, expected, message);
  }

  await tp.write("no");

  {
    const actual = JSON.parse(await tp.read());
    const expected = {};
    assertEquals(actual, expected);
  }

  await tp.end();
});

Deno.test("cache.ts :: custom file names", async () => {
  const tp = await spawnTestProcess();

  {
    const actual = strip(await tp.read());
    const expected = "Enable local Deno cache? (yes/no)";
    const message = "should ask if you want to enable the cache";
    assertEquals(actual, expected, message);
  }

  await tp.write("yes");

  {
    const actual = strip(await tp.read());
    const expected = "Local Deno cache directory: (.deno)";
    const message = "should ask for deno-dir path";
    assertEquals(actual, expected, message);
  }

  await tp.write("deno-is-awesome!");

  {
    const actual = strip(await tp.read());
    const expected = "Lock-File Name: (lock_file.json)";
    const message = "should ask for a lock-file name";
    assertEquals(actual, expected, message);
  }

  await tp.write("totally-locked.json");

  {
    const actual = JSON.parse(await tp.read());
    const expected = {
      "DENO_DIR": "deno-is-awesome!",
      "LOCK_FILE": "totally-locked.json",
    };
    assertEquals(actual, expected);
  }

  await tp.end();
});
