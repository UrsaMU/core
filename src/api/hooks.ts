import { pipeline, Next, Pipe } from "@digibear/middleware";
import { Context } from "..";

interface HookObject {
  [index: string]: any;
  input: Pipe<Context>;
  startup: Pipe<any>;
  shutdown: Pipe<any>;
  connect: Pipe<any>;
  disconnect: Pipe<any>;
  reconnect: Pipe<any>;
}

export const hooks: HookObject = {
  input: pipeline<Context>(),
  startup: pipeline<any>(),
  shutdown: pipeline<any>(),
  connect: pipeline<any>(),
  disconnect: pipeline<any>(),
  reconnect: pipeline<any>(),
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
    ...ctx.data,
  });
};
