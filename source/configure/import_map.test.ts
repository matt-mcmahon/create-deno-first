import { assertEquals } from "../../remote/asserts.ts";
import { configureTestProcess, TP } from "../../remote/fluentty.ts";
import { strip } from "../utils.ts";
import { join } from "../../remote/path.ts";

const prefix = "create_deno_first_";
const processScript = "source/configure/import_map.process.ts";

Deno.test({
  name: "import_map.ts :: default value (no)",
  async fn() {
    const tempDir = Deno.makeTempDirSync({ prefix });
    const importMapFile = `${tempDir}/import_map.json`;
    const importMapData = { imports: { "source code path": "mapped path" } };

    async function pretest(tp: TP): Promise<TP> {
      Deno.writeTextFileSync(importMapFile, JSON.stringify(importMapData));
      return tp;
    }

    async function posttest(tp: TP): Promise<TP> {
      Deno.removeSync(tempDir, { recursive: true });
      return tp;
    }

    const startTestProcess = configureTestProcess(processScript, tempDir);
    const tp = await startTestProcess({ pretest, posttest });

    {
      const actual = strip(await tp.read()).trim();
      const expected = "Use an import-map? (yes/no)";
      assertEquals(actual, expected);
    }

    {
      const input = undefined;
      await tp.write(input);

      const actual = strip(await tp.read()).trim();
      const expected = "";
      const message = `give:\n\t${Deno.inspect(input)}\n` +
        `expected:\n\t${Deno.inspect(expected)}\n` +
        `got:\n\t${Deno.inspect(actual)}`;
      assertEquals(actual, expected, message);
    }

    await tp.end();
  },
});

Deno.test({
  name: "import_map.ts :: no",
  async fn() {
    const tempDir = Deno.makeTempDirSync({ prefix });
    const importMapFile = `${tempDir}/import_map.json`;
    const importMapData = { imports: { "source code path": "mapped path" } };

    async function pretest(tp: TP): Promise<TP> {
      Deno.writeTextFileSync(importMapFile, JSON.stringify(importMapData));
      return tp;
    }

    async function posttest(tp: TP): Promise<TP> {
      Deno.removeSync(tempDir, { recursive: true });
      return tp;
    }

    const startTestProcess = configureTestProcess(processScript, tempDir);
    const tp = await startTestProcess({ pretest, posttest });

    {
      const actual = strip(await tp.read()).trim();
      const expected = "Use an import-map? (yes/no)";
      assertEquals(actual, expected);
    }

    {
      const input = "no";
      await tp.write(input);

      const actual = strip(await tp.read()).trim();
      const expected = "";
      const message = `give:\n\t${Deno.inspect(input)}\n` +
        `expected:\n\t${Deno.inspect(expected)}\n` +
        `got:\n\t${Deno.inspect(actual)}`;
      assertEquals(actual, expected, message);
    }

    await tp.end();
  },
});

Deno.test({
  name: "import_map.ts :: yes, default name, no existing file",
  async fn() {
    const tempDir = Deno.makeTempDirSync({ prefix });

    async function posttest(tp: TP) {
      Deno.removeSync(tempDir, { recursive: true });
      return tp;
    }

    const startTestProcess = configureTestProcess(processScript, tempDir);

    const tp = await startTestProcess({ posttest });

    {
      const actual = strip(await tp.read()).trim();
      const expected = "Use an import-map? (yes/no)";
      assertEquals(actual, expected);
    }

    {
      const input = "yes";
      await tp.write(input);
      const actual = strip(await tp.read()).trim();
      const expected = "Import-map filename: (import_map.json)";
      const message = `give:\n\t${Deno.inspect(input)}\n` +
        `expected:\n\t${Deno.inspect(expected)}\n` +
        `got:\n\t${Deno.inspect(actual)}`;
      assertEquals(actual, expected, message);
    }

    {
      const input = undefined;

      await tp.write(input);

      const actual = strip(await tp.read()).trim();
      const expected = "import_map.json does not exist, create? (yes/no)";
      const message = `give:\n\t${Deno.inspect(input)}\n` +
        `expected:\n\t${Deno.inspect(expected)}\n` +
        `got:\n\t${Deno.inspect(actual)}`;
      assertEquals(actual, expected, message);
    }

    {
      const input = "yes";

      await tp.write(input);

      const actual = strip(await tp.read()).trim();
      const expected = "import_map.json";
      const message = `give:\n\t${Deno.inspect(input)}\n` +
        `expected:\n\t${Deno.inspect(expected)}\n` +
        `got:\n\t${Deno.inspect(actual)}`;
      assertEquals(actual, expected, message);
    }

    await tp.end();
  },
});

