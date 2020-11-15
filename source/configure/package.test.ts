import { strip } from "../../../fluentty/source/utils.ts";
import { assertEquals } from "../../remote/asserts.ts";
import { configureTestProcess, TP } from "../../remote/fluentty.ts";
import { basename } from "../../remote/path.ts";

const script = "source/configure/package.process.ts";

Deno.test({
  name: "package.ts :: existing package.json",
  async fn() {
    const tempDir = Deno.makeTempDirSync({ prefix: "create_deno_first" });

    const startTestProcess = configureTestProcess(script, tempDir);

    async function pretest(tp: TP) {
      Deno.copyFileSync(
        `template/platform/node/package.json`,
        `${tempDir}/package.json`,
      );
      return tp;
    }

    async function posttest(tp: TP) {
      Deno.removeSync(tempDir, { recursive: true });
      return tp;
    }

    const tp = await startTestProcess({ pretest, posttest });

    {
      const jsonString = strip(await tp.read());
      const actual = JSON.parse(jsonString);
      const expected = { NPM_PACKAGE_NAME: "@mwm/create-deno-first" };
      assertEquals(actual, expected);
    }

    const status = await tp.process.status();

    {
      const actual = status.success;
      const expected = true;
      assertEquals(actual, expected, "Process should EXIT_SUCCESS");
    }

    await tp.end();
  },
});

Deno.test({
  name: "package.ts :: no existing package.json",
  async fn() {
    const tempDir = Deno.makeTempDirSync({ prefix: "create_deno_first_" });

    const startTestProcess = configureTestProcess(script, tempDir);

    async function pretest(tp: TP) {
      return tp;
    }

    async function posttest(tp: TP) {
      Deno.removeSync(tempDir, { recursive: true });
      return tp;
    }

    const tp = await startTestProcess({ pretest, posttest });

    {
      const actual = strip(await tp.read()).trim();
      const expected = `Initialize Node Package in ${tempDir}? (yes/no)`;
      assertEquals(actual, expected);
    }

    await tp.write("yes");

    {
      const jsonString = strip(await tp.read());
      const actual = JSON.parse(jsonString);
      const expected = { NPM_PACKAGE_NAME: basename(tempDir) };
      assertEquals(actual, expected);
    }

    const status = await tp.process.status();

    {
      const actual = status.success;
      const expected = true;
      assertEquals(actual, expected, "Process should EXIT_SUCCESS");
    }

    await tp.end();
  },
});
