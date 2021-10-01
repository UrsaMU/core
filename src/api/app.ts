import express, { Request } from "express";
import cors from "cors";
import helmet from "helmet";

import { DbObj, IDbObj } from "../models/dbobj";
import { Expression } from "@ursamu/parser";
import expressWs from "express-ws";
import WebSocket from "ws";
import { nanoid } from "nanoid";
import { hooks } from "./hooks";
import { remConn } from "./connections";
import { emitter } from "./Emitter";
export { Next } from "@digibear/middleware";
const ExpressApp = express();

const wsExpress = expressWs(ExpressApp);
const app = wsExpress.app;

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

wsExpress.app.ws("/", (ws: MUSocket, req) => {
  ws.id = nanoid();

  ws.on("message", (data) => {
    // Only continue of there is an id associated with the socket.
    let ctx: Context = JSON.parse(data.toString());

    if (ws.id) {
      ctx.id = ws.id;
      ws.width = ctx.data.width || 78;

      ctx.socket = ws;

      hooks.input.execute(ctx);
    }
  });

  ws.on("close", async () => {
    if (ws.cid) remConn(ws.cid);
    console.log(ws.cid);
    const player = await DbObj.findOne({ dbref: ws.cid });
    emitter.emit("disconnected", player);
  });
});

export interface MUSocket extends WebSocket {
  id?: string;
  cid?: string;
  dbref?: string;
  width?: number;
}

export interface Context {
  id: string;
  socket: MUSocket;
  data: { [key: string]: any };
  player?: IDbObj;
  expr?: Expression;
  msg?: string;
  width?: number;
}

export interface MuRequest extends Request {
  player?: IDbObj;
}

export type Data = { [key: string]: any };

export { app, wsExpress };
