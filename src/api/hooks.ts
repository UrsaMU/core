import { pipeline, Next } from "@digibear/middleware";
import { createServer } from "http";
import { Context } from "..";

export const hooks = {
  input: pipeline<Context>(),
  startup: pipeline<any>(),
  shutdown: pipeline<any>(),
  connectn: pipeline<any>(),
  disconnect: pipeline<any>(),
  reconnect: pipeline<any>(),
};

export { Next };

export const force = async (ctx: Context, command: string) => {
  await hooks.input.execute({
    ...ctx,
    ...{ msg: command },
    ...{ ...ctx.data, ...{ found: false } },
  });
};
