import { Server as IoServer, Socket } from "socket.io";
import express, { Request } from "express";
import cors from "cors";
import helmet from "helmet";
import { Server } from "http";
import { DBObj } from "./database";
import { Expression } from "@ursamu/parser";

const app = express();
const server = new Server(app);

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      imgSrc: ["self", "data:", "*"],
    },
  })
);

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

export interface Channel {
  name: string;
  header?: string;
  read?: string;
  write?: string;
  modify?: string;
}

export interface MuRequest extends Request {
  player?: DBObj;
}

const io = new IoServer(server);

export type Data = { [key: string]: any };

export { app, server, io, express };
