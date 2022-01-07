import { Context, dbObj, Next, verify } from "..";
import { handleConnect } from "../utils/utils";

export default async (ctx: Context, next: Next) => {
  if (ctx.data?.token) {
    const dbref = await verify(ctx.data.token);
    const player = await dbObj.findOne({ dbref: dbref });
    if (player) ctx.player = player;
    handleConnect(ctx);
  }

  next();
};
