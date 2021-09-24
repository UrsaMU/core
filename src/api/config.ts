import { readFileSync } from "fs";
import glob from "glob";
import { basename } from "path/posix";

interface IConfig {
  [key: string]: any;
}

const config: IConfig = {};
const files = glob.sync("config/**/*.json");
files.forEach((file) => {
  config[basename(file).split(".")[0]] = JSON.parse(
    readFileSync(file, "utf-8")
  );
});

export { config };
