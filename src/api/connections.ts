import { sign } from "jsonwebtoken";
import { compare } from "../utils/utils";
import { MUSocket } from "./app";
import { send } from "./broadcast";
import { DB, DBObj } from "./database";
import { flags } from "./flags";

export const conns: MUSocket[] = [];

/**
 *  Return the socket of an in-game object if a socket is available.
 * @param id The _id or dbref of the target who's socket we want to retreive.
 * @example
 * const socket = getSocket('wErwwSFfgdfu');
 * @returns
 */
export const getSocket = (id: string) =>
  conns.find(
    (conn) =>
      conn.id === id ||
      conn.cid === id ||
      conn.dbref === parseInt(id.slice(1), 10)
  );

/**
 *Log a player entiity into the game.
 * @param socket The socket that initiated the login process
 * @param name The name of the character to log in
 * @param password The password
 * @example const token = await login(ctx.socket, args[1], args[2]);
 * @returns
 */
export const login = async (
  socket: MUSocket,
  name: string,
  password: string
): Promise<string | undefined> => {
  const regex = new RegExp(name, "i");
  const player = (await DB.dbs.db.find<DBObj>({ name: regex }))[0];

  if (player) {
    if (player && (await compare(password, player.password || ""))) {
      const { tags } = flags.set(player.flags, {}, "connected");
      player.flags = tags;
      await DB.dbs.db.update({ _id: player._id }, player);
      socket.cid = player._id;
      conns.push(socket);
      await send(player.location, `${player.name} has connected.`);
      socket.join(player.location);
      return await sign(player._id!, process.env.SECRET!);
    }
  }
};
