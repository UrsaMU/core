import { Socket, Server as IoServer } from "socket.io";
import { MUSocket } from "..";
import { hooks } from "./hooks";

const server = new IoServer();

server.on("connection", (socket: MUSocket) => {
  socket.join(socket.id);

  socket.on("message", (ctx) => {
    socket.cid = ctx.data.cid;
    ctx.id = socket.id;
    ctx.socket = socket;

    hooks.input.execute(ctx);
  });

  socket.on("disconnect", () => {
    hooks.disconnect.execute({ socket });
  });
});

export { server };
