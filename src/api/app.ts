import { Socket, Server as IoServer } from "socket.io";
import { MUSocket } from "..";
import { hooks } from "./hooks";

const server = new IoServer({ pingInterval: 10000, pingTimeout: 5000 });
export const connections: Set<MUSocket> = new Set();

server.on("connection", (socket: MUSocket) => {
  socket.join(socket.id);

  socket.on("message", (ctx) => {
    if (ctx.data.cid) socket.cid = ctx.data.cid;
    ctx.id = socket.id;
    ctx.socket = socket;
    if (ctx.msg) hooks.input.execute(ctx);
  });

  socket.on("quit", async (data) => {
    await hooks.disconnect.execute({ socket, data });
    connections.delete(socket);
  });

  socket.on("disconnect", async (reason) => {
    if (reason === "ping timeout") {
      await hooks.disconnect.execute({ socket });
      connections.delete(socket);
    }
  });
});

export { server };
