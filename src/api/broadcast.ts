import { Server, Socket } from "socket.io";
import { DBObj } from "./database";
import { server } from "./app";
import { Expression } from "@ursamu/parser";
import { hooks } from "./hooks";
import { parser } from "./parser";
import { getSocket } from "./connections";

export interface Context {
  id: string;
  socket: MUSocket;
  data?: { [key: string]: any };
  player?: DBObj;
  expr?: Expression;
  msg?: string;
}

export interface MUSocket extends Socket {
  width?: number;
  height?: number;
  cid?: string;
  dbref?: number;
}

const io = new Server(server);

io.on("connect", (socket: MUSocket) => {
  // send a connect message!
  socket.join(socket.id);
  socket.send({ data: { connected: true }, msg: "" });

  socket.on("message", async (ctx: Context) => {
    ctx.socket = socket;
    ctx.id = socket.id;
    socket.width = ctx.data?.width;
    await hooks.execute(ctx);
  });
});

type Data = { [key: string]: any };

interface MsgOpts {
  id: string;
  data?: Data;
  msg: string;
}

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
