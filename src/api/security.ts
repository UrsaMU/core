import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
export const sign = (id: any): Promise<string | undefined> =>
  new Promise((resolve, reject) =>
    jwt.sign(id, process.env.SECRET || "", {}, (err, token) => {
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
export const verify = (token: string): Promise<any> =>
  new Promise((resolve, reject) =>
    jwt.verify(token, process.env.SECRET || "", (err, res) => {
      if (err) reject(err);
      resolve(res);
    })
  );
