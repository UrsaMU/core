import { Context, send } from "..";

export default (ctx: Context) => {
  if (ctx.msg?.trim())
    send(ctx.id, "Huh? Type 'help' for help.", { log: false });
};
