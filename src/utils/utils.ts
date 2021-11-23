import { Socket } from "socket.io";
import { Context, flags, send, setFlag } from "..";
import { dbObj, DBObj } from "../models/DBObj";

/**
 * Return the next available DBref number.
 * @returns
 */
export const id = async () => {
  const dbrefs = await dbObj.find({}).populate("dbref").exec();
  return `#${dbrefs.length}`;
};

const set = async (obj: DBObj, flgs: string) => {
  const { data, tags } = flags.set(obj.flags || "", obj.data || {}, flgs);
  obj.flags = tags;
  obj.data = data;
  await dbObj.findOneAndUpdate({ dbref: obj.dbref }, { data, flags: tags });
  return obj;
};

export const handleConnect = async (ctx: Context) => {
  // Handle channels via socket if one exists.
  if (ctx.socket && ctx.player) {
    ctx.socket.join(ctx.player.location || "");
    ctx.socket.join(ctx.player.dbref!);
    ctx.player.channels?.forEach((channel) => ctx.socket?.join(channel));
    ctx.socket.pid = ctx.player?.dbref;

    await set(ctx.player, "connected");
    send(ctx.player?.dbref!, "Connected!", { token: ctx.data?.token });
  }
};
