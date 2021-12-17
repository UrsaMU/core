import { pipeline, Next, Pipe, Middleware } from "@digibear/middleware";
import { Context } from "..";

interface HookObject {
  [index: string]: any;
  input: Pipe<Context>;
  startup: Pipe<any>;
  shutdown: Pipe<any>;
  connect: Pipe<any>;
  disconnect: Pipe<any>;
  reconnect: Pipe<any>;
  commands: Map<string, CustHooks>;
}

interface CustHooks {
  before: Pipe<Context>;
  after: Pipe<Context>;
}

export const hooks: HookObject = {
  commands: new Map<string, CustHooks>(),
  input: pipeline<Context>(),
  startup: pipeline<any>(),
  shutdown: pipeline<any>(),
  connect: pipeline<any>(),
  disconnect: pipeline<any>(),
  reconnect: pipeline<any>(),
  add: function (
    name: string,
    when: "before" | "after",
    ...hooks: Middleware<Context>[]
  ) {
    name = name.toLowerCase();
    // The command already exsists, just add to it.
    if (this.commands.has(name)) {
      this.commands.get(name)?.[when].use(...hooks);

      // Else make a new instance!
    } else {
      this.commands.set(name, {
        before: pipeline<Context>(),
        after: pipeline<Context>(),
      });
      this.commands.get(name)?.[when].use(...hooks);
    }
  },
};

export { Next };
/**
 * Force a socket to execute a given command using the supplied context object.
 * @param ctx The context object to b e passed to the command
 * @param command The string to trigger the wanted command.
 * @example force(ctx, "look");
 */
export const force = async (ctx: Context, command: string) => {
  await hooks.input.execute({
    ...ctx,
    ...{ msg: command },
  });
};
