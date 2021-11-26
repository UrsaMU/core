import { Server as IoServer } from "socket.io";
import { hooks } from "./hooks";
import express, { NextFunction, Request, Response } from "express";
import { createServer } from "http";
import { config, logger, MUSocket, plugins, verify } from "..";
import mongoose from "mongoose";
import user from "../routes/userRoutes";
import dbobjRoutes from "../routes/dbobjRoutes";
import authRoutes from "../routes/authRoutes";
import { join } from "path";
import authReq from "../middleware/authReq";
import execRoutes from "../routes/execRoutes";
import { dbObj } from "../models/DBObj";
import { handleConnect, setFlgs } from "../utils/utils";
import checkCmd from "../hooks/checkCmd";
import huh from "../hooks/huh";
import checkLimbo from "../hooks/checkLimbo";

const app = express();
const server = createServer(app);
const io = new IoServer(server);
app.use(express.json());
app.use("/users", user);
app.use("/dbobjs", authReq, dbobjRoutes);
app.use("/auth", authRoutes);
app.use("/exec", execRoutes);

// Default Error handler.
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: "ERROR: " + err.message });
});

io.on("connection", (socket: MUSocket) => {
  socket.join(socket.id);

  socket.on("message", async (ctx) => {
    ctx.id = socket.id;
    ctx.socket = socket;
    if (ctx.data.token) {
      const dbref = await verify(ctx.data.token);
      ctx.player = await dbObj.findOne({ dbref: dbref });
      await handleConnect(ctx);
    }

    socket.on("disconnect", async () => {
      const player = await dbObj.findOne({ dbref: socket.pid });
      if (player) setFlgs(player, "!connected");
    });

    hooks.input.execute(ctx);
  });
});

export const start = () => {
  server.listen(config.get("port") || 4000, () => {
    logger.info("server Listening on port " + config.get("port"));
    mongoose.connect(process.env.DATABASE_URI || "", async () => {
      logger.info("MongoDB Connected.");
      await plugins(join(__dirname, "../plugins/"));
      await plugins(join(__dirname, "../commands/"));

      hooks.startup.use(checkLimbo);
      hooks.input.use(checkCmd, huh);
      hooks.startup.execute({});
    });
  });
};

export { io, server, express, mongoose };
