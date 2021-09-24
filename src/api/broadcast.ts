import { Data, MUSocket } from "./app";
import { DbObj } from "../models/dbobj";
import { parser } from "./parser";
import { getSocket } from "./connections";

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
