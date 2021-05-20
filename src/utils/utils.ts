import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db, DBObj } from "../api/database";
import { flags } from "../api/flags";

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

export const sign = (id: string): Promise<string | undefined> =>
  new Promise((resolve, reject) =>
    jwt.sign(
      { id },
      "holyshitchangethis",
      { expiresIn: "1d" },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    )
  );

export const verify = (token: string) =>
  new Promise((resolve, reject) =>
    jwt.verify(token, "holyshitchangethis", (err, res) => {
      if (err) reject(err);
      resolve(res);
    })
  );
