import { Next } from "@digibear/middleware";
import { Context } from "../api/app";
import { send } from "../api/broadcast";
import { matchCmd } from "../api/cmds";
import { DbObj, IDbObj } from "../models/dbobj";
import { idleColor } from "../utils/formatting";

export default async (ctx: Context, next: Next) => {
  const { args, cmd } = await matchCmd(ctx);
  const player: IDbObj = await DbObj.findOne({ dbref: ctx.socket.cid });

  try {
    if (cmd) {
      if (player) {
        player.temp.lastCommand = Date.now();

        player.markModified("temp.lastCommand");
        await player.save();
        const p2: IDbObj = await DbObj.findOne({ dbref: ctx.socket.cid });
        console.log(idleColor(p2.temp.lastCommand));
      }
      return await cmd.render(args, ctx);
    }
  } catch (error: any) {
    send(ctx.socket, `D'Oh! Error detected!: ${error.stack.toString()}`);
  }
  next();
};
