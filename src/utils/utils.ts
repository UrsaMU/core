import bcrypt from "bcrypt";
import { Dirent, existsSync, PathLike } from "fs";
import { readdir, readFile } from "fs/promises";
import jwt from "jsonwebtoken";
import { join } from "path";
import { DbObj, IDbObj } from "../models/dbobj";
import { flags } from "../api/flags";

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
  await obj.save();
  return obj;
};

interface LoginOptions {
  name?: string;
  password?: string;
  token?: string;
}
export const login = async ({
  name,
  password,
  token,
}: LoginOptions): Promise<IDbObj | undefined> => {
  let player;

  if (name && password) {
    const tempPlayer = await DbObj.findOne({
      name: new RegExp("^" + name, "i"),
    });

    // If the password checks, the player is verified.
    if (tempPlayer && (await compare(password, tempPlayer.password))) {
      player = await setflags(tempPlayer, "connected");
      player.temp = { lastCommand: Date.now() };
      player.save();
    }
  } else if (token) {
    const data = await verify(token, process.env.SECRET || "");
    // If the token checks out, the player is verified.
    const tempPlayer = await DbObj.findOne({ dbref: data.id });
    if (tempPlayer) {
      player = await setflags(tempPlayer, "conencted");
    }
  }

  return player;
};

export const target = async (enactor: IDbObj, tar: string) => {
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
