import { Server as IoServer } from "socket.io";
import { hooks } from "./hooks";
import express, { NextFunction, Request, Response } from "express";
import { createServer } from "http";
import {
  config,
  Context,
  DBObj,
  logger,
  MUSocket,
  plugins,
  send,
  getPlugins,
} from "..";
import dbobjRoutes from "../routes/dbobjRoutes";
import authRoutes from "../routes/authRoutes";
import { join } from "path";
import authReq from "../middleware/authReq";
import { setFlgs } from "../utils/utils";
import checkCmd from "../hooks/checkCmd";
import huh from "../hooks/huh";
import checkLimbo from "../hooks/checkLimbo";
import cleanShutdown from "../hooks/cleanShutdown";
import cors from "cors";
import { DB } from "./database";
import verifyToken from "../hooks/verifyToken";
import { Channel } from "../declorations";
import { textFiles } from "./plugins";

const app = express();
app.use(cors());
const server = createServer(app);
const io = new IoServer(server);
app.use(express.json());
app.use("/dbobjs", authReq, dbobjRoutes);
app.use("/auth", authRoutes);

// declate databases
export const dbObj = new DB<DBObj>(join(__dirname, "../../data/objs.db"));
export const channel = new DB<Channel>(join(__dirname, "../../data/chans.db"));

// Default Error handler.
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({ message: "ERROR: " + err.message });
});

io.on("connection", (socket: MUSocket) => {
  socket.join(socket.id);

  socket.on("message", async (ctx: Context) => {
    ctx.id = socket.id;
    ctx.socket = socket;

    ctx.config = config;
    ctx.width = ctx.data?.width;

    if (ctx.data?.login) {
      send(ctx.id, textFiles.get("connect") || "");
    }
    hooks.input.use(huh);
    hooks.input.execute(ctx);
  });

  socket.on("disconnect", async () => {
    const player = await dbObj.findOne({ dbref: socket.pid });
    if (player) setFlgs(player, "!connected");
  });
});

interface StartOptions {
  port?: string;
  telnetPort?: string;
  load?: () => any | Promise<any>;
}

export const start = ({
  port = "4000",
  telnetPort = "4001",
  load = () => {},
}: StartOptions = {}) => {
  process.env.PORT = port;
  process.env.TELNETPORT = telnetPort;

  server.listen(process.env.PORT, async () => {
    logger.info("server Listening on port: " + process.env.PORT);
    await plugins(join(__dirname, "../commands/"));
    logger.info("Commands directory loaded.");
    await plugins(join(__dirname, "../plugins/"));
    getPlugins();
    logger.info("Plugins directory loaded.");
    await plugins(join(__dirname, "../../text/"));
    logger.info("Text files loaded.");
    hooks.startup.use(checkLimbo);
    hooks.input.use(verifyToken, checkCmd);
    load();
    await hooks.startup.execute({});
  });
};

export { io, server, express };

process.on("SIGINT", async () => {
  // This should be the very last hook in the pipeline as it holds our process#exit call.
  hooks.shutdown.use(cleanShutdown);
  hooks.shutdown.execute({});
});
