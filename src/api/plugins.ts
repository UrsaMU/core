import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { loaddir } from "../utils/utils";

type IPlugin = () => void | Promise<void>;

export const plugins = async (path: string = "") => {
  // Load plugin systems.
  if (existsSync(join(__dirname, "../plugins"))) {
    await loaddir(join(__dirname, "../plugins/"), (file, path) => {
      if (file.isDirectory()) {
        const fd = readFileSync(
          join(path.toString(), file.name, "package.json"),
          "utf-8"
        );
        const pkg = JSON.parse(fd);
        import(join(path.toString(), file.name, pkg.main)).then(async (mod) => {
          if (mod.default) {
            await mod.default();
          }
        });
      } else if (
        file.name.endsWith(".ts") ||
        (file.name.endsWith(".js") && !file.name.endsWith(".d.ts"))
      ) {
        import(join(path.toString(), file.name)).then(async (mod) => {
          if (mod.default) {
            await mod.default();
          }
        });
      }
    });
  }

  // load custom plugin dir
  if (existsSync(path)) {
    await loaddir(path, (file, pth) => {
      if (file.isDirectory()) {
        const fd = readFileSync(
          join(pth.toString(), file.name, "package.json"),
          "utf-8"
        );
        const pkg = JSON.parse(fd);
        import(join(pth.toString(), file.name, pkg.main)).then(async (mod) => {
          if (mod.default) {
            await mod.default();
          }
        });
      } else if (
        file.name.endsWith(".ts") ||
        (file.name.endsWith(".js") && !file.name.endsWith(".d.ts"))
      ) {
        import(join(pth.toString(), file.name)).then(async (mod) => {
          if (mod.default) {
            await mod.default();
          }
        });
      }
    });
  }
};
