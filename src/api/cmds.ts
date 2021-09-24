import { Context } from "./app";

export interface Cmd {
  name: string;
  pattern: RegExp;
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
  commands.forEach((cmd) => cmds.push(cmd));

/**
 * Match an input string with a registered command.
 * @param input The input string to match.
 * @returns
 */
export const matchCmd = (input: string) => {
  const command = cmds.find((cmd: Cmd) => input.match(cmd.pattern));
  const match = input.match(command?.pattern || "");
  return { args: Array.from(match || []), cmd: command };
};
export { cmds };
