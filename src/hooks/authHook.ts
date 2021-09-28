import { Context, Next } from "../api/app";
import { conns, getSocket } from "../api/connections";
import { verify } from "../utils/utils";

export default async (ctx: Context, next: Next) => {
  const { token } = ctx.data;

  if (token) {
    const dbref = await verify(token, process.env.SECRET || "");
    if (dbref) {
      const socket = getSocket(dbref);
      ctx.socket.cid = dbref;
      if (!socket) conns.push(ctx.socket);
    }
  }
  next();
};
