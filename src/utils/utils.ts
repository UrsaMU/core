import bcrypt from "bcrypt";
import { Dirent, existsSync, PathLike } from "fs";
import { readdir, readFile } from "fs/promises";
import jwt from "jsonwebtoken";
import { join } from "path";
import { DbObj, IDbObj } from "../models/dbobj";
import { flags } from "../api/flags";
import { Context, Data } from "../api/app";
import { conns } from "../api/conns";
import { force, hooks } from "../api/hooks";
import { send } from "../api/broadcast";

/**
 * Hash a string.
 * @param pass The password to hash
 * @returns
 */
export const hash = (pass: string): Promise<string> =>
  new Promise((resolve, reject) =>
    bcrypt.hash(pass, 10, (err, encr) => {
      if (err) reject(err);
      resolve(encr);
    })
  );

/**
 * Compare a hashed string to it's plantext counterpart.
 * @param data The plan text representation of the hashed string
 * @param pass Hashed string
 * @returns
 */
export const compare = (data: string, pass: string): Promise<Boolean> =>
  new Promise((resolve, reject) =>
    bcrypt.compare(data, pass, (err, comp) => {
      if (err) reject(err);
      resolve(comp);
    })
  );

/**
 * Create a new JWT
 * @param dbref The dbref of the object to send in the token.
 * @param secret The game secret for signing JWTs
 * @returns
 */
export const sign = (
  dbref: string,
  secret: string
): Promise<string | undefined> =>
  new Promise((resolve, reject) => {
    jwt.sign(dbref, secret, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });

/**
 * Validate a JWT
 * @param token The toeken to validate
 * @param secret The secret to use as a key.
 * @returns
 */
export const verify = (token: string, secret: string): Promise<any> =>
  new Promise((resolve, reject) =>
    jwt.verify(token, secret, (err, res) => {
      if (err) reject(err);
      resolve(res);
    })
  );

/**
 * Load all js files from a directory.
 * @param path The path to the files to handle.
 * @param cb optional callback function.
 */
export const loaddir = async (
  path: string,
  cb?: (file: Dirent, path: PathLike) => Promise<void> | void
) => {
  if (existsSync(path)) {
    const dirent = await readdir(path, {
      withFileTypes: true,
    });
    for (const file of dirent) {
      if (cb) {
        await cb(file, path);
      } else {
        if (
          (file.name.endsWith(".ts") || file.name.endsWith(".js")) &&
          !file.name.endsWith(".d.ts")
        ) {
          const module = await import(path + file.name);
          if (module.default) await module.default();
        } else if (file.isDirectory()) {
          const module = await import(join(path, file.name, "index"));
          if (module.default) await module.default();
        }
      }
    }
  }
};

/**
 * Load a file from a given path.
 * @param path Tge path to the file.
 * @returns
 */
export const loadText = async (path: string) => {
  return await readFile(path, { encoding: "utf-8" });
};

/**
 * Return the next available DBref number.
 * @returns
 */
export const id = async () => {
  const dbrefs = (await DbObj.find({}).populate("dbref").exec()) as number[];

  var mia = dbrefs.sort().reduce(function (acc: number[], cur, ind, arr) {
    var diff = cur - arr[ind - 1];
    if (diff > 1) {
      var i = 1;
      while (i < diff) {
        acc.push(arr[ind - 1] + i);
        i++;
      }
    }
    return acc;
  }, []);
  return mia.length > 0 ? `#${mia[0]}` : `#${dbrefs.length}`;
};

/**
 * Set or undset flags on an object.
 * @param obj The DbObj to modify
 * @param flgs The flag expression to set.
 * @returns
 */
export const setflags = async (obj: any, flgs: string) => {
  const { tags, data } = flags.set(obj.flags, obj.data, flgs);
  obj.flags = tags;
  obj.data = data;
  return obj;
};

/**
 * change settings on a dbogj
 * @param obj The object to modify
 * @param f flags to add to the object
 * @param d data to add to the object
 * @returns
 */
export const set = async (obj: IDbObj, f: string, d: Data = {}) => {
  const { tags, data } = flags.set(obj.flags, obj.data, f);
  obj.flags = tags;
  obj.data = { ...obj.data, ...data, ...d };
  obj.markModified("flags");
  setTimeout(() => obj.save(), 100);
  return obj;
};

/**
 * Log a character in
 * @param ctx The request contrext object.
 * @returns
 */
export const login = async (ctx: Context): Promise<IDbObj | undefined> => {
  const { name, password, token } = ctx.data;
  if (name && password) {
    let player: IDbObj = await DbObj.findOne({
      name: new RegExp("^" + name, "i"),
    });

    // If the password checks, the player is verified.
    if (player && (await compare(password, player.password || ""))) {
      player.temp = { ...{}, ...{ lastCommand: Date.now() } };
      player = await set(player, "connected");
      ctx.socket.cid = player.dbref;
      const socket = conns.has(player.dbref);
      if (!socket) conns.add(ctx.socket);

      const token = await sign(player.dbref, process.env.SECRET || "");

      await hooks.connect.execute(player);
      await send(ctx.socket, "Connected!!", { token });
      await force(ctx, "look");
      return player;
    }
  } else if (token) {
    const dbref = await verify(token, process.env.SECRET || "");

    if (dbref) {
      const player: IDbObj = await DbObj.findOne({ dbref });
      const socket = conns.has(dbref);
      await set(player, "connected");
      if (!socket) conns.add(ctx.socket);

      ctx.socket.cid = dbref;
      return player;
    }
  }
};

export const target = async (enactor: IDbObj, tar: string): Promise<IDbObj> => {
  switch (tar.toLowerCase().trim()) {
    case "me":
      return enactor;
    case "here" || "":
      return await DbObj.findOne({ dbref: enactor.loc });
    default:
      return await DbObj.findOne({
        $or: [
          { name: new RegExp(tar, "i") },
          { dbref: new RegExp(tar, "i") },
          { alias: new RegExp(tar, "i") },
        ],
      });
  }
};

export const idle = (secs: number) => {
  const curr = Date.now();
  const past = secs;
  secs = Math.floor((curr - secs) / 1000);
  const mins = Math.floor((curr - past) / (1000 * 60));
  const hrs = Math.floor((curr - past) / (1000 * 60 * 60));

  if (hrs) return hrs + "h";
  if (mins) return mins + "m";
  return secs + "s";
};

/**
 * Return a boolean value if a player can see something.
 * @param en The action enactor
 * @param tar The action target
 * @returns
 */
export const canSee = (en: IDbObj, tar: IDbObj) =>
  (tar.flags.includes("dark") && flags.lvl(en.flags) >= flags.lvl(tar.flags)) ||
  (flags.check(en.flags, "staff+") && tar.flags.includes("dark")) ||
  flags.check(tar.flags, "!dark");
