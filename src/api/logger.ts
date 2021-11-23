import chalk from "chalk";
import { EventEmitter } from "stream";

class Logger extends EventEmitter {
  constructor() {
    super();
  }

  info(...strs: string[]) {
    const date = new Date();
    const hrs = date.getHours().toString().padStart(2, "0");
    const mins = date.getMinutes().toString().padStart(2, "0");
    const secs = date.getSeconds().toString().padStart(2, "0");

    const combinedTime = `${hrs}:${mins}:${secs}`;

    console.log(
      `[${chalk.cyanBright("INFO")}] ${chalk.gray(combinedTime)}`,
      ...strs.map((str) => " " + str)
    );
  }
}

export const logger = new Logger();
