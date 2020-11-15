import { assertEquals } from "../../remote/asserts.ts";
import { configureTestProcess, TP } from "../../remote/fluentty.ts";
import { strip } from "../utils.ts";

const prefix = "create_deno_first_";
const processScript = "source/configure/import_map.process.ts";

Deno.test({
  name: "import_map.ts :: default values, existing file",
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

    await tp.write();

    {
      const text = strip(await tp.read()).trim();
      const actual = JSON.parse(text);
      const expected = [["IMPORT_MAP", ""]];
      const message = `give:\n\t${text}` +
        `expected:\n\t${Deno.inspect(expected)}\n` +
        `got:\n\t${Deno.inspect(actual)}`;
      assertEquals(actual, expected, message);
    }

    await tp.end();
  },
});

Deno.test({
  name: "import_map.ts :: default values, no file",
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

    await tp.write();

    {
      const actual = strip(await tp.read()).trim();
      const expected = "";
      assertEquals(actual, expected);
    }

    await tp.write();

    {
      const text = strip(await tp.read()).trim();
      const actual = JSON.parse(text);
      const expected = [["IMPORT_MAP", ""]];
      const message = `give:\n\t${text}` +
        `expected:\n\t${Deno.inspect(expected)}\n` +
        `got:\n\t${Deno.inspect(actual)}`;
      assertEquals(actual, expected, message);
    }

    await tp.end();
  },
});
