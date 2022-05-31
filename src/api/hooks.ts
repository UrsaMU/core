import { pipeline, Next } from "@digibear/middleware";
import { createServer } from "http";
import { Context } from "..";

export const hooks = {
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
  ctx.msg = command;
  ctx.data ||= {};
  ctx.data.force = true;

  await hooks.input.execute(ctx);
};
