import { Socket, Server as IoServer } from "socket.io";
import { hooks } from "./hooks";
import express, { NextFunction, Request, Response } from "express";
import { createServer } from "http";
import { config, plugins } from "..";
import mongoose from "mongoose";
import user from "../routes/userRoutes";
import dbobjRoutes from "../routes/dbobjRoutes";
import authRoutes from "../routes/authRoutes";
import { join } from "path";
import authReq from "../middleware/authReq";
import execRoutes from "../routes/execRoutes";

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

io.on("connection", (socket: Socket) => {
  socket.join(socket.id);

  socket.on("message", (ctx) => {
    ctx.id = socket.id;
    ctx.socket = socket;
    hooks.input.execute(ctx);
  });
});

server.listen(config.get("port") || 4000, () => {
  console.log("server Listening on port " + config.get("port"));
  mongoose.connect(process.env.DATABASE_URI || "", async () => {
    console.log("MongoDB Connected.");
    await plugins(join(__dirname, "../plugins/"));
    await plugins(join(__dirname, "../commands/"));
    hooks.startup.execute({});
  });
});

export { io, server, express, mongoose };
