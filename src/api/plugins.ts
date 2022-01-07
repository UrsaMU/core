import { readdir, readFile } from "fs/promises";
import { join, resolve } from "path";

export const textFiles = new Map<string, string>();

/**
 * Load all js files from a directory.
 * @param path The path to the files to handle.
 */
export const plugins = async (path: string) => {
  const dirent = await readdir(path, {
    withFileTypes: true,
  });
  for (const file of dirent) {
    if (
      (file.name.endsWith(".ts") && !file.name.endsWith(".d.ts")) ||
      file.name.endsWith(".js")
    ) {
      const module = await import(path + file.name);
      if (module.default) await module.default();
    } else if (file.isDirectory()) {
      const pack = await readFile(
        resolve(path, file.name, "package.json"),
        "utf-8"
      );
      const data = JSON.parse(pack);
      const module = await import(join(path, file.name, data.main));
      if (module.default) await module.default();
    } else if (file.name.endsWith(".md") || file.name.endsWith(".txt")) {
      textFiles.set(
        file.name.split(".")[0],
        await readFile(path + file.name, { encoding: "utf-8" })
      );
    }
  }
};
