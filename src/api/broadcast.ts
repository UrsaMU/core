import { Data, MUSocket } from "./app";
import { DbObj, IDbObj } from "../models/dbobj";
import { parser } from "./parser";
import { conns, getSocket } from "./connections";

/**
 *
 * @param id The ID of the socket connection to send the message to.
 * @param msg The message to send.
 * @param data Any data to be sent with the message to the client.
 * @example send(ctx.id, "This is a rest", {some: "data"})
 * @returns
 */
export const send = async (socket: MUSocket, msg: string, data: Data = {}) => {
  const message = JSON.stringify({
    msg: await parser.string("telnet", {
      msg,
      data,
      scope: {
        ...{ "%#": "" },
        ...data.scope,
      },
    }),
    data,
  });

  socket.send(message);
};

export const broadcast = async (msg: string) => {
  for (const conn of conns) {
    await send(conn, msg);
  }
};

export const broadcastTo = async (players: IDbObj[], msg: string) => {
  for (const player of players) {
    const socket = getSocket(player.dbref);
    if (socket) await send(socket, msg);
  }
};
