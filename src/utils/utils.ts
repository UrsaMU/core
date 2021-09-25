import bcrypt from "bcrypt";
import { Dirent, PathLike } from "fs";
import { readdir, readFile } from "fs/promises";
import jwt from "jsonwebtoken";
import { resolve } from "path";
import { DbObj } from "../models/dbobj";
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
 * @param id The ID of the object to send in the token.
 * @param secret The game secret for signing JWTs
 * @returns
 */
export const sign = (id: string, secret: string): Promise<string | undefined> =>
  new Promise((resolve, reject) =>
    jwt.sign({ id }, secret, { expiresIn: "1d" }, (err, token) => {
      if (err) reject(err);
      resolve(token);
    })
  );

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
        const pack = await readFile(
          resolve(path, file.name, "package.json"),
          "utf-8"
        );
        const data = JSON.parse(pack);
        const module = await import(path + data.main);
        if (module.default) await module.default();
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
  return mia.length > 0 ? mia[0] : dbrefs.length;
};

export const setflags = async (obj: any, flgs: string) => {
  const { tags, data } = flags.set(obj.flags, obj.data, flgs);
  obj.flags = tags;
  obj.data = data;
  await obj.save();
  return obj;
};
