import { readdirSync, readFileSync } from "fs";
import { set as loSet, get as loGet } from "lodash";

export class Config {
  _config: { [key: string]: any };
  constructor(path: string) {
    this._config = {};
    const dirent = readdirSync(path, {
      encoding: "utf-8",
      withFileTypes: true,
    });
    for (const dir of dirent) {
      if (dir.isFile() && dir.name.endsWith(".json")) {
        this._config = this._config[dir.name.split(".")[0]] = JSON.parse(
          readFileSync(path + `/${dir.name}`, { encoding: "utf-8" })
        );
      }
    }
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
