import { Context } from "..";

export interface Cmd {
  name: string;
  pattern: RegExp | string;
  render: (ctx: Context, args: string[]) => Promise<void>;
  flags?: string;
  help?: string;
  hidden?: boolean;
}

const cmds: Cmd[] = [];

/**
 * Add a list of command objects to the game.
 * @param commands A comma seperated list of command objects to be added to the game.
 * @example
 * addCmd({
 *  name: "test",
 *  pattern: "test",
 *  flags: "connected",
 *  render: (ctx) => await end(ctx.id, "This is a test!")
 * })
 * @returns
 */
export const addCmd = (...commands: Cmd[]) =>
  commands.forEach((cmd) => {
    if (typeof cmd.pattern === "string") {
      const tempPattern = cmd.pattern
        .replace(/([\/\+\(\))])/g, "\\$1")
        .replace(/\*/g, "(.*)")
        .replace(/\s+/, "\\s+")
        .replace(/=/g, "\\s*=\\s*")
        .replace(/^\./, "[\\+@]?");
      cmd.pattern = new RegExp("^" + tempPattern, "i");
    }

    cmds.push(cmd);
  });
/**
 * Match a command pattern and flags with a player.
 * @param ctx The Context being fed to the match system
 * @returns
 */
export const matchCmd = async (ctx: Context) => {
  const command = cmds.find((cmd) => {
    if (ctx.msg?.match(cmd.pattern)) {
      return true;
    }
    return false;
  });
  const match = ctx.msg?.match(command?.pattern || "");
  return { args: Array.from(match || []), cmd: command };
};

export { cmds };
