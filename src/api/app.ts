import { Socket, Server as IoServer } from "socket.io";
import { hooks } from "./hooks";

const io = new IoServer();

io.on("connection", (socket: Socket) => {
  socket.join(socket.id);

  socket.on("message", (ctx) => {
    ctx.id = socket.id;
    ctx.socket = socket;
    hooks.input.execute(ctx);
  });
});

export { io };
