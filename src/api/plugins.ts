import { readdir, readFile } from "fs/promises";
import { resolve } from "path";

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
      const module = await import(path + data.main);
      if (module.default) await module.default();
    }
  }
};

/**
 * Load a file from a given path.
 * @param path Tge path to the file.
 * @returns
 */
export const loadText = async (path: string) => {
  return await readFile(path, { encoding: "utf-8" });
};
