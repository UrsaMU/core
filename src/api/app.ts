import { Server as IoServer, Socket } from "socket.io";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { Server } from "http";
import { DBObj } from "./database";
import { Expression } from "@ursamu/parser";
import { hooks } from "./hooks";

const app = express();
const server = new Server(app);

app.use(cors());
app.use(helmet());

export interface MUSocket extends Socket {
  width?: number;
  height?: number;
  cid?: string;
  dbref?: number;
}

export interface Context {
  id: string;
  socket: MUSocket;
  data?: { [key: string]: any };
  player?: DBObj;
  expr?: Expression;
  msg?: string;
}

const io = new IoServer(server);

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

export type Data = { [key: string]: any };

export { app, server, io, express };
