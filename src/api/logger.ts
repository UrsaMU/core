import chalk from "chalk";
import { EventEmitter } from "stream";

class Logger extends EventEmitter {
  constructor() {
    super();
  }

  _getTimeStamp() {
    const date = new Date();
    const hrs = date.getHours().toString().padStart(2, "0");
    const mins = date.getMinutes().toString().padStart(2, "0");
    const secs = date.getSeconds().toString().padStart(2, "0");

    return `${hrs}:${mins}:${secs}`;
  }

  info(...strs: string[]) {
    console.log(
      `[${chalk.cyanBright("INFO")}] ${chalk.gray(this._getTimeStamp())}`,
      ...strs
    );
  }

  error(...strs: string[]) {
    console.log(
      `[${chalk.redBright("ERROR")}] ${chalk.gray(this._getTimeStamp())}`,
      ...strs
    );
  }
}

export const logger = new Logger();
