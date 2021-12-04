import { Context, flags, send } from "..";
import { dbObj, DBObj } from "../models/DBObj";

/**
 * Return the next available DBref number.
 * @returns
 */
export const id = async () => {
  const dbrefs = await dbObj.find({}).populate("dbref").exec();
  return `#${dbrefs.length}`;
};

export const setFlgs = async (obj: DBObj, flgs: string) => {
  const { data, tags } = flags.set(obj.flags || "", obj.data || {}, flgs);
  obj.flags = tags;
  obj.data = data;
  await dbObj.findOneAndUpdate({ dbref: obj.dbref }, obj);
  return obj;
};

export const handleConnect = async (ctx: Context) => {
  // Handle channels via socket if one exists.
  if (ctx.socket && ctx.player) {
    ctx.socket.join(ctx.player.location || "");
    ctx.socket.join(ctx.player.dbref!);
    ctx.player.channels?.forEach((channel) => ctx.socket?.join(channel));
    ctx.socket.pid = ctx.player?.dbref;

    await setFlgs(ctx.player, "connected");
    await send(ctx.player?.dbref!, "", { token: ctx.data?.token });
  }
};

export const target = async (ctx: Context, str: string) => {
  switch (str.toLowerCase()) {
    case "me":
      return ctx.player;
    case "":
    case "here":
      return (
        await ctx.sdk?.get({
          dbref: ctx.player?.location?.slice(1) || "",
        })
      )[0];
    default:
      const regex = RegExp(str, "i");
      return (
        await ctx.sdk?.get({
          $or: [{ name: regex }, { alias: regex }, { dbref: str.slice(1) }],
        })
      )[0];
  }
};
