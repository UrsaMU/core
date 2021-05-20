import { sign } from "jsonwebtoken";
import { compare } from "../utils/utils";
import { MUSocket, send } from "./broadcast";
import { db } from "./database";
import { flags } from "./flags";

export const conns: MUSocket[] = [];

export const getSocket = (id: string) =>
  conns.find(
    (conn) =>
      conn.id === id ||
      conn.cid === id ||
      conn.dbref === parseInt(id.slice(1), 10)
  );

export const login = async (
  socket: MUSocket,
  name: string,
  password: string
) => {
  const regex = new RegExp(name, "i");
  const player = (await db.find({ name: regex }))[0];

  if (player) {
    if (player && (await compare(password, player.password || ""))) {
      const { tags } = flags.set(player.flags, {}, "connected");
      player.flags = tags;
      await db.update({ _id: player._id }, player);
      conns.push(socket);
      await send(player.location, `${player.name} has connected.`);
      socket.join(player.location);
      return await sign(player._id!, process.env.SECRET!);
    }
  }
};