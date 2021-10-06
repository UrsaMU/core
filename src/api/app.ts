import { Server } from "http";
import { Socket, Server as IoServer } from "socket.io";
import { hooks } from "./hooks";

export default (server: Server) => {
  const io = new IoServer(server);

  io.on("connection", (socket: Socket) => {
    socket.join(socket.id);

    socket.on("message", (ctx) => {
      ctx = JSON.parse(ctx);
      ctx.id = socket.id;
      ctx.socket = socket;
      hooks.input.execute(ctx);
    });
  });

  return io;
};
