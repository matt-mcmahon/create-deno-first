import { askYesNo, question } from "../../remote/fluentty.ts";
import { existsSync } from "../../remote/fs.ts";
import type { JSONData } from "../utils.ts";
import type { ConfigModule } from "../configure.ts";

interface PackageJSON {
  name: string;
  private: boolean;
  version: string;
  repository: {
    directory: string;
  };
}

function initNPM(cwd: string) {
  return {
    async IO(): Promise<PackageJSON> {
      const p = Deno.run({ cmd: ["npm", "init", "-y"], cwd, stdout: "null" });
      await p.status();
      p.close();
      const packageFile = cwd + "/package.json";
      const packageText = Deno.readTextFileSync(packageFile);
      const packageData = JSON.parse(packageText);
      return packageData;
    },
  };
}

function getPackageData(packageFile: string) {
  return {
    async IO(): Promise<PackageJSON> {
      const packageText = Deno.readTextFileSync(packageFile);
      const packageData = JSON.parse(packageText);
      return packageData;
    },
  };
}

export const configPackageJSON: (path: string) => ConfigModule = (path) =>
  async (defaultTo) => {
    const packageFile = path + "/package.json";

    const exists = existsSync(packageFile);

    if (!exists) {
      const doInit = await askYesNo(`Initialize Node Package in ${path}?`)
        .defaultTo("no")
        .justAccept()
        .IO();
      if (doInit === "no") {
        return Promise.reject(
          new Error(`No package.json file exists at ${path}`),
        );
      }
    }

    const packageData = exists
      ? await getPackageData(packageFile).IO()
      : await initNPM(path).IO();

    return packageData.name;
  };
