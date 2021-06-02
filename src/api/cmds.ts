import { Context } from "./app";

export interface Cmd {
  name: string;
  pattern: RegExp | string;
  render: (args: string[], ctx: Context) => Promise<void>;
  flags?: string;
  help?: string;
}

const cmds: Cmd[] = [];

/**
 * Add one or more commands to the server.
 * @param commands The coma seperated list of commands to add to the system.
 * @returns
 */
export const addCmd = (...commands: Cmd[]) =>
  commands.forEach((cmd) => cmds.push(cmd));
export { cmds };
