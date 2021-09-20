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
  width?: number;
}

export interface Context {
  id: string;
  socket: MUSocket;
  data: { [key: string]: any };
  player?: DBObj;
  expr?: Expression;
  msg?: string;
  width?: number;
}

export interface ChannelEntry {
  _id: string;
  name: string;
  title: string;
  mask: string;
  alias: string;
  joined?: boolean;
}

export interface Channel {
  [key: string]: any;
  _id?: string;
  name: string;
  header?: string;
  display?: string;
  access?: string;
  read?: string;
  write?: string;
  modify?: string;
  private?: boolean;
  loud?: boolean;
  mask?: boolean;
  alias?: string;

  description?: string;
}
export interface MuRequest extends Request {
  player?: DBObj;
}

const io = new IoServer(server);

export type Data = { [key: string]: any };

export { app, server, io, express };
