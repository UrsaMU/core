import { Data } from "..";
import { parser } from "./parser";
import { server } from "./app";

/**
 * Send a message to a client.
 * @param id The ID of the socket connection to send the message to.
 * @param msg The message to send.
 * @param data Any data to be sent with the message to the client.
 * @example send(ctx.id, "This is a rest", {some: "data"})
 * @returns
 */
export const send = async (id: string, msg: string, data: Data = {}) => {
  server.to(id).emit("message", {
    msg: parser.substitute(
      "telnet",
      (await parser.run({
        msg,
        data,
        scope: {
          ...{ "%#": "" },
          ...data.scope,
        },
      })) || ""
    ),
    data,
  });
  return this;
};

/**
 * Broadcast a message to all connected sockets.
 * @param msg The message to broadcast
 * @param data Any data to be sent to the client
 * @example
 * broadcast("This is a test", {some: "data"})
 * @returns
 */
export const broadcast = async (msg: string, data: Data = {}) => {
  server.emit("message", {
    msg: parser.substitute(
      "telnet",
      (await parser.run({
        msg,
        data,
        scope: {
          ...{ "%#": "" },
          ...data.scope,
        },
      })) || ""
    ),
    data,
  });
  return this;
};
