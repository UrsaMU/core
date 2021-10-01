import { execSync } from "child_process";
import { join } from "path";
import { hooks } from "../../api/hooks";

export default async () => {
  try {
    const output = execSync("which pm2");
    if (!output) {
      return console.error(
        "You must install pm2 'npm -g pm2' in order to use the telnet service."
      );
    }
    execSync(`pm2 start ${join(__dirname, "telnet.js")} --name telnet`);
    console.log("Telnet Module lodaded.");
    hooks.shutdown.use(async (_, next) => {
      execSync("pm2 delete telnet");
      next();
    });
  } catch {
    hooks.shutdown.use(async (_, next) => {
      execSync("pm2 delete telnet");
      next();
    });
  }
};
