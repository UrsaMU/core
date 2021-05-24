import { Server, Socket } from "socket.io";
import { DBObj } from "./database";
import { Data, server } from "./app";
import { Expression } from "@ursamu/parser";
import { hooks } from "./hooks";
import { parser } from "./parser";
import { getSocket } from "./connections";
import { io } from "./app";

export const send = async (id: string, msg: string, data: Data = {}) => {
  io.to(id).emit("message", {
    msg: parser.substitute(
      data.type || "telnet",
      await parser.string(data.type || "telnet", {
        msg,
        data,
        scope: {
          ...{ "%#": getSocket(id)?.cid || "" },
          ...data.scope,
        },
      })
    ),
    data: data.transmit || {},
  });
  return this;
};

export const broadcast = async (msg: string, data: Data = {}) => {
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
    data: data.transmit || {},
  });
  return this;
};
