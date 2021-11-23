import { Data } from "..";
import { parser } from "./parser";
import { io } from "./app";
import { Msgs } from "../models/Msgs";

/**
 * Send a message to a client.
 * @param id The ID of the socket connection to send the message to.
 * @param msg The message to send.
 * @param data Any data to be sent with the message to the client.
 * @example send(ctx.id, "This is a rest", {some: "data"})
 * @returns
 */
export const send = async (
  id: string | string[],
  msg: string,
  data: Data = {}
) => {
  io.to(id).emit("message", {
    msg: msg,
    tars: id,
    data,
  });

  // Msgs.create({
  //   text: msg,
  //   data,
  //   tars: id,
  // });
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
  io.emit("message", {
    msg: parser.substitute("telnet", msg),
    data,
  });

  Msgs.create({
    text: parser.substitute("telnet", msg),
    data,
    tars: ["*"],
  });
};
