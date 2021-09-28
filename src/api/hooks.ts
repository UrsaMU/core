import { pipeline, Next, Pipe, Middleware } from "@digibear/middleware";
import { Context } from "./app";

export const hooks = {
  input: pipeline<Context>(),
  start: pipeline<{ [key: string]: any }>(),
  shutdown: pipeline<{ [key: string]: any }>(),
  custom: new Map<string, Pipe<Context | { [key: string]: any }>>(),
};

export type HookData = { [key: string]: any };
export { Next };

export const force = async (ctx: Context, command: string) => {
  await hooks.input.execute({
    ...ctx,
    ...{ msg: command },
    ...{ ...ctx.data, ...{ found: false } },
  });
};
