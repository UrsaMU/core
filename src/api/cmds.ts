import { DbObj } from "../models/dbobj";
import { Context } from "./app";
import { flags } from "./flags";

export interface Cmd {
  name: string;
  pattern: RegExp | string;
  render: (args: string[], ctx: Context) => Promise<void>;
  flags?: string;
  help?: string;
  hidden?: boolean;
}

const cmds: Cmd[] = [];

/**
 * Add one or more commands to the server.
 * @param commands The coma seperated list of commands to add to the system.
 * @returns
 */
export const addCmd = (...commands: Cmd[]) =>
  commands.forEach((cmd) => {
    if (typeof cmd.pattern === "string") {
      const tempPattern = cmd.pattern
        .replace(/([\/\+\(\))])/g, "\\$1")
        .replace(/\*/g, "(.*)")
        .replace(/\s+/, "\\s+")
        .replace(/^\./, "[\\+@]");
      cmd.pattern = new RegExp("^" + tempPattern, "i");
    }

    cmds.push(cmd);
  });

/**
 * Match an input string with a registered command.
 * @param input The input string to match.
 * @returns
 */
export const matchCmd = async (ctx: Context) => {
  const player = await DbObj.findOne({ dbref: ctx.socket.cid || "" });

  const command = cmds.find((cmd: Cmd) => {
    if (
      ctx.msg?.match(cmd.pattern) &&
      flags.check(player?.flags || "", cmd.flags || "")
    ) {
      return true;
    }
    return false;
  });
  const match = ctx.msg?.match(command?.pattern || "");
  return { args: Array.from(match || []), cmd: command };
};
export { cmds };
