import { readdirSync, readFileSync } from "fs";
import { set as loSet, get as loGet } from "lodash";
import { resolve } from "path";
import { loaddir } from "..";

export class Config {
  _config: { [key: string]: any };
  /**
   * Create a new database
   * @param path The path to the Database you want to start.
   */
  constructor(path: string = "") {
    this._config = {};
    if (path) this.load(path);
  }

  load(path: string) {
    loaddir(path, (file, path) => {
      if (file.name.endsWith(".JSON")) {
        const fd = readFileSync(resolve(path.toString(), file.name), "utf-8");
        this._config[file.name.split(".")[0]] = JSON.parse(fd);
      }
    });
  }

  /**
   * Set a new config setting.
   * @param path The path to the setting to create
   * @param value The value to set
   * @returns
   */
  set(path: string, value: any) {
    loSet(this._config, path, value);
    return this;
  }

  /**
   * retrive a setting from the config object.
   * @param path The path to the config setting to get
   * @returns
   */
  get(path: string) {
    return loGet(this._config, path);
  }
}

export const config = new Config();
