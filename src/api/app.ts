import { Socket, Server as IoServer } from "socket.io";
import { MUSocket } from "..";
import { hooks } from "./hooks";

const server = new IoServer({ pingInterval: 2000, pingTimeout: 2000 });
export const connections: Set<MUSocket> = new Set();

server.on("connection", (socket: MUSocket) => {
  socket.join(socket.id);

  socket.on("message", (ctx) => {
    if (ctx.data.cid) socket.cid = ctx.data.cid;
    ctx.id = socket.id;
    ctx.socket = socket;
    hooks.input.execute(ctx);
  });

  socket.on("quit", async (reason) => {
    await hooks.disconnect.execute({ socket, reason });
    connections.delete(socket);
  });

  socket.on("disconnect", async (reason) => {
    await hooks.disconnect.execute({ reason, socket });
    connections.delete(socket);
  });
});

export { server };
