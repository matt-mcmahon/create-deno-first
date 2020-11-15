import {
  askYesNo,
  isYes,
  noop as voidFn,
  verifyWriteTextFile,
} from "../../remote/fluentty.ts";
import { ifElse } from "../../remote/functional.ts";

type Pairs = [filePath: string, fileData: string][];

const writeFiles = (pairs: Pairs) =>
  async () => {
    for (const pair of pairs) {
      const [filePath, fileData] = pair;
      await verifyWriteTextFile(filePath)(fileData);
    }
  };

export async function configMakefiles(pairs: Pairs): Promise<void> {
  await askYesNo("Create Makefiles?")
    .defaultTo("yes")
    .justAccept()
    .IO()
    .then(ifElse(isYes, writeFiles(pairs), voidFn));
}
