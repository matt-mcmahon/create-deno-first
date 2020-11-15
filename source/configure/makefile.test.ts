import { assertEquals } from "../../remote/asserts.ts";
import {
  configureTestProcess,
  forceWriteTextFile,
  TP,
} from "../../remote/fluentty.ts";
import { exists } from "../../remote/fs.ts";
import { strip } from "../utils.ts";

const startTestProcess = configureTestProcess(
  "source/configure/makefile.process.ts",
);

async function test(path: string, data: string) {
  {
    const actual = await exists(path);
    const expected = true;
    assertEquals(actual, expected, `${path} should exist`);
  }
  {
    const actual = await Deno.readTextFile(path);
    const expected = data;
    assertEquals(
      actual,
      expected,
      `${path}:\n\tactual: ${actual}\n\texpected: ${expected}`,
    );
  }
}

Deno.test("makefile.ts :: no target files, default answers", async () => {
  const tempDir = Deno.makeTempDirSync({ prefix: "makefile_test_#2_" });
  const tp = startTestProcess();
  await tp.then(async (tp) => {
    const path1 = `${tempDir}/path1.mk`;
    const path2 = `${tempDir}/path2.mk`;

    const original1 = `all: original ${path1}`;
    const original2 = `all: original ${path2}`;

    const overwrite1 = `all: overwrite ${path1}`;
    const overwrite2 = `all: overwrite ${path2}`;

    {
      const actual = strip(await tp.read());
      const expected = "Create Makefiles? (yes/no)";
      assertEquals(actual, expected);
    }

    await tp.write("yes");
    await tp.process.status();

    await test(path1, overwrite1);
    await test(path2, overwrite2);
  }).finally(async () => {
    (await tp).end();
    Deno.removeSync(tempDir);
  });
});

Deno.test(
  "makefile.ts :: existing target files, overwrite #1, not #2",
  async () => {
    const tempDir = Deno.makeTempDirSync({ prefix: "makefile_test_#2_" });

    const path1 = `${tempDir}/path1.mk`;
    const path2 = `${tempDir}/path2.mk`;

    const original1 = `all: original ${path1}`;
    const original2 = `all: original ${path2}`;

    const overwrite1 = `all: overwrite ${path1}`;
    const overwrite2 = `all: overwrite ${path2}`;

    const tp = await startTestProcess({
      async pretest(tp: TP) {
        await forceWriteTextFile(path1, original1);
        await forceWriteTextFile(path2, original2);
        return tp;
      },
      async posttest(tp: TP) {
        await test(path1, overwrite1);
        await test(path2, original2);
        return tp;
      },
    });

    {
      const actual = strip(await tp.read());
      const expected = "Create Makefiles? (yes/no)";
      assertEquals(actual, expected);
    }

    await tp.write("yes");

    {
      const actual = strip(await tp.read());
      const expected = `File ${path1} exists, overwrite? (yes/no)`;
      assertEquals(actual, expected);
    }

    await tp.write("yes");

    {
      const actual = strip(await tp.read());
      const expected = `File ${path2} exists, overwrite? (yes/no)`;
      assertEquals(actual, expected);
    }

    await tp.write("no");

    await tp.process.status();

    Deno.removeSync(tempDir);

    await tp.end();
  },
);
