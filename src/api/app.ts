import { Socket, Server as IoServer } from "socket.io";
import { hooks } from "./hooks";
import express from "express";
import { createServer } from "http";
import { config, plugins } from "..";
import mongoose from "mongoose";
import auth from "../routes/auth";
import { join } from "path";
const app = express();
const server = createServer(app);
const io = new IoServer(server);
app.use(express.json());
app.use("/auth", auth);

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
    hooks.startup.execute({});
  });
});

export { io, server, express };
