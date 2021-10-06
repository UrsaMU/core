import { Server } from "socket.io";
import { Data } from "..";
import { parser } from "./parser";

export default (io: Server) => {
  /**
   *
   * @param id The ID of the socket connection to send the message to.
   * @param msg The message to send.
   * @param data Any data to be sent with the message to the client.
   * @example send(ctx.id, "This is a rest", {some: "data"})
   * @returns
   */
  const send = async (id: string, msg: string, data: Data = {}) => {
    io.to(id).emit("message", {
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
    return this;
  };

  const broadcastTo = async (
    location: string,
    msg: string,
    data: Data = {}
  ) => {
    io.to(location).emit("message", {
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
    return this;
  };

  /**
   * Broadcast a message to all connected sockets.
   * @param msg The message to broadcast
   * @param data Any data to be sent to the client
   * @returns
   */
  const broadcast = async (msg: string, data: Data = {}) => {
    io.emit("message", {
      msg: parser.substitute(
        data.type || "telnet",
        await parser.string(data.type || "telnet", {
          msg,
          data,
          scope: {
            ...{ "%#": "" },
            ...data.scope,
          },
        })
      ),
      data,
    });
    return this;
  };

  return { broadcast, broadcastTo, send };
};
