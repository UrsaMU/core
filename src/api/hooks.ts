import { pipeline, Next } from "@digibear/middleware";
import { Context } from "./app";

export const hooks = pipeline<Context>();
export { Next };

export const force = async (ctx: Context, command: string) => {
  await hooks.execute({
    ...ctx,
    ...{ msg: command },
  });
};
