import { Context, dbObj, flags, send } from "..";
import { DBObj } from "../declorations";

/**
 * Return the next available DBref number.
 * @returns
 */
export const id = async () => {
  const dbrefs = await dbObj.find({});
  return `#${dbrefs.length}`;
};

/**
 * Set a list of flags on an object.
 * @param obj The obj to set the flag expression on.
 * @param flgs The flag expression to set on the object.
 * @returns
 */
export const setFlgs = async (obj: DBObj, flgs: string) => {
  const { data, tags } = flags.set(obj.flags || "", obj.data || {}, flgs);
  obj.flags = tags;
  obj.data = data;
  await dbObj.findOneAndUpdate({ dbref: obj.dbref }, obj);
  return obj;
};

/**
 * Handle a new connection to the game.
 * @param ctx The context object.
 */
export const handleConnect = async (ctx: Context) => {
  // Handle channels via socket if one exists.
  if (ctx.socket && ctx.player) {
    ctx.socket.join(ctx.player.location || "");
    ctx.socket.join(ctx.player.dbref!);

    ctx.socket.pid = ctx.player?.dbref;

    await setFlgs(ctx.player, "connected");

    // join channels
    ctx.player.channels.forEach((chan) => {
      if (chan.joined) ctx.socket?.join(chan.name);
    });

    await send(ctx.player?.dbref!, "", { token: ctx.data?.token });
  }
};

/**
 * Try to determine what the enactor is trying to target.
 * @param ctx The Context object
 * @param str The string to match
 * @returns
 */
export const target = async (ctx: Context, str: string = "") => {
  switch (str.toLowerCase()) {
    case "me":
      return ctx.player;
    case "":
    case "here":
      if (ctx.player?.location) {
        return await dbObj.findOne({ dbref: ctx.player?.location });
      }
    default:
      const regex = RegExp(str, "i");
      return await dbObj.findOne({
        $or: [{ name: regex }, { alias: regex }, { dbref: regex }],
      });
  }
};

/**
 * Get an object's name depending on the lookers relationship to the lookee.
 * @param en The command enactor (looker)
 * @param tar The target (lookee)
 * @returns
 */
export const name = (en: DBObj, tar: DBObj) => {
  if (flags.check(en.flags || "", tar.flags || "") || tar.owner === en.dbref) {
    return `${tar.name}(${tar.dbref}${flags.codes(tar.flags || "")})`;
  } else {
    return tar.name;
  }
};

export const msgFmt = (msg: string) => {
  const msgPieces = msg.split(" ");
  msgPieces.shift();
  msg = msgPieces.join(" ").trim();
  // poses
  if (msg.startsWith(":") || msg.startsWith(";")) {
    return `${msg[0] === ":" ? " " : ""}${msg.slice(1)}`;
  }

  return ` says, "${msg.trim()}"`;
};