Deno.test({
  name: "import_map.ts :: yes, new name, existing file",
  async fn() {
    const tempDir = Deno.makeTempDirSync({ prefix });

    const fileName = "my_import_map.json";

    Deno.writeTextFileSync(join(tempDir, fileName), "existing file");

    async function posttest(tp: TP) {
      Deno.removeSync(tempDir, { recursive: true });
      return tp;
    }

    const startTestProcess = configureTestProcess(processScript, tempDir);

    const tp = await startTestProcess({ posttest });

    {
      const actual = strip(await tp.read()).trim();
      const expected = "Use an import-map? (yes/no)";
      assertEquals(actual, expected);
    }

    {
      const input = "yes";
      await tp.write(input);

      const actual = strip(await tp.read()).trim();
      const expected = "Import-map filename: (import_map.json)";
      const message = `give:\n\t${Deno.inspect(input)}\n` +
        `expected:\n\t${Deno.inspect(expected)}\n` +
        `got:\n\t${Deno.inspect(actual)}`;
      assertEquals(actual, expected, message);
    }

    {
      const input = fileName;

      await tp.write(input);

      const actual = strip(await tp.read()).trim();
      const expected = fileName;
      const message = `give:\n\t${Deno.inspect(input)}\n` +
        `expected:\n\t${Deno.inspect(expected)}\n` +
        `got:\n\t${Deno.inspect(actual)}`;
      assertEquals(actual, expected, message);
    }

    {
      const actual = Deno.readTextFileSync(join(tempDir, fileName));
      const expected = "existing file";
      const message = `give:\n\tExisting file "${Deno.inspect(fileName)}"\n` +
        `expected:\n\t${Deno.inspect(expected)}\n` +
        `got:\n\t${Deno.inspect(actual)}`;
      assertEquals(actual, expected, message);
    }

    await tp.end();
  },
});

Deno.test({
  name: "import_map.ts :: yes, new name, no file",
  async fn() {
    const tempDir = Deno.makeTempDirSync({ prefix });

    const fileName = "my_import_map.json";

    async function posttest(tp: TP) {
      Deno.removeSync(tempDir, { recursive: true });
      return tp;
    }

    const startTestProcess = configureTestProcess(processScript, tempDir);

    const tp = await startTestProcess({ posttest });

    {
      const actual = strip(await tp.read()).trim();
      const expected = "Use an import-map? (yes/no)";
      assertEquals(actual, expected);
    }

    {
      const input = "yes";
      await tp.write(input);

      const actual = strip(await tp.read()).trim();
      const expected = "Import-map filename: (import_map.json)";
      const message = `give:\n\t${Deno.inspect(input)}\n` +
        `expected:\n\t${Deno.inspect(expected)}\n` +
        `got:\n\t${Deno.inspect(actual)}`;
      assertEquals(actual, expected, message);
    }

    {
      const input = fileName;

      await tp.write(input);

      const actual = strip(await tp.read()).trim();
      const expected = `${input} does not exist, create? (yes/no)`;
      const message = `give:\n\t${Deno.inspect(input)}\n` +
        `expected:\n\t${Deno.inspect(expected)}\n` +
        `got:\n\t${Deno.inspect(actual)}`;
      assertEquals(actual, expected, message);
    }

    {
      const input = "yes";
      await tp.write(input);

      const actual = strip(await tp.read()).trim();
      const expected = fileName;
      const message = `give:\n\t${Deno.inspect(input)}\n` +
        `expected:\n\t${Deno.inspect(expected)}\n` +
        `got:\n\t${Deno.inspect(actual)}`;
      assertEquals(actual, expected, message);
    }

    {
      const actual = JSON.parse(Deno.readTextFileSync(join(tempDir, fileName)));
      const expected = { imports: {} };
      const message = `give:\n\tExisting file "${Deno.inspect(fileName)}"\n` +
        `expected:\n\t${Deno.inspect(expected)}\n` +
        `got:\n\t${Deno.inspect(actual)}`;
      assertEquals(actual, expected, message);
    }

    await tp.end();
  },
});
