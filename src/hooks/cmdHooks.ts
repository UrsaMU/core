import { Next } from "@digibear/middleware";
import { Context } from "../api/app";
import { send } from "../api/broadcast";
import { matchCmd } from "../api/cmds";

export default async (ctx: Context, next: Next) => {
  const { args, cmd } = matchCmd(ctx.msg || "");

  try {
    if (cmd) return await cmd.render(args, ctx);
  } catch (error: any) {
    send(ctx.socket, `D'Oh! Error detected!: ${error.stack.toString()}`);
  }
  next();
};
