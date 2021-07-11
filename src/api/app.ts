import { Server as IoServer, Socket } from "socket.io";
import express, { Request } from "express";
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
app.use(express.json());

export interface MUSocket extends Socket {
  cid?: string;
  dbref?: number;
}

export interface Context {
  id: string;
  socket: MUSocket;
  data: { [key: string]: any };
  player?: DBObj;
  expr?: Expression;
  msg?: string;
}

export interface MuRequest extends Request {
  player?: DBObj;
}

const io = new IoServer(server);

io.on("connect", (socket: MUSocket) => {
  // send a connect message!
  socket.join(socket.id);

  socket.on("message", async (ctx: Context) => {
    ctx.socket = socket;
    ctx.id = socket.id;
    await hooks.execute(ctx);
  });
});

export type Data = { [key: string]: any };

export { app, server, io, express };
