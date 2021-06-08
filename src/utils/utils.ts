import bcrypt from "bcrypt";
import { readdir, readFile } from "fs/promises";
import jwt from "jsonwebtoken";

export const hash = (pass: string): Promise<string> =>
  new Promise((resolve, reject) =>
    bcrypt.hash(pass, 10, (err, encr) => {
      if (err) reject(err);
      resolve(encr);
    })
  );

export const compare = (data: string, pass: string): Promise<Boolean> =>
  new Promise((resolve, reject) =>
    bcrypt.compare(data, pass, (err, comp) => {
      if (err) reject(err);
      resolve(comp);
    })
  );

export const sign = (id: string, secret: string): Promise<string | undefined> =>
  new Promise((resolve, reject) =>
    jwt.sign({ id }, secret, { expiresIn: "1d" }, (err, token) => {
      if (err) reject(err);
      resolve(token);
    })
  );

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
 */
export const loaddir = async (path: string) => {
  const dirent = await readdir(path, {
    withFileTypes: true,
  });
  for (const file of dirent) {
    if (file.name.endsWith(".ts")) {
      const module = await import(path + file.name);
      if (module.default) await module.default();
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
