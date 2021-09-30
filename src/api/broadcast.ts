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
      data: {
        ...data,
        ...{ width: socket.width || 78 },
      },
      scope: {
        ...{ "%#": "" },
        ...data.scope,
      },
    }),
    data,
  });

  socket.send(message);
};

/**
 *  Broadcast a message to all connected sockets.
 * @param msg The message to all sockets.
 */
export const broadcast = async (msg: string) => {
  for (const conn of conns) {
    await send(conn, msg);
  }
};

/**
 *  Send a message to a  collection of dbobjects.
 * @param players The array of player objects to send the message to.
 * @param msg Tje message to send
 */
export const broadcastTo = async (players: IDbObj[], msg: string) => {
  for (const player of players) {
    const socket = getSocket(player.dbref);
    if (socket) await send(socket, msg);
  }
};

/**
 * Send a message to a location.
 * @param dbref The dbref to send the message to.
 * @param msg The message to send.
 */
export const broadcastToLoc = async (dbref: string, msg: string) => {
  const players = await DbObj.find({
    $and: [{ loc: dbref }, { flags: /connected/i }],
  });
  for (const player of players) {
    const socket = getSocket(player.dbref);
    if (socket) await send(socket, msg);
  }
};
