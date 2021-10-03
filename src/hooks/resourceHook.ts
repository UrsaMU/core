import { HookData } from "../api/hooks";
import { Next } from "@digibear/middleware";
import { loaddir } from "../utils/utils";
import { join } from "path";
import { readFileSync } from "fs";
import { textDB } from "../api/text";
import frontmatter from "front-matter";

export default async (data: HookData, next: Next) => {
  // load resources
  await loaddir(join(__dirname, "../functions/"));
  await loaddir(join(__dirname, "../commands/"));
  await loaddir(join(__dirname, "../scripts/"));
  await loaddir(join(__dirname, "../services/"));

  // Load text entries
  await loaddir(join(__dirname, "../../text/"), (file, path) => {
    if (
      file.name.toLowerCase().endsWith(".md") ||
      file.name.toLowerCase().endsWith(".txt")
    ) {
      const fd = readFileSync(path + file.name, "utf8");
      textDB[file.name.split(".")[0]] = frontmatter(fd);
    }
  });

  next();
};
